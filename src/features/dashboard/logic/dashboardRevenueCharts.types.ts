export type RevenueChartsPlatformId = 'all' | 'shopee' | 'lazada' | 'tiktok_shop'
export type RevenueChartsRangeDays = 7 | 30

export type RevenueChartsResponse = {
  updatedAt: string
  platform: RevenueChartsPlatformId
  rangeDays: RevenueChartsRangeDays
  summary: {
    totalRevenue: number
    totalRevenueDeltaPercent: number
    averageRevenuePerDay: number
    averageRevenueDeltaPercent: number
    highestDayRevenue: number
    highestDayDate: string
    lowestDayRevenue: number
    lowestDayDate: string
  }
  monthlyGoal: {
    monthLabel: string
    targetRevenue: number
    achievedRevenue: number
    progressPercent: number
  }
  dailySeries: Array<{
    date: string
    shopee: number
    lazada: number
    tiktokShop: number
    previousTotal: number
  }>
  hourlyDistribution: Array<{
    hour: number
    revenue: number
  }>
  categoryBreakdown: Array<{
    id: string
    label: string
    revenue: number
  }>
  weeklyComparison: Array<{
    id: string
    label: string
    startDate: string
    endDate: string
    shopee: number
    lazada: number
    tiktokShop: number
    growthPercent: number
  }>
  peakHoursLabel: string
}

export type RevenueChartsSummaryCardViewModel = {
  id: 'total' | 'avg' | 'highest' | 'lowest'
  label: string
  value: string
  deltaLabel?: string
  deltaTone?: 'up' | 'down' | 'neutral'
  dateLabel?: string
}

export type RevenueChartsDailyTrendPointViewModel = {
  dateLabel: string
  shopee: number
  lazada: number
  tiktokShop: number
  total: number
  previousTotal: number
}

export type RevenueChartsHourlyPointViewModel = {
  hourLabel: string
  revenue: number
  isPeak: boolean
}

export type RevenueChartsCategoryItemViewModel = {
  id: string
  label: string
  valueLabel: string
  ratioPercent: number
  barColor: string
}

export type RevenueChartsWeeklyRowViewModel = {
  id: string
  weekLabel: string
  shopeeLabel: string
  lazadaLabel: string
  tiktokShopLabel: string
  totalLabel: string
  growthLabel: string
  growthTone: 'up' | 'down'
}

export type RevenueChartsViewModel = {
  updatedAtLabel: string
  title: string
  rangeTabs: Array<{ days: RevenueChartsRangeDays; label: string }>
  selectedRange: RevenueChartsRangeDays
  platformTabs: Array<{ id: RevenueChartsPlatformId; label: string }>
  selectedPlatform: RevenueChartsPlatformId
  summaryCards: RevenueChartsSummaryCardViewModel[]
  goalLabel: string
  goalProgressPercent: number
  goalProgressLabel: string
  dailyChartTitle: string
  dailyChartPoints: RevenueChartsDailyTrendPointViewModel[]
  hourlyChartTitle: string
  peakHoursLabel: string
  hourlyPoints: RevenueChartsHourlyPointViewModel[]
  categoryChartTitle: string
  categoryItems: RevenueChartsCategoryItemViewModel[]
  weeklyTableTitle: string
  weeklyRows: RevenueChartsWeeklyRowViewModel[]
  hasData: boolean
}
