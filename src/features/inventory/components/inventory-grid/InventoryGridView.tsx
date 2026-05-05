import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { InventoryGrid } from '@/features/inventory/components/inventory-grid/InventoryGrid'
import { useInventorySKUs } from '@/features/inventory/hooks/useInventoryData'
import type { InventoryGridViewModel } from '@/features/inventory/logic/inventoryGrid.types'
import type { InventoryTableRow } from '@/features/inventory/logic/inventoryTable.types'
import { mapStockLevelToTableRow } from '@/features/inventory/logic/inventoryTableLogic'
import { mockStockLevels } from '@/mocks/data/inventory'

type InventoryGridViewProps = {
  filters?: {
    search?: string
    status?: string
    category?: string
    platform?: string
  }
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

  // Determine which data to display:
  // - If loading: show empty array (allows loading skeleton to display)
  // - If data exists: use API data (even if empty array)
  // - Otherwise: use mock data as last resort fallback
  const rows: InventoryTableRow[] = useMemo(() => {
    const displayData = isLoading ? [] : (data?.items ?? mockStockLevels)
    return displayData.map(mapStockLevelToTableRow)
  }, [isLoading, data?.items])

  const [prevFilters, setPrevFilters] = useState(filters)
  if (
    prevFilters?.search !== filters?.search ||
    prevFilters?.status !== filters?.status ||
    prevFilters?.category !== filters?.category ||
    prevFilters?.platform !== filters?.platform
  ) {
    setPrevFilters(filters)
    setCurrentPage(1)
  }

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
        // Handle card actions: 'edit', 'view', 'quick_action'
        const row = rows.find(r => r.id === rowId)
        if (!row) return
        
        switch (action) {
          case 'edit':
            navigate(`/products/${row.productId}/edit`, {
              state: {
                from: `${location.pathname}${location.search}`,
              },
            })
            break
          case 'view':
            navigate(`/inventory/adjust/${row.id}`, {
              state: {
                from: `${location.pathname}${location.search}`,
                prefillStockLevelId: row.id,
              },
            })
            break
          default:
            // Other actions can be handled here
            break
        }
      },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      pageSizeOptions: [12, 24, 36, 48],
    }
  }, [rows, isLoading, currentPage, pageSize, data?.totalCount, navigate, location.pathname, location.search])

  return <InventoryGrid model={model} />
}
