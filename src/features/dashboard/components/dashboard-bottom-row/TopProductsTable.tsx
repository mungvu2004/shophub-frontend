import { useMemo } from 'react'

import { buildTopProductsFromOrders, buildTopProductsTableViewModel } from '@/features/dashboard/logic/topProductsTable.logic'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

import { TopProductsTableView } from './TopProductsTableView'

type TopProductsTableProps = {
  orders?: RevenueOrderItem[]
}

export function TopProductsTable({ orders }: TopProductsTableProps) {
  const model = useMemo(() => {
    const products = buildTopProductsFromOrders({ orders })
    return buildTopProductsTableViewModel({ products })
  }, [orders])

  return <TopProductsTableView model={model} />
}
