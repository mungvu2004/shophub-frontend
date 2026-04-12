import { useState } from 'react'

import type { OrdersReturnsViewMode } from '@/features/orders/logic/ordersReturns.types'

export function useOrdersReturnsViewMode(defaultMode: OrdersReturnsViewMode = 'timeline') {
  const [mode, setMode] = useState<OrdersReturnsViewMode>(defaultMode)

  return {
    mode,
    isTimeline: mode === 'timeline',
    setMode,
  }
}
