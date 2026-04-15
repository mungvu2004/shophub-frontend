import { OrdersReturnsTimelineItem } from '@/features/orders/components/orders-returns/OrdersReturnsTimelineItem'
import type { OrdersReturnsDateGroupModel } from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsTimelineGroupProps = {
  group: OrdersReturnsDateGroupModel
  onOpenDetail?: (item: OrdersReturnsDateGroupModel['items'][number]) => void
}

export function OrdersReturnsTimelineGroup({ group, onOpenDetail }: OrdersReturnsTimelineGroupProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-4">
        <h2 className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#464555]">{group.dateLabel}</h2>
        <div className="h-px flex-1 bg-[#d8e3fb]" />
      </div>

      <div className="relative space-y-3 pl-8">
        <div className="absolute bottom-3 left-[10px] top-3 w-[2px] bg-[#d8e3fb]" />
        {group.items.map((item) => (
          <OrdersReturnsTimelineItem key={item.id} item={item} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </section>
  )
}
