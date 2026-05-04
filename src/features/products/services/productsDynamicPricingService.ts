/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/services/apiClient'
import type {
  DynamicPricingPayload,
} from '@/features/products/logic/productsDynamicPricing.types'

const fallbackPayload: DynamicPricingPayload = {
  title: 'Định giá Động',
  subtitle: '',
  recommendationsTitle: 'Gợi ý giá AI - Chờ xác nhận',
  applyAllLabel: 'Áp dụng giá AI hàng loạt',
  historyLabel: 'Lịch sử thay đổi giá',
  periodLabel: '30 ngày qua',
  tableHeaders: {
    product: 'Sản phẩm',
    platform: 'Sàn',
    pricing: 'Phân tích giá',
    confidence: 'Độ tin cậy',
    actions: 'Xác nhận',
  },
  approveLabel: 'Duyệt',
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
  competitorGaps: [],
}

/**
 * Xử lý dữ liệu trả về từ API để đảm bảo luôn đúng cấu trúc DynamicPricingPayload.
 */
const mapResponseToPayload = (raw: any): DynamicPricingPayload => {
  const data = (raw && typeof raw === 'object' && 'success' in raw && 'data' in raw) ? raw.data : raw;

  if (!data || typeof data !== 'object') {
    return fallbackPayload
  }

  return {
    ...fallbackPayload,
    ...data,
    tableHeaders: {
      ...fallbackPayload.tableHeaders,
      ...(data.tableHeaders || {})
    },
    historySummary: {
      ...fallbackPayload.historySummary,
      ...(data.historySummary || {})
    },
    rules: Array.isArray(data.rules) ? data.rules : [],
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    historyPoints: Array.isArray(data.historyPoints) ? data.historyPoints : [],
    insights: Array.isArray(data.insights) ? data.insights : [],
    competitorGaps: Array.isArray(data.competitorGaps) ? data.competitorGaps : [],
  }
}

export const productsDynamicPricingService = {
  getDynamicPricingData: async (): Promise<DynamicPricingPayload> => {
    try {
      // Gỡ bỏ tiền tố /api vì baseURL đã có sẵn /api
      const response = await apiClient.get<any>('/products/dynamic-pricing')
      return mapResponseToPayload(response.data)
    } catch (error) {
      console.error('Lỗi khi gọi API Định giá động:', error)
      return fallbackPayload
    }
  },

  applyAllRecommendedPrices: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/products/dynamic-pricing/apply-all', {})
    return response.data
  },

  updateRuleStatus: async (
    ruleId: string,
    isActive: boolean,
  ): Promise<{ message: string; status: 'active' | 'inactive' }> => {
    const response = await apiClient.patch<{ message: string; status: 'active' | 'inactive' }>(
      `/products/dynamic-pricing/rules/${ruleId}`,
      { isActive },
    )
    return response.data
  },
}
