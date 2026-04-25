export type TopProductsMetricId = 'revenue' | 'quantity' | 'returnRate'
export type TopProductsRangeDays = 7 | 30 | 90
export type TopProductsPlatformId = 'all' | 'shopee' | 'lazada' | 'tiktok_shop'

export type TopProductsPlatformBadge = 'shopee' | 'lazada' | 'tiktok'

export type DashboardTopProductItem = {
  id: string
  name: string
  sku: string
  platform: TopProductsPlatformId
  imageUrl: string
  soldQty: number
  revenue: number
  avgPrice: number
  returnRate: number
  trendPercent: number
  rankChange?: number
  last7DaysSales?: number[]
}

export type DashboardTopProductsResponse = {
  updatedAt: string
  metric: TopProductsMetricId
  rangeDays: TopProductsRangeDays
  platform: TopProductsPlatformId
  podium: DashboardTopProductItem[]
  ranking: DashboardTopProductItem[]
  insights: Array<{
    id: string
    title: string
    description: string
    tone: 'info' | 'warning' | 'positive'
  }>
  contribution: Array<{
    id: string
    label: string
    percent: number
  }>
  declining: DashboardTopProductItem[]
}

export type TopProductsMetricTab = {
  id: TopProductsMetricId
  label: string
}

export type TopProductsRangeTab = {
  days: TopProductsRangeDays
  label: string
}

export type TopProductsPlatformTab = {
  id: TopProductsPlatformId
  label: string
}

export type TopProductsPodiumCardViewModel = {
  id: string
  rank: 1 | 2 | 3
  name: string
  sku: string
  platformLabel: string
  platformTone: TopProductsPlatformBadge
  imageUrl: string
  headlineValue: string
  trendLabel: string
  trendTone: 'up' | 'down'
  stats: Array<{
    id: string
    label: string
    value: string
    tone?: 'good' | 'neutral' | 'bad'
  }>
}

export type ProductLabelType = 'hero' | 'long_tail' | 'rising_star' | 'new_entry'

export type ProductTagViewModel = {
  type: ProductLabelType
  label: string
}

export type TopProductsRankingRowViewModel = {
  id: string
  rankLabel: string
  rankChange?: number
  name: string
  sku: string
  platformLabel: string
  platformTone: TopProductsPlatformBadge
  imageUrl: string
  soldLabel: string
  soldValue: number
  revenueLabel: string
  revenueValue: number
  avgPriceLabel: string
  avgPriceValue: number
  returnRateLabel: string
  returnRateValue: number
  trendTone: 'up' | 'down'
  trendBars: number[]
  sparklineData: Array<{ value: number }>
  tags: ProductTagViewModel[]
}

export type TopProductsInsightViewModel = {
  id: string
  title: string
  description: string
  tone: 'info' | 'warning' | 'positive'
}

export type TopProductsDecliningItemViewModel = {
  id: string
  name: string
  imageUrl: string
  trendLabel: string
  trendTone: 'down' | 'up'
}

export type DashboardTopProductsViewModel = {
  title: string
  subtitle: string
  updatedAtLabel: string
  metricTabs: TopProductsMetricTab[]
  selectedMetric: TopProductsMetricId
  rangeTabs: TopProductsRangeTab[]
  selectedRange: TopProductsRangeDays
  platformTabs: TopProductsPlatformTab[]
  selectedPlatform: TopProductsPlatformId
  podiumCards: TopProductsPodiumCardViewModel[]
  rankingRows: TopProductsRankingRowViewModel[]
  insights: TopProductsInsightViewModel[]
  contribution: Array<{
    id: string
    label: string
    percent: number
    color: string
  }>
  contributionTotalLabel: string
  decliningTitle: string
  decliningItems: TopProductsDecliningItemViewModel[]
  hasData: boolean
}
