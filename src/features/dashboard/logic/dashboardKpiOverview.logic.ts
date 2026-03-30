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

export type { DashboardKPIOverviewPageProps, DashboardKPIOverviewViewModel } from '@/features/dashboard/logic/dashboardKpiOverview.types'

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

function normalizeMetric(metric: MetricCardData, isPlaceholderMode: boolean): MetricCardData & { isPlaceholder?: boolean } {
  const normalized: MetricCardData & { isPlaceholder?: boolean } = {
    ...metric,
    signalTone: resolveSignalTone(metric),
    isPlaceholder: isPlaceholderMode || metric.isPlaceholder,
  }

  if (metric.placeholderLayout === 'alert-summary') {
    normalized.breakdown = [{ label: 'ƯU TIÊN', value: buildPriorityText(metric) }]
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
    metrics: resolvedMetrics.map((metric) => normalizeMetric(metric, !metrics.length)),
    noDataHint,
    hasRealMetrics: metrics.length > 0,
  }
}
