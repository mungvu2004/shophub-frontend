import { ChevronDown, Download, RefreshCw, Layers } from 'lucide-react'
import type {
  RevenueChartsRangeDays,
  RevenueChartsViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueHeroSectionProps = {
  model: RevenueChartsViewModel
  isRefreshing: boolean
  onRangeChange: (range: RevenueChartsRangeDays) => void
  onExportFullReport: () => void
  onToggleSettings: () => void
}

export function RevenueHeroSection({ 
  model, 
  isRefreshing, 
  onRangeChange,
  onExportFullReport,
  onToggleSettings
}: RevenueHeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-secondary-200 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_oklch(0.94_0.03_263)_0%,_transparent_45%),radial-gradient(circle_at_bottom_left,_oklch(0.95_0.03_248)_0%,_transparent_40%)]" />

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
              <Layers className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-secondary-900 sm:text-3xl">{model.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-secondary-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-semibold text-secondary-700">
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Cập nhật lúc: {model.updatedAtLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-secondary-300" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">Live analytics active</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 xl:w-auto xl:items-end">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-secondary-200 bg-secondary-50 p-1.5">
            {model.rangeTabs.map((tab) => (
              <button
                key={tab.days}
                type="button"
                onClick={() => onRangeChange(tab.days)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  tab.days === model.selectedRange
                    ? 'bg-white text-secondary-900 shadow-sm'
                    : 'text-secondary-500 hover:bg-secondary-100 hover:text-secondary-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
            <button
              type="button"
              onClick={onExportFullReport}
              className="group inline-flex items-center gap-2 rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-sm font-semibold text-secondary-700 transition hover:border-primary-300 hover:text-primary-700 active:scale-95"
            >
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              <span>Xuất báo cáo</span>
            </button>

            <button
              type="button"
              onClick={onToggleSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 active:scale-95"
            >
              <ChevronDown className="h-4 w-4" />
              <span>Tùy chỉnh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
