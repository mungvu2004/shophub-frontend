import { useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { DashboardRevenueChartsView } from '@/features/dashboard/components/dashboard-revenue-charts-page/DashboardRevenueChartsView'
import { useDashboardRevenueCharts } from '@/features/dashboard/hooks/useDashboardRevenueCharts'
import { buildDashboardRevenueChartsViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.logic'
import type {
  RevenueChartsPlatformId,
  RevenueChartsRangeDays,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

export const shouldShowBlockingRevenueChartsError = (input: { isError: boolean; hasModel: boolean }) => input.isError && !input.hasModel

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

  if (shouldShowBlockingRevenueChartsError({ isError, hasModel: Boolean(model) })) {
    return <DataLoadErrorState title="Không tải được dữ liệu Revenue Charts." onRetry={() => refetch()} />
  }

  if (!model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang chuẩn bị dữ liệu Revenue Charts...</div>
  }

  return (
    <div className="space-y-4">
      {isError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Dữ liệu mới chưa tải được. Đang hiển thị dữ liệu gần nhất.
        </div>
      ) : null}

      <DashboardRevenueChartsView
        model={model}
        isRefreshing={isFetching}
        onPlatformChange={setSelectedPlatform}
        onRangeChange={setSelectedRange}
      />
    </div>
  )
}
