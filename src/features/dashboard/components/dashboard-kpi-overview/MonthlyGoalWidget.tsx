import { Target } from 'lucide-react'
import type { MonthlyGoalData } from '@/features/dashboard/logic/dashboardKpiOverview.types'

type MonthlyGoalWidgetProps = {
  goal: MonthlyGoalData & { safeProgressPercent: number; isPlaceholder?: boolean }
}

export function MonthlyGoalWidget({ goal }: MonthlyGoalWidgetProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all hover:border-indigo-200">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <Target className="h-4 w-4" />
      </div>
      
      <div className="min-w-[140px] space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>Mục tiêu tháng</span>
          <span className="text-emerald-600">{goal.safeProgressPercent}%</span>
        </div>
        
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
            style={{ width: `${goal.safeProgressPercent}%` }}
          />
        </div>
        
        <div className="text-[10px] font-medium text-slate-500">
          <span className={goal.isPlaceholder ? 'text-slate-300' : 'text-slate-900'}>{goal.currentValue}</span>
          <span className="mx-1">/</span>
          <span>{goal.targetValue}</span>
        </div>
      </div>
    </div>
  )
}
