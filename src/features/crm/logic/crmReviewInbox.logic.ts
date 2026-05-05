import type {
  CRMReviewFilterStatus,
  CRMReviewItem,
  CRMReviewPlatform,
  CRMReviewSentiment,
  CRMReviewSort,
} from '@/types/crm.types'

export const crmReviewStatusTabs: Array<{
  id: CRMReviewFilterStatus
  label: string
  countKey: 'totalCount' | 'unrepliedCount' | 'negativeCount' | 'repliedCount'
}> = [
  { id: 'all', label: 'Tất cả', countKey: 'totalCount' },
  { id: 'unreplied', label: 'Chưa trả lời', countKey: 'unrepliedCount' },
  { id: 'negative', label: 'Tiêu cực', countKey: 'negativeCount' },
  { id: 'replied', label: 'Đã trả lời', countKey: 'repliedCount' },
]

export const crmReviewSortOptions: Array<{ id: CRMReviewSort; label: string }> = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'oldest', label: 'Cũ nhất' },
]

const platformStyles: Record<CRMReviewPlatform, string> = {
  shopee: 'bg-orange-50 text-orange-600',
  tiktok_shop: 'bg-slate-900 text-white',
  lazada: 'bg-blue-50 text-blue-700',
}

const sentimentStyles: Record<CRMReviewSentiment, string> = {
  negative: 'bg-indigo-50 text-indigo-700',
  neutral: 'bg-slate-100 text-slate-600',
  positive: 'bg-emerald-50 text-emerald-700',
}

export function getPlatformLabel(platform: CRMReviewPlatform) {
  if (platform === 'tiktok_shop') return 'TikTok'
  if (platform === 'lazada') return 'Lazada'
  return 'Shopee'
}

export function getPlatformBadgeClass(platform: CRMReviewPlatform) {
  return platformStyles[platform]
}

export function getSentimentLabel(sentiment: CRMReviewSentiment) {
  if (sentiment === 'negative') return 'Tiêu cực'
  if (sentiment === 'positive') return 'Tích cực'
  return 'Trung lập'
}

export function getSentimentClass(sentiment: CRMReviewSentiment) {
  return sentimentStyles[sentiment]
}

export function getReviewBorderClass(item: CRMReviewItem) {
  if (item.ai.sentiment === 'negative') return 'border-l-red-500'
  if (item.ai.sentiment === 'positive') return 'border-l-emerald-500'
  return 'border-l-slate-300'
}

export function formatTimeAgo(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const diffHours = Math.max(Math.floor(diffMs / (1000 * 60 * 60)), 0)

  if (diffHours < 1) return 'Vừa xong'
  if (diffHours < 24) return `${diffHours} giờ trước`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} ngày trước`
}

export function buildStars(rating: number) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)))
  return Array.from({ length: 5 }, (_, idx) => idx < safe)
}
