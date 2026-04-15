import { OrdersReturnsTimelineGroup } from '@/features/orders/components/orders-returns/OrdersReturnsTimelineGroup'
import type { OrdersReturnsDateGroupModel } from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsTimelineProps = {
  groups: OrdersReturnsDateGroupModel[]
  onOpenDetail?: (item: OrdersReturnsDateGroupModel['items'][number]) => void
}

export function OrdersReturnsTimeline({ groups, onOpenDetail }: OrdersReturnsTimelineProps) {
  if (groups.length === 0) {
    return <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">Không có dữ liệu hoàn/hủy theo bộ lọc hiện tại.</div>
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <OrdersReturnsTimelineGroup key={group.dateLabel} group={group} onOpenDetail={onOpenDetail} />
      ))}
    </div>
  )
}
