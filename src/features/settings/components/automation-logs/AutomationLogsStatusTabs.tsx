import { cn } from '@/lib/utils'

import type { AutomationLogStatusFilter } from '@/features/settings/logic/settingsAutomationLogs.types'

type AutomationLogsStatusTabsProps = {
  tabs: Array<{ id: AutomationLogStatusFilter; label: string }>
  value: AutomationLogStatusFilter
  onChange: (value: AutomationLogStatusFilter) => void
}

export function AutomationLogsStatusTabs({ tabs, value, onChange }: AutomationLogsStatusTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-slate-100 px-6 py-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'border-b-2 pb-1 text-[13px] font-semibold',
            value === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
