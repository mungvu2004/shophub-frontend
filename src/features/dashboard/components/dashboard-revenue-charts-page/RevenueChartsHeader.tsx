import { ChevronDown, Download } from 'lucide-react'

import type {
  RevenueChartsRangeDays,
  RevenueChartsViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueChartsHeaderProps = {
  model: RevenueChartsViewModel
  isRefreshing: boolean
  onRangeChange: (range: RevenueChartsRangeDays) => void
}

export function RevenueChartsHeader({ model, isRefreshing, onRangeChange }: RevenueChartsHeaderProps) {
  return (
    <section className="bg-abstract-geometric flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-[13px] text-slate-600">
          <span>{model.title}</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
        </div>
        <p className="mt-1 text-xs font-semibold text-slate-400">{model.updatedAtLabel}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg bg-indigo-50 p-1">
          {model.rangeTabs.map((tab) => (
            <button
              key={tab.days}
              type="button"
              onClick={() => onRangeChange(tab.days)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                tab.days === model.selectedRange ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          <ChevronDown className="h-4 w-4" />
          Sàn TMĐT
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200"
        >
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </button>

        {isRefreshing ? <span className="text-xs font-semibold text-slate-400">Đang cập nhật...</span> : null}
      </div>
    </section>
  )
}
