import type {
  RevenueChartExportFormat,
  RevenueChartExportTarget,
  RevenueChartsViewModel,
  RevenueChartsPlatformId,
  RevenueChartsRangeDays,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'
import { RevenueHeroSection } from './parts/RevenueHeroSection'
import { RevenuePlatformSelector } from './parts/RevenuePlatformSelector'
import { RevenueStatsGrid } from './parts/RevenueStatsGrid'
import { RevenueTrendCard } from './parts/RevenueTrendCard'
import { RevenueComparisonCard } from './parts/RevenueComparisonCard'
import { RevenueHourlyDistributionCard } from './RevenueHourlyDistributionCard'
import { RevenueCategoryBreakdownCard } from './RevenueCategoryBreakdownCard'
import { RevenueGoalBanner } from './RevenueGoalBanner'
import { RevenueOrderHeatmapCard } from './RevenueOrderHeatmapCard'

type DashboardRevenueChartsViewProps = {
  model: RevenueChartsViewModel
  isRefreshing: boolean
  onPlatformChange: (platform: RevenueChartsPlatformId) => void
  onRangeChange: (range: RevenueChartsRangeDays) => void
  onCategorySelect: (categoryId: string) => void
  selectedCategoryId: string | null
  onExportChart: (target: RevenueChartExportTarget, format: RevenueChartExportFormat) => void
}

export function DashboardRevenueChartsView({
  model,
  isRefreshing,
  onPlatformChange,
  onRangeChange,
  onCategorySelect,
  selectedCategoryId,
  onExportChart,
}: DashboardRevenueChartsViewProps) {
  return (
    <div className="min-h-screen bg-secondary-50 pb-12 font-sans">
      {/* 1. Page Header Area */}
      <RevenueHeroSection model={model} isRefreshing={isRefreshing} onRangeChange={onRangeChange} />

      <main className="mx-auto max-w-[1600px] space-y-4 px-6 py-6">
        {/* 2. Controls Area */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-secondary-900 tracking-tight">Phân tích đa sàn</h2>
            <span className="h-1 w-1 rounded-full bg-secondary-300" />
            <p className="text-xs font-medium text-secondary-500 uppercase tracking-widest">Revenue Analytics</p>
          </div>
          <RevenuePlatformSelector 
            selectedPlatform={model.selectedPlatform} 
            onChange={onPlatformChange} 
            platforms={model.platformTabs} 
          />
        </div>

        {/* 3. KPI Section (4 columns) */}
        <RevenueStatsGrid cards={model.summaryCards} />

        {/* 4. Goal Banner */}
        <RevenueGoalBanner 
          label={model.goalLabel} 
          progressPercent={model.goalProgressPercent} 
          progressLabel={model.goalProgressLabel} 
        />

        {model.hasData ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            {/* 5. Main Trend Chart (Full width in 4-col grid) */}
            <div className="xl:col-span-4">
              <RevenueTrendCard 
                title={model.dailyChartTitle} 
                points={model.dailyChartPoints} 
                selectedPlatform={model.selectedPlatform}
                timelineEvents={model.timelineEvents}
                onExport={(format) => onExportChart('daily-trend', format)}
              />
            </div>

            {/* 6. Hourly Distribution (3/4 width) */}
            <div className="xl:col-span-3">
              <RevenueHourlyDistributionCard 
                title={model.hourlyChartTitle} 
                peakHoursLabel={model.peakHoursLabel} 
                points={model.hourlyPoints} 
                onExport={(format) => onExportChart('hourly-distribution', format)}
              />
            </div>

            {/* 7. Category Breakdown (1/4 width) */}
            <div className="xl:col-span-1">
              <RevenueCategoryBreakdownCard 
                title={model.categoryChartTitle} 
                items={model.categoryItems} 
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={onCategorySelect}
                onExport={(format) => onExportChart('category-breakdown', format)}
              />
            </div>

            <div className="xl:col-span-4">
              <RevenueOrderHeatmapCard
                title={model.heatmapTitle}
                cells={model.heatmapCells}
                onExport={(format) => onExportChart('order-heatmap', format)}
              />
            </div>

            {/* 8. Comparison Table (Full width) */}
            <div className="xl:col-span-4">
              <RevenueComparisonCard 
                title={model.weeklyTableTitle} 
                rows={model.weeklyRows} 
                selectedPlatform={model.selectedPlatform} 
              />
            </div>
          </div>
        ) : (
          <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-secondary-200 bg-white p-12 text-center shadow-sm">
             <div className="mb-4 rounded-full bg-secondary-50 p-4">
                <svg className="h-8 w-8 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
             </div>
             <p className="text-base font-bold text-secondary-700">Chưa có dữ liệu giao dịch</p>
             <p className="mt-1 text-sm text-secondary-500">Hãy thử thay đổi nền tảng hoặc khoảng thời gian lọc dữ liệu.</p>
          </div>
        )}
      </main>
    </div>
  )
}
