import type {
  RevenueChartsPlatformId,
  RevenueChartsRangeDays,
  RevenueChartsViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

import { RevenueCategoryBreakdownCard } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenueCategoryBreakdownCard'
import { RevenueChartsHeader } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenueChartsHeader'
import { RevenueDailyTrendChart } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenueDailyTrendChart'
import { RevenueGoalBanner } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenueGoalBanner'
import { RevenueHourlyDistributionCard } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenueHourlyDistributionCard'
import { RevenuePlatformTabs } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenuePlatformTabs'
import { RevenueSummaryStrip } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenueSummaryStrip'
import { RevenueWeeklyComparisonTable } from '@/features/dashboard/components/dashboard-revenue-charts-page/RevenueWeeklyComparisonTable'

type DashboardRevenueChartsViewProps = {
  model: RevenueChartsViewModel
  isRefreshing: boolean
  onPlatformChange: (platform: RevenueChartsPlatformId) => void
  onRangeChange: (range: RevenueChartsRangeDays) => void
}

export function DashboardRevenueChartsView({
  model,
  isRefreshing,
  onPlatformChange,
  onRangeChange,
}: DashboardRevenueChartsViewProps) {
  return (
    <div className="space-y-6 pb-8">
      <RevenueChartsHeader model={model} isRefreshing={isRefreshing} onRangeChange={onRangeChange} />

      <RevenuePlatformTabs tabs={model.platformTabs} selectedPlatform={model.selectedPlatform} onChange={onPlatformChange} />

      <RevenueSummaryStrip cards={model.summaryCards} />

      <RevenueGoalBanner label={model.goalLabel} progressPercent={model.goalProgressPercent} progressLabel={model.goalProgressLabel} />

      {model.hasData ? (
        <>
          <RevenueDailyTrendChart title={model.dailyChartTitle} points={model.dailyChartPoints} />

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <RevenueHourlyDistributionCard title={model.hourlyChartTitle} peakHoursLabel={model.peakHoursLabel} points={model.hourlyPoints} />
            </div>

            <div className="xl:col-span-2">
              <RevenueCategoryBreakdownCard title={model.categoryChartTitle} items={model.categoryItems} />
            </div>
          </section>

          <RevenueWeeklyComparisonTable title={model.weeklyTableTitle} rows={model.weeklyRows} />
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-sm font-medium text-slate-500">
          Chưa có dữ liệu doanh thu cho bộ lọc hiện tại.
        </div>
      )}
    </div>
  )
}
