import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { InventoryTable } from '@/features/inventory/components/inventory-table/InventoryTable'
import { useInventorySKUs } from '@/features/inventory/hooks/useInventoryData'
import type { InventorySortState, InventoryTableViewModel, InventoryTableRow } from '@/features/inventory/logic/inventoryTable.types'
import { mapStockLevelToTableRow } from '@/features/inventory/logic/inventoryTableLogic'
import { mockStockLevels } from '@/mocks/data/inventory'
import { toast } from 'sonner'

type InventoryTableViewProps = {
  filters?: {
    search?: string
    status?: string
    category?: string
    platform?: string
  }
}

export function InventoryTableView({ filters }: InventoryTableViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortState, setSortState] = useState<InventorySortState>({
    columnId: 'actualStock',
    direction: 'desc',
  })

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

  // Determine which data to display:
  // - If loading: show empty array (allows loading skeleton to display)
  // - If data exists: use API data (even if empty array)
  // - Otherwise: use mock data as last resort fallback
  const displayData = isLoading ? [] : (data?.items ?? mockStockLevels)

  const rows: InventoryTableRow[] = useMemo(() => {
    return displayData.map(mapStockLevelToTableRow)
  }, [displayData])

  const model: InventoryTableViewModel = useMemo(() => {
    return {
      columns: [
        { id: 'image', label: 'Ảnh', align: 'center' },
        { id: 'productName', label: 'Tên sản phẩm' },
        { id: 'sku', label: 'SKU' },
        { id: 'category', label: 'Phân loại' },
        { id: 'platformType', label: 'Loại sàn' },
        { id: 'marketplaceStock', label: 'Tồn trên sàn', align: 'right' },
        { id: 'actualStock', label: 'Tồn thực tế', align: 'right' },
        { id: 'onOrder', label: 'Đã đặt', align: 'right' },
        { id: 'available', label: 'Khả dụng', align: 'right' },
        { id: 'status', label: 'Trạng thái' },
        { id: 'forecast', label: 'Dự báo AI' },
      ],
      rows,
      selectedRows,
      isLoading,
      sortState,
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
      onSortChange: setSortState,
      onEditRow: (_rowId, productId) => {
        if (!productId) return
        navigate(`/products/${productId}/edit`, {
          state: {
            from: `${location.pathname}${location.search}`,
          },
        })
      },
      onDeleteRows: (rowIds: string[]) => {
        setSelectedRows((prev) => prev.filter((id) => !rowIds.includes(id)))
        toast.success(`Da xoa khoi danh sach chon ${rowIds.length} SKU.`)
      },
      onBulkAdjust: () => {
        toast.info(`Bat dau dieu chinh hang loat cho ${selectedRows.length} SKU.`)
      },
      onPageChange: setCurrentPage,
      onPageSizeChange: (size) => {
        setPageSize(size)
        setCurrentPage(1)
      },
      pageSizeOptions: [10, 20, 50, 100],
      onOpenProductDetail: (_rowId, _productId) => {
        const selectedRow = rows.find((row) => row.id === _rowId)
        if (!selectedRow) {
          return
        }

        navigate(`/inventory/adjust/${selectedRow.id}`, {
          state: {
            from: `${location.pathname}${location.search}`,
            prefillStockLevelId: selectedRow.id,
          },
        })
      },
    }
  }, [rows, selectedRows, isLoading, sortState, currentPage, pageSize, data?.totalCount, navigate, location.pathname, location.search])

  return <InventoryTable model={model} />
}
