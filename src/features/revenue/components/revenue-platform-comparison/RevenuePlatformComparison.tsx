import { useMemo } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { useRevenuePlatformComparison } from '@/features/revenue/hooks/useRevenuePlatformComparison'
import {
  buildRevenuePlatformComparisonViewModel,
} from '@/features/revenue/logic/revenuePlatformComparison.logic'
import { RevenuePlatformComparisonView } from '@/features/revenue/components/revenue-platform-comparison/RevenuePlatformComparisonView'
import { useUIStore } from '@/stores/uiStore'
import { useProductData } from '@/features/products/hooks/useProductData'

export function RevenuePlatformComparison() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'RevenuePlatformComparisonPage',
  })

  const selectedDate = useUIStore((state) => state.selectedDate)

  const selectedMonth = useMemo(() => {
    const datePattern = /^(\d{4})-(\d{2})-\d{2}$/
    const matched = datePattern.exec(selectedDate)

    if (matched) {
      return `${matched[1]}-${matched[2]}`
    }

    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }, [selectedDate])

  const { data, isLoading, isError, refetch } = useRevenuePlatformComparison(selectedMonth)

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
