import { apiClient } from '@/services/apiClient'

import type {
  DashboardTopProductItem,
  DashboardTopProductsResponse,
  TopProductsMetricId,
  TopProductsPlatformId,
  TopProductsRangeDays,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

type DashboardTopProductsApiEnvelope = {
  success?: boolean
  data?: unknown
}

const toTopProductItem = (value: unknown, index: number): DashboardTopProductItem | null => {
  if (!value || typeof value !== 'object') return null

  const item = value as Record<string, unknown>
  const platform = item.platform === 'shopee' || item.platform === 'lazada' || item.platform === 'tiktok_shop' ? item.platform : 'shopee'

  return {
    id: typeof item.id === 'string' ? item.id : `top-${index + 1}`,
    name: typeof item.name === 'string' ? item.name : 'Sản phẩm chưa đặt tên',
    sku: typeof item.sku === 'string' ? item.sku : '--',
    platform,
    imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
    soldQty: typeof item.soldQty === 'number' && Number.isFinite(item.soldQty) ? item.soldQty : 0,
    revenue: typeof item.revenue === 'number' && Number.isFinite(item.revenue) ? item.revenue : 0,
    avgPrice: typeof item.avgPrice === 'number' && Number.isFinite(item.avgPrice) ? item.avgPrice : 0,
    returnRate: typeof item.returnRate === 'number' && Number.isFinite(item.returnRate) ? item.returnRate : 0,
    trendPercent: typeof item.trendPercent === 'number' && Number.isFinite(item.trendPercent) ? item.trendPercent : 0,
  }
}

const toList = (value: unknown): DashboardTopProductItem[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item, index) => toTopProductItem(item, index))
    .filter((item): item is DashboardTopProductItem => Boolean(item))
}

const toInsights = (value: unknown): DashboardTopProductsResponse['insights'] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>

      const tone = row.tone === 'warning' || row.tone === 'positive' ? row.tone : 'info'

      return {
        id: typeof row.id === 'string' ? row.id : `insight-${index + 1}`,
        title: typeof row.title === 'string' ? row.title : 'AI insight',
        description: typeof row.description === 'string' ? row.description : '',
        tone,
      }
    })
    .filter((item): item is DashboardTopProductsResponse['insights'][number] => Boolean(item))
}

const toContribution = (value: unknown): DashboardTopProductsResponse['contribution'] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>

      const percent = typeof row.percent === 'number' && Number.isFinite(row.percent) ? Math.max(0, row.percent) : 0

      return {
        id: typeof row.id === 'string' ? row.id : `segment-${index + 1}`,
        label: typeof row.label === 'string' ? row.label : 'Khác',
        percent,
      }
    })
    .filter((item): item is DashboardTopProductsResponse['contribution'][number] => Boolean(item))
}

const toResponse = (
  value: unknown,
  fallbackMetric: TopProductsMetricId,
  fallbackRange: TopProductsRangeDays,
  fallbackPlatform: TopProductsPlatformId,
): DashboardTopProductsResponse => {
  if (!value || typeof value !== 'object') {
    return {
      updatedAt: '--:--',
      metric: fallbackMetric,
      rangeDays: fallbackRange,
      platform: fallbackPlatform,
      podium: [],
      ranking: [],
      insights: [],
      contribution: [],
      declining: [],
    }
  }

  const payload = value as Record<string, unknown>

  const metric = payload.metric === 'quantity' || payload.metric === 'returnRate' ? payload.metric : fallbackMetric
  const rangeDays = payload.rangeDays === 7 || payload.rangeDays === 90 ? payload.rangeDays : fallbackRange
  const platform = payload.platform === 'shopee' || payload.platform === 'lazada' || payload.platform === 'tiktok_shop' ? payload.platform : fallbackPlatform

  return {
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : '--:--',
    metric,
    rangeDays,
    platform,
    podium: toList(payload.podium),
    ranking: toList(payload.ranking),
    insights: toInsights(payload.insights),
    contribution: toContribution(payload.contribution),
    declining: toList(payload.declining),
  }
}

class DashboardTopProductsService {
  async getTopProducts(params: {
    metric: TopProductsMetricId
    range: TopProductsRangeDays
    platform: TopProductsPlatformId
  }): Promise<DashboardTopProductsResponse> {
    const response = await apiClient.get<DashboardTopProductsApiEnvelope>('/dashboard/top-products', {
      params,
    })

    return toResponse(response.data?.data, params.metric, params.range, params.platform)
  }
}

export const dashboardTopProductsService = new DashboardTopProductsService()
