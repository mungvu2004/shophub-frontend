import { http, HttpResponse } from 'msw'

import {
  buildCRMReviewSummary,
  crmReplyTemplatesBySentiment,
  crmReviewInboxMock,
  crmWeeklyInsightMock,
} from '@/mocks/data/crm'
import { buildCRMCustomerProfilesResponse } from '@/mocks/data/crmCustomerProfiles'
import { crmSentimentAnalysisMock } from '@/mocks/data/crmSentimentAnalysis'
import type {
  CRMCustomerProfilesResponse,
  CRMSentimentAnalysisResponse,
  CRMSentimentPlatformFilter,
  CRMReviewFilterStatus,
  CRMReviewSort,
} from '@/types/crm.types'

function applyStatusFilter(status: CRMReviewFilterStatus, items = crmReviewInboxMock) {
  if (status === 'unreplied') return items.filter((item) => !item.isReplied)
  if (status === 'negative') return items.filter((item) => item.ai.sentiment === 'negative')
  if (status === 'replied') return items.filter((item) => item.isReplied)
  return items
}

function applySort(sort: CRMReviewSort, items: typeof crmReviewInboxMock) {
  return [...items].sort((left, right) => {
    const leftMs = new Date(left.createdAt).getTime()
    const rightMs = new Date(right.createdAt).getTime()

    if (sort === 'oldest') return leftMs - rightMs
    return rightMs - leftMs
  })
}

export const crmHandlers = [
  http.get('/api/crm/sentiment-analysis', ({ request }) => {
    const url = new URL(request.url)
    const weekFilter = url.searchParams.get('week')
    const platformFilterParam = (url.searchParams.get('platform') ?? 'all') as CRMSentimentPlatformFilter
    const platformFilter: CRMSentimentPlatformFilter = ['all', 'shopee', 'lazada', 'tiktok'].includes(platformFilterParam)
      ? platformFilterParam
      : 'all'

    const filteredReviews = crmSentimentAnalysisMock.reviews.filter((review) => {
      const isWeekMatched = !weekFilter || review.weekLabel === weekFilter
      const isPlatformMatched = platformFilter === 'all' || review.platform === platformFilter
      return isWeekMatched && isPlatformMatched
    })

    const platformBreakdown = ['all', 'shopee', 'lazada', 'tiktok'].map((id) => {
      if (id === 'all') {
        return {
          id,
          label: 'Tất cả',
          value: filteredReviews.length,
        }
      }

      const value = filteredReviews.filter((review) => review.platform === id).length
      const label = id === 'shopee' ? 'Shopee' : id === 'lazada' ? 'Lazada' : 'TikTok'

      return {
        id,
        label,
        value,
      }
    }) as CRMSentimentAnalysisResponse['platformBreakdown']

    return HttpResponse.json({
      success: true,
      data: {
        ...crmSentimentAnalysisMock,
        totalReviews: filteredReviews.length,
        reviews: filteredReviews,
        platformBreakdown,
      },
    })
  }),

  http.post('/api/crm/sentiment-analysis/reviews/:id/reply', async ({ params, request }) => {
    const review = crmSentimentAnalysisMock.reviews.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Review not found',
        },
        { status: 404 },
      )
    }

    const payload = (await request.json()) as {
      content?: string
      tone?: 'important' | 'friendly'
      isDraft?: boolean
    }

    if (!payload?.content?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Content is required',
        },
        { status: 400 },
      )
    }

    review.reply = {
      id: `reply-${review.id}-${Date.now()}`,
      content: payload.content.trim(),
      tone: payload.tone ?? 'important',
      isDraft: Boolean(payload.isDraft),
      createdAt: new Date().toISOString(),
    }
    review.isReplied = !review.reply.isDraft

    return HttpResponse.json({
      success: true,
      data: review,
    })
  }),

  http.get('/api/crm/reviews/summary', () => {
    return HttpResponse.json({
      success: true,
      data: {
        summary: buildCRMReviewSummary(crmReviewInboxMock),
        weeklyInsight: crmWeeklyInsightMock,
      },
    })
  }),

  http.get('/api/crm/customer-profiles', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') ?? ''
    const customerId = url.searchParams.get('customerId') ?? undefined

    const payload: CRMCustomerProfilesResponse = buildCRMCustomerProfilesResponse({
      search,
      customerId,
    })

    return HttpResponse.json({
      success: true,
      data: payload,
    })
  }),

  http.get('/api/crm/reviews/inbox', ({ request }) => {
    const url = new URL(request.url)

    const statusParam = (url.searchParams.get('status') ?? 'all') as CRMReviewFilterStatus
    const status: CRMReviewFilterStatus = ['all', 'unreplied', 'negative', 'replied'].includes(statusParam)
      ? statusParam
      : 'all'

    const sortParam = (url.searchParams.get('sort') ?? 'newest') as CRMReviewSort
    const sort: CRMReviewSort = sortParam === 'oldest' ? 'oldest' : 'newest'

    const filtered = applyStatusFilter(status)
    const items = applySort(sort, filtered)

    return HttpResponse.json({
      success: true,
      data: {
        items,
      },
    })
  }),

  http.get('/api/crm/reviews/:id/reply-templates', ({ params }) => {
    const review = crmReviewInboxMock.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Review not found',
        },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      success: true,
      data: {
        templates: crmReplyTemplatesBySentiment[review.ai.sentiment],
      },
    })
  }),

  http.post('/api/crm/reviews/:id/mark-read', ({ params }) => {
    const review = crmReviewInboxMock.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Review not found',
        },
        { status: 404 },
      )
    }

    review.isRead = true

    return HttpResponse.json({
      success: true,
      data: review,
    })
  }),

  http.post('/api/crm/reviews/:id/reply', async ({ params, request }) => {
    const review = crmReviewInboxMock.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Review not found',
        },
        { status: 404 },
      )
    }

    const payload = (await request.json()) as {
      content?: string
      tone?: 'important' | 'friendly'
      isDraft?: boolean
    }

    if (!payload?.content?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Content is required',
        },
        { status: 400 },
      )
    }

    review.reply = {
      id: `reply-${review.id}-${Date.now()}`,
      content: payload.content.trim(),
      tone: payload.tone ?? 'important',
      isDraft: Boolean(payload.isDraft),
      createdAt: new Date().toISOString(),
    }

    review.isReplied = !review.reply.isDraft

    return HttpResponse.json({
      success: true,
      data: review,
    })
  }),
]
