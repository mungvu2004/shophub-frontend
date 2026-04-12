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
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.dateLabel} className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{group.dateLabel}</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{group.items.length} sự kiện</span>
          </div>

          <div className="space-y-3">
            {group.items.map((item) => (
              <InventoryStockMovementCard
                key={item.id}
                movement={item}
                isSelected={selectedMovementId === String(item.id)}
                onSelect={onSelectMovement}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}