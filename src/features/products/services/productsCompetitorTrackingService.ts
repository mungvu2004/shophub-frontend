import { apiClient } from '@/services/apiClient'
import type { CompetitorTrackingPayload } from '@/features/products/logic/productsCompetitorTracking.types'

type CompetitorTrackingResponse = {
  data?: CompetitorTrackingPayload
} & Partial<CompetitorTrackingPayload>

const fallbackPayload: CompetitorTrackingPayload = {
  alertBanner: {
    matchedCount: 0,
    message: 'Chua co canh bao moi',
  },
  totalProductsTracked: 0,
  comparisonRows: [],
  topCompetitors: [],
  alertSettings: {
    thresholdPercent: 5,
    updatedAt: new Date().toISOString(),
  },
  heatmap: [],
}

const normalizePayload = (payload: CompetitorTrackingResponse): CompetitorTrackingPayload => {
  const source = payload.data ?? payload

  return {
    alertBanner: source.alertBanner ?? fallbackPayload.alertBanner,
    totalProductsTracked: source.totalProductsTracked ?? fallbackPayload.totalProductsTracked,
    comparisonRows: Array.isArray(source.comparisonRows) ? source.comparisonRows : fallbackPayload.comparisonRows,
    topCompetitors: Array.isArray(source.topCompetitors) ? source.topCompetitors : fallbackPayload.topCompetitors,
    alertSettings: source.alertSettings ?? fallbackPayload.alertSettings,
    heatmap: Array.isArray(source.heatmap) ? source.heatmap : fallbackPayload.heatmap,
  }
}

export const productsCompetitorTrackingService = {
  async getCompetitorTrackingData(): Promise<CompetitorTrackingPayload> {
    const response = await apiClient.get<CompetitorTrackingResponse>('/products/competitor-tracking')
    return normalizePayload(response.data)
  },
}
