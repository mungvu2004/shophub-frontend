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
    <header className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 md:flex-row md:items-end md:justify-between md:px-5">
      <div className="space-y-2">
        <h1 className="text-[24px] font-bold leading-8 text-slate-900">{title}</h1>
        <p className="text-[13px] font-medium text-slate-600">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600">
          <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-300/60" />
          <span className="font-medium">{autoRefreshLabel}</span>
          <span className="text-slate-400">{updatedAtLabel}</span>
          {isRefreshing ? <Loader2 className="size-3 animate-spin" /> : null}
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm"
          onClick={onMarkAllRead}
          disabled={isMarkingAllRead}
        >
          {isMarkingAllRead ? <Loader2 className="size-4 animate-spin" /> : <BellRing className="size-4" />}
          Đánh dấu tất cả đã đọc
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-10 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <Settings className="size-4" />
          Cài đặt thông báo
        </Button>
      </div>
    </header>
  )
}
