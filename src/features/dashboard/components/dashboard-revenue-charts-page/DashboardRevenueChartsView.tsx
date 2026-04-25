import { Settings2, X } from 'lucide-react'
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
  isSettingsOpen: boolean
  onPlatformChange: (platform: RevenueChartsPlatformId) => void
  onRangeChange: (range: RevenueChartsRangeDays) => void
  onCategorySelect: (categoryId: string) => void
  selectedCategoryId: string | null
  onExportChart: (target: RevenueChartExportTarget, format: RevenueChartExportFormat) => void
  onExportFullReport: () => void
  onToggleSettings: () => void
}

export function DashboardRevenueChartsView({
  model,
  isRefreshing,
  isSettingsOpen,
  onPlatformChange,
  onRangeChange,
  onCategorySelect,
  selectedCategoryId,
  onExportChart,
  onExportFullReport,
  onToggleSettings,
}: DashboardRevenueChartsViewProps) {
  return (
    <div className="bg-secondary-50 pb-10 font-sans relative">
      {/* Settings Modal Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
                  <Settings2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black text-secondary-900">Tùy chỉnh báo cáo</h2>
              </div>
              <button 
                onClick={onToggleSettings}
                className="rounded-full p-2 hover:bg-secondary-100 transition-colors"
              >
                <X className="h-5 w-5 text-secondary-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-secondary-500">Hiển thị thành phần</p>
                <div className="space-y-2">
                  {[
                    { id: 'trend', label: 'Xu hướng doanh thu', checked: true },
                    { id: 'hourly', label: 'Phân bổ theo giờ', checked: true },
                    { id: 'category', label: 'Tỷ trọng danh mục', checked: true },
                    { id: 'heatmap', label: 'Mật độ đơn hàng', checked: true },
                  ].map(item => (
                    <label key={item.id} className="flex items-center justify-between p-3 rounded-2xl border border-secondary-100 hover:border-primary-200 transition-colors cursor-pointer group">
                      <span className="text-sm font-bold text-secondary-700 group-hover:text-primary-700">{item.label}</span>
                      <input type="checkbox" defaultChecked={item.checked} className="h-5 w-5 rounded-md border-secondary-300 text-primary-600 focus:ring-primary-500" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-secondary-500">Đơn vị tiền tệ</p>
                <select className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm font-bold text-secondary-900 focus:border-primary-500 focus:ring-primary-500">
                  <option value="vnd">Việt Nam Đồng (₫)</option>
                  <option value="usd">Đô la Mỹ ($)</option>
                </select>
              </div>

              <button 
                onClick={onToggleSettings}
                className="w-full rounded-2xl bg-secondary-900 py-3.5 text-sm font-black text-white shadow-lg shadow-secondary-900/20 transition hover:bg-secondary-800 active:scale-[0.98]"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-[1600px] px-4 pt-4 sm:px-6 lg:px-8">
        <RevenueHeroSection 
          model={model} 
          isRefreshing={isRefreshing} 
          onRangeChange={onRangeChange}
          onExportFullReport={onExportFullReport}
          onToggleSettings={onToggleSettings}
        />
      </section>

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-secondary-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-secondary-900">Phân tích đa sàn</h2>
              <span className="h-1 w-1 rounded-full bg-secondary-300" />
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary-500">Revenue Analytics</p>
            </div>
            <RevenuePlatformSelector
              selectedPlatform={model.selectedPlatform}
              onChange={onPlatformChange}
              platforms={model.platformTabs}
            />
          </div>
        </div>

        <RevenueStatsGrid cards={model.summaryCards} />

        <RevenueGoalBanner
          label={model.goalLabel}
          progressPercent={model.goalProgressPercent}
          progressLabel={model.goalProgressLabel}
        />

        {model.hasData ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* Hàng 1: Trend (8) + Hourly (4) */}
            <div className="xl:col-span-8">
              <RevenueTrendCard
                title={model.dailyChartTitle}
                points={model.dailyChartPoints}
                selectedPlatform={model.selectedPlatform}
                timelineEvents={model.timelineEvents}
                onExport={(format) => onExportChart('daily-trend', format)}
              />
            </div>

            <div className="xl:col-span-4">
              <RevenueHourlyDistributionCard
                title={model.hourlyChartTitle}
                peakHoursLabel={model.peakHoursLabel}
                points={model.hourlyPoints}
                onExport={(format) => onExportChart('hourly-distribution', format)}
              />
            </div>

            {/* Hàng 2: Category (12) - Giờ đã có không gian rộng rãi để dàn hàng ngang */}
            <div className="xl:col-span-12">
              <RevenueCategoryBreakdownCard
                title={model.categoryChartTitle}
                items={model.categoryItems}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={onCategorySelect}
                onExport={(format) => onExportChart('category-breakdown', format)}
              />
            </div>

            <div className="xl:col-span-12">
              <RevenueOrderHeatmapCard
                title={model.heatmapTitle}
                cells={model.heatmapCells}
                onExport={(format) => onExportChart('order-heatmap', format)}
              />
            </div>

            <div className="xl:col-span-12">
              <RevenueComparisonCard
                title={model.weeklyTableTitle}
                rows={model.weeklyRows}
                selectedPlatform={model.selectedPlatform}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-secondary-200 bg-white p-10 text-center shadow-sm">
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
