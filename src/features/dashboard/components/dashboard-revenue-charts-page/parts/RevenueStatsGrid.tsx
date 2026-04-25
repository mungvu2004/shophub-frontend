import { TrendingUp, TrendingDown, Calendar, DollarSign, Activity } from 'lucide-react'

import { REVENUE_CHART_COLORS } from '@/features/dashboard/logic/dashboardRevenueCharts.constants'
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
    case 'total': return 'bg-indigo-100 text-indigo-700'
    case 'avg': return 'bg-blue-100 text-blue-700'
    case 'highest': return 'bg-emerald-100 text-emerald-700'
    case 'lowest': return 'bg-rose-100 text-rose-700'
    default: return 'bg-slate-100 text-slate-600'
  }
}
export function RevenueStatsGrid({ cards }: RevenueStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.id}
          className="group relative overflow-hidden rounded-2xl border border-secondary-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-500/10 active:scale-[0.98]"
        >
          <div className="flex items-start justify-between relative z-10">
            <div className={`rounded-xl p-2.5 transition-all duration-300 ${getCardColor(card.id)} group-hover:scale-110 group-hover:shadow-lg`}>
              {getIconByCardId(card.id)}
            </div>
            {card.deltaLabel && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black shadow-sm border ${
                card.deltaTone === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                card.deltaTone === 'down' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-100'
              }`}>
                {card.deltaTone === 'up' ? '↑' : card.deltaTone === 'down' ? '↓' : ''} {card.deltaLabel}
              </span>
            )}
          </div>

          <div className="mt-6 space-y-1 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-80" style={{ color: REVENUE_CHART_COLORS.SLATE_500 }}>{card.label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-primary-600" style={{ color: REVENUE_CHART_COLORS.SLATE_900 }}>{card.value}</h4>
            </div>
            {card.dateLabel && (
              <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors" style={{ color: REVENUE_CHART_COLORS.SLATE_500 }}>{card.dateLabel}</p>
            )}
          </div>

          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-indigo-50/10 transition-all duration-700 group-hover:scale-[2] group-hover:bg-indigo-50/30" />
        </article>
      ))}
    </div>
  )
}

