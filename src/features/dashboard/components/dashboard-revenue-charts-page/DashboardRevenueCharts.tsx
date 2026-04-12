import { useMemo, useState } from 'react'

import { DashboardRevenueChartsView } from '@/features/dashboard/components/dashboard-revenue-charts-page/DashboardRevenueChartsView'
import { useDashboardRevenueCharts } from '@/features/dashboard/hooks/useDashboardRevenueCharts'
import { buildDashboardRevenueChartsViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.logic'
import type {
  RevenueChartsPlatformId,
  RevenueChartsRangeDays,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

export function DashboardRevenueCharts() {
  const [selectedPlatform, setSelectedPlatform] = useState<RevenueChartsPlatformId>('all')
  const [selectedRange, setSelectedRange] = useState<RevenueChartsRangeDays>(30)

  const { data, isLoading, isFetching, isError, refetch } = useDashboardRevenueCharts({
    platform: selectedPlatform,
    range: selectedRange,
  })

  const model = useMemo(() => {
    if (!data) return null

    return buildDashboardRevenueChartsViewModel({
      data,
      selectedPlatform,
    })
  }, [data, selectedPlatform])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu doanh thu...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không tải được dữ liệu Revenue Charts.</p>
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
    <DashboardRevenueChartsView
      model={model}
      isRefreshing={isFetching}
      onPlatformChange={setSelectedPlatform}
      onRangeChange={setSelectedRange}
    />
  )
}
