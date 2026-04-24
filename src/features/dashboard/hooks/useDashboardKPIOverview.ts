import { useState, useMemo } from 'react'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'
import { calculatePlatformMetrics } from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import { buildDashboardKPIOverviewViewModel } from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import { normalizeDashboardPlatform } from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import type { DashboardKPIOverviewPageProps, MetricCardData, ComparisonPeriod } from '@/features/dashboard/logic/dashboardKpiOverview.types'

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
  const [metricsOrder, setMetricsOrder] = useState<string[]>([])
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('yesterday')

  const hasOrders = Array.isArray(orders) && orders.length > 0

  // Calculate tab counts
  const totalOrdersCount = hasOrders ? orders.length : 0
  const shopeeCount = hasOrders ? orders.filter((o: RevenueOrderItem) => normalizeDashboardPlatform(o.platform) === 'shopee').length : 0
  const lazadaCount = hasOrders ? orders.filter((o: RevenueOrderItem) => normalizeDashboardPlatform(o.platform) === 'lazada').length : 0
  const tiktokCount = hasOrders ? orders.filter((o: RevenueOrderItem) => normalizeDashboardPlatform(o.platform) === 'tiktok').length : 0

  // Get filtered orders for selected platform
  const filteredOrders = useMemo(() => {
    if (!hasOrders) return []
    return selectedTabId !== 'all'
      ? orders.filter((o: RevenueOrderItem) => normalizeDashboardPlatform(o.platform) === selectedTabId)
      : orders
  }, [hasOrders, orders, selectedTabId])

  // Calculate metrics based on selected platform and comparison period
  const rawMetrics = useMemo(() => {
    return hasOrders ? calculatePlatformMetrics(filteredOrders as RevenueOrderItem[], comparisonPeriod) : []
  }, [hasOrders, filteredOrders, comparisonPeriod])

  // Reorder metrics based on saved order
  const metrics = useMemo(() => {
    if (metricsOrder.length === 0) return rawMetrics

    return [...rawMetrics].sort((a, b) => {
      const indexA = metricsOrder.indexOf(a.id)
      const indexB = metricsOrder.indexOf(b.id)
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }, [rawMetrics, metricsOrder])

  const handleReorder = (newMetrics: MetricCardData[]) => {
    setMetricsOrder(newMetrics.map((m) => m.id))
  }

  const handlePeriodChange = (period: ComparisonPeriod) => {
    setComparisonPeriod(period)
  }

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
    onReorderMetrics: handleReorder,
    comparisonPeriod,
    onPeriodChange: handlePeriodChange,
  })

  return {
    model,
    selectedTabId,
    setSelectedTabId,
    filteredOrders,
  }
}
