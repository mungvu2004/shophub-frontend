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
  filterLabel: string
  clearFilterLabel: string
  onToggleSeverity: (severity: AlertsSeverity) => void
  onClearSeverity: () => void
  onTabChange: (tab: AlertsTabId) => void
}

const severityColorClass: Record<AlertsSeverity, string> = {
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
  action: 'bg-orange-50 text-orange-700 border-orange-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
  filterLabel,
  clearFilterLabel,
  onToggleSeverity,
  onClearSeverity,
  onTabChange,
}: AlertsSummaryStripProps) {
  const currentFilterLabel = useMemo(() => {
    if (selectedSeverities.length === 0) return filterLabel

    const labels = chips
      .filter((chip) => selectedSeverities.includes(chip.severity))
      .map((chip) => chip.label)

    if (labels.length === 0) return filterLabel
    if (labels.length === 1) return `Lọc: ${labels[0]}`
    if (labels.length === 2) return `Lọc: ${labels[0]} + ${labels[1]}`
    return `Lọc: ${labels.length} tiêu chí`
  }, [chips, selectedSeverities, filterLabel])

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
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
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
                    severityColorClass[chip.severity],
                    isSelected ? 'ring-2 ring-primary-500/20 border-primary-500' : 'opacity-80 hover:opacity-100',
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
              <DropdownMenuTrigger className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                {currentFilterLabel}
                <ChevronDown className="size-4 text-slate-400" />
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
              <Button type="button" variant="outline" className="h-9 rounded-xl border-slate-200 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900" onClick={onClearSeverity}>
                {clearFilterLabel}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-flex min-w-max items-center gap-1 rounded-xl border border-slate-100 bg-slate-50/50 p-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    isActive
                      ? 'bg-white text-primary-600 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50',
                  )}
                >
                  {tab.label} <span className={cn('ml-1 text-[11px]', isActive ? 'text-primary-400' : 'text-slate-400')}>({tab.count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
