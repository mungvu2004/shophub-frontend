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
    <div
      role="button"
      tabIndex={0}
      className="relative flex cursor-pointer flex-col gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-colors hover:bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-indigo-900/20 md:grid md:grid-cols-[128px_minmax(0,1fr)_120px_160px_88px] md:items-center md:gap-6"
      onClick={openOrderDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openOrderDetail()
        }
      }}
    >
      <div className="space-y-1">
        <p className="font-mono text-[14px] font-medium text-indigo-700 dark:text-indigo-400">{item.orderCode}</p>
        <p className={`text-[10px] font-bold uppercase tracking-[0.5px] ${item.orderKindTone === 'rose' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
          {item.orderKindLabel}
        </p>
        <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <span className={`h-1.5 w-1.5 rounded-full ${item.platformDotClass}`} />
          {item.platformLabel}
        </p>
      </div>

      <div>
        <h3 className="text-[16px] font-bold text-slate-900 dark:text-slate-100">{item.productName}</h3>
        <p className="text-[14px] text-slate-600 dark:text-slate-400">
          Customer: <span className="font-semibold text-slate-900 dark:text-slate-200">{item.customerName}</span>
        </p>
      </div>

      <div className="flex items-center justify-between md:contents">
        <p className="font-mono text-[16px] font-medium text-slate-900 dark:text-slate-100 md:text-right">{item.amountLabel}</p>

        <div className="md:justify-self-center">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.4px] ${item.statusClassName}`}>
            {item.statusLabel}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-lg bg-slate-50 py-2 text-[14px] font-bold text-indigo-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700 md:w-auto md:justify-self-end md:bg-transparent md:p-0 md:hover:bg-transparent md:hover:text-indigo-800 dark:md:bg-transparent dark:md:hover:bg-transparent"
        onClick={(event) => {
          event.stopPropagation()
          openOrderDetail()
        }}
      >
        Chi tiết
      </button>

      <span
        className={`absolute -left-[25px] top-9 size-2.5 rounded-full ring-4 ring-white dark:ring-slate-950 ${item.isAlert ? 'bg-rose-600 dark:bg-rose-500' : 'bg-slate-400 dark:bg-slate-600'}`}
      />
    </div>
  )
}
