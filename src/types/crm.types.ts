export type CRMReviewPlatform = 'shopee' | 'tiktok' | 'lazada'

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
