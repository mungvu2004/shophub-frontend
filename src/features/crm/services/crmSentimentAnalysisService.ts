import { apiClient } from '@/services/apiClient'
import type { CRMSentimentAnalysisResponse, CRMSentimentPlatformFilter, CRMSentimentReviewItem } from '@/types/crm.types'

type ApiEnvelope = {
  data?: CRMSentimentAnalysisResponse | { data?: CRMSentimentAnalysisResponse }
}

type ReviewEnvelope = {
  data?: CRMSentimentReviewItem | { data?: CRMSentimentReviewItem }
}

const toAnalysisData = (payload: unknown): CRMSentimentAnalysisResponse | null => {
  if (!payload || typeof payload !== 'object') return null

  const candidate = payload as ApiEnvelope & CRMSentimentAnalysisResponse
  if (candidate.data && typeof candidate.data === 'object' && 'productName' in candidate.data) {
    return candidate.data as CRMSentimentAnalysisResponse
  }

  if ('productName' in candidate) {
    return candidate as CRMSentimentAnalysisResponse
  }

  return null
}

const toReviewData = (payload: unknown): CRMSentimentReviewItem | null => {
  if (!payload || typeof payload !== 'object') return null

  const candidate = payload as ReviewEnvelope & CRMSentimentReviewItem
  if (candidate.data && typeof candidate.data === 'object' && 'id' in candidate.data) {
    return candidate.data as CRMSentimentReviewItem
  }

  if ('id' in candidate) {
    return candidate as CRMSentimentReviewItem
  }

  return null
}

export const crmSentimentAnalysisService = {
  async getAnalysis(filters?: {
    platform?: CRMSentimentPlatformFilter
    weekLabel?: string
  }): Promise<CRMSentimentAnalysisResponse> {
    const searchParams = new URLSearchParams()

    if (filters?.platform && filters.platform !== 'all') {
      searchParams.set('platform', filters.platform)
    }

    if (filters?.weekLabel && filters.weekLabel !== 'all') {
      searchParams.set('week', filters.weekLabel)
    }

    const query = searchParams.toString()
    const endpoint = query ? `/crm/sentiment-analysis?${query}` : '/crm/sentiment-analysis'

    const response = await apiClient.get(endpoint)
    const parsed = toAnalysisData(response.data)

    if (!parsed) {
      throw new Error('Invalid sentiment analysis payload')
    }

    return parsed
  },

  async sendReply(payload: {
    reviewId: string
    content: string
    isDraft: boolean
    tone: 'important' | 'friendly'
  }): Promise<CRMSentimentReviewItem> {
    const response = await apiClient.post(`/crm/sentiment-analysis/reviews/${payload.reviewId}/reply`, {
      content: payload.content,
      isDraft: payload.isDraft,
      tone: payload.tone,
    })

    const parsed = toReviewData(response.data)
    if (!parsed) {
      throw new Error('Invalid sentiment review reply payload')
    }

    return parsed
  },
}