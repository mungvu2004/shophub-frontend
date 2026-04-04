import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

export type AllocationStatusKey = 'shipping' | 'pendingConfirm' | 'delivered' | 'returnedOrCancelled'

export type AllocationDonutSlice = {
  key: AllocationStatusKey
  label: string
  value: number
  color: string
}

export type AllocationDonutChartViewModel = {
  title: string
  totalOrders: number
  unitLabel: string
  slices: AllocationDonutSlice[]
  hasData: boolean
}

export type AllocationDonutChartModelParams = {
  orders?: RevenueOrderItem[]
}
