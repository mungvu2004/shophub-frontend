import { http, HttpResponse, delay } from 'msw'

import {
  buildCRMReviewSummary,
  crmReplyTemplatesBySentiment,
  crmReviewInboxMock,
  crmWeeklyInsightMock,
} from '@/mocks/data/crm'
import {
  buildCRMCustomerProfilesResponse,
  crmCustomerProfilesData,
} from '@/mocks/data/crmCustomerProfiles'
import { crmSentimentAnalysisMock } from '@/mocks/data/crmSentimentAnalysis'
import { mockProducts } from '@/mocks/data/products'
import type {
  CRMCustomerCreatePayload,
  CRMCustomerProfileDetail,
  CRMCustomerProfilesResponse,
  CRMCustomerSegmentKey,
  CRMCustomerUpdatePayload,
  CRMSentimentAnalysisResponse,
  CRMSentimentPlatformFilter,
  CRMSentimentReviewItem,
  CRMReviewFilterStatus,
  CRMReviewPlatform,
  CRMReviewSentiment,
  CRMReviewSort,
} from '@/types/crm.types'

type CRMReviewRecord = (typeof crmReviewInboxMock)[number] & { productId?: string }

const REVIEW_DELAY = {
  query: 400,
  mutate: 600,
  runAnalysis: 900,
} as const

const PLATFORM_LABELS: Record<CRMReviewPlatform, string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok_shop: 'TikTok',
}

const REVIEW_COMMENTS = [
  'Chất lượng tuyệt vời, đóng gói rất kỹ.',
  'Giao hàng nhanh hơn dự kiến, nhân viên tư vấn nhiệt tình.',
  'Màu sắc bên ngoài hơi đậm hơn hình một chút nhưng vẫn rất đẹp.',
  'Vải mặc mát, không bị xù lông sau khi giặt.',
  'Bảng size shop tư vấn rất chuẩn, mình mặc vừa in.',
  'Sản phẩm có vết chỉ thừa nhỏ, nhưng tổng thể vẫn rất tốt.',
  'Dùng một thời gian thấy rất bền, sẽ ủng hộ shop tiếp.',
  'Giao sai màu nhưng shop đã hỗ trợ đổi trả rất nhanh, hài lòng.',
]

const TOPICS_POOL = ['Chất liệu', 'Giao hàng', 'Giá cả', 'Đóng gói', 'Tư vấn', 'Độ bền', 'Màu sắc', 'Form dáng']

const CUSTOMER_SEGMENT_LABELS: Record<CRMCustomerSegmentKey, string> = {
  vip_gold: 'VIP Gold',
  regular_blue: 'Khách thường',
  at_risk_red: 'Có nguy cơ rời',
}

const seededRandom = (seed: string) => {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash)
  }

  return () => {
    hash = (hash * 16807) % 2147483647
    return (hash - 1) / 2147483646
  }
}

function ensureReviewProductId(review: CRMReviewRecord, fallbackProductId: string) {
  return review.productId ?? fallbackProductId
}

function getProductReviews(productId: string) {
  return crmReviewInboxMock.filter((review) => ensureReviewProductId(review, productId) === productId)
}

