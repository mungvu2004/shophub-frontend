import { useState } from 'react'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'
import { calculatePlatformMetrics } from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import { buildDashboardKPIOverviewViewModel } from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import { normalizeDashboardPlatform } from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import type { DashboardKPIOverviewPageProps } from '@/features/dashboard/logic/dashboardKpiOverview.types'

type UseDashboardKPIOverviewReturn = {
  model: ReturnType<typeof buildDashboardKPIOverviewViewModel>
  selectedTabId: string
  setSelectedTabId: (tabId: string) => void
  filteredOrders: RevenueOrderItem[]
}

export function useDashboardKPIOverview(
  orders: RevenueOrderItem[] | undefined,
  isNoDataState: boolean,
  props: DashboardKPIOverviewPageProps,
): UseDashboardKPIOverviewReturn {
  const [selectedTabId, setSelectedTabId] = useState<string>('all')

  const hasOrders = Array.isArray(orders) && orders.length > 0

  // Calculate tab counts
  const totalOrdersCount = hasOrders ? orders.length : 0
  const shopeeCount = hasOrders ? orders.filter((o: RevenueOrderItem) => normalizeDashboardPlatform(o.platform) === 'shopee').length : 0
  const lazadaCount = hasOrders ? orders.filter((o: RevenueOrderItem) => normalizeDashboardPlatform(o.platform) === 'lazada').length : 0
  const tiktokCount = hasOrders ? orders.filter((o: RevenueOrderItem) => normalizeDashboardPlatform(o.platform) === 'tiktok').length : 0

  // Get filtered orders for selected platform
  const filteredOrders = hasOrders && selectedTabId !== 'all'
    ? orders.filter((o: RevenueOrderItem) => normalizeDashboardPlatform(o.platform) === selectedTabId)
    : (orders || [])

  // Calculate metrics based on selected platform
  const metrics = hasOrders ? calculatePlatformMetrics(filteredOrders as RevenueOrderItem[]) : []

  const model = buildDashboardKPIOverviewViewModel({
    ...props,
    selectedTabId,
    onTabChange: setSelectedTabId,
    tabs: isNoDataState
      ? [
          { id: 'all', label: 'Tất cả', count: '(0)' },
          { id: 'shopee', label: 'Shopee', count: '(0)', dotColor: '#F97316' },
          { id: 'lazada', label: 'Lazada', count: '(0)', dotColor: '#2563EB' },
          { id: 'tiktok', label: 'TikTok Shop', count: '(0)', dotColor: '#0F172A' },
        ]
      : [
          { id: 'all', label: 'Tất cả', count: `(${totalOrdersCount})` },
          { id: 'shopee', label: 'Shopee', count: `(${shopeeCount})`, dotColor: '#F97316' },
          { id: 'lazada', label: 'Lazada', count: `(${lazadaCount})`, dotColor: '#2563EB' },
          { id: 'tiktok', label: 'TikTok Shop', count: `(${tiktokCount})`, dotColor: '#0F172A' },
        ],
    metrics: metrics.length > 0 ? metrics : undefined,
    showMonthlyGoal: !isNoDataState,
  })

  return {
    model,
    selectedTabId,
    setSelectedTabId,
    filteredOrders,
  }
}
