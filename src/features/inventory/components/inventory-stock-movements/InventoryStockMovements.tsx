import { useEffect, useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { InventoryStockMovementsView } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsView'
import { buildInventoryStockMovementsViewModel } from '@/features/inventory/logic/inventoryStockMovements.logic'
import type {
  InventoryStockMovementGroupFilter,
  InventoryStockMovementPlatformFilter,
} from '@/features/inventory/logic/inventoryStockMovements.types'
import { useInventoryStockMovements } from '@/features/inventory/hooks/useInventoryStockMovements'
import { stockMovementsService } from '@/features/inventory/services/stockMovements.service'
import { useCreateMovement } from '@/features/inventory/hooks/useCreateMovement'

export function InventoryStockMovements() {
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<InventoryStockMovementPlatformFilter>('all')
  const [movementGroup, setMovementGroup] = useState<InventoryStockMovementGroupFilter>('all')
  const [warehouseId, setWarehouseId] = useState('all')
  const [performerId, setPerformerId] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null)
  
  // Custom states for new features
  const [chartData, setChartData] = useState<any[]>([])
  const [performers, setPerformers] = useState<any[]>([])

  const { data, isLoading, isFetching, isError, refetch } = useInventoryStockMovements({
    search,
    platform,
    movementGroup,
    warehouseId,
    performerId,
    page,
    pageSize,
  })

  const createMovementController = useCreateMovement(() => {
    refetch()
  })

  useEffect(() => {
    stockMovementsService.getChartData({
      platform,
      movementGroup,
      warehouseId,
      performerId
    }).then(setChartData)
  }, [platform, movementGroup, warehouseId, performerId])

  useEffect(() => {
    stockMovementsService.getPerformers().then(setPerformers)
  }, [])

  const model = useMemo(() => {
    if (!data) return null

    const model = buildInventoryStockMovementsViewModel({
      response: data,
      query: {
        search,
        platform,
        movementGroup,
        warehouseId,
        performerId,
        page,
        pageSize,
      } as any,
      selectedMovementId,
      chartData,
      performerOptions: performers,
      onExportLogs: () => stockMovementsService.exportToCSV(data.movements),
    })

    return model
  }, [data, movementGroup, page, pageSize, platform, search, selectedMovementId, warehouseId, performerId, chartData, performers])

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
      model={model as any}
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
      onPerformerChange={(value) => {
        setPerformerId(value)
        setPage(1)
      }}
      onRefresh={() => refetch()}
      onExport={model.onExportLogs}
      selectedMovementId={selectedMovementId}
      onSelectMovement={setSelectedMovementId}
      onPageChange={setPage}
      onPageSizeChange={(value) => {
        setPageSize(value)
        setPage(1)
      }}
      createMovementController={createMovementController}
    />
  )
}
