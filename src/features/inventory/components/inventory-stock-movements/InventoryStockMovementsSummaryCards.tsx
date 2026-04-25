import { Boxes, ArrowUpRight, ArrowDownLeft, Store, TrendingUp } from 'lucide-react'
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

const toneColorMap = {
  emerald: 'text-emerald-600 bg-emerald-50',
  amber: 'text-amber-600 bg-amber-50',
  indigo: 'text-primary-600 bg-primary-50',
  rose: 'text-rose-600 bg-rose-50',
}

export function InventoryStockMovementsSummaryCards({ cards }: InventoryStockMovementsSummaryCardsProps) {
  return (
    <Card className="h-full min-h-[340px] border border-secondary-100 bg-white p-7 rounded-[32px] shadow-sm flex flex-col transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h3 className="text-xs font-black text-secondary-900 uppercase tracking-[0.2em]">Tổng quan</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1 text-[9px] font-black text-secondary-400 border border-secondary-100">
           <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           REAL-TIME
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-6">
        {cards.map((card) => {
          const Icon = iconMap[card.id as keyof typeof iconMap] ?? Boxes
          const colors = toneColorMap[card.tone]

          return (
            <div 
              key={card.id} 
              className="group relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className={`flex size-11 items-center justify-center rounded-2xl ${colors} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm border border-transparent group-hover:border-current`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-400 mb-0.5">{card.label}</p>
                    <p className="text-xl font-black text-secondary-900 tabular-nums">{card.value}</p>
                  </div>
                </div>
                <div className="text-right">
                   {card.id === 'total-movements' && <TrendingUp className="size-4 text-emerald-500 ml-auto animate-bounce-slow" />}
                   <p className="text-[9px] font-black text-secondary-400 uppercase tracking-tighter mt-1">{card.helperText.split(' ')[0]}</p>
                </div>
              </div>
              
              {/* Premium Progress Bar */}
              <div className="h-1 w-full bg-secondary-50 rounded-full overflow-hidden">
                 <div 
                   className={`h-full rounded-full transition-all duration-1000 ease-out ${card.tone === 'emerald' ? 'bg-emerald-500' : card.tone === 'rose' ? 'bg-rose-500' : 'bg-primary-500'}`}
                   style={{ width: card.id === 'total-movements' ? '100%' : '70%' }}
                 />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-secondary-50 shrink-0">
         <p className="text-[9px] text-secondary-300 font-bold uppercase tracking-widest text-center italic">
            Theo bộ lọc hiện tại
         </p>
      </div>
    </Card>
  )
}
