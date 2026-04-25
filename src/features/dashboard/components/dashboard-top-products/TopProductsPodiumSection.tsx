import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import type { DashboardTopProductsViewModel } from '@/features/dashboard/logic/dashboardTopProducts.types'

type TopProductsPodiumSectionProps = {
  cards: DashboardTopProductsViewModel['podiumCards']
}

const platformClassMap = {
  shopee: 'bg-orange-100 text-orange-700',
  lazada: 'bg-indigo-100 text-indigo-800',
  tiktok: 'bg-slate-900 text-white',
}

const trendClassMap = {
  up: 'text-emerald-600',
  down: 'text-rose-600',
}

const statToneClassMap = {
  good: 'text-emerald-600',
  neutral: 'text-amber-600',
  bad: 'text-rose-600',
}

function RankBadge({ rank }: { rank: 1 | 2 | 3 }) {
  const className =
    rank === 1
      ? 'bg-yellow-400 text-yellow-900'
      : rank === 2
        ? 'bg-slate-300 text-slate-700'
        : 'bg-orange-400 text-orange-950'

  return (
    <span
      className={`absolute -top-4 left-5 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-sm ${className}`}
      aria-label={`Hạng ${rank}`}
    >
      {rank}
    </span>
  )
}

export function TopProductsPodiumSection({ cards }: TopProductsPodiumSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.id}
          className={`relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md ${card.rank === 1 ? 'lg:-mt-3 lg:border-primary-200' : ''}`}
        >
          <RankBadge rank={card.rank} />

          <div className="mx-auto h-24 w-24 overflow-hidden rounded-xl bg-slate-100 ring-4 ring-slate-50">
            <img src={card.imageUrl} alt={card.name} className="h-full w-full object-cover" />
          </div>

          <div className="mt-4 text-center">
            <p className="line-clamp-1 text-base font-bold text-slate-900">{card.name}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-tight text-slate-500">SKU: {card.sku}</p>
            <span
              className={`mt-3 inline-flex rounded-lg px-2 py-1 text-[10px] font-bold ${platformClassMap[card.platformTone]}`}
            >
              {card.platformLabel}
            </span>

            <p className="mt-4 font-mono text-[30px] font-bold leading-9 text-slate-900">{card.headlineValue}</p>
            <p
              className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${trendClassMap[card.trendTone]}`}
            >
              {card.trendTone === 'up' ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {card.trendLabel} so với kỳ trước
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
            {card.stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <p className="text-[10px] text-slate-500">{stat.label}</p>
                <p
                  className={`mt-1 font-mono text-xs font-semibold ${stat.tone ? statToneClassMap[stat.tone] : 'text-slate-900'}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}
