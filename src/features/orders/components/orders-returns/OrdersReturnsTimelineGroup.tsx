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
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{group.dateLabel}</h2>
        <div className="h-px flex-1 bg-indigo-100 dark:bg-slate-800" />
      </div>

      <div className="relative space-y-3 pl-8">
        <div className="absolute bottom-3 left-[10px] top-3 w-[2px] bg-indigo-100 dark:bg-slate-800" />
        {group.items.map((item) => (
          <OrdersReturnsTimelineItem key={item.id} item={item} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </section>
  )
}
