import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import type { OrdersReturnsPlatformFilter } from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsFiltersProps = {
  search: string
  platform: OrdersReturnsPlatformFilter
  platformOptions: Array<{ value: OrdersReturnsPlatformFilter; label: string }>
  onSearchChange: (value: string) => void
  onPlatformChange: (value: OrdersReturnsPlatformFilter) => void
}

export function OrdersReturnsFilters({
  search,
  platform,
  platformOptions,
  onSearchChange,
  onPlatformChange,
}: OrdersReturnsFiltersProps) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <div className="relative w-full max-w-[320px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Tìm mã đơn, tên khách hàng..."
          className="h-9 rounded-lg border-slate-200 bg-slate-50 pl-9 text-[14px]"
        />
      </div>

      {platformOptions.map((option) => {
        const isActive = platform === option.value
        const dotClass = option.value === 'all'
          ? 'bg-slate-400'
          : option.value === 'shopee'
            ? 'bg-orange-500'
            : option.value === 'lazada'
              ? 'bg-blue-600'
              : 'bg-black'

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onPlatformChange(option.value)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-4 text-[12px] font-semibold ${
              isActive ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
