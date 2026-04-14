import { ChevronDown } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import type {
  AlertsSeverity,
  AlertsTabId,
  AlertsSummaryChip,
  AlertsTabItem,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

type AlertsSummaryStripProps = {
  chips: AlertsSummaryChip[]
  tabs: AlertsTabItem[]
  activeTab: AlertsTabId
  selectedSeverities: AlertsSeverity[]
  onToggleSeverity: (severity: AlertsSeverity) => void
  onClearSeverity: () => void
  onTabChange: (tab: AlertsTabId) => void
}

const severityColorClass: Record<AlertsSeverity, string> = {
  critical: 'bg-rose-50 text-rose-700 ring-rose-200',
  action: 'bg-orange-50 text-orange-700 ring-orange-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

const dotColorClass: Record<AlertsSeverity, string> = {
  critical: 'bg-rose-600',
  action: 'bg-orange-500',
  info: 'bg-blue-500',
  resolved: 'bg-emerald-500',
}

export function AlertsSummaryStrip({
  chips,
  tabs,
  activeTab,
  selectedSeverities,
  onToggleSeverity,
  onClearSeverity,
  onTabChange,
}: AlertsSummaryStripProps) {
  const filterLabel = useMemo(() => {
    if (selectedSeverities.length === 0) return 'Lọc'

    const labels = chips
      .filter((chip) => selectedSeverities.includes(chip.severity))
      .map((chip) => chip.label)

    if (labels.length === 0) return 'Lọc'
    if (labels.length === 1) return `Lọc: ${labels[0]}`
    if (labels.length === 2) return `Lọc: ${labels[0]} + ${labels[1]}`
    return `Lọc: ${labels.length} tiêu chí`
  }, [chips, selectedSeverities])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_32px_-24px_rgba(15,23,42,0.5)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const isSelected = selectedSeverities.includes(chip.severity)

              return (
                <button
                  key={chip.severity}
                  type="button"
                  onClick={() => onToggleSeverity(chip.severity)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide ring-1 transition',
                    severityColorClass[chip.severity],
                    isSelected ? 'ring-2 ring-offset-1 opacity-100' : 'opacity-75 hover:opacity-100',
                  )}
                >
                  <span className={cn('size-2 rounded-full', dotColorClass[chip.severity])} />
                  {chip.label}: {chip.count}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 items-center gap-1 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
                {filterLabel}
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuRadioGroup value={selectedSeverities.join('|')}>
                  <DropdownMenuRadioItem
                    value=""
                    onSelect={(event) => {
                      event.preventDefault()
                      onClearSeverity()
                    }}
                  >
                    Tất cả mức độ
                  </DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  {chips.map((chip) => (
                    <DropdownMenuCheckboxItem
                      key={chip.severity}
                      checked={selectedSeverities.includes(chip.severity)}
                      onCheckedChange={() => onToggleSeverity(chip.severity)}
                    >
                      {chip.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem
                    value="critical+action"
                    onSelect={(event) => {
                      event.preventDefault()
                      onClearSeverity()
                      onToggleSeverity('critical')
                      onToggleSeverity('action')
                    }}
                  >
                    Ưu tiên xử lý
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedSeverities.length > 0 ? (
              <Button type="button" variant="outline" className="h-9 rounded-xl border-slate-300 px-3 text-xs" onClick={onClearSeverity}>
                Bỏ lọc
              </Button>
            ) : null}
          </div>
        </div>

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
      </div>
    </section>
  )
}
