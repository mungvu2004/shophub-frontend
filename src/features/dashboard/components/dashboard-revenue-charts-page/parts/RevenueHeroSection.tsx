import { ChevronDown, Download, RefreshCw, Layers } from 'lucide-react'
import type {
  RevenueChartsRangeDays,
  RevenueChartsViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueHeroSectionProps = {
  model: RevenueChartsViewModel
  isRefreshing: boolean
  onRangeChange: (range: RevenueChartsRangeDays) => void
}

export function RevenueHeroSection({ model, isRefreshing, onRangeChange }: RevenueHeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0F172A] p-8 text-white shadow-2xl sm:p-12">
      {/* Background patterns */}
      <div className="absolute left-0 top-0 h-full w-full opacity-10">
        <div className="absolute left-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-indigo-500 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/20 p-2 backdrop-blur-md">
              <Layers className="h-6 w-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{model.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              Cập nhật lúc: {model.updatedAtLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="text-indigo-400">Live Analytics Active</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-2xl bg-slate-800/50 p-1.5 backdrop-blur-md border border-slate-700/50">
            {model.rangeTabs.map((tab) => (
              <button
                key={tab.days}
                type="button"
                onClick={() => onRangeChange(tab.days)}
                className={`rounded-xl px-5 py-2 text-xs font-bold transition-all duration-300 ${
                  tab.days === model.selectedRange 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="group flex items-center gap-2 rounded-2xl bg-slate-800/50 px-5 py-3 text-sm font-bold text-slate-200 border border-slate-700/50 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-4 w-4 text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
              <span>Xuất báo cáo</span>
            </button>
            
            <button
              type="button"
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-95"
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
