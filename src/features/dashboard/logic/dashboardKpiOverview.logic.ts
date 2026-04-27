import {
  DEFAULT_NO_DATA_HINT,
  PLACEHOLDER_METRICS,
  PLACEHOLDER_MONTHLY_GOAL,
  PLACEHOLDER_TABS,
} from '@/features/dashboard/logic/dashboardKpiOverview.constants'
import type {
  ComparisonPeriod,
  DashboardKPIOverviewPageProps,
  DashboardKPIOverviewViewModel,
  MetricCardData,
} from '@/features/dashboard/logic/dashboardKpiOverview.types'
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'

export type { DashboardKPIOverviewPageProps, DashboardKPIOverviewViewModel } from '@/features/dashboard/logic/dashboardKpiOverview.types'

export function normalizeDashboardPlatform(platform?: string): 'shopee' | 'lazada' | 'tiktok' | 'other' {
  const normalized = platform?.toLowerCase().trim() ?? ''
  if (normalized === 'tiktok_shop' || normalized === 'tiktok') return 'tiktok'
  if (normalized === 'lazada') return 'lazada'
  if (normalized === 'shopee') return 'shopee'
  return 'other'
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

function buildComparisonText(metric: MetricCardData, period: ComparisonPeriod = 'yesterday'): string {
  const periodText = period === 'yesterday' ? 'HÔM QUA' : period === 'last-week' ? 'TUẦN TRƯỚC' : 'THÁNG TRƯỚC'
  if (metric.comparisonPercent === undefined) {
    return `CHƯA CÓ DỮ LIỆU SO VỚI ${periodText}`
  }
  const percent = metric.comparisonPercent ?? 0
  const direction = metric.comparisonDirection === 'up' ? 'CAO' : 'THẤP'
  return `${direction} HƠN ${percent}% SO VỚI ${periodText}`
}

export function calculatePlatformMetrics(orders: RevenueOrderItem[], period: ComparisonPeriod = 'yesterday'): MetricCardData[] {
  if (!orders.length) return []
  return calculatePlatformMetricsAt(orders, { period })
}

function getMetricValueAtDate(orders: RevenueOrderItem[], dateKey: string, metricId: string): number {
  const dayOrders = orders.filter((o) => getOrderLocalDateKey(o.createdAt) === dateKey)
  if (metricId === 'today-revenue') {
    return dayOrders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)
  }
  if (metricId === 'total-orders') {
    return dayOrders.length
  }
  if (metricId === 'urgent-orders') {
    return dayOrders.filter((o) => o.status?.toLowerCase() === 'cancelled').length
  }
  if (metricId === 'refund-rate') {
    if (dayOrders.length === 0) return 0
    const refunds = dayOrders.filter((o) => o.status?.toLowerCase() === 'refunded' || o.status?.toLowerCase() === 'cancelled').length
    return (refunds / dayOrders.length) * 100
  }
  return 0
}

