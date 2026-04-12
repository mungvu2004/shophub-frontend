import { Clock3, Filter, Package, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { AutomationBuilderConditionIcon, AutomationBuilderConditionViewModel } from '@/features/settings/logic/settingsAutomationBuilder.types'

const iconMap: Record<AutomationBuilderConditionIcon, LucideIcon> = {
  package: Package,
  'clock-3': Clock3,
  'triangle-alert': TriangleAlert,
  filter: Filter,
}

type AutomationBuilderConditionGridProps = {
  conditions: AutomationBuilderConditionViewModel[]
  onSelect: (conditionId: string) => void
}

export function AutomationBuilderConditionGrid({ conditions, onSelect }: AutomationBuilderConditionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2">
      {conditions.map((condition) => {
        const Icon = iconMap[condition.icon]

        return (
          <button
            key={condition.id}
            type="button"
            onClick={() => onSelect(condition.id)}
            className={cn(
              'relative flex min-h-[120px] flex-col items-start justify-center gap-2 rounded-lg border bg-white px-4 text-left transition-all',
              condition.isSelected
                ? 'border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm',
            )}
          >
            <Icon className={cn('size-6', condition.isSelected ? 'text-indigo-600' : 'text-slate-400')} />
            <p className={cn('text-sm', condition.isSelected ? 'font-semibold text-slate-700' : 'font-medium text-slate-600')}>{condition.title}</p>
            <p className="text-xs leading-5 text-slate-500">{condition.description}</p>
          </button>
        )
      })}
    </div>
  )
}
