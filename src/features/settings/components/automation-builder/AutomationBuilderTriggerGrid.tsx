import { Clock3, Package, ShoppingCart, TriangleAlert, TrendingUpDown, Webhook } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { AutomationBuilderTriggerIcon, AutomationBuilderTriggerViewModel } from '@/features/settings/logic/settingsAutomationBuilder.types'

const iconMap: Record<AutomationBuilderTriggerIcon, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  package: Package,
  'message-square-warning': TriangleAlert,
  'trending-up-down': TrendingUpDown,
  'clock-3': Clock3,
  webhook: Webhook,
}

type AutomationBuilderTriggerGridProps = {
  triggers: AutomationBuilderTriggerViewModel[]
  onSelect: (triggerId: string) => void
}

export function AutomationBuilderTriggerGrid({ triggers, onSelect }: AutomationBuilderTriggerGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2 xl:grid-cols-3">
      {triggers.map((trigger) => {
        const Icon = iconMap[trigger.icon]

        return (
          <button
            key={trigger.id}
            type="button"
            onClick={() => onSelect(trigger.id)}
            className={cn(
              'relative flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-lg border bg-white px-4 text-center transition-all',
              trigger.isSelected
                ? 'border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm',
            )}
          >
            <Icon className={cn('size-6', trigger.isSelected ? 'text-indigo-600' : 'text-slate-400')} />
            <p className={cn('text-sm', trigger.isSelected ? 'font-semibold text-slate-700' : 'font-medium text-slate-600')}>{trigger.title}</p>
            {trigger.isSelected ? <span className="absolute right-2 top-2 size-3 rounded-full bg-indigo-600" aria-hidden /> : null}
          </button>
        )
      })}
    </div>
  )
}
