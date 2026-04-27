import { BellRing, Loader2, Settings, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

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
    <ThemedPageHeader
      title={title}
      subtitle={subtitle}
      theme="crm"
      badge={{ text: 'System Alerts', icon: <ShieldAlert className="size-3.5" /> }}
    >
      <div className="flex flex-col items-start sm:items-end gap-3 w-full">
        <div className="inline-flex h-9 items-center gap-2 rounded-full border border-purple-200/50 bg-white/60 backdrop-blur px-3.5 text-xs font-bold text-purple-900 shadow-sm whitespace-nowrap">
          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span>{autoRefreshLabel}</span>
          <span className="h-3 w-px bg-purple-200" />
          <span className="text-purple-600 font-mono font-black">{updatedAtLabel}</span>
          {isRefreshing ? <Loader2 className="size-3 animate-spin text-purple-500" /> : null}
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 sm:flex-none whitespace-nowrap rounded-xl border-purple-200/50 bg-white/80 backdrop-blur px-4 text-xs font-black uppercase tracking-wider text-purple-900 shadow-sm hover:bg-white hover:text-purple-700 focus-visible:ring-purple-500"
            onClick={onMarkAllRead}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? <Loader2 className="size-4 animate-spin mr-2" /> : <BellRing className="size-4 mr-2" />}
            <span>{markAllReadLabel}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 w-10 p-0 rounded-xl border-purple-200/50 bg-white/80 backdrop-blur text-purple-600 hover:text-purple-900 hover:bg-white focus-visible:ring-purple-500 shadow-sm"
            onClick={onOpenSettings}
            title={settingsTooltip}
          >
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </ThemedPageHeader>
  )
}
