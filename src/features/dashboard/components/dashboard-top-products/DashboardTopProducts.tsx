import { useMemo, useState } from 'react'

import { DashboardTopProductsView } from '@/features/dashboard/components/dashboard-top-products/DashboardTopProductsView'
import { useDashboardTopProducts } from '@/features/dashboard/hooks/useDashboardTopProducts'
import { buildDashboardTopProductsViewModel } from '@/features/dashboard/logic/dashboardTopProducts.logic'
import type {
  TopProductsMetricId,
  TopProductsPlatformId,
  TopProductsRangeDays,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

export function DashboardTopProducts() {
  const [selectedMetric, setSelectedMetric] = useState<TopProductsMetricId>('revenue')
  const [selectedRange, setSelectedRange] = useState<TopProductsRangeDays>(30)
  const [selectedPlatform, setSelectedPlatform] = useState<TopProductsPlatformId>('all')

  const { data, isLoading, isFetching, isError, refetch } = useDashboardTopProducts({
    metric: selectedMetric,
    range: selectedRange,
    platform: selectedPlatform,
  })

  const model = useMemo(() => {
    if (!data) return null

    return buildDashboardTopProductsViewModel({
      data,
      selectedMetric,
      selectedRange,
      selectedPlatform,
    })
  }, [data, selectedMetric, selectedPlatform, selectedRange])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu top sản phẩm...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không tải được dữ liệu Top Products.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <DashboardTopProductsView
      model={model}
      onMetricChange={setSelectedMetric}
      onRangeChange={setSelectedRange}
      onPlatformChange={setSelectedPlatform}
      isRefreshing={isFetching}
    />
  )
}
