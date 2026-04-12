import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import type {
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsPlatformOption,
  OrdersPendingActionsSlaFilter,
  OrdersPendingActionsSlaOption,
} from '@/features/orders/logic/ordersPendingActions.types'

type OrdersPendingActionsFiltersProps = {
  search: string
  platform: OrdersPendingActionsPlatformFilter
  sla: OrdersPendingActionsSlaFilter
  platformOptions: OrdersPendingActionsPlatformOption[]
  slaOptions: OrdersPendingActionsSlaOption[]
  onSearchChange: (value: string) => void
  onPlatformChange: (value: OrdersPendingActionsPlatformFilter) => void
  onSlaChange: (value: OrdersPendingActionsSlaFilter) => void
}

export function OrdersPendingActionsFilters({
  search,
  platform,
  sla,
  platformOptions,
  slaOptions,
  onSearchChange,
  onPlatformChange,
  onSlaChange,
}: OrdersPendingActionsFiltersProps) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div className="relative w-full max-w-[380px]">
        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Tìm mã đơn, khách hàng, sản phẩm..."
          className="h-9 rounded-lg border-slate-200 bg-slate-50 pl-9 text-[14px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/35 p-2">
        {platformOptions.map((option) => {
          const active = platform === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onPlatformChange(option.value)}
              className={`h-8 rounded-full px-4 text-xs font-semibold ${
                active ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2">
        {slaOptions.map((option) => {
          const active = sla === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSlaChange(option.value)}
              className={`h-8 rounded-md px-3 text-xs font-semibold ${
                active ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
