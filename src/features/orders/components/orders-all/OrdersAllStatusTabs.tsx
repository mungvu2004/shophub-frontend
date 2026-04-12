import type { OrderStatusFilter } from '@/features/orders/logic/ordersAll.types'

type OrdersAllStatusTabsProps = {
  tabs: Array<{
    id: OrderStatusFilter
    label: string
    count: number
  }>
  activeStatus: OrderStatusFilter
  onStatusChange: (status: OrderStatusFilter) => void
}

export function OrdersAllStatusTabs({ tabs, activeStatus, onStatusChange }: OrdersAllStatusTabsProps) {
  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onStatusChange(tab.id)}
            className={`h-8 rounded-full border px-4 text-[12px] font-semibold ${
              tab.id === activeStatus
                ? 'border-indigo-500 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </section>
  )
}
