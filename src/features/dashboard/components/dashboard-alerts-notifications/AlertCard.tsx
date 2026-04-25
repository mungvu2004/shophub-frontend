import { useState, useEffect, useRef } from 'react'
import { MessageSquareQuote, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type {
  AlertsActionVariant,
  DashboardAlertCardModel,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

type AlertCardProps = {
  card: DashboardAlertCardModel
  compact?: boolean
  isFocused?: boolean
  onActionClick?: (payload: {
    alertId: string
    actionId: string
    actionLabel: string
    category: DashboardAlertCardModel['category']
  }) => void
  onAssignClick?: (alertId: string) => void
}

const frameClass: Record<DashboardAlertCardModel['severity'], string> = {
  critical: 'border border-rose-100 bg-rose-50/30',
  action: 'border border-orange-100 bg-orange-50/30',
  info: 'border border-blue-100 bg-blue-50/30',
  resolved: 'border border-emerald-100 bg-emerald-50/30',
}

const statusClass: Record<DashboardAlertCardModel['severity'], string> = {
  critical: 'bg-rose-600 text-white',
  action: 'bg-orange-100 text-orange-800',
  info: 'bg-blue-100 text-blue-800',
  resolved: 'bg-emerald-100 text-emerald-800',
}

const platformClass: Record<DashboardAlertCardModel['platform'], string> = {
  shopee: 'bg-orange-50 text-orange-700 border-orange-100',
  lazada: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  tiktok_shop: 'bg-slate-50 text-slate-700 border-slate-200',
}

const actionVariantClass: Record<AlertsActionVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  soft: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
  ghost: 'bg-transparent text-slate-500 hover:text-slate-900',
}

export function AlertCard({ card, compact = false, isFocused = false, onActionClick, onAssignClick }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    if (!card.expiresAt) return null
    const diff = new Date(card.expiresAt).getTime() - Date.now()
    return diff > 0 ? Math.floor(diff / 1000) : 0
  })
  const cardRef = useRef<HTMLElement>(null)
  
  const isInfoCard = compact && card.severity === 'info'
  const shouldCollapseDescription = isInfoCard && card.description.length > 90
  const descriptionClassName = cn(
    'max-w-4xl text-slate-600 transition-all duration-300',
    compact ? 'text-[13px] leading-6' : 'text-sm leading-[22px]',
    isInfoCard && !isExpanded ? 'line-clamp-3 overflow-hidden' : '',
  )

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isFocused])

  useEffect(() => {
    if (!card.expiresAt) return

    const timer = setInterval(() => {
      const diff = new Date(card.expiresAt!).getTime() - Date.now()
      setTimeLeft(diff > 0 ? Math.floor(diff / 1000) : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [card.expiresAt])

  const displayCountdown = timeLeft !== null ? (() => {
    const h = Math.floor(timeLeft / 3600)
    const m = Math.floor((timeLeft % 3600) / 60)
    const s = timeLeft % 60
    
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })() : card.countdownLabel

  return (
    <article
      ref={cardRef}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border bg-white px-6 py-6 shadow-sm transition-all duration-300',
        frameClass[card.severity],
        isFocused ? 'ring-2 ring-primary-500 ring-offset-2 scale-[1.02] shadow-xl z-10' : 'border-slate-100 hover:-translate-y-1 hover:shadow-xl',
        isInfoCard && 'min-h-[260px]',
      )}
    >
      <div className="flex h-full flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 flex h-full flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className={cn('rounded-lg px-2.5 py-1 font-bold uppercase tracking-wider text-[10px]', statusClass[card.severity])}>
              {card.statusLabel}
            </span>
            <span className="text-slate-400 font-medium">{card.timeAgo}</span>
            <span className={cn('rounded-full border px-2.5 py-1 font-bold text-[10px] uppercase tracking-tight', platformClass[card.platform])}>
              {card.platformLabel}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-tighter text-nowrap">
              {card.priorityLabel}
            </span>
          </div>

          <h3 className={cn('max-w-4xl font-extrabold text-slate-900 tracking-tight', compact ? 'text-lg leading-7' : 'text-xl leading-8')}>
            {card.title}
          </h3>
          
          <div className="space-y-3">
            <p className={descriptionClassName}>{card.description}</p>

            {shouldCollapseDescription ? (
              <button
                type="button"
                onClick={() => setIsExpanded((value) => !value)}
                className="inline-flex items-center text-xs font-bold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded px-1.5 py-0.5 bg-primary-50/50 hover:bg-primary-50 transition-colors"
              >
                {isExpanded ? 'Thu gọn nội dung' : 'Xem chi tiết'}
              </button>
            ) : null}
          </div>

          {card.quote ? (
            <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50/80 px-4 py-3 text-sm text-slate-600 border border-slate-100/50 shadow-inner">
              <MessageSquareQuote className="size-4 text-slate-300" />
              <span className="italic font-medium leading-relaxed">{card.quote}</span>
            </div>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100/50">
            <div className="flex flex-wrap gap-2.5">
              {card.actions.map((action, index) => (
                <Button
                  key={action.id}
                  type="button"
                  onClick={() =>
                    onActionClick?.({
                      alertId: card.id,
                      actionId: action.id,
                      actionLabel: action.label,
                      category: card.category,
                    })
                  }
                  className={cn(
                    'h-10 rounded-xl px-5 text-xs font-black tracking-wide whitespace-nowrap shadow-sm transition-all active:scale-95',
                    isInfoCard ? 'min-w-[120px]' : '',
                    actionVariantClass[action.variant],
                    isFocused && index === 0 && 'ring-2 ring-primary-400 ring-offset-1'
                  )}
                >
                  {action.label}
                  {isFocused && index === 0 && <kbd className="ml-2 hidden sm:inline-block bg-black/10 px-1 rounded text-[9px]">Enter</kbd>}
                </Button>
              ))}
              
              {card.severity !== 'resolved' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onAssignClick?.(card.id)}
                  className="h-10 rounded-xl px-4 border-dashed border-slate-300 bg-white text-slate-500 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50/30 transition-all font-bold text-xs"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {card.assignedTo ? 'Đổi người xử lý' : 'Phân công'}
                  {isFocused && <kbd className="ml-2 hidden sm:inline-block bg-slate-100 px-1 rounded text-[9px]">A</kbd>}
                </Button>
              )}
            </div>

            {card.assignedTo && (
              <div className="flex items-center gap-3 py-1.5 px-3 rounded-full bg-slate-50 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md cursor-default">
                <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200">
                  <img src={card.assignedTo.avatar} alt={card.assignedTo.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Xử lý bởi</span>
                  <span className="text-[11px] font-black text-slate-700 leading-none">{card.assignedTo.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {displayCountdown ? (
          <aside className="w-full max-w-[160px] self-start rounded-3xl border-2 border-rose-100 bg-rose-50/50 px-5 py-6 text-center shadow-sm lg:w-[160px] transition-transform group-hover:scale-105">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/70">Hết hạn sau</p>
            <div className={cn(
              "mt-3 text-4xl font-black tracking-tighter tabular-nums drop-shadow-sm",
              timeLeft !== null && timeLeft <= 60 ? "text-rose-600 animate-pulse" : "text-rose-600"
            )}>
              <span>{displayCountdown}</span>
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  )
}
