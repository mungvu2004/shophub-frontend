import { useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { RevenueMlForecastView } from '@/features/revenue/components/revenue-ml-forecast/RevenueMlForecastView'
import { useRevenueMlForecast } from '@/features/revenue/hooks/useRevenueMlForecast'
import { buildRevenueMlForecastViewModel } from '@/features/revenue/logic/revenueMlForecast.logic'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'

export function RevenueMlForecast() {
  const [selectedDays, setSelectedDays] = useState<RevenueMlForecastRangeDays>(30)
  const { data, isLoading, isError, refetch } = useRevenueMlForecast(selectedDays)

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildRevenueMlForecastViewModel(data, selectedDays)
  }, [data, selectedDays])

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        Đang tải dữ liệu dự báo doanh thu ML...
      </div>
    )
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không tải được dữ liệu dự báo doanh thu ML." onRetry={() => refetch()} />
  }

  return <RevenueMlForecastView model={model} onRangeChange={setSelectedDays} />
}
