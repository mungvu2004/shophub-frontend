import { http, HttpResponse } from 'msw'

import {
  revenueMlForecastMock,
  revenuePlatformComparisonMock,
  revenueSummaryReportMock,
} from '@/mocks/data/revenue'

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

    return HttpResponse.json(revenuePlatformComparisonMock, { status: 200 })
  }),
  http.get('/api/revenue/ml-forecast', ({ request }) => {
    const url = new URL(request.url)
    const days = Number(url.searchParams.get('days'))

    if (![7, 30, 90].includes(days)) {
      return HttpResponse.json(
        {
          message: 'days must be one of 7, 30, 90',
        },
        { status: 400 },
      )
    }

    return HttpResponse.json(toRevenueMlForecastByDays(days as 7 | 30 | 90), { status: 200 })
  }),
]
