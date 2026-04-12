import { cn } from '@/lib/utils'

import type { AlertsTabId, AlertsTabItem } from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

type AlertsTabsProps = {
  activeTab: AlertsTabId
  tabs: AlertsTabItem[]
  onTabChange: (tab: AlertsTabId) => void
}

export function AlertsTabs({ activeTab, tabs, onTabChange }: AlertsTabsProps) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-max items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.5)]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'rounded-lg px-4 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-slate-900 font-semibold text-white shadow-sm'
                  : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700',
              )}
            >
              {tab.label} ({tab.count})
            </button>
          )
        })}
      </div>
    </div>
  )
}
