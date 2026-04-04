import { useMemo } from 'react'

import { buildRevenueLineChartViewModel } from '@/features/dashboard/logic/revenueLineChart.logic'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

import { RevenueLineChartView } from './RevenueLineChartView'

type RevenueLineChartProps = {
  orders?: RevenueOrderItem[]
  isLoading?: boolean
  isError?: boolean
  days?: number
}

export function RevenueLineChart({ orders, isLoading, isError, days = 7 }: RevenueLineChartProps) {
  const model = useMemo(
    () =>
      buildRevenueLineChartViewModel({
        orders,
        days,
      }),
    [days, orders],
  )

  return <RevenueLineChartView model={model} isLoading={isLoading} isError={isError} />
}
