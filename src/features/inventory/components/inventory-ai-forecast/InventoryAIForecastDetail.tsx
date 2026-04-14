import { useMemo } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
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
    return <DataLoadErrorState title={`Không thể tải chi tiết dự báo cho SKU ${sku}.`} className="rounded-xl p-6" />
  }

  return <InventoryAIForecastDetailView model={model} onBack={onBack} />
}