function buildDynamicProductReviews(productId: string): CRMReviewRecord[] {
  const random = seededRandom(productId)

  return Array.from({ length: 8 }, (_, idx) => {
    const sentiment: CRMReviewSentiment = random() > 0.6 ? 'positive' : random() > 0.3 ? 'neutral' : 'negative'
    const platform: CRMReviewPlatform = random() > 0.66 ? 'shopee' : random() > 0.33 ? 'lazada' : 'tiktok_shop'
    const createdAt = new Date(Date.now() - random() * 1_000_000_000).toISOString()

    return {
      id: `crm-sentiment-${productId}-${idx}`,
      platform,
      productId,
      rating: sentiment === 'positive' ? 5 : sentiment === 'neutral' ? 4 : 2,
      productName: mockProducts.find((product) => product.id === productId)?.name ?? 'Sản phẩm đang theo dõi',
      customerName: `Khách hàng ${Math.floor(random() * 1000)}`,
      customerMaskedPhone: '***',
      comment: REVIEW_COMMENTS[Math.floor(random() * REVIEW_COMMENTS.length)],
      createdAt,
      isPriority: sentiment === 'negative',
      isReplied: random() > 0.5,
      isRead: random() > 0.3,
      ai: {
        sentiment,
        confidence: 70 + Math.floor(random() * 25),
        topics: [TOPICS_POOL[Math.floor(random() * TOPICS_POOL.length)], TOPICS_POOL[Math.floor(random() * TOPICS_POOL.length)]],
      },
      reply:
        random() > 0.5
          ? {
              id: `reply-${productId}-${idx}`,
              content: 'Cảm ơn bạn đã phản hồi. Shop đã ghi nhận và sẽ cải thiện trải nghiệm.',
              tone: sentiment === 'negative' ? 'important' : 'friendly',
              isDraft: false,
              createdAt,
            }
          : undefined,
    }
  })
}

function ensureProductReviews(productId: string) {
  const existing = getProductReviews(productId)
  if (existing.length > 0) return existing

  const generated = buildDynamicProductReviews(productId)
  crmReviewInboxMock.unshift(...generated)
  return generated
}

function toSentimentReviewItem(review: CRMReviewRecord): CRMSentimentReviewItem {
  const createdAt = new Date(review.createdAt)
  const weekLabel = `W${Math.max(1, Math.min(8, 8 - Math.floor((Date.now() - createdAt.getTime()) / (7 * 24 * 60 * 60 * 1000))))}`

  return {
    id: review.id,
    platform: review.platform,
    weekLabel,
    customerName: review.customerName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    sentiment: review.ai.sentiment,
    confidence: review.ai.confidence,
    topics: review.ai.topics,
    responseLabel: 'Phản hồi',
    isReplied: review.isReplied,
    reply: review.reply,
  }
}

function buildSentimentTimeline(productId: string) {
  const random = seededRandom(productId)
  const baseScore = 65 + Math.floor(random() * 20)

  return Array.from({ length: 8 }, (_, idx) => ({
    weekLabel: `W${idx + 1}`,
    score: Math.min(100, baseScore + Math.floor(random() * 10) - 5),
    note: idx === 3 ? 'Cập nhật bảng size' : undefined,
  }))
}

function buildSentimentKeywords(items: CRMSentimentReviewItem[]) {
  const topicCount = new Map<string, number>()

  items.forEach((item) => {
    item.topics.forEach((topic) => {
      topicCount.set(topic, (topicCount.get(topic) ?? 0) + 1)
    })
  })

  const total = Math.max(items.length, 1)

  return [...topicCount.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([label, count]) => ({
      label,
      percent: Math.min(100, Math.round((count / total) * 100)),
    }))
}

function buildPlatformBreakdown(items: CRMSentimentReviewItem[]) {
  const countByPlatform = items.reduce(
    (accumulator, item) => {
      accumulator.all += 1
      accumulator[item.platform] += 1
      return accumulator
    },
    { all: 0, shopee: 0, lazada: 0, tiktok_shop: 0 },
  )

  return [
    { id: 'all' as const, label: 'Tất cả', value: countByPlatform.all },
    { id: 'shopee' as const, label: PLATFORM_LABELS.shopee, value: countByPlatform.shopee },
    { id: 'lazada' as const, label: PLATFORM_LABELS.lazada, value: countByPlatform.lazada },
    { id: 'tiktok_shop' as const, label: PLATFORM_LABELS.tiktok_shop, value: countByPlatform.tiktok_shop },
  ]
}

