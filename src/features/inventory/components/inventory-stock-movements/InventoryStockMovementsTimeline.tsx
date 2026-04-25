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
    return null;
  }

  return (
    <div className="space-y-12 relative">
      {/* Dynamic Connector Line */}
      <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-secondary-100 via-secondary-100 to-transparent" />

      {groups.map((group) => (
        <section key={group.dateLabel} className="relative">
          <div className="sticky top-20 z-10 mb-8 flex items-center gap-4 py-2">
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-2 shadow-sm border border-secondary-100 group">
              <Calendar className="size-4 text-primary-500 transition-transform group-hover:scale-110" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary-900">{group.dateLabel}</h3>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-secondary-100 to-transparent" />
            <span className="rounded-full bg-secondary-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-secondary-400 border border-secondary-100">
               {group.items.length} Giao dịch
            </span>
          </div>

          <div className="space-y-6 pl-10">
            {group.items.map((item, index) => (
              <div 
                key={item.id} 
                className="animate-in fade-in slide-in-from-left-4 duration-700 ease-out fill-mode-both"
                style={{ animationDelay: `${index * 80}ms` }}
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
