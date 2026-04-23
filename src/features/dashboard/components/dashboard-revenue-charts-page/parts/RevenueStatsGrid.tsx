import { TrendingUp, TrendingDown, Calendar, DollarSign, Activity } from 'lucide-react'
import type { RevenueChartsSummaryCardViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueStatsGridProps = {
  cards: RevenueChartsSummaryCardViewModel[]
}

const getIconByCardId = (id: string) => {
  switch (id) {
    case 'total': return <DollarSign className="h-5 w-5" />
    case 'avg': return <Activity className="h-5 w-5" />
    case 'highest': return <TrendingUp className="h-5 w-5" />
    case 'lowest': return <TrendingDown className="h-5 w-5" />
    default: return <Calendar className="h-5 w-5" />
  }
}

const getCardColor = (id: string) => {
  switch (id) {
    case 'total': return 'bg-primary-100 text-primary-700'
    case 'avg': return 'bg-info-100 text-info-700'
    case 'highest': return 'bg-success-100 text-success-700'
    case 'lowest': return 'bg-danger-100 text-danger-700'
    default: return 'bg-secondary-100 text-secondary-600'
  }
}

export function RevenueStatsGrid({ cards }: RevenueStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.id}
          className="group relative overflow-hidden rounded-2xl border border-secondary-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10"
        >
          <div className="flex items-start justify-between">
            <div className={`rounded-xl p-2.5 transition-colors ${getCardColor(card.id)} group-hover:bg-opacity-80`}>
              {getIconByCardId(card.id)}
            </div>
            {card.deltaLabel && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${
                card.deltaTone === 'up' ? 'bg-success-100 text-success-700' :
                card.deltaTone === 'down' ? 'bg-danger-100 text-danger-700' : 'bg-secondary-100 text-secondary-600'
              }`}>
                {card.deltaTone === 'up' ? '↑' : card.deltaTone === 'down' ? '↓' : ''} {card.deltaLabel}
              </span>
            )}
          </div>

          <div className="mt-5 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h4>
            </div>
            {card.dateLabel && (
              <p className="text-[11px] font-medium text-slate-400">{card.dateLabel}</p>
            )}
          </div>

          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-indigo-50/20 transition-transform duration-500 group-hover:scale-150" />
        </article>
      ))}
    </div>
  )
}
