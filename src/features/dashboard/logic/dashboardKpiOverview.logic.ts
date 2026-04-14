import {
  DEFAULT_NO_DATA_HINT,
  PLACEHOLDER_METRICS,
  PLACEHOLDER_MONTHLY_GOAL,
  PLACEHOLDER_TABS,
} from '@/features/dashboard/logic/dashboardKpiOverview.constants'
import type {
  DashboardKPIOverviewPageProps,
  DashboardKPIOverviewViewModel,
  MetricCardData,
} from '@/features/dashboard/logic/dashboardKpiOverview.types'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

export type { DashboardKPIOverviewPageProps, DashboardKPIOverviewViewModel } from '@/features/dashboard/logic/dashboardKpiOverview.types'

export function normalizeDashboardPlatform(platform?: string): 'shopee' | 'lazada' | 'tiktok' {
  const normalized = platform?.toLowerCase().trim() ?? ''
  if (normalized === 'tiktok_shop' || normalized === 'tiktok') return 'tiktok'
  if (normalized === 'lazada') return 'lazada'
  return 'shopee'
}

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getOrderLocalDateKey(createdAt?: string): string {
  if (!createdAt) return ''
  const parsed = new Date(createdAt)
  if (Number.isNaN(parsed.getTime())) return ''
  return toLocalDateKey(parsed)
}

function clampPercent(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, value))
}

function resolveSignalTone(metric: MetricCardData): 'good' | 'bad' {
  if (metric.signalTone) return metric.signalTone
  if (metric.changeTone === 'warning') return 'bad'
  return 'good'
}

function buildPriorityText(metric: MetricCardData): string {
  if (!metric.platformOrders?.length) return 'Ưu tiên xử lý đơn --'

  const highest = metric.platformOrders.reduce((max, current) => {
    if (current.orderCount > max.orderCount) return current
    return max
  }, metric.platformOrders[0])

  if (!highest || highest.orderCount <= 0) return 'Ưu tiên xử lý đơn --'

  return `Ưu tiên xử lý đơn ${highest.platform}`
}

function buildComparisonText(metric: MetricCardData): string {
  const percent = metric.comparisonPercent ?? 0
  const direction = metric.comparisonDirection === 'up' ? 'CAO' : 'THẤP'
  return `${direction} HƠN ${percent}% SO VỚI THÁNG TRƯỚC`
}

export function calculatePlatformMetrics(orders: RevenueOrderItem[]): MetricCardData[] {
  if (!orders.length) return []
  return calculatePlatformMetricsAt(orders)
}

