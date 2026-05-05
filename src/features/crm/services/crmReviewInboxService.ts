import { apiClient } from '@/services/apiClient'
import type {
  CRMReplyTemplate,
  CRMReviewDeleteResponse,
  CRMReviewFilterStatus,
  CRMReviewInboxSummary,
  CRMReviewItem,
  CRMReviewSort,
  CRMWeeklyInsight,
} from '@/types/crm.types'

type ArrayResponse<T> = {
  items?: T[]
  data?: T[] | { items?: T[] }
}

type SummaryResponse = {
  summary?: CRMReviewInboxSummary
  weeklyInsight?: CRMWeeklyInsight
}

const toItems = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[]

  if (!payload || typeof payload !== 'object') return []

  const maybeArray = payload as ArrayResponse<T>

  if (Array.isArray(maybeArray.items)) return maybeArray.items
  if (Array.isArray(maybeArray.data)) return maybeArray.data

  if (maybeArray.data && typeof maybeArray.data === 'object' && Array.isArray(maybeArray.data.items)) {
    return maybeArray.data.items
  }

  return []
}

const toSummary = (payload: unknown): SummaryResponse => {
  if (!payload || typeof payload !== 'object') return {}

  const candidate = payload as { data?: SummaryResponse } & SummaryResponse
  if (candidate.data && typeof candidate.data === 'object') return candidate.data
  return candidate
}

export const crmReviewInboxService = {
  async getSummary(): Promise<{ summary: CRMReviewInboxSummary | null; weeklyInsight: CRMWeeklyInsight | null }> {
    const response = await apiClient.get('/crm/reviews/summary')
    const parsed = toSummary(response.data)

    return {
      summary: parsed.summary ?? null,
      weeklyInsight: parsed.weeklyInsight ?? null,
    }
  },

  async getReviewInbox(params: {
    status: CRMReviewFilterStatus
    sort: CRMReviewSort
  }): Promise<CRMReviewItem[]> {
    const response = await apiClient.get('/crm/reviews/inbox', {
      params,
    })

    return toItems<CRMReviewItem>(response.data)
  },

  async getReplyTemplates(reviewId: string): Promise<CRMReplyTemplate[]> {
    const response = await apiClient.get(`/crm/reviews/${reviewId}/reply-templates`)
    return toItems<CRMReplyTemplate>(response.data)
  },

  async markRead(reviewId: string): Promise<CRMReviewItem> {
    const response = await apiClient.post(`/crm/reviews/${reviewId}/mark-read`)
    const items = toItems<CRMReviewItem>(response.data)
    if (items.length > 0) return items[0]
    const candidate = response.data as { data?: CRMReviewItem } & CRMReviewItem
    if (candidate.data && 'id' in candidate.data) return candidate.data
    if ('id' in candidate) return candidate as CRMReviewItem
    throw new Error('Invalid mark read response')
  },

  async saveReply(payload: {
    reviewId: string
    content: string
    tone: 'important' | 'friendly'
    isDraft: boolean
  }): Promise<void> {
    await apiClient.post(`/crm/reviews/${payload.reviewId}/reply`, {
      content: payload.content,
      tone: payload.tone,
      isDraft: payload.isDraft,
    })
  },

  async deleteReview(reviewId: string): Promise<CRMReviewDeleteResponse> {
    const response = await apiClient.delete(`/crm/reviews/${reviewId}`)
    const candidate = response.data as { data?: CRMReviewDeleteResponse } & CRMReviewDeleteResponse
    if (candidate.data && 'deletedId' in candidate.data) return candidate.data
    if (candidate.deletedId) return { deletedId: candidate.deletedId }
    return { deletedId: reviewId }
  },

  async togglePriority(reviewId: string, isPriority: boolean): Promise<CRMReviewItem> {
    const response = await apiClient.patch(`/crm/reviews/${reviewId}/priority`, { isPriority })
    const items = toItems<CRMReviewItem>(response.data)
    if (items.length > 0) return items[0]
    const candidate = response.data as { data?: CRMReviewItem } & CRMReviewItem
    if (candidate.data && 'id' in candidate.data) return candidate.data
    if ('id' in candidate) return candidate as CRMReviewItem
    throw new Error('Invalid toggle priority response')
  },
}
