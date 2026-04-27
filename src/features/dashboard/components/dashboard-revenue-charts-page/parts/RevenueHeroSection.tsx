import { ChevronDown, Download, RefreshCw, Layers } from 'lucide-react'
import type {
  RevenueChartsRangeDays,
  RevenueChartsViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

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
    <ThemedPageHeader
      title={model.title}
      subtitle={
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50/50 px-3 py-1.5 text-xs font-bold text-indigo-700 backdrop-blur border border-indigo-100">
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Cập nhật lúc: {model.updatedAtLabel}
          </span>
          <span className="h-1 w-1 rounded-full bg-indigo-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Live analytics active</span>
        </div> as any
      }
      theme="revenue"
      badge={{ text: 'Revenue Analytics', icon: <Layers className="size-3.5" /> }}
    >
      <div className="flex w-full flex-col gap-3 xl:w-auto xl:items-end">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-indigo-200/50 bg-white/60 p-1.5 backdrop-blur shadow-sm">
          {model.rangeTabs.map((tab) => (
            <button
              key={tab.days}
              type="button"
              onClick={() => onRangeChange(tab.days)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                tab.days === model.selectedRange
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-900 hover:bg-white hover:text-indigo-700'
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
            className="group inline-flex items-center gap-2 rounded-xl border border-indigo-200/50 bg-white/80 backdrop-blur px-4 py-2.5 text-sm font-bold text-indigo-900 shadow-sm transition hover:bg-white hover:text-indigo-700 active:scale-95"
          >
            <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            <span>Xuất báo cáo</span>
          </button>

          <button
            type="button"
            onClick={onToggleSettings}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
          >
            <ChevronDown className="h-4 w-4" />
            <span>Tùy chỉnh</span>
          </button>
        </div>
      </div>
    </ThemedPageHeader>
  )
}
