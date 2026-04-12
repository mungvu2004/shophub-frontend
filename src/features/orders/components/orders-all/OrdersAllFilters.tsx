import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import type { OrderPlatformFilter, OrdersAllPlatformOption } from '@/features/orders/logic/ordersAll.types'

type OrdersAllFiltersProps = {
  search: string
  platform: OrderPlatformFilter
  platformOptions: OrdersAllPlatformOption[]
  onSearchChange: (value: string) => void
  onPlatformChange: (value: OrderPlatformFilter) => void
}

export function OrdersAllFilters({
  search,
  platform,
  platformOptions,
  onSearchChange,
  onPlatformChange,
}: OrdersAllFiltersProps) {
  const allOption = platformOptions.find((item) => item.value === 'all')
  const quickPlatforms = platformOptions.filter((item) => item.value !== 'all')
  const isAllActive = platform === 'all'

  return (
    <section className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-full max-w-[360px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Tìm mã đơn, tên khách hàng..."
          className="h-9 rounded-lg border-slate-200 bg-slate-50 pl-9 text-[14px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPlatformChange('all')}
          className={`h-8 rounded-full px-4 text-[12px] font-bold ${
            isAllActive ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600'
          }`}
        >
          {allOption?.label ?? 'Tất cả'}
        </button>

        {quickPlatforms.map((item) => {
          const isActive = platform === item.value
          const dotClass = item.value === 'shopee' ? 'bg-orange-500' : item.value === 'lazada' ? 'bg-blue-600' : 'bg-black'

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onPlatformChange(item.value)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-4 text-[12px] font-semibold ${
                isActive ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
              {item.label}
            </button>
          )
        })}

        <button type="button" className="h-8 rounded-lg border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700">
          Hôm nay
        </button>

        <button type="button" className="h-8 rounded-lg px-2 text-[12px] font-bold text-indigo-600">
          Bộ lọc nâng cao
        </button>
      </div>
    </section>
  )
}
