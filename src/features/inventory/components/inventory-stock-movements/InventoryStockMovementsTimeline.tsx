import { Calendar } from 'lucide-react'
import { InventoryStockMovementCard } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementCard'
import type { InventoryStockMovementDayGroup } from '@/features/inventory/logic/inventoryStockMovements.types'

type InventoryStockMovementsTimelineProps = {
  groups: InventoryStockMovementDayGroup[]
  selectedMovementId: string | null
  onSelectMovement: (movementId: string) => void
}

export function InventoryStockMovementsTimeline({ groups, selectedMovementId, onSelectMovement }: InventoryStockMovementsTimelineProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Chưa có biến động nào phù hợp bộ lọc hiện tại.
      </div>
    )
  }

  return (
    <div className="space-y-10 relative">
      {groups.map((group) => (
        <section key={group.dateLabel} className="relative">
          <div className="sticky top-0 z-10 mb-6 flex items-center gap-4 bg-slate-50/90 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm border border-slate-100">
              <Calendar className="size-3.5 text-primary-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">{group.dateLabel}</h3>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{group.items.length} sự kiện</span>
          </div>

          <div className="space-y-4 pl-4 border-l-2 border-slate-100 ml-6">
            {group.items.map((item, index) => (
              <div 
                key={item.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <InventoryStockMovementCard
                  movement={item}
                  isSelected={selectedMovementId === String(item.id)}
                  onSelect={onSelectMovement}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
