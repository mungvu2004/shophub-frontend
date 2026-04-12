import { RotateCcw, WalletCards, XCircle } from 'lucide-react'

import type { OrdersReturnsStatCardModel } from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsSummaryCardsProps = {
  cards: OrdersReturnsStatCardModel[]
}

const toneConfig = {
  rose: {
    iconWrap: 'bg-[rgba(186,26,26,0.1)] text-[#ba1a1a]',
    badge: 'bg-[rgba(186,26,26,0.05)] text-[#ba1a1a]',
  },
  slate: {
    iconWrap: 'bg-[rgba(119,117,135,0.1)] text-[#777587]',
    badge: 'bg-[rgba(119,117,135,0.05)] text-[#777587]',
  },
  indigo: {
    iconWrap: 'bg-[rgba(53,37,205,0.1)] text-[#3525cd]',
    badge: 'bg-[rgba(53,37,205,0.05)] text-[#3525cd]',
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
          <article key={card.id} className="rounded-xl bg-white p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between">
              <div className={`flex size-12 items-center justify-center rounded-xl ${tone.iconWrap}`}>
                <Icon className="size-5" />
              </div>
              <span className={`rounded-lg px-2 py-1 text-[12px] font-bold uppercase tracking-[0.6px] ${tone.badge}`}>
                {card.title}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <p className="font-mono text-[34px] font-medium leading-10 tracking-[-0.85px] text-[#111c2d]">{card.valueLabel}</p>
              <p className="text-[14px] text-[#464555]">{card.subLabel}</p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
