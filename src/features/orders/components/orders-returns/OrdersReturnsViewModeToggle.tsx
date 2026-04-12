import { List, Rows2 } from 'lucide-react'

import type { OrdersReturnsViewMode } from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsViewModeToggleProps = {
  mode: OrdersReturnsViewMode
  onModeChange: (mode: OrdersReturnsViewMode) => void
}

export function OrdersReturnsViewModeToggle({ mode, onModeChange }: OrdersReturnsViewModeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-[#f0f3ff] p-1">
      <button
        type="button"
        onClick={() => onModeChange('table')}
        className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium ${
          mode === 'table' ? 'bg-[#3525cd] text-white shadow-sm' : 'text-[#464555]'
        }`}
      >
        <Rows2 className="size-3.5" />
        Bảng
      </button>
      <button
        type="button"
        onClick={() => onModeChange('timeline')}
        className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium ${
          mode === 'timeline' ? 'bg-[#3525cd] text-white shadow-sm' : 'text-[#464555]'
        }`}
      >
        <List className="size-3.5" />
        Timeline
      </button>
    </div>
  )
}
