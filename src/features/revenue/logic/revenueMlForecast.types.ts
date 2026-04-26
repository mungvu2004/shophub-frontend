import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'

export type RevenueMlForecastRangeOptionViewModel = {
  days: RevenueMlForecastRangeDays
  label: string
  isActive: boolean
}

export type RevenueMlForecastHeaderViewModel = {
  title: string
  modelLabel: string
  accuracyLabel: string
  updateLabel: string
  rangeOptions: RevenueMlForecastRangeOptionViewModel[]
  reportCtaLabel: string
}

export type RevenueMlForecastKpiCardViewModel = {
  id: string
  label: string
  valueLabel: string
  subValueLabel: string
  confidencePercent?: number
  trendLabel?: string
  trendClassName?: string
  tagLabel?: string
  accent?: 'default' | 'warning'
  ctaLabel?: string
}

export type RevenueMlForecastChartLegendViewModel = {
  id: string
  label: string
  type: 'line' | 'dashed' | 'block'
  color: string
}

export type RevenueMlForecastChartPointViewModel = {
  label: string
  historical: number | null
  forecast: number | null
  confidenceLow: number | null
  confidenceHigh: number | null
}

export type RevenueMlForecastChartAnnotationViewModel = {
  id: string
  title: string
  note: string
  xLabel: string
  tone: 'warning' | 'success'
}

export type RevenueMlForecastScenarioCardViewModel = {
  id: string
  title: string
  projectedRevenue: number
  valueLabel: string
  note: string
  accent: 'negative' | 'neutral' | 'positive'
  isRecommended?: boolean
}

export type RevenueMlForecastChannelBreakdown = {
  channel: string
  percentage: number
  revenue: number
  colorHex: string
}

export type RevenueMlForecastKeyDriver = {
  id: string
  label: string
  impact: number
  trend: 'positive' | 'negative'
}

export type RevenueMlForecastActionPlanViewModel = {
  title: string
  steps: string[]
  ctaLabel: string
}

export type RevenueMlForecastViewModel = {
  header: RevenueMlForecastHeaderViewModel
  cards: RevenueMlForecastKpiCardViewModel[]
  chartTitle: string
  chartPoints: RevenueMlForecastChartPointViewModel[]
  chartLegends: RevenueMlForecastChartLegendViewModel[]
  chartAnnotations: RevenueMlForecastChartAnnotationViewModel[]
  targetRevenue: number
  gapToTarget: number
  channelBreakdown: RevenueMlForecastChannelBreakdown[]
  historicalMape: number
  keyDrivers: RevenueMlForecastKeyDriver[]
  scenarioTitle: string
  scenarioActionLabel: string
  scenarios: RevenueMlForecastScenarioCardViewModel[]
  actionPlan: RevenueMlForecastActionPlanViewModel
  selectedDays: RevenueMlForecastRangeDays
}
