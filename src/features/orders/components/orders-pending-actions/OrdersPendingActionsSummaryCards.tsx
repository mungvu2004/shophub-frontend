import type { OrdersPendingActionsCardModel } from '@/features/orders/logic/ordersPendingActions.types'

type OrdersPendingActionsSummaryCardsProps = {
  cards: OrdersPendingActionsCardModel[]
}

function getToneClass(tone: OrdersPendingActionsCardModel['tone']): string {
  if (tone === 'rose') return 'border-rose-100 bg-rose-50/70'
  if (tone === 'amber') return 'border-amber-100 bg-amber-50/70'
  if (tone === 'indigo') return 'border-indigo-100 bg-indigo-50/70'
  return 'border-slate-200 bg-slate-50/70'
}

export function OrdersPendingActionsSummaryCards({ cards }: OrdersPendingActionsSummaryCardsProps) {
  return (
    <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.id} className={`rounded-xl border p-4 shadow-[0_6px_14px_rgba(15,23,42,0.04)] ${getToneClass(card.tone)}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.4px] text-slate-500">{card.title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
          <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
        </article>
      ))}
    </section>
  )
}
