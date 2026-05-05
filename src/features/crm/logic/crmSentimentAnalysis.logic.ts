import { getPlatformBadgeClass, getPlatformLabel } from '@/features/crm/logic/crmReviewInbox.logic'
import type {
  CRMSentimentAnalysisResponse,
  CRMSentimentReviewItem,
  CRMSentimentTrendPoint,
} from '@/types/crm.types'

const numberFormatter = new Intl.NumberFormat('vi-VN')

const sentimentMeta = {
  positive: {
    label: 'Tích cực',
    toneClass: 'bg-[#d1fae5] text-[#047857]',
    borderClass: 'border-l-[#10b981]',
  },
  neutral: {
    label: 'Trung lập',
    toneClass: 'bg-[#f1f5f9] text-[#475569]',
    borderClass: 'border-l-[#cbd5e1]',
  },
  negative: {
    label: 'Tiêu cực',
    toneClass: 'bg-[#fee2e2] text-[#b91c1c]',
    borderClass: 'border-l-[#f43f5e]',
  },
} as const

export function formatReviewTimestamp(isoDate: string) {
  const date = new Date(isoDate)
  const time = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
  const day = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  return `${time} • ${day}`
}

export function buildStars(rating: number) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)))
  return Array.from({ length: 5 }, (_, index) => index < safe)
}

function mapReview(review: CRMSentimentReviewItem) {
  const sentiment = sentimentMeta[review.sentiment]

  return {
    ...review,
    platformLabel: getPlatformLabel(review.platform),
    platformClass: getPlatformBadgeClass(review.platform),
    sentimentLabel: sentiment.label,
    sentimentClass: sentiment.toneClass,
    borderClass: sentiment.borderClass,
    stars: buildStars(review.rating),
    timeLabel: formatReviewTimestamp(review.createdAt),
    topicsLabel: review.topics.join(', '),
    actionLabel: review.isReplied ? 'XEM PHẢN HỒI' : review.responseLabel,
  }
}

function buildFallbackPlatformBreakdown(data: CRMSentimentAnalysisResponse) {
  const counts = data.reviews.reduce(
    (accumulator, review) => {
      accumulator.all += 1
      accumulator[review.platform] += 1
      return accumulator
    },
    {
      all: 0,
      shopee: 0,
      lazada: 0,
      tiktok_shop: 0,
    },
  )

  return [
    { id: 'all' as const, label: 'Tất cả', value: data.totalReviews || counts.all },
    { id: 'shopee' as const, label: 'Shopee', value: counts.shopee },
    { id: 'lazada' as const, label: 'Lazada', value: counts.lazada },
    { id: 'tiktok_shop' as const, label: 'TikTok', value: counts.tiktok_shop },
  ]
}

export function buildCRMSentimentAnalysisViewModel(data: CRMSentimentAnalysisResponse) {
  const platformBreakdown = data.platformBreakdown.length
    ? data.platformBreakdown
    : buildFallbackPlatformBreakdown(data)

  return {
    breadcrumbLabel: data.breadcrumbLabel,
    backLabel: data.backLabel,
    title: data.productName,
    subtitle: data.subtitle,
    sku: data.sku,
    skuLabel: `SKU: ${data.sku}`,
    reportButtonLabel: data.reportButtonLabel,
    compareButtonLabel: data.compareButtonLabel,
    totalReviews: data.totalReviews,
    chart: {
      title: data.chartTitle,
      description: data.chartDescription,
      annotationLabel: data.chartAnnotationLabel,
      legend: data.chartLegend,
      points: data.timeline.map((point: CRMSentimentTrendPoint) => ({
        ...point,
        scoreLabel: String(point.score),
      })),
    },
    reviews: {
      title: data.reviewsTitle,
      totalPrefix: data.reviewsTotalPrefix,
      totalValue: numberFormatter.format(data.totalReviews),
      items: data.reviews.map(mapReview),
      emptyLabel: data.reviewsEmptyLabel,
    },
    insights: {
      title: data.insightsTitle,
      keywordTitle: data.keywordTitle,
      keywords: data.keywords,
      suggestionsTitle: data.suggestionsTitle,
      suggestions: data.suggestions,
      platformStats: platformBreakdown.map((item) => ({
        id: item.id,
        label: item.label,
        value: numberFormatter.format(item.value),
      })),
    },
    score: {
      label: data.sentimentScoreLabel,
      valueLabel: data.sentimentScore.toFixed(1),
      targetLabel: data.scoreTargetLabel,
      targetValueLabel: data.scoreTarget.toFixed(1),
      changeLabel: data.scoreChangeLabel,
      progressPercent: Math.min(Math.round((data.sentimentScore / data.scoreTarget) * 100), 100),
    },
  }
}

export type CRMSentimentAnalysisViewModel = ReturnType<typeof buildCRMSentimentAnalysisViewModel>