import { CalendarDays } from 'lucide-react'
import type { ComparisonPeriod } from '@/features/dashboard/logic/dashboardKpiOverview.types'

type KPIPeriodSelectorProps = {
  selectedPeriod: ComparisonPeriod
  onPeriodChange?: (period: ComparisonPeriod) => void
}

export function KPIPeriodSelector({ selectedPeriod, onPeriodChange }: KPIPeriodSelectorProps) {
  const periods: { id: ComparisonPeriod; label: string }[] = [
    { id: 'yesterday', label: 'Hôm qua' },
    { id: 'last-week', label: 'Tuần trước' },
    { id: 'last-month', label: 'Tháng trước' },
  ]

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {periods.map((period) => {
          const isActive = selectedPeriod === period.id

          return (
            <button
              key={period.id}
              type="button"
              onClick={() => onPeriodChange?.(period.id)}
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {isActive && <CalendarDays className="mr-1.5 h-3.5 w-3.5" />}
              {period.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
