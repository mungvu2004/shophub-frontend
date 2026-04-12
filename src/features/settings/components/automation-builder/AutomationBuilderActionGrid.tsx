import { Bell, MessageCircle, ShieldCheck, Tag } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { AutomationBuilderActionIcon, AutomationBuilderActionViewModel } from '@/features/settings/logic/settingsAutomationBuilder.types'

const iconMap: Record<AutomationBuilderActionIcon, LucideIcon> = {
  bell: Bell,
  tag: Tag,
  'message-circle': MessageCircle,
  'shield-check': ShieldCheck,
}

type AutomationBuilderActionGridProps = {
  actions: AutomationBuilderActionViewModel[]
  onSelect: (actionId: string) => void
}

export function AutomationBuilderActionGrid({ actions, onSelect }: AutomationBuilderActionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2">
      {actions.map((action) => {
        const Icon = iconMap[action.icon]

        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action.id)}
            className={cn(
              'relative flex min-h-[120px] flex-col items-start justify-center gap-2 rounded-lg border bg-white px-4 text-left transition-all',
              action.isSelected
                ? 'border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm',
            )}
          >
            <Icon className={cn('size-6', action.isSelected ? 'text-indigo-600' : 'text-slate-400')} />
            <p className={cn('text-sm', action.isSelected ? 'font-semibold text-slate-700' : 'font-medium text-slate-600')}>{action.title}</p>
            <p className="text-xs leading-5 text-slate-500">{action.description}</p>
          </button>
        )
      })}
    </div>
  )
}
