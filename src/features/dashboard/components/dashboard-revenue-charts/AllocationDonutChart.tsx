import { useMemo } from 'react'

import { buildAllocationDonutChartViewModel } from '@/features/dashboard/logic/allocationDonutChart.logic'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

import { AllocationDonutChartView } from './AllocationDonutChartView'

type AllocationDonutChartProps = {
  orders?: RevenueOrderItem[]
  isLoading?: boolean
  isError?: boolean
}

export function AllocationDonutChart({ orders, isLoading, isError }: AllocationDonutChartProps) {
  const model = useMemo(
    () =>
      buildAllocationDonutChartViewModel({
        orders,
      }),
    [orders],
  )

  return <AllocationDonutChartView model={model} isLoading={isLoading} isError={isError} />
}
