import { http, HttpResponse } from 'msw'

import {
  revenueMlForecastMock,
  revenuePlatformComparisonMock,
  revenueSummaryReportMock,
} from '@/mocks/data/revenue'
import type { RevenuePlatformComparisonResponse, RevenuePlatformSnapshot } from '@/types/revenue.types'

const rangeFactorMap = {
  7: 0.45,
  30: 1,
  90: 2.35,
} as const

const trendByDaysMap = {
  7: 6.8,
  30: 19.5,
  90: 31.2,
} as const

const accuracyByDaysMap = {
  7: 94.1,
  30: 91.2,
  90: 87.4,
} as const

const handleRevenueMlForecast = ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const parsedDays = Number(url.searchParams.get('days'))
  const days = [7, 30, 90].includes(parsedDays) ? (parsedDays as 7 | 30 | 90) : 30

  return HttpResponse.json(toRevenueMlForecastByDays(days), { status: 200 })
}

const toRevenueMlForecastByDays = (days: 7 | 30 | 90) => {
  const factor = rangeFactorMap[days]

  return {
    ...revenueMlForecastMock,
    accuracyPercent: accuracyByDaysMap[days],
    cards: revenueMlForecastMock.cards.map((card) => {
      if (card.type !== 'forecast') {
        return card
      }

      return {
        ...card,
        predictionValue: Math.round(card.predictionValue * factor),
        rangeMin: Math.round(card.rangeMin * factor),
        rangeMax: Math.round(card.rangeMax * factor),
        trendPercent: trendByDaysMap[days],
      }
    }),
    chart: {
      ...revenueMlForecastMock.chart,
      title: `Dự báo doanh thu ${days} ngày tới`,
      points: revenueMlForecastMock.chart.points.map((point) => ({
        ...point,
        historical: point.historical === null ? null : Math.round(point.historical * factor),
        forecast: point.forecast === null ? null : Math.round(point.forecast * factor),
        confidenceLow: point.confidenceLow === null ? null : Math.round(point.confidenceLow * factor),
        confidenceHigh: point.confidenceHigh === null ? null : Math.round(point.confidenceHigh * factor),
      })),
    },
    scenario: {
      ...revenueMlForecastMock.scenario,
      scenarios: revenueMlForecastMock.scenario.scenarios.map((scenario) => ({
        ...scenario,
        projectedRevenue: Math.round(scenario.projectedRevenue * factor),
      })),
    },
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const parseMonthOrFallback = (month: string) => {
  const monthPattern = /^(\d{4})-(0[1-9]|1[0-2])$/
  const matched = monthPattern.exec(month)

  if (matched) {
    return {
      year: Number(matched[1]),
      month: Number(matched[2]),
    }
  }

  const now = new Date()

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

const toTrendLabel = (date: Date) => {
  const shortYear = String(date.getFullYear()).slice(-2)
  return `T${date.getMonth() + 1}/${shortYear}`
}

const toPlatformComparisonByMonth = (month: string): RevenuePlatformComparisonResponse => {
  const selected = parseMonthOrFallback(month)
  const selectedMonthIndex = selected.year * 12 + selected.month
  const baselineMonthIndex = 2026 * 12 + 3
  const monthDiff = selectedMonthIndex - baselineMonthIndex
  const monthFactor = clamp(1 + monthDiff * 0.035, 0.72, 1.45)

  const monthLabel = `T${selected.month}/${selected.year}`

  const transformedPlatforms: RevenuePlatformSnapshot[] = revenuePlatformComparisonMock.platforms.map((platform, index) => {
    const platformBias = platform.platform === 'tiktok' ? 1.06 : platform.platform === 'lazada' ? 0.97 : 1
    const trendBias = platform.platform === 'tiktok' ? 4 : platform.platform === 'lazada' ? -1.5 : 0

    return {
      ...platform,
      revenue: Math.max(1, Math.round(platform.revenue * monthFactor * platformBias)),
      orders: Math.max(1, Math.round(platform.orders * monthFactor * (1 + index * 0.015))),
      aov: Math.max(1, Math.round(platform.aov * (1 + monthDiff * 0.004 + (platform.platform === 'tiktok' ? 0.006 : 0)))),
      growthPercent: Number((platform.growthPercent + monthDiff * 1.9 + trendBias).toFixed(1)),
      returnRatePercent: Number(clamp(platform.returnRatePercent - monthDiff * 0.05, 0.6, 6.5).toFixed(1)),
      netMarginPercent: Number(clamp(platform.netMarginPercent + monthDiff * 0.18, 12, 38).toFixed(1)),
      rating: Number(clamp(platform.rating + monthDiff * 0.01, 4.2, 5).toFixed(1)),
    }
  })

  const byPlatform = {
    shopee: transformedPlatforms.find((item) => item.platform === 'shopee')!,
    tiktok: transformedPlatforms.find((item) => item.platform === 'tiktok')!,
    lazada: transformedPlatforms.find((item) => item.platform === 'lazada')!,
  }

  const maxOrders = Math.max(...transformedPlatforms.map((item) => item.orders))
  const maxAov = Math.max(...transformedPlatforms.map((item) => item.aov))
  const minReturnRate = Math.min(...transformedPlatforms.map((item) => item.returnRatePercent))

  const toPercent = (value: number) => Number(value.toFixed(1))

  const comparisonMetrics: RevenuePlatformComparisonResponse['comparisonMetrics'] = [
    {
      id: 'metric-revenue',
      label: 'Doanh thu',
      values: [
        { platform: 'shopee', value: 100 },
        { platform: 'tiktok', value: toPercent((byPlatform.tiktok.revenue / byPlatform.shopee.revenue) * 100) },
        { platform: 'lazada', value: toPercent((byPlatform.lazada.revenue / byPlatform.shopee.revenue) * 100) },
      ],
    },
    {
      id: 'metric-orders',
      label: 'Số đơn',
      values: [
        { platform: 'shopee', value: toPercent((byPlatform.shopee.orders / maxOrders) * 100) },
        { platform: 'tiktok', value: toPercent((byPlatform.tiktok.orders / maxOrders) * 100) },
        { platform: 'lazada', value: toPercent((byPlatform.lazada.orders / maxOrders) * 100) },
      ],
    },
    {
      id: 'metric-aov',
      label: 'AOV',
      values: [
        { platform: 'shopee', value: toPercent((byPlatform.shopee.aov / maxAov) * 100) },
        { platform: 'tiktok', value: toPercent((byPlatform.tiktok.aov / maxAov) * 100) },
        { platform: 'lazada', value: toPercent((byPlatform.lazada.aov / maxAov) * 100) },
      ],
    },
    {
      id: 'metric-return-rate',
      label: 'Tỷ lệ hoàn',
      values: [
        { platform: 'shopee', value: toPercent((minReturnRate / byPlatform.shopee.returnRatePercent) * 100) },
        { platform: 'tiktok', value: toPercent((minReturnRate / byPlatform.tiktok.returnRatePercent) * 100) },
        { platform: 'lazada', value: toPercent((minReturnRate / byPlatform.lazada.returnRatePercent) * 100) },
      ],
    },
  ]

  const transformedTrend = revenuePlatformComparisonMock.trendByMonth.map((point, index, rows) => {
    const monthOffset = rows.length - 1 - index
    const pointDate = new Date(selected.year, selected.month - 1 - monthOffset, 1)
    const driftPerPoint = 1 + monthDiff * 0.03 + (index - (rows.length - 1)) * 0.01

    return {
      ...point,
      label: toTrendLabel(pointDate),
      shopee: Math.max(1, Math.round(point.shopee * monthFactor * driftPerPoint)),
      tiktok: Math.max(1, Math.round(point.tiktok * monthFactor * driftPerPoint * 1.03)),
      lazada: Math.max(1, Math.round(point.lazada * monthFactor * driftPerPoint * 0.98)),
    }
  })

  return {
    ...revenuePlatformComparisonMock,
    subtitle: `Shopee vs TikTok Shop vs Lazada - ${monthLabel}`,
    monthLabel,
    platforms: transformedPlatforms,
    comparisonMetrics,
    trendByMonth: transformedTrend,
    aiInsights: {
      ...revenuePlatformComparisonMock.aiInsights,
      subtitle: `Báo cáo tổng hợp từ AI dựa trên hiệu quả vận hành thực tế (${monthLabel})`,
    },
  }
}

export const revenueHandlers = [
  http.get('/api/revenue/summary-report', ({ request }) => {
    const url = new URL(request.url)
    const month = (url.searchParams.get('month') ?? '').trim()

    if (!month) {
      return HttpResponse.json(
        {
          message: 'month is required',
        },
        { status: 400 },
      )
    }

    return HttpResponse.json(revenueSummaryReportMock, { status: 200 })
  }),
  http.get('/api/revenue/platform-comparison', ({ request }) => {
    const url = new URL(request.url)
    const month = (url.searchParams.get('month') ?? '').trim()

    if (!month) {
      return HttpResponse.json(
        {
          message: 'month is required',
        },
        { status: 400 },
      )
    }

    return HttpResponse.json(toPlatformComparisonByMonth(month), { status: 200 })
  }),
  http.get('/api/revenue/ml-forecast', handleRevenueMlForecast),
  http.get('/revenue/ml-forecast', handleRevenueMlForecast),
]