export function calculatePlatformMetricsAt(
  orders: RevenueOrderItem[],
  options?: { now?: Date },
): MetricCardData[] {
  if (!orders.length) return []

  const now = options?.now ?? new Date()

  // Compare by local day to avoid UTC date drift.
  const today = toLocalDateKey(now)
  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = toLocalDateKey(yesterdayDate)

  const todayOrders = orders.filter((order) => {
    const orderDate = getOrderLocalDateKey(order.createdAt)
    return orderDate === today
  })
  const yesterdayOrders = orders.filter((order) => {
    const orderDate = getOrderLocalDateKey(order.createdAt)
    return orderDate === yesterday
  })

  // Calculate metrics
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount ?? 0), 0)
  const totalOrders = orders.length
  const cancelledOrders = orders.filter((o) => o.status?.toLowerCase() === 'cancelled').length
  const refundedOrders = orders.filter((o) => o.status?.toLowerCase() === 'refunded').length
  const todayCancelledOrders = todayOrders.filter((o) => o.status?.toLowerCase() === 'cancelled').length
  const yesterdayCancelledOrders = yesterdayOrders.filter((o) => o.status?.toLowerCase() === 'cancelled').length
  const todayCancelledRate = todayOrders.length > 0 ? (todayCancelledOrders / todayOrders.length) * 100 : 0
  const yesterdayCancelledRate = yesterdayOrders.length > 0 ? (yesterdayCancelledOrders / yesterdayOrders.length) * 100 : 0
  const cancelledRateDelta = Number((todayCancelledRate - yesterdayCancelledRate).toFixed(1))
  const cancelledRateChangeLabel =
    cancelledRateDelta === 0 ? '0.0%' : `${cancelledRateDelta > 0 ? '+' : '-'}${Math.abs(cancelledRateDelta).toFixed(1)}%`
  const cancelledRateChangeTone: MetricCardData['changeTone'] =
    cancelledRateDelta > 0 ? 'warning' : cancelledRateDelta < 0 ? 'positive' : 'neutral'

  const refundRate = totalOrders > 0 ? ((refundedOrders / totalOrders) * 100).toFixed(1) : '0'

  // Platform breakdown for today
  const platformBreakdown = ['shopee', 'lazada', 'tiktok'].map((platform) => ({
    label: platform.toUpperCase(),
    value: (
      todayOrders
        .filter((o) => normalizeDashboardPlatform(o.platform) === platform)
        .reduce((sum, o) => sum + (o.totalAmount ?? 0), 0) / 1000000
    ).toFixed(1) + 'M',
  }))

  const metrics: MetricCardData[] = [
    {
      id: 'today-revenue',
      title: 'DOANH THU HÔM NAY',
      value: (todayRevenue / 1000000).toFixed(2) + 'M',
      changeLabel: '+12%',
      changeTone: 'positive',
      signalTone: 'good',
      accentColor: '#EDE9FE',
      placeholderLayout: 'platform-split',
      breakdown: platformBreakdown,
      iconName: 'DollarSign',
    },
    {
      id: 'total-orders',
      title: 'TỔNG ĐƠN HÀNG',
      value: totalOrders.toString(),
      changeLabel: '+5%',
      changeTone: 'positive',
      signalTone: 'good',
      accentColor: '#E2E8F0',
      placeholderLayout: 'platform-split',
      breakdown: [
        { label: 'SHOPEE', value: orders.filter((o) => normalizeDashboardPlatform(o.platform) === 'shopee').length.toString() },
        { label: 'LAZADA', value: orders.filter((o) => normalizeDashboardPlatform(o.platform) === 'lazada').length.toString() },
        { label: 'TIKTOK', value: orders.filter((o) => normalizeDashboardPlatform(o.platform) === 'tiktok').length.toString() },
      ],
      iconName: 'ShoppingCart',
    },
    {
      id: 'urgent-orders',
      title: 'CẦN XỬ LÝ NGAY',
      value: cancelledOrders.toString(),
      changeLabel: cancelledRateChangeLabel,
      changeTone: cancelledRateChangeTone,
      signalTone: cancelledOrders > 0 ? 'bad' : 'good',
      accentColor: '#FFEDD5',
      borderTone: cancelledOrders > 0 ? 'warning' : 'default',
      placeholderLayout: 'alert-summary',
      breakdown: [{ label: '', value: `Cần xử lý ${cancelledOrders} đơn hủy` }],
      iconName: 'AlertCircle',
    },
    {
      id: 'refund-rate',
      title: 'TỶ LỆ HOÀN/HỦY',
      value: `${refundRate}%`,
      changeLabel: '-2%',
      changeTone: 'positive',
      signalTone: 'good',
      accentColor: '#E2E8F0',
      placeholderLayout: 'rate-compare',
      ratioPercent: Math.min(parseFloat(refundRate) || 0, 100),
      comparisonPercent: 2,
      comparisonDirection: 'down',
      breakdown: [{ label: 'SO VỚI THÁNG TRƯỚC', value: 'THẤP HƠN 2% SO VỚI THÁNG TRƯỚC' }],
      iconName: 'BarChart3',
    },
  ]

  return metrics
}

function normalizeMetric(metric: MetricCardData, isPlaceholderMode: boolean): MetricCardData & { isPlaceholder?: boolean } {
  const normalized: MetricCardData & { isPlaceholder?: boolean } = {
    ...metric,
    signalTone: resolveSignalTone(metric),
    isPlaceholder: isPlaceholderMode || metric.isPlaceholder,
  }

  if (metric.placeholderLayout === 'alert-summary') {
    const hasExplicitBreakdown = Array.isArray(metric.breakdown) && metric.breakdown.length > 0
    if (!hasExplicitBreakdown) {
      normalized.breakdown = [{ label: 'ƯU TIÊN', value: buildPriorityText(metric) }]
    }
  }

  if (metric.placeholderLayout === 'rate-compare') {
    normalized.ratioPercent = clampPercent(metric.ratioPercent ?? 0)
    normalized.breakdown = [{ label: 'SO VỚI THÁNG TRƯỚC', value: buildComparisonText(metric) }]
  }

  return normalized
}

export function buildDashboardKPIOverviewViewModel({
  title = '',
  description = '',
  tabs = [],
  selectedTabId,
  onTabChange,
  monthlyGoal,
  metrics = [],
  noDataHint = DEFAULT_NO_DATA_HINT,
  showMonthlyGoal = true,
}: DashboardKPIOverviewPageProps): DashboardKPIOverviewViewModel {
  const resolvedTabs = tabs.length ? tabs : PLACEHOLDER_TABS
  const resolvedSelectedTabId = selectedTabId ?? resolvedTabs[0]?.id ?? 'all'
  const resolvedMonthlyGoal = monthlyGoal ?? PLACEHOLDER_MONTHLY_GOAL
  const resolvedMetrics = metrics.length ? metrics : PLACEHOLDER_METRICS

  return {
    title,
    description,
    tabs: resolvedTabs,
    selectedTabId: resolvedSelectedTabId,
    onTabChange,
    monthlyGoal: {
      ...resolvedMonthlyGoal,
      safeProgressPercent: clampPercent(resolvedMonthlyGoal.progressPercent),
      isPlaceholder: !monthlyGoal,
    },
    showMonthlyGoal,
    metrics: resolvedMetrics.map((metric) => normalizeMetric(metric, !metrics.length)),
    noDataHint,
    hasRealMetrics: metrics.length > 0,
  }
}
