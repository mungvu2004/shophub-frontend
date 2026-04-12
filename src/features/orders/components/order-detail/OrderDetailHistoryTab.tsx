import type { OrderDetailHistoryItem } from '@/features/orders/logic/orderDetail.types'

type OrderDetailHistoryTabProps = {
  items: OrderDetailHistoryItem[]
}

export function OrderDetailHistoryTab({ items }: OrderDetailHistoryTabProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Lịch sử đơn hàng</h3>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-700">{item.title}</p>
              <span className="font-mono text-xs text-slate-400">{item.happenedAtLabel}</span>
            </div>
            {item.note ? <p className="mt-1 text-sm text-slate-500">{item.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
