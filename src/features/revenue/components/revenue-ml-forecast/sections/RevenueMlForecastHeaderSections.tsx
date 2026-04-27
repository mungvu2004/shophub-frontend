import { MoveRight, Activity } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'
import type {
  RevenueMlForecastHeaderViewModel,
  RevenueMlForecastKpiCardViewModel,
} from '@/features/revenue/logic/revenueMlForecast.types'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'
import { cn } from '@/lib/utils'

function RevenueMlForecastKpiCard({ card }: { card: RevenueMlForecastKpiCardViewModel }) {
  const topBadgeLabel =
    typeof card.confidencePercent === 'number'
      ? `${card.confidencePercent.toFixed(0)}% tin cậy`
      : card.tagLabel ?? (card.accent === 'warning' ? 'Cảnh báo' : 'Đang theo dõi')

  return (
    <article
      className={cn(
        'flex h-full min-h-[182px] flex-col rounded-[26px] border px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)]',
        card.accent === 'warning'
          ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50/70'
          : 'border-slate-100 bg-gradient-to-br from-white to-slate-50/70',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-slate-500">{card.label}</p>
          <div className="mt-2 h-1.5 w-14 rounded-full bg-slate-100">
            <div
              className={cn('h-full rounded-full', card.accent === 'warning' ? 'bg-amber-400' : 'bg-[#3525cd]')}
              style={{ width: card.accent === 'warning' ? '72%' : '88%' }}
            />
          </div>
        </div>

        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.8px]',
            card.accent === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
          )}
        >
          {topBadgeLabel}
        </span>
      </div>

      <p
        className={cn(
          'mt-4 text-[28px] font-bold leading-tight tracking-[-0.4px] md:text-[30px]',
          card.accent === 'warning' ? 'text-amber-600' : 'text-[#3525cd]',
        )}
      >
        {card.valueLabel}
      </p>

      <p className="mt-2 text-[12px] font-medium leading-relaxed text-slate-600">{card.subValueLabel}</p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="min-h-5 text-[12px] font-semibold">
          {card.trendLabel ? (
            <span className={card.trendClassName}>{card.trendLabel}</span>
          ) : card.tagLabel ? (
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.8px] text-slate-600">
              {card.tagLabel}
            </span>
          ) : null}
        </div>

        {card.ctaLabel ? (
          <Button
            variant="ghost"
            className="h-auto gap-1 px-0 py-0 text-[12px] font-bold text-[#3525cd] hover:bg-transparent"
          >
            {card.ctaLabel}
            <MoveRight className="size-3.5" />
          </Button>
        ) : null}
      </div>
    </article>
  )
}

export function RevenueMlForecastHeaderSection({
  model,
  onRangeChange,
}: {
  model: RevenueMlForecastHeaderViewModel
  onRangeChange: (days: RevenueMlForecastRangeDays) => void
}) {
  return (
    <ThemedPageHeader
      title={model.title}
      subtitle={
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
          <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200/80">
            {model.modelLabel}
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700 ring-1 ring-emerald-100">
            Độ chính xác 30 ngày: {model.accuracyLabel}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600">
            {model.updateLabel}
          </span>
        </div>
      }
      theme="revenue"
      badge={{ text: 'ML Forecast', icon: <Activity className="size-3.5" /> }}
    >
      <div className="flex flex-col items-start gap-3 xl:items-end">
        <Button
          variant="ghost"
          className="h-auto px-0 py-0 text-[13px] font-semibold text-[#3525cd] hover:bg-transparent hover:text-[#3525cd]"
        >
          {model.reportCtaLabel}
        </Button>

        <div className="inline-flex w-fit flex-wrap gap-1 rounded-2xl bg-white/80 p-1.5 shadow-sm ring-1 ring-slate-200/80 backdrop-blur">
          {model.rangeOptions.map((option) => (
            <button
              key={option.days}
              type="button"
              onClick={() => onRangeChange(option.days)}
              className={cn(
                'rounded-xl px-4 py-2 text-xs font-bold transition-all',
                option.isActive
                  ? 'bg-[#3525cd] text-white shadow-[0_8px_16px_rgba(53,37,205,0.2)]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </ThemedPageHeader>
  )
}

export function RevenueMlForecastHeadlineCardsSection({
  cards,
}: {
  cards: RevenueMlForecastKpiCardViewModel[]
}) {
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {cards.map((card) => (
        <RevenueMlForecastKpiCard key={card.id} card={card} />
      ))}
    </section>
  )
}
