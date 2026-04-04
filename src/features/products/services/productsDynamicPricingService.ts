import { apiClient } from '@/services/apiClient'
import type {
  DynamicPricingPayload,
  DynamicPricingRuleStatus,
} from '@/features/products/logic/productsDynamicPricing.types'

type DynamicPricingResponse = {
  data?: DynamicPricingPayload
} & Partial<DynamicPricingPayload>

type ApplyAllPricingResponse = {
  success: boolean
  appliedCount: number
  message: string
}

type UpdateRuleStatusResponse = {
  success: boolean
  ruleId: string
  status: DynamicPricingRuleStatus
  message: string
}

const fallbackPayload: DynamicPricingPayload = {
  subtitle: '',
  periodLabel: '30 ngay qua',
  totalSuggestions: 0,
  displayedSuggestions: 0,
  selectedProductName: '',
  rules: [],
  recommendations: [],
  historyPoints: [],
  historySummary: {
    lowestPrice: 0,
    averagePrice: 0,
  },
  insights: [],
}

const normalizePayload = (payload: DynamicPricingResponse): DynamicPricingPayload => {
  const source = payload.data ?? payload

  return {
    subtitle: source.subtitle ?? fallbackPayload.subtitle,
    periodLabel: source.periodLabel ?? fallbackPayload.periodLabel,
    totalSuggestions: source.totalSuggestions ?? fallbackPayload.totalSuggestions,
    displayedSuggestions: source.displayedSuggestions ?? fallbackPayload.displayedSuggestions,
    selectedProductName: source.selectedProductName ?? fallbackPayload.selectedProductName,
    rules: Array.isArray(source.rules) ? source.rules : fallbackPayload.rules,
    recommendations: Array.isArray(source.recommendations)
      ? source.recommendations
      : fallbackPayload.recommendations,
    historyPoints: Array.isArray(source.historyPoints) ? source.historyPoints : fallbackPayload.historyPoints,
    historySummary: source.historySummary ?? fallbackPayload.historySummary,
    insights: Array.isArray(source.insights) ? source.insights : fallbackPayload.insights,
  }
}

export const productsDynamicPricingService = {
  async getDynamicPricingData(): Promise<DynamicPricingPayload> {
    const response = await apiClient.get<DynamicPricingResponse>('/products/dynamic-pricing')
    return normalizePayload(response.data)
  },

  async applyAllRecommendedPrices(): Promise<ApplyAllPricingResponse> {
    const response = await apiClient.post<ApplyAllPricingResponse>('/products/dynamic-pricing/apply-all')
    return response.data
  },

  async updateRuleStatus(ruleId: string, isActive: boolean): Promise<UpdateRuleStatusResponse> {
    const response = await apiClient.patch<UpdateRuleStatusResponse>(`/products/dynamic-pricing/rules/${ruleId}`, {
      isActive,
    })
    return response.data
  },
}
