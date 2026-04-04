import { useMemo } from 'react'

import { useInventoryAIForecastDetail } from '@/features/inventory/hooks/useInventoryAIForecastDetail'
import { buildInventoryAIForecastDetailViewModel } from '@/features/inventory/logic/inventoryAIForecastDetail.logic'

import { InventoryAIForecastDetailView } from './InventoryAIForecastDetailView'

type InventoryAIForecastDetailProps = {
  sku: string
  onBack: () => void
}

export function InventoryAIForecastDetail({ sku, onBack }: InventoryAIForecastDetailProps) {
  const { data, isPending, isError } = useInventoryAIForecastDetail(sku)

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildInventoryAIForecastDetailViewModel(data)
  }, [data])

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-xl bg-white" />
        <div className="h-72 animate-pulse rounded-xl bg-white" />
        <div className="h-72 animate-pulse rounded-xl bg-white" />
      </div>
    )
  }

  if (isError || !model) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Không thể tải chi tiết dự báo cho SKU {sku}.
      </div>
    )
  }

  return <InventoryAIForecastDetailView model={model} onBack={onBack} />
}
