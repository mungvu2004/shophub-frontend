import { MessageSquareQuote } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type {
  AlertsActionVariant,
  DashboardAlertCardModel,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

type AlertCardProps = {
  card: DashboardAlertCardModel
  compact?: boolean
}

const frameClass: Record<DashboardAlertCardModel['severity'], string> = {
  critical: 'border border-rose-200 bg-gradient-to-br from-rose-50/70 via-white to-white',
  action: 'border border-orange-200 bg-gradient-to-br from-orange-50/80 via-white to-white',
  info: 'border border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-white',
  resolved: 'border border-emerald-200 bg-gradient-to-br from-emerald-50/75 via-white to-white',
}

const statusClass: Record<DashboardAlertCardModel['severity'], string> = {
  critical: 'bg-rose-600 text-white',
  action: 'bg-orange-100 text-orange-800',
  info: 'bg-blue-100 text-blue-800',
  resolved: 'bg-emerald-100 text-emerald-800',
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

export function AlertCard({ card, compact = false }: AlertCardProps) {
  return (
    <article className={cn('relative overflow-hidden rounded-2xl px-5 py-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]', frameClass[card.severity])}>
      <div className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600">
        {card.priorityLabel}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={cn('rounded-md px-2 py-1 font-bold uppercase tracking-wide', statusClass[card.severity])}>
              {card.statusLabel}
            </span>
            <span className="text-slate-400">{card.timeAgo}</span>
            <span className={cn('rounded-full px-2 py-1 font-semibold', platformClass[card.platform])}>{card.platformLabel}</span>
          </div>

          <h3 className={cn('max-w-4xl font-semibold text-slate-900', compact ? 'text-[16px] leading-6' : 'text-[19px] leading-7')}>
            {card.title}
          </h3>
          <p className={cn('max-w-4xl text-slate-600', compact ? 'text-[13px] leading-6' : 'text-sm leading-[22px]')}>
            {card.description}
          </p>

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
                className={cn('h-9 rounded-xl px-4 text-xs font-semibold', actionVariantClass[action.variant])}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {card.countdownLabel ? (
          <aside className="min-w-[140px] self-stretch rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-[0_8px_20px_-16px_rgba(15,23,42,0.45)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Đếm ngược</p>
            <div className="mt-2 text-3xl font-bold text-slate-900">
              <span>{card.countdownLabel}</span>
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  )
}
