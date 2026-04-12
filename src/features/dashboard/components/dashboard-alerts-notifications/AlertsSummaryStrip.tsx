import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type {
  AlertsSeverity,
  AlertsSummaryChip,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

type AlertsSummaryStripProps = {
  chips: AlertsSummaryChip[]
  selectedSeverities: AlertsSeverity[]
  onToggleSeverity: (severity: AlertsSeverity) => void
  onClearSeverity: () => void
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
  selectedSeverities,
  onToggleSeverity,
  onClearSeverity,
}: AlertsSummaryStripProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_32px_-24px_rgba(15,23,42,0.5)] md:flex-row md:items-center md:justify-between">
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

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" className="h-9 rounded-xl px-3 text-sm font-medium text-slate-600">
          Lọc
          <ChevronDown className="size-4" />
        </Button>
        {selectedSeverities.length > 0 ? (
          <Button type="button" variant="outline" className="h-9 rounded-xl border-slate-300 px-3 text-xs" onClick={onClearSeverity}>
            Bỏ lọc
          </Button>
        ) : null}
      </div>
    </section>
  )
}
