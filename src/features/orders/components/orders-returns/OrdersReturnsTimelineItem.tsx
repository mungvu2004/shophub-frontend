import type { OrdersReturnsTimelineItemModel } from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsTimelineItemProps = {
  item: OrdersReturnsTimelineItemModel
  onOpenDetail?: (item: OrdersReturnsTimelineItemModel) => void
}

export function OrdersReturnsTimelineItem({ item, onOpenDetail }: OrdersReturnsTimelineItemProps) {
  const openOrderDetail = () => {
    if (onOpenDetail) {
      onOpenDetail(item)
    }
  }

  return (
    <article
      className="relative grid cursor-pointer gap-3 rounded-xl bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] hover:bg-indigo-50/20 md:grid-cols-[128px_minmax(0,1fr)_120px_160px_88px] md:items-center md:gap-6"
      onClick={openOrderDetail}
    >
      <div className="space-y-1">
        <p className="font-mono text-[14px] font-medium text-[#3525cd]">{item.orderCode}</p>
        <p className={`text-[10px] font-bold uppercase tracking-[0.5px] ${item.orderKindTone === 'rose' ? 'text-[#ba1a1a]' : 'text-[#777587]'}`}>
          {item.orderKindLabel}
        </p>
        <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
          <span className={`h-1.5 w-1.5 rounded-full ${item.platformDotClass}`} />
          {item.platformLabel}
        </p>
      </div>

      <div>
        <h3 className="text-[16px] font-bold text-[#111c2d]">{item.productName}</h3>
        <p className="text-[14px] text-[#464555]">
          Customer: <span className="font-semibold text-[#111c2d]">{item.customerName}</span>
        </p>
      </div>

      <p className="font-mono text-[16px] font-medium text-[#111c2d] md:text-right">{item.amountLabel}</p>

      <div className="md:justify-self-center">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.4px] ${item.statusClassName}`}>
          {item.statusLabel}
        </span>
      </div>

      <button
        type="button"
        className="justify-self-start text-[14px] font-bold text-[#3525cd] md:justify-self-end"
        onClick={(event) => {
          event.stopPropagation()
          openOrderDetail()
        }}
      >
        Chi tiết
      </button>

      <span
        className={`absolute -left-[25px] top-9 size-2.5 rounded-full ring-4 ring-[#f9f9ff] ${item.isAlert ? 'bg-[#ba1a1a]' : 'bg-[#777587]'}`}
      />
    </article>
  )
}
