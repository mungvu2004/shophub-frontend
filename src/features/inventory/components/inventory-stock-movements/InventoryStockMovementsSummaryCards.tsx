import { ArrowDownLeft, ArrowUpRight, Boxes, Store } from 'lucide-react'

import { Card } from '@/components/ui/card'
import type { InventoryStockMovementSummaryCardViewModel } from '@/features/inventory/logic/inventoryStockMovements.types'

type InventoryStockMovementsSummaryCardsProps = {
  cards: InventoryStockMovementSummaryCardViewModel[]
}

const iconMap = {
  'total-movements': Boxes,
  inbound: ArrowUpRight,
  outbound: ArrowDownLeft,
  lazada: Store,
} as const

const toneClassMap: Record<InventoryStockMovementSummaryCardViewModel['tone'], string> = {
  emerald: 'from-emerald-50 to-white text-emerald-600',
  amber: 'from-amber-50 to-white text-amber-600',
  indigo: 'from-indigo-50 to-white text-indigo-600',
  rose: 'from-rose-50 to-white text-rose-600',
}

export function InventoryStockMovementsSummaryCards({ cards }: InventoryStockMovementsSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconMap[card.id as keyof typeof iconMap] ?? Boxes

        return (
          <Card key={card.id} className={`gap-0 overflow-hidden border border-slate-100 bg-gradient-to-br px-5 py-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] ${toneClassMap[card.tone]}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon className="size-5" />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
                  <p className="mt-1 text-[28px] font-bold tracking-[-0.04em] text-[#111c2d]">{card.value}</p>
                </div>
              </div>

              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Live
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">{card.helperText}</p>
          </Card>
        )
      })}
    </section>
  )
}