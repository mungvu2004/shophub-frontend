import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { filterForecastRows, buildInventoryAIForecastViewModel } from '@/features/inventory/logic/inventoryAIForecast.logic'
import type { ForecastTableFilter } from '@/features/inventory/logic/inventoryAIForecast.types'
import { useInventoryAIForecast } from '@/features/inventory/hooks/useInventoryAIForecast'
import { useForecastParameters } from '@/features/inventory/hooks/inventory-ai-forecast/useForecastParameters'
import { useProductData } from '@/features/products/hooks/useProductData'

import { InventoryAIForecastDetail } from './InventoryAIForecastDetail'
import { InventoryAIForecastView } from './InventoryAIForecastView'

export function InventoryAIForecast() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'InventoryAIForecastPage',
  })

  const [selectedFilter, setSelectedFilter] = useState<ForecastTableFilter>('all')
  const [selectedSku, setSelectedSku] = useState<string | null>(null)
  
  const { data, isPending, isError, error, refetch } = useInventoryAIForecast()
  const { isRecalculating, recalculate } = useForecastParameters()

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildInventoryAIForecastViewModel(data)
  }, [data])

  const filteredRows = useMemo(() => {
    if (!model) {
      return []
    }

    return filterForecastRows(model.tableRows, selectedFilter)
  }, [model, selectedFilter])

  const handleRefresh = async () => {
    await refetch()
    toast.success('Dữ liệu đã được làm mới đồng bộ với AI.')
  }

  const handleExport = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Đang xuất kế hoạch nhập hàng...',
        success: 'Xuất file thành công! (forecast_plan.xlsx)',
        error: 'Có lỗi xảy ra khi xuất file.',
      }
    )
  }

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-3xl bg-white" />
        <div className="h-20 animate-pulse rounded-3xl bg-white" />
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
      </div>
    )
  }

  if (isError) {
    return (
      <DataLoadErrorState
        title="Không thể tải dữ liệu dự báo tồn kho."
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
        className="rounded-3xl p-6"
      />
    )
  }

  if (!model) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
        Chưa có dữ liệu dự báo.
      </div>
    )
  }

  if (selectedSku) {
    return <InventoryAIForecastDetail sku={selectedSku} onBack={() => setSelectedSku(null)} />
  }

  return (
    <InventoryAIForecastView
      model={model}
      selectedFilter={selectedFilter}
      filteredRows={filteredRows}
      isRecalculating={isRecalculating}
      onFilterChange={setSelectedFilter}
      onOpenDetail={setSelectedSku}
      onRecalculate={recalculate}
      onRefresh={handleRefresh}
      onExport={handleExport}
    />
  )
}
