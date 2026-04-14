import { useEffect, useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { InventoryStockMovementsView } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsView'
import { buildInventoryStockMovementsViewModel } from '@/features/inventory/logic/inventoryStockMovements.logic'
import type {
  InventoryStockMovementGroupFilter,
  InventoryStockMovementPlatformFilter,
} from '@/features/inventory/logic/inventoryStockMovements.types'
import { useInventoryStockMovements } from '@/features/inventory/hooks/useInventoryStockMovements'

export function InventoryStockMovements() {
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<InventoryStockMovementPlatformFilter>('all')
  const [movementGroup, setMovementGroup] = useState<InventoryStockMovementGroupFilter>('all')
  const [warehouseId, setWarehouseId] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null)

  const { data, isLoading, isFetching, isError, refetch } = useInventoryStockMovements({
    search,
    platform,
    movementGroup,
    warehouseId,
    page,
    pageSize,
  })

  const model = useMemo(() => {
    if (!data) return null

    return buildInventoryStockMovementsViewModel({
      response: data,
      query: {
        search,
        platform,
        movementGroup,
        warehouseId,
        page,
        pageSize,
      },
      selectedMovementId,
    })
  }, [data, movementGroup, page, pageSize, platform, search, selectedMovementId, warehouseId])

  useEffect(() => {
    if (!model?.selectedMovement) {
      setSelectedMovementId(null)
      return
    }

    if (!selectedMovementId || String(model.selectedMovement.id) !== selectedMovementId) {
      setSelectedMovementId(String(model.selectedMovement.id))
    }
  }, [model, selectedMovementId])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu nhập/xuất kho...</div>
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không tải được dữ liệu biến động kho." onRetry={() => refetch()} />
  }

  return (
    <InventoryStockMovementsView
      model={model}
      isRefreshing={isFetching}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      onPlatformChange={(value) => {
        setPlatform(value)
        setPage(1)
      }}
      onMovementGroupChange={(value) => {
        setMovementGroup(value)
        setPage(1)
      }}
      onWarehouseChange={(value) => {
        setWarehouseId(value)
        setPage(1)
      }}
      selectedMovementId={selectedMovementId}
      onSelectMovement={setSelectedMovementId}
      onPageChange={setPage}
      onPageSizeChange={(value) => {
        setPageSize(value)
        setPage(1)
      }}
    />
  )
}