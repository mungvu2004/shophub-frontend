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
        <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate-500 dark:text-slate-400 md:top-3" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Tìm mã đơn, tên khách hàng..."
          className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-9 text-sm dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 md:h-10"
          aria-label="Tìm mã đơn, tên khách hàng"
        />
      </div>

      {platformOptions.map((option) => {
        const isActive = platform === option.value
        const dotClass = option.value === 'all'
          ? 'bg-slate-500 dark:bg-slate-400'
          : option.value === 'shopee'
            ? 'bg-orange-500'
            : option.value === 'lazada'
              ? 'bg-blue-600'
              : 'bg-black dark:bg-white'

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onPlatformChange(option.value)}
            className={`inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition-colors md:h-10 ${
              isActive ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
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
