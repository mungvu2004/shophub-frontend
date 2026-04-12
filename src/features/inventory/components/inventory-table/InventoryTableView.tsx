import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { InventoryTable } from '@/features/inventory/components/inventory-table/InventoryTable'
import { useInventorySKUs } from '@/features/inventory/hooks/useInventoryData'
import type { InventoryTableViewModel, InventoryTableRow } from '@/features/inventory/logic/inventoryTable.types'
import type { StockLevel } from '@/types/inventory.types'
import { mockStockLevels } from '@/mocks/data/inventory'

type InventoryTableViewProps = {
  filters?: {
    search?: string
    status?: string
    category?: string
    platform?: string
  }
}

function mapStockLevelToTableRow(stockLevel: StockLevel): InventoryTableRow {
  const matched = stockLevel.variantId.match(/^var-(\d+)-/)
  const productId = matched ? `prod-${matched[1]}` : undefined

  return {
    id: stockLevel.id,
    productId,
    sku: stockLevel.sku,
    productName: stockLevel.productName || stockLevel.variantName || 'Unknown',
    category: stockLevel.category || 'Uncategorized',
    shopeeStock: stockLevel.channelStock?.shopee || 0,
    tiktokStock: stockLevel.channelStock?.tiktok || 0,
    lazadaStock: stockLevel.channelStock?.lazada || 0,
    actualStock: stockLevel.physicalQty || 0,
    onOrder: stockLevel.onOrder || 0,
    available: stockLevel.availableQty || 0,
    status: getStockStatus(stockLevel.availableQty || 0, stockLevel.physicalQty || 0),
    restockDays: getRestockDays(stockLevel.physicalQty || 0),
  }
}

function getStockStatus(available: number, physical: number): 'normal' | 'warning' | 'critical' {
  if (physical === 0 || available < 0) return 'critical'
  if (available <= 10) return 'warning'
  return 'normal'
}

function getRestockDays(stock: number): string {
  if (stock === 0) return '<7 ngày'
  if (stock < 30) return '7-14 ngày'
  return '>14 ngày'
}

export function InventoryTableView({ filters }: InventoryTableViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters?.search, filters?.status, filters?.category, filters?.platform])

  // Fetch inventory data from API
  const { data, isLoading } = useInventorySKUs({
    search: filters?.search,
    status: filters?.status,
    category: filters?.category,
    platform: filters?.platform,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  })

  // Use mock data as fallback if API returns empty or hasn't loaded yet
  const displayData = (data?.items && data.items.length > 0) ? data.items : mockStockLevels

  const rows: InventoryTableRow[] = useMemo(() => {
    return displayData.map(mapStockLevelToTableRow)
  }, [displayData])

  const model: InventoryTableViewModel = useMemo(() => {
    return {
      columns: [
        { id: 'image', label: 'Ảnh', align: 'center' },
        { id: 'sku', label: 'SKU' },
        { id: 'productName', label: 'Tên sản phẩm' },
        { id: 'category', label: 'Phân loại' },
        { id: 'shopee', label: 'Shopee', align: 'right' },
        { id: 'tiktok', label: 'TikTok', align: 'right' },
        { id: 'lazada', label: 'Lazada', align: 'right' },
        { id: 'actualStock', label: 'Tồn thực tế', align: 'right' },
        { id: 'onOrder', label: 'Đã đặt', align: 'right' },
        { id: 'available', label: 'Khả dụng', align: 'right' },
        { id: 'status', label: 'Trạng thái' },
        { id: 'forecast', label: 'Dự báo AI' },
      ],
      rows,
      selectedRows,
      isLoading,
      currentPage,
      pageSize,
      totalCount: data?.totalCount || mockStockLevels.length,
      onSelectRow: (rowId) => {
        setSelectedRows((prev) =>
          prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
        )
      },
      onSelectAll: (selected) => {
        setSelectedRows(selected ? rows.map((r) => r.id) : [])
      },
      onPageChange: setCurrentPage,
      onPageSizeChange: (size) => {
        setPageSize(size)
        setCurrentPage(1)
      },
      pageSizeOptions: [10, 20, 50, 100],
      onOpenProductDetail: (_rowId, productId) => {
        if (!productId) {
          return
        }

        navigate(`/products/${productId}`, {
          state: {
            from: `${location.pathname}${location.search}`,
          },
        })
      },
    }
  }, [rows, selectedRows, isLoading, currentPage, pageSize, data?.totalCount, navigate, location.pathname, location.search])

  return <InventoryTable model={model} />
}
