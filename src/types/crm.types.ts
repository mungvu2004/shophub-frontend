export type CRMReviewPlatform = 'shopee' | 'tiktok_shop' | 'lazada'

export type CRMReviewSentiment = 'positive' | 'neutral' | 'negative'

export type CRMReviewFilterStatus = 'all' | 'unreplied' | 'negative' | 'replied'

export type CRMReviewSort = 'newest' | 'oldest'

export type CRMReviewAiTag = {
  sentiment: CRMReviewSentiment
  confidence: number
  topics: string[]
}

export type CRMReviewReply = {
  id: string
  content: string
  tone: 'important' | 'friendly'
  isDraft: boolean
  createdAt: string
}

export type CRMReviewItem = {
  id: string
  platform: CRMReviewPlatform
  rating: number
  productName: string
  customerName: string
  customerMaskedPhone: string
  comment: string
  createdAt: string
  isPriority: boolean
  isReplied: boolean
  isRead: boolean
  ai: CRMReviewAiTag
  reply?: CRMReviewReply
}

export type CRMReviewInboxSummary = {
  replyRatePercent: number
  avgReplyHours: number
  trustScore: number
  totalCount: number
  unrepliedCount: number
  negativeCount: number
  repliedCount: number
}

export type CRMReplyTemplate = {
  id: string
  tone: 'important' | 'friendly'
  title: string
  content: string
}

export type CRMWeeklyInsight = {
  id: string
  title: string
  description: string
  ctaLabel: string
}

export type CRMCustomerProfileSegment = 'vip_gold' | 'regular_blue' | 'at_risk_red'

export type CRMCustomerProfileMetrics = {
  totalOrders: number
  totalSpend: number
  lastOrderLabel: string
  averageOrderValue: number
}

export type CRMCustomerProfileTag = {
  id: string
  label: string
  tone: CRMCustomerProfileSegment
}

export type CRMCustomerProfileListItem = {
  id: string
  customerCode: string
  fullName: string
  maskedPhone: string
  avatarUrl: string
  platformCodes: CRMReviewPlatform[]
  totalOrders: number
  totalSpend: number
  lastOrderLabel: string
  segment: CRMCustomerProfileTag
}

export type CRMCustomerProfileTimelinePoint = {
  dateLabel: string
  title: string
  subtitle?: string
  isCurrent?: boolean
}

export type CRMCustomerProfileOrder = {
  id: string
  orderCode: string
  dateLabel: string
  productName: string
  platform: CRMReviewPlatform
  amount: number
  statusLabel: string
  statusKey: 'completed' | 'returned'
  statusTone: 'success' | 'neutral'
}

export type CRMCustomerProfileNote = {
  id: string
  content: string
  createdAtLabel: string
  authorLabel: string
}

export type CRMCustomerProfileReview = {
  id: string
  sourceLabel: string
  rating: number
  content: string
  productName: string
  sentimentLabel: string
}

export type CRMCustomerProfileRfmMetric = {
  label: string
  value: string
  progressPercent: number
}

export type CRMCustomerProfileInsight = {
  title: string
  confidenceLabel: string
  description: string
  favoriteProductLabel: string
  favoriteChannelLabel: string
  churnRiskLabel: string
  churnRiskPercent: number
}

export type CRMCustomerProfileDetail = {
  id: string
  customerCode: string
  fullName: string
  maskedPhone: string
  email: string
  avatarUrl: string
  customerSinceLabel: string
  segment: CRMCustomerProfileTag
  platformLabels: Array<{
    id: CRMReviewPlatform
    label: string
    tone: 'lazada' | 'shopee' | 'tiktok'
  }>
  primaryCtaLabel: string
  secondaryCtaLabel: string
  stats: CRMCustomerProfileMetrics
  lifecycle: CRMCustomerProfileTimelinePoint[]
  orders: CRMCustomerProfileOrder[]
  notes: CRMCustomerProfileNote[]
  reviews: CRMCustomerProfileReview[]
  rfm: CRMCustomerProfileRfmMetric[]
  insight: CRMCustomerProfileInsight
}

export type CRMCustomerProfilesSummary = {
  totalCustomers: number
  totalOrders: number
  totalSpend: number
  averageOrderValue: number
  activePlatforms: number
}

export type CRMCustomerProfilesResponse = {
  summary: CRMCustomerProfilesSummary
  customers: CRMCustomerProfileListItem[]
  selectedCustomerId: string
  selectedCustomer: CRMCustomerProfileDetail | null
}

export type CRMSentimentPlatformFilter = 'all' | CRMReviewPlatform

export interface CRMSentimentFilters {
  productId: string
  platform: CRMSentimentPlatformFilter
  weekLabel: string
}

export type CRMSentimentTrendPoint = {
  weekLabel: string
  score: number
  note?: string
}

export type CRMSentimentReviewItem = {
  id: string
  platform: CRMReviewPlatform
  weekLabel: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
  sentiment: CRMReviewSentiment
  confidence: number
  topics: string[]
  responseLabel: string
  isReplied: boolean
  reply?: CRMReviewReply
}

export type CRMSentimentKeyword = {
  label: string
  percent: number
}

export type CRMSentimentAnalysisResponse = {
  productName: string
  sku: string
  subtitle: string
  breadcrumbLabel: string
  backLabel: string
  reportButtonLabel: string
  compareButtonLabel: string
  chartTitle: string
  chartDescription: string
  chartAnnotationLabel: string
  chartLegend: Array<{
    id: string
    label: string
    toneClass: string
  }>
  timeline: CRMSentimentTrendPoint[]
  totalReviews: number
  reviews: CRMSentimentReviewItem[]
  platformBreakdown: Array<{
    id: CRMSentimentPlatformFilter
    label: string
    value: number
  }>
  reviewsTotalPrefix: string
  reviewsTitle: string
  reviewsEmptyLabel: string
  insightsTitle: string
  keywordTitle: string
  keywords: CRMSentimentKeyword[]
  suggestionsTitle: string
  suggestions: string[]
  sentimentScoreLabel: string
  scoreTargetLabel: string
  sentimentScore: number
  scoreTarget: number
  scoreChangeLabel: string
}
