import { BellRing, Loader2, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'

type AlertsHeaderProps = {
  title: string
  subtitle: string
  autoRefreshLabel: string
  updatedAtLabel: string
  markAllReadLabel: string
  settingsTooltip: string
  isRefreshing: boolean
  isMarkingAllRead: boolean
  onMarkAllRead: () => void
  onOpenSettings: () => void
}

export function AlertsHeader({
  title,
  subtitle,
  autoRefreshLabel,
  updatedAtLabel,
  markAllReadLabel,
  settingsTooltip,
  isRefreshing,
  isMarkingAllRead,
  onMarkAllRead,
  onOpenSettings,
}: AlertsHeaderProps) {
  return (
    <header className="grid gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="text-sm font-medium text-slate-500">{subtitle}</p>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-100 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-600 whitespace-nowrap">
          <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span>{autoRefreshLabel}</span>
          <span className="h-3 w-px bg-slate-200" />
          <span className="text-slate-400 font-mono">{updatedAtLabel}</span>
          {isRefreshing ? <Loader2 className="size-3 animate-spin text-primary-500" /> : null}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 whitespace-nowrap rounded-xl border-slate-200 bg-white px-4 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:ring-primary-500"
            onClick={onMarkAllRead}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? <Loader2 className="size-3.5 animate-spin" /> : <BellRing className="size-3.5" />}
            <span>{markAllReadLabel}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-primary-500"
            onClick={onOpenSettings}
            title={settingsTooltip}
          >
            <Settings className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
