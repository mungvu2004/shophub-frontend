export type DynamicPricingPlatform = 'shopee' | 'tiktok_shop' | 'lazada'

export type DynamicPricingRuleStatus = 'active' | 'inactive'

export interface DynamicPricingRule {
  id: string
  title: string
  description: string
  icon: 'trend' | 'shield' | 'calendar'
  appliedProducts: number
  platforms: DynamicPricingPlatform[]
  tag?: string
  scheduleText?: string
  isActive: boolean
  status: DynamicPricingRuleStatus
}

export interface DynamicPricingRecommendation {
  id: string
  productId: string
  productName: string
  sku: string
  imageUrl: string
  platform: DynamicPricingPlatform
  currentPrice: number
  aiPrice: number
  changePercent: number
  reason: string
  confidence: number
}

export interface DynamicPricingHistoryPoint {
  dateLabel: string
  shopeePrice: number
  tiktokPrice: number
  lazadaPrice: number
  competitorAvgPrice: number
}

export interface DynamicPricingInsight {
  id: string
  tone: 'primary' | 'warning' | 'success'
  title: string
  value: string
  description: string
}

export interface DynamicPricingHistorySummary {
  lowestPrice: number
  averagePrice: number
}

export interface DynamicPricingCompetitorGap {
  platform: string
  gapPercent: number // Ví dụ: -5 nghĩa là giá mình thấp hơn đối thủ 5%
  competitorPrice: number
}

export interface DynamicPricingPayload {
  title: string
  subtitle: string
  recommendationsTitle: string
  applyAllLabel: string
  historyLabel: string
  periodLabel: string
  tableHeaders: {
    product: string
    platform: string
    pricing: string
    confidence: string
    actions: string
  }
  approveLabel: string
  totalSuggestions: number
  displayedSuggestions: number
  selectedProductName: string
  rules: DynamicPricingRule[]
  recommendations: DynamicPricingRecommendation[]
  historyPoints: DynamicPricingHistoryPoint[]
  historySummary: DynamicPricingHistorySummary
  insights: DynamicPricingInsight[]
  competitorGaps: DynamicPricingCompetitorGap[]
}

export interface DynamicPricingViewModel {
  isLoading: boolean
  isError: boolean
  isApplyingAll: boolean
  isTogglingRule: boolean
  errorMessage: string | null
  payload: DynamicPricingPayload
  onRetry: () => void
  onApplyAll: () => void
  onOpenHistory: () => void
  onOpenProductDetail: (productId: string) => void
  onToggleRule: (ruleId: string, nextActive: boolean) => void
}