function buildSentimentSuggestions(items: CRMSentimentReviewItem[]) {
  const negatives = items.filter((item) => item.sentiment === 'negative').length
  const neutrals = items.filter((item) => item.sentiment === 'neutral').length
  const replied = items.filter((item) => item.isReplied).length

  return [
    `Ưu tiên xử lý ${negatives} đánh giá tiêu cực để giảm rủi ro rời bỏ.`,
    `Chuẩn hóa mẫu phản hồi cho ${neutrals} đánh giá trung lập để tăng chuyển đổi.`,
    `Duy trì tỷ lệ phản hồi ở mức ${items.length ? Math.round((replied / items.length) * 100) : 0}% bằng quy trình tự động hóa.`,
  ]
}

function buildSentimentResponse(productId: string, platform: CRMSentimentPlatformFilter, weekLabel?: string | null): CRMSentimentAnalysisResponse {
  const product = mockProducts.find((item) => item.id === productId) ?? mockProducts[0]
  const baseReviews = ensureProductReviews(product.id)
    .map(toSentimentReviewItem)
    .filter((review) => (platform === 'all' ? true : review.platform === platform))
    .filter((review) => (!weekLabel || weekLabel === 'all' ? true : review.weekLabel === weekLabel))
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())

  const timeline = buildSentimentTimeline(product.id)
  const sentimentScore = baseReviews.length
    ? Number(
        (
          baseReviews.reduce((sum, review) => {
            if (review.sentiment === 'positive') return sum + 100
            if (review.sentiment === 'neutral') return sum + 65
            return sum + 30
          }, 0) / baseReviews.length
        ).toFixed(1),
      )
    : 0

  return {
    ...crmSentimentAnalysisMock,
    productName: product.name,
    sku: product.variants[0]?.internalSku ?? 'N/A',
    totalReviews: baseReviews.length,
    reviews: baseReviews,
    platformBreakdown: buildPlatformBreakdown(baseReviews),
    timeline,
    keywords: buildSentimentKeywords(baseReviews),
    suggestions: buildSentimentSuggestions(baseReviews),
    sentimentScore,
    scoreTarget: 90,
    scoreChangeLabel: `${baseReviews.filter((review) => review.sentiment === 'positive').length} đánh giá tích cực trong kỳ`,
  }
}

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
    await delay(REVIEW_DELAY.query)
    const url = new URL(request.url)
    const productId = url.searchParams.get('productId') || mockProducts[0]?.id || 'prod-001'
    const weekFilter = url.searchParams.get('week')
    const platformFilterParam = (url.searchParams.get('platform') ?? 'all') as CRMSentimentPlatformFilter
    const platformFilter: CRMSentimentPlatformFilter = ['all', 'shopee', 'lazada', 'tiktok_shop'].includes(platformFilterParam)
      ? platformFilterParam
      : 'all'

    return HttpResponse.json({
      success: true,
      data: buildSentimentResponse(productId, platformFilter, weekFilter),
    })
  }),

  http.post('/api/crm/sentiment-analysis/run', async ({ request }) => {
    await delay(REVIEW_DELAY.runAnalysis)
    const payload = (await request.json()) as { productId?: string }

    return HttpResponse.json({
      success: true,
      data: {
        productId: payload.productId ?? mockProducts[0]?.id ?? 'prod-001',
        status: 'completed',
      },
    })
  }),

  http.post('/api/crm/sentiment-analysis/reviews/:id/reply', async ({ params, request }) => {
    await delay(REVIEW_DELAY.mutate)
    const payload = (await request.json()) as {
      content?: string
      tone?: 'important' | 'friendly'
      isDraft?: boolean
    }

    const review = crmReviewInboxMock.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy đánh giá' }, { status: 404 })
    }

    review.isReplied = !payload.isDraft
    review.reply = {
      id: `reply-${params.id}-${Date.now()}`,
      content: payload.content ?? '',
      createdAt: new Date().toISOString(),
      tone: payload.tone ?? 'important',
      isDraft: Boolean(payload.isDraft),
    }

    return HttpResponse.json({
      success: true,
      data: toSentimentReviewItem(review),
    })
  }),

  http.get('/api/crm/reviews/summary', async () => {
    await delay(REVIEW_DELAY.query)
    return HttpResponse.json({
      success: true,
      data: {
        summary: buildCRMReviewSummary(crmReviewInboxMock),
        weeklyInsight: crmWeeklyInsightMock,
      },
    })
  }),

  http.get('/api/crm/customer-profiles', async ({ request }) => {
    await delay(REVIEW_DELAY.query)
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

  http.post('/api/crm/customer-profiles', async ({ request }) => {
    await delay(REVIEW_DELAY.mutate)
    const payload = (await request.json()) as CRMCustomerCreatePayload

    if (!payload?.fullName?.trim()) {
      return HttpResponse.json({ success: false, message: 'Họ tên là bắt buộc' }, { status: 400 })
    }

    const newCustomer: CRMCustomerProfileDetail = {
      id: `cust-${Date.now()}`,
      customerCode: `KH-${String(crmCustomerProfilesData.length + 1).padStart(3, '0')}`,
      fullName: payload.fullName,
      maskedPhone: payload.maskedPhone || '***',
      email: payload.email || '',
      avatarUrl: `https://i.pravatar.cc/150?u=customer-${Date.now()}`,
      customerSinceLabel: new Date().toLocaleDateString('vi-VN'),
      segment: {
        id: payload.segment ?? 'regular_blue',
        label: CUSTOMER_SEGMENT_LABELS[payload.segment ?? 'regular_blue'],
        tone: payload.segment ?? 'regular_blue',
      },
      platformLabels: (payload.platformCodes ?? []).map((platform) => ({
        id: platform,
        label: PLATFORM_LABELS[platform],
        tone: (platform === 'tiktok_shop' ? 'tiktok' : platform) as 'lazada' | 'shopee' | 'tiktok',
      })),
      primaryCtaLabel: 'Gửi voucher cá nhân hóa',
      secondaryCtaLabel: 'Chỉnh sửa',
      stats: { totalOrders: 0, totalSpend: 0, lastOrderLabel: 'Chưa có đơn', averageOrderValue: 0 },
      lifecycle: [{ dateLabel: new Date().toLocaleDateString('vi-VN'), title: 'Đơn đầu tiên', isCurrent: true }],
      orders: [],
      notes: [],
      reviews: [],
      rfm: [
        { label: 'RECENCY', value: '0/10', progressPercent: 0 },
        { label: 'FREQUENCY', value: '0/10', progressPercent: 0 },
        { label: 'MONETARY', value: '0/10', progressPercent: 0 },
      ],
      insight: {
        title: 'Khách hàng mới',
        confidenceLabel: 'Chưa có dữ liệu',
        description: 'Khách hàng mới thêm vào hệ thống.',
        favoriteProductLabel: 'Chưa xác định',
        favoriteChannelLabel: 'Chưa xác định',
        churnRiskLabel: 'Thấp',
        churnRiskPercent: 5,
      },
    }

    crmCustomerProfilesData.push(newCustomer)

    return HttpResponse.json({ success: true, data: newCustomer })
  }),

  http.patch('/api/crm/customer-profiles/:id', async ({ params, request }) => {
    await delay(REVIEW_DELAY.mutate)
    const customer = crmCustomerProfilesData.find((item) => item.id === params.id)

    if (!customer) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy khách hàng' }, { status: 404 })
    }

    const payload = (await request.json()) as CRMCustomerUpdatePayload
    if (payload.fullName !== undefined) customer.fullName = payload.fullName
    if (payload.maskedPhone !== undefined) customer.maskedPhone = payload.maskedPhone
    if (payload.email !== undefined) customer.email = payload.email
    if (payload.platformCodes !== undefined) {
      customer.platformLabels = payload.platformCodes.map((platform) => ({
        id: platform,
        label: PLATFORM_LABELS[platform],
        tone: (platform === 'tiktok_shop' ? 'tiktok' : platform) as 'lazada' | 'shopee' | 'tiktok',
      }))
    }
    if (payload.segment !== undefined) {
      customer.segment = {
        id: payload.segment,
        label: CUSTOMER_SEGMENT_LABELS[payload.segment],
        tone: payload.segment,
      }
    }

    return HttpResponse.json({ success: true, data: customer })
  }),

  http.delete('/api/crm/customer-profiles/:id', async ({ params }) => {
    await delay(REVIEW_DELAY.mutate)
    const index = crmCustomerProfilesData.findIndex((item) => item.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy khách hàng' }, { status: 404 })
    }

    crmCustomerProfilesData.splice(index, 1)

    return HttpResponse.json({ success: true, data: { deletedId: params.id } })
  }),

  http.patch('/api/crm/customer-profiles/:id/segment', async ({ params, request }) => {
    await delay(REVIEW_DELAY.mutate)
    const customer = crmCustomerProfilesData.find((item) => item.id === params.id)

    if (!customer) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy khách hàng' }, { status: 404 })
    }

    const payload = (await request.json()) as { segment: CRMCustomerSegmentKey }

    customer.segment = {
      id: payload.segment,
      label: CUSTOMER_SEGMENT_LABELS[payload.segment],
      tone: payload.segment,
    }

    return HttpResponse.json({ success: true, data: customer })
  }),

  http.get('/api/crm/reviews/inbox', async ({ request }) => {
    await delay(REVIEW_DELAY.query)
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

  http.delete('/api/crm/reviews/:id', async ({ params }) => {
    await delay(REVIEW_DELAY.mutate)
    const index = crmReviewInboxMock.findIndex((item) => item.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy đánh giá' }, { status: 404 })
    }

    crmReviewInboxMock.splice(index, 1)

    return HttpResponse.json({ success: true, data: { deletedId: params.id } })
  }),

  http.patch('/api/crm/reviews/:id/priority', async ({ params, request }) => {
    await delay(REVIEW_DELAY.mutate)
    const review = crmReviewInboxMock.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy đánh giá' }, { status: 404 })
    }

    const payload = (await request.json()) as { isPriority: boolean }
    review.isPriority = payload.isPriority

    return HttpResponse.json({ success: true, data: review })
  }),

  http.get('/api/crm/reviews/:id/reply-templates', async ({ params }) => {
    await delay(REVIEW_DELAY.query)
    const review = crmReviewInboxMock.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy đánh giá' }, { status: 404 })
    }

    return HttpResponse.json({
      success: true,
      data: {
        items: crmReplyTemplatesBySentiment[review.ai.sentiment],
      },
    })
  }),

  http.post('/api/crm/reviews/:id/mark-read', async ({ params }) => {
    await delay(REVIEW_DELAY.mutate)
    const review = crmReviewInboxMock.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy đánh giá' }, { status: 404 })
    }

    review.isRead = true

    return HttpResponse.json({ success: true, data: review })
  }),

  http.post('/api/crm/reviews/:id/reply', async ({ params, request }) => {
    await delay(REVIEW_DELAY.mutate)
    const review = crmReviewInboxMock.find((item) => item.id === params.id)

    if (!review) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy đánh giá' }, { status: 404 })
    }

    const payload = (await request.json()) as {
      content: string
      tone: 'important' | 'friendly'
      isDraft: boolean
    }

    review.reply = {
      id: `reply-${params.id}-${Date.now()}`,
      content: payload.content,
      tone: payload.tone,
      isDraft: payload.isDraft,
      createdAt: new Date().toISOString(),
    }
    review.isReplied = !payload.isDraft
    review.isRead = true

    return HttpResponse.json({
      success: true,
      data: review,
    })
  }),
]