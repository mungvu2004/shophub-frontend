import { describe, expect, it } from 'vitest'

import type { RevenueChartsResponse } from '@/features/dashboard/logic/dashboardRevenueCharts.types'
import { buildDashboardRevenueChartsViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.logic'

function createResponse(overrides?: Partial<RevenueChartsResponse>): RevenueChartsResponse {
  return {
    updatedAt: '14:35',
    platform: 'all',
    rangeDays: 30,
    summary: {
      totalRevenue: 900000000,
      totalRevenueDeltaPercent: 12.5,
      averageRevenuePerDay: 30000000,
      averageRevenueDeltaPercent: 5.2,
      highestDayRevenue: 45000000,
      highestDayDate: '2026-03-15',
      lowestDayRevenue: 12000000,
      lowestDayDate: '2026-03-02',
    },
    monthlyGoal: {
      monthLabel: 'tháng 3',
      targetRevenue: 1000000000,
      achievedRevenue: 1100000000,
      progressPercent: 140.3,
    },
    dailySeries: [
      {
        date: '2026-03-01',
        shopee: 10000000,
        lazada: 8000000,
        tiktokShop: 9000000,
        previousTotal: 24000000,
        voucherRevenue: 1800000,
        promotionRevenue: 2200000,
      },
    ],
    hourlyDistribution: [{ hour: 20, revenue: 5000000 }],
    categoryBreakdown: [
      {
        id: 'c1',
        label: 'A',
        revenue: 20000000,
        products: [
          {
            id: 'p1',
            name: 'Product A',
            revenue: 15000000,
            orders: 120,
          },
        ],
      },
    ],
    weeklyComparison: [
      {
        id: 'w1',
        label: 'Tuần 1',
        startDate: '2026-03-01',
        endDate: '2026-03-07',
        shopee: 40000000,
        lazada: 30000000,
        tiktokShop: 20000000,
        growthPercent: 3.5,
      },
    ],
    peakHoursLabel: '19h - 22h',
    timelineEvents: [
      {
        id: 'e1',
        date: '2026-03-01',
        label: 'Flash',
        type: 'flash_sale',
        impactPercent: 10,
      },
    ],
    hourlyHeatmap: [
      {
        dayIndex: 0,
        hour: 10,
        orderCount: 30,
      },
    ],
    ...overrides,
  }
}

describe('buildDashboardRevenueChartsViewModel', () => {
  it('uses clamped progress in both label and progress bar value', () => {
    const response = createResponse()

    const model = buildDashboardRevenueChartsViewModel({
      data: response,
      selectedPlatform: 'all',
    })

    expect(model.goalProgressPercent).toBe(100)
    expect(model.goalLabel).toContain('100%')
  })
})
