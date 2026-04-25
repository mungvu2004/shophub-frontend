import { RotateCcw, WalletCards, XCircle } from 'lucide-react'

import type { OrdersReturnsStatCardModel } from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsSummaryCardsProps = {
  cards: OrdersReturnsStatCardModel[]
}

const toneConfig = {
  rose: {
    iconWrap: 'bg-rose-100/50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
    badge: 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
  },
  slate: {
    iconWrap: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    badge: 'bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-300',
  },
  indigo: {
    iconWrap: 'bg-indigo-100/50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
  },
} as const

function resolveIcon(id: OrdersReturnsStatCardModel['id']) {
  if (id === 'returns') return RotateCcw
  if (id === 'cancellations') return XCircle
  return WalletCards
}

export function OrdersReturnsSummaryCards({ cards }: OrdersReturnsSummaryCardsProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = resolveIcon(card.id)
        const tone = toneConfig[card.tone]

        return (
          <article key={card.id} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div className={`flex size-12 items-center justify-center rounded-xl ${tone.iconWrap}`}>
                <Icon className="size-5" />
              </div>
              <span className={`rounded-lg px-2 py-1 text-[12px] font-bold uppercase tracking-[0.6px] ${tone.badge}`}>
                {card.title}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <p className="font-mono text-[34px] font-medium leading-10 tracking-[-0.85px] text-slate-900 dark:text-slate-100">{card.valueLabel}</p>
              <p className="text-[14px] text-slate-600 dark:text-slate-400">{card.subLabel}</p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
