import { http, HttpResponse } from 'msw'

import {
  revenueMlForecastMock,
  revenuePlatformComparisonMock,
  revenueSummaryReportMock,
} from '@/mocks/data/revenue'
import { mlForecastComparisonScenariosMock } from '@/mocks/data/revenueMLScenarios'
import type { 
  RevenueMlForecastScenarioInput, 
} from '@/types/revenue.types'

const rangeFactorMap = {
  7: 0.45,
  30: 1,
  90: 2.35,
} as const

const handleRevenueMlForecast = ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const parsedDays = Number(url.searchParams.get('days'))
  const days = [7, 30, 90].includes(parsedDays) ? (parsedDays as 7 | 30 | 90) : 30
  const factor = rangeFactorMap[days]

  return HttpResponse.json({
    ...revenueMlForecastMock,
    accuracyPercent: days === 7 ? 94.1 : days === 30 ? 91.2 : 87.4,
    keyDrivers: revenueMlForecastMock.keyDrivers,
    chart: {
      ...revenueMlForecastMock.chart,
      points: revenueMlForecastMock.chart.points.map((p) => ({
        ...p,
        historical: p.historical === null ? null : Math.round(p.historical * factor),
        forecast: p.forecast === null ? null : Math.round(p.forecast * factor),
      })),
    },
  }, { status: 200 })
}

export const revenueHandlers = [
  http.get('/api/revenue/summary-report', () => HttpResponse.json(revenueSummaryReportMock)),
  
  http.get('/api/revenue/platform-comparison', () => HttpResponse.json(revenuePlatformComparisonMock)),

  http.get('/api/revenue/ml-forecast', handleRevenueMlForecast),

  http.get('/api/revenue/ml-forecast/comparison', () => {
    return HttpResponse.json(mlForecastComparisonScenariosMock || [], { status: 200 })
  }),

  http.post('/api/revenue/ml-forecast/simulate', async ({ request }) => {
    try {
      const body = (await request.json()) as RevenueMlForecastScenarioInput
      const baseline = mlForecastComparisonScenariosMock?.[0]
      
      if (!baseline) {
        return new HttpResponse(JSON.stringify({ message: 'Baseline scenario not found' }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const priceChange = body.assumptions?.['price-change'] || 0
      const adsChange = body.assumptions?.['ads-budget-change'] || 0

      const impact = 1 + priceChange / 100 + adsChange / 200
      const simulatedRevenue = Math.round(baseline.projectedRevenue * impact)

      return HttpResponse.json({
        ...baseline,
        id: `sim-${Date.now()}`,
        title: body.title || 'Kịch bản giả định',
        projectedRevenue: simulatedRevenue,
        color: '#ec4899',
        metrics: {
          revenue: simulatedRevenue,
          growth: Number(((simulatedRevenue / 48_750_000 - 1) * 100).toFixed(1)),
        },
        points: (baseline.points || []).map((p) => ({ ...p, value: Math.round(p.value * impact) })),
      }, { status: 200 })
    } catch (e) {
      console.error('MSW Simulate Error:', e)
      return new HttpResponse(JSON.stringify({ message: 'Invalid simulation input' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }),
]
