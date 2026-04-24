import { apiClient } from '@/services/apiClient'

import type {
  RevenueChartsPlatformId,
  RevenueChartsRangeDays,
  RevenueChartsResponse,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type DashboardRevenueChartsApiEnvelope = {
  success?: boolean
  data?: unknown
}

const asNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const asString = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback)

const toPlatform = (value: unknown, fallback: RevenueChartsPlatformId): RevenueChartsPlatformId => {
  if (value === 'all' || value === 'shopee' || value === 'lazada' || value === 'tiktok_shop') {
    return value
  }

  return fallback
}

const toRange = (value: unknown, fallback: RevenueChartsRangeDays): RevenueChartsRangeDays => {
  if (value === 7 || value === 30) return value
  return fallback
}

const toResponse = (
  value: unknown,
  fallbackPlatform: RevenueChartsPlatformId,
  fallbackRange: RevenueChartsRangeDays,
): RevenueChartsResponse => {
  if (!value || typeof value !== 'object') {
    return {
      updatedAt: '--:--',
      platform: fallbackPlatform,
      rangeDays: fallbackRange,
      summary: {
        totalRevenue: 0,
        totalRevenueDeltaPercent: 0,
        averageRevenuePerDay: 0,
        averageRevenueDeltaPercent: 0,
        highestDayRevenue: 0,
        highestDayDate: '--',
        lowestDayRevenue: 0,
        lowestDayDate: '--',
      },
      monthlyGoal: {
        monthLabel: '--',
        targetRevenue: 0,
        achievedRevenue: 0,
        progressPercent: 0,
      },
      dailySeries: [],
      hourlyDistribution: [],
      categoryBreakdown: [],
      weeklyComparison: [],
      peakHoursLabel: '--',
      timelineEvents: [],
      hourlyHeatmap: [],
    }
  }

  const payload = value as Record<string, unknown>
  const summaryRaw = payload.summary && typeof payload.summary === 'object' ? (payload.summary as Record<string, unknown>) : {}
  const goalRaw = payload.monthlyGoal && typeof payload.monthlyGoal === 'object' ? (payload.monthlyGoal as Record<string, unknown>) : {}

  return {
    updatedAt: asString(payload.updatedAt, '--:--'),
    platform: toPlatform(payload.platform, fallbackPlatform),
    rangeDays: toRange(payload.rangeDays, fallbackRange),
    summary: {
      totalRevenue: asNumber(summaryRaw.totalRevenue),
      totalRevenueDeltaPercent: asNumber(summaryRaw.totalRevenueDeltaPercent),
      averageRevenuePerDay: asNumber(summaryRaw.averageRevenuePerDay),
      averageRevenueDeltaPercent: asNumber(summaryRaw.averageRevenueDeltaPercent),
      highestDayRevenue: asNumber(summaryRaw.highestDayRevenue),
      highestDayDate: asString(summaryRaw.highestDayDate, '--'),
      lowestDayRevenue: asNumber(summaryRaw.lowestDayRevenue),
      lowestDayDate: asString(summaryRaw.lowestDayDate, '--'),
    },
    monthlyGoal: {
      monthLabel: asString(goalRaw.monthLabel, '--'),
      targetRevenue: asNumber(goalRaw.targetRevenue),
      achievedRevenue: asNumber(goalRaw.achievedRevenue),
      progressPercent: asNumber(goalRaw.progressPercent),
    },
    dailySeries: Array.isArray(payload.dailySeries)
      ? payload.dailySeries
          .map((item) => {
            if (!item || typeof item !== 'object') return null
            const point = item as Record<string, unknown>

            return {
              date: asString(point.date, ''),
              shopee: asNumber(point.shopee),
              lazada: asNumber(point.lazada),
              tiktokShop: asNumber(point.tiktokShop),
              previousTotal: asNumber(point.previousTotal),
                voucherRevenue: asNumber(point.voucherRevenue),
                promotionRevenue: asNumber(point.promotionRevenue),
            }
          })
          .filter((item): item is RevenueChartsResponse['dailySeries'][number] => Boolean(item))
      : [],
    hourlyDistribution: Array.isArray(payload.hourlyDistribution)
      ? payload.hourlyDistribution
          .map((item) => {
            if (!item || typeof item !== 'object') return null
            const point = item as Record<string, unknown>

            return {
              hour: asNumber(point.hour),
              revenue: asNumber(point.revenue),
            }
          })
          .filter((item): item is RevenueChartsResponse['hourlyDistribution'][number] => Boolean(item))
      : [],
    categoryBreakdown: Array.isArray(payload.categoryBreakdown)
      ? payload.categoryBreakdown
          .map((item) => {
            if (!item || typeof item !== 'object') return null
            const row = item as Record<string, unknown>

            return {
              id: asString(row.id, ''),
              label: asString(row.label, 'Khác'),
              revenue: asNumber(row.revenue),
              products: Array.isArray(row.products)
                ? row.products
                    .map((product) => {
                      if (!product || typeof product !== 'object') return null
                      const productRow = product as Record<string, unknown>

                      return {
                        id: asString(productRow.id, ''),
                        name: asString(productRow.name, 'Sản phẩm'),
                        revenue: asNumber(productRow.revenue),
                        orders: asNumber(productRow.orders),
                      }
                    })
                    .filter(
                      (product): product is RevenueChartsResponse['categoryBreakdown'][number]['products'][number] =>
                        Boolean(product),
                    )
                : [],
            }
          })
          .filter((item): item is RevenueChartsResponse['categoryBreakdown'][number] => Boolean(item))
      : [],
    weeklyComparison: Array.isArray(payload.weeklyComparison)
      ? payload.weeklyComparison
          .map((item) => {
            if (!item || typeof item !== 'object') return null
            const row = item as Record<string, unknown>

            return {
              id: asString(row.id, ''),
              label: asString(row.label, '--'),
              startDate: asString(row.startDate, '--'),
              endDate: asString(row.endDate, '--'),
              shopee: asNumber(row.shopee),
              lazada: asNumber(row.lazada),
              tiktokShop: asNumber(row.tiktokShop),
              growthPercent: asNumber(row.growthPercent),
            }
          })
          .filter((item): item is RevenueChartsResponse['weeklyComparison'][number] => Boolean(item))
      : [],
    peakHoursLabel: asString(payload.peakHoursLabel, '--'),
    timelineEvents: Array.isArray(payload.timelineEvents)
      ? payload.timelineEvents
          .map((item) => {
            if (!item || typeof item !== 'object') return null
            const row = item as Record<string, unknown>
            const typeRaw = row.type

            return {
              id: asString(row.id, ''),
              date: asString(row.date, ''),
              label: asString(row.label, '--'),
              type: typeRaw === 'holiday' ? 'holiday' : 'flash_sale',
              impactPercent: asNumber(row.impactPercent),
            }
          })
          .filter((item): item is RevenueChartsResponse['timelineEvents'][number] => Boolean(item))
      : [],
    hourlyHeatmap: Array.isArray(payload.hourlyHeatmap)
      ? payload.hourlyHeatmap
          .map((item) => {
            if (!item || typeof item !== 'object') return null
            const row = item as Record<string, unknown>

            return {
              dayIndex: asNumber(row.dayIndex),
              hour: asNumber(row.hour),
              orderCount: asNumber(row.orderCount),
            }
          })
          .filter((item): item is RevenueChartsResponse['hourlyHeatmap'][number] => Boolean(item))
      : [],
  }
}

class DashboardRevenueChartsService {
  async getRevenueCharts(params: {
    platform: RevenueChartsPlatformId
    range: RevenueChartsRangeDays
  }): Promise<RevenueChartsResponse> {
    const response = await apiClient.get<DashboardRevenueChartsApiEnvelope>('/dashboard/revenue-charts', {
      params,
    })

    return toResponse(response.data?.data, params.platform, params.range)
  }
}

export const dashboardRevenueChartsService = new DashboardRevenueChartsService()
