export type PlatformTab = {
  id: string
  label: string
  count?: string
  dotColor?: string
}

export type MonthlyGoalData = {
  label: string
  currentValue: string
  targetValue: string
  progressPercent: number
}

export type MetricBreakdownItem = {
  label: string
  value: string
}

export type PlatformOrderItem = {
  platform: string
  orderCount: number
}

export type MetricCardData = {
  id: string
  title: string
  value: string
  changeLabel?: string
  changeTone?: 'positive' | 'warning' | 'neutral'
  signalTone?: 'good' | 'bad'
  accentColor?: string
  borderTone?: 'default' | 'warning'
  breakdown?: MetricBreakdownItem[]
  placeholderLayout?: 'platform-split' | 'alert-summary' | 'rate-compare'
  platformOrders?: PlatformOrderItem[]
  ratioPercent?: number
  comparisonPercent?: number
  comparisonDirection?: 'up' | 'down'
  isPlaceholder?: boolean
  iconName?: string
  trendData?: number[]
}

export type DashboardKPIOverviewPageProps = {
  title?: string
  description?: string
  tabs?: PlatformTab[]
  selectedTabId?: string
  onTabChange?: (tabId: string) => void
  monthlyGoal?: MonthlyGoalData
  metrics?: MetricCardData[]
  noDataHint?: string
  showMonthlyGoal?: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
}

export type DashboardKPIOverviewViewModel = {
  title: string
  description: string
  tabs: PlatformTab[]
  selectedTabId: string
  onTabChange?: (tabId: string) => void
  monthlyGoal: MonthlyGoalData & { safeProgressPercent: number; isPlaceholder?: boolean }
  showMonthlyGoal: boolean
  metrics: Array<MetricCardData & { isPlaceholder?: boolean }>
  noDataHint: string
  hasRealMetrics: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
}
