/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useProductData } from '@/features/products/hooks/useProductData'

export function InventoryStockMovements() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'InventoryStockMovementsPage',
  })

  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<InventoryStockMovementPlatformFilter>('all')
  const [movementGroup, setMovementGroup] = useState<InventoryStockMovementGroupFilter>('all')
  const [warehouseId, setWarehouseId] = useState('all')
  const [performerId, setPerformerId] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null)
  
  // Custom states for new features
  const [chartData, setChartData] = useState<unknown[]>([])
  const [performers, setPerformers] = useState<unknown[]>([])

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
      chartData: chartData as any,
      performerOptions: performers as any,
      onExportLogs: () => stockMovementsService.exportToCSV(data.movements),
    })

    return model
  }, [data, movementGroup, page, pageSize, platform, search, selectedMovementId, warehouseId, performerId, chartData, performers])

  const [prevModel, setPrevModel] = useState(model)
  if (model !== prevModel) {
    setPrevModel(model)
    if (!model?.selectedMovement) {
      setSelectedMovementId(null)
    } else if (!selectedMovementId || String(model.selectedMovement.id) !== selectedMovementId) {
      setSelectedMovementId(String(model.selectedMovement.id))
    }
  }

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
        setPlatform(value as any)
        setPage(1)
      }}
      onMovementGroupChange={(value) => {
        setMovementGroup(value as any)
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
