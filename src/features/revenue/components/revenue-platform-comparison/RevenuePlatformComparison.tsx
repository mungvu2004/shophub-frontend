import { useMemo } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { useRevenuePlatformComparison } from '@/features/revenue/hooks/useRevenuePlatformComparison'
import {
  buildRevenuePlatformComparisonViewModel,
} from '@/features/revenue/logic/revenuePlatformComparison.logic'
import { RevenuePlatformComparisonView } from '@/features/revenue/components/revenue-platform-comparison/RevenuePlatformComparisonView'

export function RevenuePlatformComparison() {
  const { data, isLoading, isError, refetch } = useRevenuePlatformComparison('2026-03')

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
    return <DataLoadErrorState title="Không tải được dữ liệu so sánh sàn." onRetry={() => refetch()} />
  }

  return <RevenuePlatformComparisonView model={model} />
}
