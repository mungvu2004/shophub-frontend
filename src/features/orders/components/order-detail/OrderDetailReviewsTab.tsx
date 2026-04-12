import type { OrderDetailReviewItem } from '@/features/orders/logic/orderDetail.types'

type OrderDetailReviewsTabProps = {
  items: OrderDetailReviewItem[]
}

export function OrderDetailReviewsTab({ items }: OrderDetailReviewsTabProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">Review khách hàng</h3>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-700">{item.sourceLabel}</p>
              <span className="text-xs font-semibold text-slate-400">{item.rating > 0 ? `★ ${item.rating}/5` : 'Chưa có đánh giá'}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{item.content}</p>
            <p className="mt-1 text-xs text-slate-400">{item.createdAtLabel}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
