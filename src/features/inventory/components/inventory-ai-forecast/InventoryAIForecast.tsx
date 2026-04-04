import { useMemo, useState } from 'react'

import { filterForecastRows, buildInventoryAIForecastViewModel } from '@/features/inventory/logic/inventoryAIForecast.logic'
import type { ForecastTableFilter } from '@/features/inventory/logic/inventoryAIForecast.types'
import { useInventoryAIForecast } from '@/features/inventory/hooks/useInventoryAIForecast'

import { InventoryAIForecastDetail } from './InventoryAIForecastDetail'
import { InventoryAIForecastView } from './InventoryAIForecastView'

export function InventoryAIForecast() {
  const [selectedFilter, setSelectedFilter] = useState<ForecastTableFilter>('all')
  const [selectedSku, setSelectedSku] = useState<string | null>(null)
  const { data, isPending, isError, error } = useInventoryAIForecast()

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

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-xl bg-white" />
        <div className="h-20 animate-pulse rounded-xl bg-white" />
        <div className="h-64 animate-pulse rounded-xl bg-white" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Không thể tải dữ liệu dự báo tồn kho. {error instanceof Error ? error.message : ''}
      </div>
    )
  }

  if (!model) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
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
      onFilterChange={setSelectedFilter}
      onOpenDetail={setSelectedSku}
    />
  )
}
