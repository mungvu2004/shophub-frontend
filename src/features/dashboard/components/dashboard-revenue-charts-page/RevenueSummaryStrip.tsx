import type { RevenueChartsSummaryCardViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueSummaryStripProps = {
  cards: RevenueChartsSummaryCardViewModel[]
}

const deltaColorByTone = {
  up: 'text-emerald-600',
  down: 'text-rose-600',
  neutral: 'text-slate-500',
}

  // eslint-disable-next-line react-refresh/only-export-components
export const toDeltaIndicator = (tone?: RevenueChartsSummaryCardViewModel['deltaTone']) => {
  if (tone === 'down') return '↓'
  if (tone === 'up') return '↑'
  return ''
}

export function RevenueSummaryStrip({ cards }: RevenueSummaryStripProps) {
  return (
    <section className="grid grid-cols-1 overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <article key={card.id} className={`space-y-2 p-5 ${index < cards.length - 1 ? 'border-b border-indigo-100 xl:border-b-0 xl:border-r' : ''}`}>
          <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">{card.label}</p>
          <div className="flex flex-wrap items-end gap-2">
            <p className="text-2xl font-bold tracking-tight text-slate-900">{card.value}</p>
            {card.deltaLabel ? (
              <p className={`text-xs font-bold ${deltaColorByTone[card.deltaTone ?? 'neutral']}`}>
                {toDeltaIndicator(card.deltaTone)}{toDeltaIndicator(card.deltaTone) ? ' ' : ''}{card.deltaLabel}
              </p>
            ) : null}
            {card.dateLabel ? <p className="text-xs font-bold text-slate-500">{card.dateLabel}</p> : null}
          </div>
        </article>
      ))}
    </section>
  )
}
