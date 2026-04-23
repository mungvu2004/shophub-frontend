import type {
  RevenuePlatformComparisonResponse,
  RevenuePlatformKey,
  RevenuePlatformSnapshot,
} from '@/types/revenue.types'

export type RevenuePlatformCardViewModel = {
  id: string
  platform: RevenuePlatformKey
  name: string
  badge: string
  badgeClassName: string
  accentClassName: string
  iconClassName: string
  revenueLabel: string
  growthLabel: string
  growthClassName: string
  ordersLabel: string
  returnRateLabel: string
  returnRateClassName: string
  aovLabel: string
  feeRateLabel: string
  netMarginLabel: string
  netMarginClassName: string
  ratingLabel: string
}

export type RevenueComparisonMetricViewModel = {
  id: string
  label: string
  values: Array<{
    platform: RevenuePlatformKey
    valueLabel: string
    percentage: number
  }>
}

export type RevenueTrendPointViewModel = {
  label: string
  shopee: number
  tiktok: number
  lazada: number
}

export type RevenueAiInsightViewModel = {
  id: string
  message: string
  confidenceLabel: string
}

export type RevenuePlatformComparisonViewModel = {
  title: string
  subtitle: string
  monthLabel: string
  cards: RevenuePlatformCardViewModel[]
  comparisonMetrics: RevenueComparisonMetricViewModel[]
  trend: RevenueTrendPointViewModel[]
  trendLegend: Array<{ key: RevenuePlatformKey; label: string; color: string }>
  insightsTitle: string
  insightsSubtitle: string
  insights: RevenueAiInsightViewModel[]
}

const currencyFormatter = new Intl.NumberFormat('vi-VN')

const toCurrency = (value: number) => `${currencyFormatter.format(Math.round(value))} ₫`

const toGrowthLabel = (growthPercent: number) => {
  const signal = growthPercent >= 0 ? '+' : '-'

  return `${signal}${Math.abs(growthPercent).toFixed(0)}%`
}

const getAccentClassName = (platform: RevenuePlatformKey) => {
  if (platform === 'shopee') {
    return 'border-t-[#EE4D2D]'
  }

  if (platform === 'tiktok') {
    return 'border-t-[#111111]'
  }

  return 'border-t-[#0F9D58]'
}

const getIconClassName = (platform: RevenuePlatformKey) => {
  if (platform === 'shopee') {
    return 'bg-[#EE4D2D] text-white'
  }

  if (platform === 'tiktok') {
    return 'bg-[#111111] text-white'
  }

  return 'bg-[#0F9D58] text-white'
}

const getBadgeClassName = (platform: RevenuePlatformKey) => {
  if (platform === 'shopee') {
    return 'bg-[#EE4D2D]/10 text-[#EE4D2D]'
  }

  if (platform === 'tiktok') {
    return 'bg-emerald-100 text-emerald-700'
  }

  return 'bg-blue-100 text-blue-700'
}

const getGrowthClassName = (value: number) => (value >= 0 ? 'text-emerald-600' : 'text-rose-600')

const getReturnRateClassName = (value: number) => {
  if (value <= 1.5) {
    return 'text-emerald-600'
  }

  if (value <= 2.5) {
    return 'text-amber-600'
  }

  return 'text-rose-600'
}

const getNetMarginClassName = (value: number) => {
  if (value >= 24) {
    return 'text-emerald-600'
  }

  if (value >= 18) {
    return 'text-amber-600'
  }

  return 'text-rose-600'
}

const getLegendColor = (platform: RevenuePlatformKey) => {
  if (platform === 'shopee') {
    return '#EE4D2D'
  }

  if (platform === 'tiktok') {
    return '#111111'
  }

  return '#0F9D58'
}

const toCardViewModel = (platform: RevenuePlatformSnapshot): RevenuePlatformCardViewModel => ({
  id: platform.id,
  platform: platform.platform,
  name: platform.name,
  badge: platform.badge,
  badgeClassName: getBadgeClassName(platform.platform),
  accentClassName: getAccentClassName(platform.platform),
  iconClassName: getIconClassName(platform.platform),
  revenueLabel: toCurrency(platform.revenue),
  growthLabel: toGrowthLabel(platform.growthPercent),
  growthClassName: getGrowthClassName(platform.growthPercent),
  ordersLabel: currencyFormatter.format(platform.orders),
  returnRateLabel: `${platform.returnRatePercent.toFixed(1)}%`,
  returnRateClassName: getReturnRateClassName(platform.returnRatePercent),
  aovLabel: toCurrency(platform.aov),
  feeRateLabel: `${platform.feeRatePercent.toFixed(0)}%`,
  netMarginLabel: `${platform.netMarginPercent.toFixed(1)}%`,
  netMarginClassName: getNetMarginClassName(platform.netMarginPercent),
  ratingLabel: platform.rating.toFixed(1),
})

const toComparisonMetrics = (
  rows: RevenuePlatformComparisonResponse['comparisonMetrics'],
): RevenueComparisonMetricViewModel[] => {
  return rows.map((metric) => {
    const max = metric.values.reduce((acc, item) => Math.max(acc, item.value), 0)

    return {
      id: metric.id,
      label: metric.label,
      values: metric.values.map((item) => ({
        platform: item.platform,
        valueLabel: `${item.value.toFixed(1)}%`,
        percentage: max > 0 ? Number(((item.value / max) * 100).toFixed(1)) : 0,
      })),
    }
  })
}

export const buildRevenuePlatformComparisonViewModel = (
  data: RevenuePlatformComparisonResponse,
): RevenuePlatformComparisonViewModel => {
  const trend = data.trendByMonth.map((item) => ({
    label: item.label,
    shopee: item.shopee,
    tiktok: item.tiktok,
    lazada: item.lazada,
  }))

  return {
    title: data.title,
    subtitle: data.subtitle,
    monthLabel: data.monthLabel,
    cards: data.platforms.map(toCardViewModel),
    comparisonMetrics: toComparisonMetrics(data.comparisonMetrics),
    trend,
    trendLegend: [
      { key: 'shopee', label: 'Shopee', color: getLegendColor('shopee') },
      { key: 'tiktok', label: 'TikTok Shop', color: getLegendColor('tiktok') },
      { key: 'lazada', label: 'Lazada', color: getLegendColor('lazada') },
    ],
    insightsTitle: data.aiInsights.title,
    insightsSubtitle: data.aiInsights.subtitle,
    insights: data.aiInsights.items.map((item) => ({
      id: item.id,
      message: item.message,
      confidenceLabel: `${item.confidencePercent}% CONFIDENCE`,
    })),
  }
}
