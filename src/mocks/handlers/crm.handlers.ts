import { http, HttpResponse, delay } from 'msw'

import {
  buildCRMReviewSummary,
  crmReplyTemplatesBySentiment,
  crmReviewInboxMock,
  crmWeeklyInsightMock,
} from '@/mocks/data/crm'
import { buildCRMCustomerProfilesResponse } from '@/mocks/data/crmCustomerProfiles'
import { crmSentimentAnalysisMock } from '@/mocks/data/crmSentimentAnalysis'
import { mockProducts } from '@/mocks/data/products'
import type {
  CRMCustomerProfilesResponse,
  CRMSentimentPlatformFilter,
  CRMReviewFilterStatus,
  CRMReviewSort,
} from '@/types/crm.types'



// Helper sinh số ngẫu nhiên dựa trên productId (seed)
const seededRandom = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return () => {
    hash = (hash * 16807) % 2147483647
    return (hash - 1) / 2147483646
  }
}

const REVIEW_COMMENTS = [
  "Chất lượng tuyệt vời, đóng gói rất kỹ.",
  "Giao hàng nhanh hơn dự kiến, nhân viên tư vấn nhiệt tình.",
  "Màu sắc bên ngoài hơi đậm hơn hình một chút nhưng vẫn rất đẹp.",
  "Vải mặc mát, không bị xù lông sau khi giặt.",
  "Bảng size shop tư vấn rất chuẩn, mình mặc vừa in.",
  "Sản phẩm có vết chỉ thừa nhỏ, nhưng tổng thể vẫn rất tốt.",
  "Dùng một thời gian thấy rất bền, sẽ ủng hộ shop tiếp.",
  "Giao sai màu nhưng shop đã hỗ trợ đổi trả rất nhanh, hài lòng.",
]

const TOPICS_POOL = ["Chất liệu", "Giao hàng", "Giá cả", "Đóng gói", "Tư vấn", "Độ bền", "Màu sắc", "Form dáng"]

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
  http.get('/api/crm/sentiment-analysis', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const productId = url.searchParams.get('productId') || 'prod-001'
    const weekFilter = url.searchParams.get('week')
    const platformFilterParam = (url.searchParams.get('platform') ?? 'all') as CRMSentimentPlatformFilter
    
    const product = mockProducts.find(p => p.id === productId) || mockProducts[0]
    const random = seededRandom(productId)

    const platformFilter: CRMSentimentPlatformFilter = ['all', 'shopee', 'lazada', 'tiktok_shop'].includes(platformFilterParam)
      ? platformFilterParam
      : 'all'

    // Sinh reviews ngẫu nhiên dựa trên sản phẩm
    const dynamicReviews = Array.from({ length: 8 }).map((_, idx) => {
      const r = random()
      const sentiment: 'positive' | 'neutral' | 'negative' = r > 0.6 ? 'positive' : r > 0.3 ? 'neutral' : 'negative'
      const platform: 'shopee' | 'lazada' | 'tiktok_shop' = r > 0.66 ? 'shopee' : r > 0.33 ? 'lazada' : 'tiktok_shop'
      const weekLabel = `W${Math.floor(random() * 8) + 1}`
      
      return {
        id: `rev-${productId}-${idx}`,
        platform,
        weekLabel,
        customerName: `Khách hàng ${Math.floor(random() * 1000)}`,
        rating: sentiment === 'positive' ? 5 : sentiment === 'neutral' ? 4 : 2,
        comment: REVIEW_COMMENTS[Math.floor(random() * REVIEW_COMMENTS.length)],
        createdAt: new Date(Date.now() - random() * 1000000000).toISOString(),
        sentiment,
        confidence: 70 + Math.floor(random() * 25),
        topics: [TOPICS_POOL[Math.floor(random() * TOPICS_POOL.length)], TOPICS_POOL[Math.floor(random() * TOPICS_POOL.length)]],
        responseLabel: 'PHẢN HỒI',
        isReplied: random() > 0.5,
      }
    })

    const filteredReviews = dynamicReviews.filter((review) => {
      const isWeekMatched = !weekFilter || weekFilter === 'all' || review.weekLabel === weekFilter
      const isPlatformMatched = platformFilter === 'all' || review.platform === platformFilter
      return isWeekMatched && isPlatformMatched
    })

    const platformBreakdown = ['all', 'shopee', 'lazada', 'tiktok_shop'].map((id) => {
      if (id === 'all') return { id, label: 'Tất cả', value: filteredReviews.length }
      const value = filteredReviews.filter((review) => review.platform === id).length
      const label = id === 'tiktok_shop' ? 'TikTok' : id.charAt(0).toUpperCase() + id.slice(1)
      return { id, label, value }
    })

    // Sinh timeline động
    const baseScore = 65 + Math.floor(random() * 20)
    const timeline = Array.from({ length: 8 }).map((_, idx) => ({
      weekLabel: `W${idx + 1}`,
      score: Math.min(100, baseScore + Math.floor(random() * 10) - 5),
      note: idx === 3 ? "Cập nhật lô hàng mới" : undefined
    }))

    // Sinh keywords động
    const keywords = [
      { label: TOPICS_POOL[Math.floor(random() * TOPICS_POOL.length)], percent: 70 + Math.floor(random() * 25) },
      { label: TOPICS_POOL[Math.floor(random() * TOPICS_POOL.length)], percent: 50 + Math.floor(random() * 20) },
      { label: TOPICS_POOL[Math.floor(random() * TOPICS_POOL.length)], percent: 30 + Math.floor(random() * 15) },
    ]

    return HttpResponse.json({
      success: true,
      data: {
        ...crmSentimentAnalysisMock,
        productName: product.name,
        sku: product.variants[0]?.internalSku || 'N/A',
        timeline,
        totalReviews: 100 + Math.floor(random() * 1000),
        reviews: filteredReviews,
        platformBreakdown,
        keywords,
        sentimentScore: timeline[timeline.length - 1].score,
        scoreTarget: 90,
      },
    })
  }),

  http.post('/api/crm/sentiment-analysis/reviews/:id/reply', async ({ params, request }) => {
    const payload = (await request.json()) as {
      content?: string
      tone?: 'important' | 'friendly'
      isDraft?: boolean
    }

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        isReplied: !payload.isDraft,
        reply: {
          id: `reply-${params.id}-${Date.now()}`,
          content: payload.content,
          createdAt: new Date().toISOString(),
          tone: payload.tone,
          isDraft: payload.isDraft
        }
      },
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
