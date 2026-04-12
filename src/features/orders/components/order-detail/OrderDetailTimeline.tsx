import type { OrderDetailHistoryItem } from '@/features/orders/logic/orderDetail.types'

type OrderDetailTimelineProps = {
  items: OrderDetailHistoryItem[]
}

export function OrderDetailTimeline({ items }: OrderDetailTimelineProps) {
  return (
    <section className="rounded-xl border border-indigo-100 bg-white p-4">
      <div className="relative space-y-5 pl-6">
        <div className="absolute left-[7px] top-1 h-[78%] w-[2px] bg-indigo-100" />

        {items.map((item) => (
          <div key={item.id} className="relative">
            <span
              className={`absolute -left-6 top-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] text-white ${
                item.done ? 'bg-emerald-500' : item.active ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            >
              {item.done ? '✓' : '•'}
            </span>
            <p className={`font-semibold ${item.done ? 'text-slate-700' : item.active ? 'text-indigo-600' : 'text-slate-400'}`}>{item.title}</p>
            <p className={`text-sm ${item.done ? 'text-slate-400' : item.active ? 'text-indigo-400' : 'text-slate-300'}`}>{item.happenedAtLabel}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
