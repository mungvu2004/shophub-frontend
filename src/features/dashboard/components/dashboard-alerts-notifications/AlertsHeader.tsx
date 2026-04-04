import { BellRing, Loader2, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'

type AlertsHeaderProps = {
  title: string
  subtitle: string
  autoRefreshLabel: string
  updatedAtLabel: string
  isRefreshing: boolean
  isMarkingAllRead: boolean
  onMarkAllRead: () => void
}

export function AlertsHeader({
  title,
  subtitle,
  autoRefreshLabel,
  updatedAtLabel,
  isRefreshing,
  isMarkingAllRead,
  onMarkAllRead,
}: AlertsHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl bg-white/60 p-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm font-semibold text-rose-700">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>{autoRefreshLabel}</span>
          <span className="text-emerald-600/70">· {updatedAtLabel}</span>
          {isRefreshing ? <Loader2 className="size-3 animate-spin" /> : null}
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-lg border-slate-300 px-4 text-[13px] font-semibold"
          onClick={onMarkAllRead}
          disabled={isMarkingAllRead}
        >
          {isMarkingAllRead ? <Loader2 className="size-4 animate-spin" /> : <BellRing className="size-4" />}
          Đánh dấu tất cả đã đọc
        </Button>

        <Button type="button" variant="ghost" className="h-10 rounded-lg px-3 text-[13px] font-semibold text-slate-700">
          <Settings className="size-4" />
          Cài đặt thông báo
        </Button>
      </div>
    </header>
  )
}
