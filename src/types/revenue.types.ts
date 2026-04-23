export type RevenueKpiTone = 'positive' | 'negative'
export type RevenueKpiDisplayType = 'currency' | 'number' | 'percent'

export interface RevenueSummaryKpi {
  id: string
  label: string
  value: number
  deltaPercent: number
  note: string
  tone: RevenueKpiTone
  displayType?: RevenueKpiDisplayType
}

export interface RevenueMonthlyGoal {
  target: number
  current: number
}

export interface RevenueDailyPoint {
  day: number
  lazada: number
  shopee: number
  tiktok: number
  previous: number
}

export type RevenueRange = 'week' | 'month' | 'quarter' | 'year'
export type RevenueSummaryPlatformFilter = 'all' | RevenuePlatformKey

export interface RevenueTopProduct {
  id: string
  name: string
  revenue: number
}

export interface RevenueProfitMomentumPoint {
  id: string
  label: string
  gross: number
  net: number
  deltaPercent: number
}

export type RevenueProfitFlowStepKind = 'increase' | 'decrease' | 'total'

export interface RevenueProfitFlowStep {
  id: string
  label: string
  amount: number
  kind: RevenueProfitFlowStepKind
}

export interface RevenueCostBreakdownItem {
  id: string
  label: string
  amount: number
  color: string
}

export type RevenueProfitTrend = 'up' | 'down' | 'flat'

export interface RevenueProductProfitItem {
  id: string
  name: string
  sku: string
  imageUrl: string
  revenue: number
  cost: number
  profit: number
  marginPercent: number
  returnCancellationRatePercent: number
  trend: RevenueProfitTrend
  aiSuggestion: string
}

export interface RevenueSummaryReportResponse {
  title: string
  periodLabel: string
  comparisonLabel: string
  kpis: RevenueSummaryKpi[]
  returnCancellationRatePercent: number
  monthlyGoal: RevenueMonthlyGoal
  dailyRevenue: RevenueDailyPoint[]
  costBreakdown: RevenueCostBreakdownItem[]
  topProducts: RevenueTopProduct[]
  profitFlow: RevenueProfitFlowStep[]
  productProfits: RevenueProductProfitItem[]
}

export type RevenuePlatformKey = 'shopee' | 'tiktok' | 'lazada'

export interface RevenuePlatformSnapshot {
  id: string
  platform: RevenuePlatformKey
  name: string
  badge: string
  revenue: number
  growthPercent: number
  orders: number
  returnRatePercent: number
  aov: number
  feeRatePercent: number
  netMarginPercent: number
  rating: number
}

export interface RevenuePlatformComparisonMetric {
  id: string
  label: string
  values: Array<{
    platform: RevenuePlatformKey
    value: number
  }>
}

export interface RevenuePlatformTrendPoint {
  id: string
  label: string
  shopee: number
  tiktok: number
  lazada: number
}

export interface RevenuePlatformAiInsight {
  id: string
  message: string
  confidencePercent: number
}

export interface RevenuePlatformComparisonResponse {
  title: string
  subtitle: string
  monthLabel: string
  platforms: RevenuePlatformSnapshot[]
  comparisonMetrics: RevenuePlatformComparisonMetric[]
  trendByMonth: RevenuePlatformTrendPoint[]
  aiInsights: {
    title: string
    subtitle: string
    items: RevenuePlatformAiInsight[]
  }
}

export type RevenueMlForecastRangeDays = 7 | 30 | 90

export type RevenueMlForecastKpiCard =
  | {
    id: string
    type: 'forecast'
    label: string
    predictionValue: number
    rangeMin: number
    rangeMax: number
    trendPercent: number
    confidencePercent: number
  }
  | {
    id: string
    type: 'peak'
    label: string
    peakWindow: string
    reason: string
    peakType: string
  }
  | {
    id: string
    type: 'risk'
    label: string
    riskCount: number
    riskSummary: string
    ctaLabel: string
  }

export interface RevenueMlForecastChartPoint {
  label: string
  historical: number | null
  forecast: number | null
  confidenceLow: number | null
  confidenceHigh: number | null
}

export interface RevenueMlForecastChartAnnotation {
  id: string
  title: string
  note: string
  xLabel: string
  tone: 'warning' | 'success'
}

export interface RevenueMlForecastScenario {
  id: string
  title: string
  projectedRevenue: number
  note: string
  accent: 'negative' | 'neutral' | 'positive'
  isRecommended?: boolean
}

export interface RevenueMlForecastChannelBreakdown {
  channel: string
  percentage: number
  revenue: number
  colorHex: string
}

export interface RevenueMlForecastKeyDriver {
  id: string
  label: string
  impact: number
  trend: 'positive' | 'negative'
}

export interface RevenueMlForecastResponse {
  title: string
  modelLabel: string
  accuracyPercent: number
  lastUpdatedLabel: string
  rangeOptions: RevenueMlForecastRangeDays[]
  reportCtaLabel: string
  cards: RevenueMlForecastKpiCard[]
  chart: {
    title: string
    points: RevenueMlForecastChartPoint[]
    annotations: RevenueMlForecastChartAnnotation[]
  }
  scenario: {
    title: string
    customizeCtaLabel: string
    scenarios: RevenueMlForecastScenario[]
  }
  actionPlan: {
    title: string
    steps: string[]
    ctaLabel: string
  }
  targetRevenue?: number
  gapToTarget?: number
  channelBreakdown?: RevenueMlForecastChannelBreakdown[]
  historicalMape?: number
  keyDrivers?: RevenueMlForecastKeyDriver[]
}
