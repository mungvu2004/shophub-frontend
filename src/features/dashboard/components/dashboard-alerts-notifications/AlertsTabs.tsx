import { useState } from 'react'

import { cn } from '@/lib/utils'

import type { AlertsTabId, AlertsTabItem } from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

type AlertsTabsProps = {
  tabs: AlertsTabItem[]
  onTabChange: (tab: AlertsTabId) => void
}

export function AlertsTabs({ tabs, onTabChange }: AlertsTabsProps) {
  const [activeTab, setActiveTab] = useState<AlertsTabId>('all')

  const handleClick = (tab: AlertsTabId) => {
    setActiveTab(tab)
    onTabChange(tab)
  }

  return (
    <div className="overflow-x-auto border-b border-indigo-100">
      <div className="inline-flex min-w-max items-center">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleClick(tab.id)}
              className={cn(
                'border-b-2 px-5 py-3 text-sm font-semibold transition-colors',
                isActive
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
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
