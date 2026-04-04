import { useMemo } from 'react'

import { useRevenuePlatformComparison } from '@/features/revenue/hooks/useRevenuePlatformComparison'
import {
  buildRevenuePlatformComparisonViewModel,
} from '@/features/revenue/logic/revenuePlatformComparison.logic'
import { RevenuePlatformComparisonView } from '@/features/revenue/components/revenue-platform-comparison/RevenuePlatformComparisonView'

export function RevenuePlatformComparison() {
  const { data, isLoading, isError } = useRevenuePlatformComparison('2026-03')

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildRevenuePlatformComparisonViewModel(data)
  }, [data])

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu so sánh sàn...</div>
  }

  if (isError || !model) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm font-semibold text-rose-600">Không tải được dữ liệu so sánh sàn.</div>
  }

  return <RevenuePlatformComparisonView model={model} />
}
