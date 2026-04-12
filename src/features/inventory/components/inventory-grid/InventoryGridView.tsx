import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { InventoryGrid } from '@/features/inventory/components/inventory-grid/InventoryGrid'
import { useInventorySKUs } from '@/features/inventory/hooks/useInventoryData'
import type { InventoryGridViewModel } from '@/features/inventory/logic/inventoryGrid.types'
import type { InventoryTableRow } from '@/features/inventory/logic/inventoryTable.types'
import type { StockLevel } from '@/types/inventory.types'
import { mockStockLevels } from '@/mocks/data/inventory'

type InventoryGridViewProps = {
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
    image: stockLevel.productImage,
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

export function InventoryGridView({ filters }: InventoryGridViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters?.search, filters?.status, filters?.category, filters?.platform])

  const model: InventoryGridViewModel = useMemo(() => {
    return {
      rows,
      isLoading,
      currentPage,
      pageSize,
      totalCount: data?.totalCount || mockStockLevels.length,
      onPageChange: setCurrentPage,
      onPageSizeChange: (size) => {
        setPageSize(size)
        setCurrentPage(1)
      },
      onCardAction: (action: string, rowId: string) => {
        console.log(`Card action: ${action} on row ${rowId}`)
        // Handle card actions here (quick purchase, view details, etc.)
      },
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
      pageSizeOptions: [12, 24, 36, 48],
    }
  }, [rows, isLoading, currentPage, pageSize, data?.totalCount, navigate, location.pathname, location.search])

  return <InventoryGrid model={model} />
}
