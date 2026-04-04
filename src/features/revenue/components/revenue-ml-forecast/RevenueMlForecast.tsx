import { useMemo, useState } from 'react'

import { RevenueMlForecastView } from '@/features/revenue/components/revenue-ml-forecast/RevenueMlForecastView'
import { useRevenueMlForecast } from '@/features/revenue/hooks/useRevenueMlForecast'
import { buildRevenueMlForecastViewModel } from '@/features/revenue/logic/revenueMlForecast.logic'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'

export function RevenueMlForecast() {
  const [selectedDays, setSelectedDays] = useState<RevenueMlForecastRangeDays>(30)
  const { data, isLoading, isError } = useRevenueMlForecast(selectedDays)

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
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm font-semibold text-rose-600">
        Không tải được dữ liệu dự báo doanh thu ML.
      </div>
    )
  }

  return <RevenueMlForecastView model={model} onRangeChange={setSelectedDays} />
}