export function calculatePlatformMetricsAt(
  orders: RevenueOrderItem[],
  options?: { now?: Date; period?: ComparisonPeriod },
): MetricCardData[] {
  if (!orders.length) return []

  const now = options?.now ?? new Date()
  const period = options?.period ?? 'yesterday'

  // Compare by local day to avoid UTC date drift.
  const today = toLocalDateKey(now)
  
  // Calculate reference date based on period
  const refDate = new Date(now)
  if (period === 'yesterday') {
    refDate.setDate(refDate.getDate() - 1)
  } else if (period === 'last-week') {
    refDate.setDate(refDate.getDate() - 7)
  } else if (period === 'last-month') {
    refDate.setMonth(refDate.getMonth() - 1)
  }
  const reference = toLocalDateKey(refDate)

  // Calculate trends for the last 7 days
  const last7Days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    last7Days.push(toLocalDateKey(d))
  }

  // Helper tính Delta an toàn
  const calculateSafeDelta = (current: number, ref: number) => {
    if (ref <= 0) return { delta: 0, percent: undefined, direction: 'up' as const }
    const delta = ((current - ref) / ref) * 100
    return { 
      delta, 
      percent: Math.abs(Math.round(delta)), 
      direction: delta >= 0 ? 'up' as const : 'down' as const 
    }
  }

  // Calculate metrics
  const todayRevenue = getMetricValueAtDate(orders, today, 'today-revenue')
  const refRevenue = getMetricValueAtDate(orders, reference, 'today-revenue')
  const revRes = calculateSafeDelta(todayRevenue, refRevenue)
  const revenueTrend = last7Days.map((date) => getMetricValueAtDate(orders, date, 'today-revenue'))

  const todayOrdersCount = getMetricValueAtDate(orders, today, 'total-orders')
  const refOrdersCount = getMetricValueAtDate(orders, reference, 'total-orders')
  const ordRes = calculateSafeDelta(todayOrdersCount, refOrdersCount)
  const ordersTrend = last7Days.map((date) => getMetricValueAtDate(orders, date, 'total-orders'))

  const todayUrgent = getMetricValueAtDate(orders, today, 'urgent-orders')
  const refUrgent = getMetricValueAtDate(orders, reference, 'urgent-orders')
  const urgentDelta = todayUrgent - refUrgent
  const urgentTrend = last7Days.map((date) => getMetricValueAtDate(orders, date, 'urgent-orders'))

  const todayRefundRate = getMetricValueAtDate(orders, today, 'refund-rate')
  const refRefundRate = getMetricValueAtDate(orders, reference, 'refund-rate')
  const refRateRes = calculateSafeDelta(todayRefundRate, refRefundRate)
  const refundTrend = last7Days.map((date) => getMetricValueAtDate(orders, date, 'refund-rate'))

  const formatDelta = (delta: number, percent: number | undefined) => {
    if (percent === undefined) return '--'
    if (delta === 0) return '0.0%'
    return `${delta > 0 ? '+' : '-'}${percent}%`
  }

  const platformBreakdown = ['shopee', 'lazada', 'tiktok'].map((platform) => {
    const dayOrders = orders.filter((o) => getOrderLocalDateKey(o.createdAt) === today)
    return {
      label: platform.toUpperCase(),
      value: (
        dayOrders
          .filter((o) => normalizeDashboardPlatform(o.platform) === platform)
          .reduce((sum, o) => sum + (o.totalAmount ?? 0), 0) / 1000000
      ).toFixed(1) + 'M',
    }
  })

  const metrics: MetricCardData[] = [
    {
      id: 'today-revenue',
      title: 'DOANH THU HÔM NAY',
      value: (todayRevenue / 1000000).toFixed(2) + 'M',
      changeLabel: formatDelta(revRes.delta, revRes.percent),
      changeTone: revRes.percent === undefined ? 'neutral' : revRes.delta >= 0 ? 'positive' : 'warning',
      signalTone: revRes.delta >= 0 ? 'good' : 'bad',
      accentColor: '#EDE9FE',
      placeholderLayout: 'platform-split',
      breakdown: platformBreakdown,
      iconName: 'DollarSign',
      trendData: revenueTrend,
      comparisonPercent: revRes.percent,
      comparisonDirection: revRes.direction,
    },
    {
      id: 'total-orders',
      title: 'TỔNG ĐƠN HÀNG HÔM NAY',
      value: todayOrdersCount.toString(),
      changeLabel: formatDelta(ordRes.delta, ordRes.percent),
      changeTone: ordRes.percent === undefined ? 'neutral' : ordRes.delta >= 0 ? 'positive' : 'warning',
      signalTone: ordRes.delta >= 0 ? 'good' : 'bad',
      accentColor: '#E2E8F0',
      placeholderLayout: 'platform-split',
      breakdown: [
        {
          label: 'SHOPEE',
          value: orders
            .filter((o) => getOrderLocalDateKey(o.createdAt) === today && normalizeDashboardPlatform(o.platform) === 'shopee')
            .length.toString(),
        },
        {
          label: 'LAZADA',
          value: orders
            .filter((o) => getOrderLocalDateKey(o.createdAt) === today && normalizeDashboardPlatform(o.platform) === 'lazada')
            .length.toString(),
        },
        {
          label: 'TIKTOK',
          value: orders
            .filter((o) => getOrderLocalDateKey(o.createdAt) === today && normalizeDashboardPlatform(o.platform) === 'tiktok')
            .length.toString(),
        },
      ],
      iconName: 'ShoppingCart',
      trendData: ordersTrend,
      comparisonPercent: ordRes.percent,
      comparisonDirection: ordRes.direction,
    },
    {
      id: 'urgent-orders',
      title: 'CẦN XỬ LÝ NGAY',
      value: todayUrgent.toString(),
      changeLabel: urgentDelta === 0 ? '0' : `${urgentDelta > 0 ? '+' : ''}${urgentDelta}`,
      changeTone: urgentDelta > 0 ? 'warning' : urgentDelta < 0 ? 'positive' : 'neutral',
      signalTone: todayUrgent > 0 ? 'bad' : 'good',
      accentColor: '#FFEDD5',
      borderTone: todayUrgent > 0 ? 'warning' : 'default',
      placeholderLayout: 'alert-summary',
      breakdown: [{ label: '', value: `Cần xử lý ${todayUrgent} đơn hủy` }],
      iconName: 'AlertCircle',
      trendData: urgentTrend,
      comparisonPercent: Math.abs(urgentDelta),
      comparisonDirection: urgentDelta >= 0 ? 'up' : 'down',
    },
    {
      id: 'refund-rate',
      title: 'TỶ LỆ HOÀN/HỦY HÔM NAY',
      value: `${todayRefundRate.toFixed(1)}%`,
      changeLabel: formatDelta(refRateRes.delta, refRateRes.percent),
      changeTone: refRateRes.percent === undefined ? 'neutral' : refRateRes.delta <= 0 ? 'positive' : 'warning',
      signalTone: todayRefundRate < 5 ? 'good' : 'bad',
      accentColor: '#E2E8F0',
      placeholderLayout: 'rate-compare',
      ratioPercent: Math.min(todayRefundRate, 100),
      comparisonPercent: refRateRes.percent,
      comparisonDirection: refRateRes.direction,
      iconName: 'BarChart3',
      trendData: refundTrend,
    },
  ]

  return metrics
}

function normalizeMetric(metric: MetricCardData, isPlaceholderMode: boolean, period: ComparisonPeriod = 'yesterday'): MetricCardData & { isPlaceholder?: boolean } {
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
    normalized.breakdown = [{ label: 'SO VỚI HÔM QUA', value: buildComparisonText(metric, period) }]
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
  onRefresh,
  isRefreshing,
  onReorderMetrics,
  comparisonPeriod = 'yesterday',
  onPeriodChange,
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
    metrics: resolvedMetrics.map((metric) => normalizeMetric(metric, !metrics.length, comparisonPeriod)),
    noDataHint,
    hasRealMetrics: metrics.length > 0,
    onRefresh,
    isRefreshing,
    onReorderMetrics,
    comparisonPeriod,
    onPeriodChange,
  }
}
