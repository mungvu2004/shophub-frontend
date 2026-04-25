import { List, Rows2 } from 'lucide-react'

import type { OrdersReturnsViewMode } from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsViewModeToggleProps = {
  mode: OrdersReturnsViewMode
  onModeChange: (mode: OrdersReturnsViewMode) => void
}

export function OrdersReturnsViewModeToggle({ mode, onModeChange }: OrdersReturnsViewModeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-indigo-50/50 p-1 dark:bg-slate-800">
      <button
        type="button"
        aria-pressed={mode === 'table'}
        onClick={() => onModeChange('table')}
        className={`inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors md:h-10 ${
          mode === 'table' ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
        }`}
      >
        <Rows2 className="size-4" />
        Bảng
      </button>
      <button
        type="button"
        aria-pressed={mode === 'timeline'}
        onClick={() => onModeChange('timeline')}
        className={`inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors md:h-10 ${
          mode === 'timeline' ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
        }`}
      >
        <List className="size-4" />
        Timeline
      </button>
    </div>
  )
}
