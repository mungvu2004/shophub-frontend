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
    <Card className="h-full min-h-[340px] border border-slate-100 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tổng quan chỉ số</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-100">
           <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
           REAL-TIME
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-4">
        {cards.map((card) => {
          const Icon = iconMap[card.id as keyof typeof iconMap] ?? Boxes
          const colors = toneColorMap[card.tone]

          return (
            <div 
              key={card.id} 
              className="group relative"
              title={
                card.id === 'total-movements' ? 'Tổng số lần nhập/xuất/điều chuyển phát hiện trong kỳ' :
                card.id === 'inbound' ? 'Tổng số lượng sản phẩm được nhập thêm vào kho' :
                card.id === 'outbound' ? 'Tổng số lượng sản phẩm xuất đi (đơn hàng, hao hụt...)' :
                card.id === 'lazada' ? 'Số lượng biến động phát sinh từ kênh Lazada' :
                card.helperText
              }
            >
              <div className="flex items-center justify-between mb-2 cursor-help">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-2xl ${colors} transition-transform group-hover:scale-110 shadow-sm`}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                    <p className="text-lg font-black text-secondary-900 leading-none mt-0.5">{card.value}</p>
                  </div>
                </div>
                <div className="text-right">
                   {card.id === 'total-movements' && <TrendingUp className="size-4 text-emerald-500 ml-auto" />}
                   <p className="text-[10px] font-medium text-slate-400 mt-1">{card.helperText.split(' ')[0]}</p>
                </div>
              </div>
              
              {/* Mini progress bar decoration */}
              <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden mt-2">
                 <div 
                   className={`h-full rounded-full opacity-60 ${card.tone === 'emerald' ? 'bg-emerald-500' : card.tone === 'rose' ? 'bg-rose-500' : 'bg-primary-500'}`}
                   style={{ width: card.id === 'total-movements' ? '100%' : '65%' }}
                 />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 shrink-0">
         <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic text-center">
            * Dữ liệu được tính toán dựa trên các bộ lọc hiện tại của hệ thống.
         </p>
      </div>
    </Card>
  )
}
