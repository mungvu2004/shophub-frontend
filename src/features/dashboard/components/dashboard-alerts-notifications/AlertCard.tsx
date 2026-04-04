import { Clock3, MessageSquareQuote } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type {
  AlertsActionVariant,
  DashboardAlertCardModel,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

type AlertCardProps = {
  card: DashboardAlertCardModel
}

const frameClass: Record<DashboardAlertCardModel['severity'], string> = {
  critical: 'border-l-4 border-l-rose-600 bg-rose-50/40',
  action: 'border-l-4 border-l-orange-500 bg-white',
  info: 'border-l-4 border-l-blue-500 bg-white',
  resolved: 'border-l-4 border-l-emerald-500 bg-emerald-50/40',
}

const statusClass: Record<DashboardAlertCardModel['severity'], string> = {
  critical: 'bg-rose-600 text-white',
  action: 'bg-orange-100 text-orange-700',
  info: 'bg-blue-100 text-blue-700',
  resolved: 'bg-emerald-100 text-emerald-700',
}

const platformClass: Record<DashboardAlertCardModel['platform'], string> = {
  shopee: 'bg-orange-100 text-orange-700',
  lazada: 'bg-indigo-100 text-indigo-700',
  tiktok_shop: 'bg-slate-100 text-slate-700',
}

const actionVariantClass: Record<AlertsActionVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  soft: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  ghost: 'bg-transparent text-slate-400 hover:text-slate-700',
}

export function AlertCard({ card }: AlertCardProps) {
  return (
    <article className={cn('rounded-xl px-6 py-5 shadow-sm', frameClass[card.severity])}>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={cn('rounded-md px-2 py-1 font-bold uppercase tracking-wide', statusClass[card.severity])}>
              {card.statusLabel}
            </span>
            <span className="text-slate-400">{card.timeAgo}</span>
            <span className={cn('rounded-full px-2 py-1 font-semibold', platformClass[card.platform])}>{card.platformLabel}</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">{card.priorityLabel}</span>
          </div>

          <h3 className="text-[28px] font-bold leading-tight text-slate-900">{card.title}</h3>
          <p className="max-w-4xl text-sm leading-6 text-slate-600">{card.description}</p>

          {card.quote ? (
            <div className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
              <MessageSquareQuote className="size-4 text-slate-400" />
              <span>{card.quote}</span>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            {card.actions.map((action) => (
              <Button
                key={action.id}
                type="button"
                className={cn('h-9 rounded-lg px-4 text-xs font-semibold', actionVariantClass[action.variant])}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {card.countdownLabel ? (
          <aside className="min-w-[132px] self-stretch rounded-xl border border-rose-100 bg-white px-4 py-3 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-rose-600">Đếm ngược</p>
            <div className="mt-2 inline-flex items-center gap-2 text-3xl font-bold text-slate-900">
              <Clock3 className="size-5 text-rose-500" />
              <span>{card.countdownLabel}</span>
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  )
}
