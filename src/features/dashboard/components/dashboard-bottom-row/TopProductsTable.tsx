import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { buildTopProductsFromOrders, buildTopProductsTableViewModel } from '@/features/dashboard/logic/topProductsTable.logic'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'
import { appendFromParam } from '@/features/shared/hooks/useBackNavigation'

import { TopProductsTableView } from './TopProductsTableView'

type TopProductsTableProps = {
  orders?: RevenueOrderItem[]
}

export function TopProductsTable({ orders }: TopProductsTableProps) {
  const navigate = useNavigate()

  const model = useMemo(() => {
    const products = buildTopProductsFromOrders({ orders })
    return buildTopProductsTableViewModel({ products })
  }, [orders])

  const handleViewAll = () => {
    navigate('/products')
  }

  const handleProductClick = (productId: string) => {
    const targetUrl = appendFromParam(`/products/${productId}`)
    navigate(targetUrl)
  }

  return <TopProductsTableView model={model} onViewAll={handleViewAll} onProductClick={handleProductClick} />
}
