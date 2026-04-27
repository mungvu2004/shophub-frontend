import { useCallback, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

import { useProductsDynamicPricing } from '@/features/products/hooks/useProductsDynamicPricing'
import type {
  DynamicPricingPayload,
  DynamicPricingRuleStatus,
  DynamicPricingViewModel,
} from '@/features/products/logic/productsDynamicPricing.types'
import { productsDynamicPricingService } from '@/features/products/services/productsDynamicPricingService'
import type { ApiError } from '@/services/apiClient'

const fallbackPayload: DynamicPricingPayload = {
  title: 'Định giá Động',
  subtitle: 'Đang tải dữ liệu...',
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

const normalizeErrorMessage = (error: unknown): string => {
  if (!error) return 'Không thể tải dữ liệu định giá động'
  const apiError = error as Partial<ApiError>
  return typeof apiError.message === 'string' ? apiError.message : 'Không thể tải dữ liệu định giá động'
}

export const useProductsDynamicPricingPageLogic = (): DynamicPricingViewModel => {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useProductsDynamicPricing()
  const [ruleStatusById, setRuleStatusById] = useState<Record<string, DynamicPricingRuleStatus>>({})
  
  const applyAllMutation = useMutation({
    mutationFn: () => productsDynamicPricingService.applyAllRecommendedPrices(),
    onSuccess: (result) => {
      toast.success(result.message)
      void refetch()
    },
    onError: (err) => toast.error(normalizeErrorMessage(err)),
  })

  const toggleRuleMutation = useMutation({
    mutationFn: ({ ruleId, isActive }: { ruleId: string; isActive: boolean }) =>
      productsDynamicPricingService.updateRuleStatus(ruleId, isActive),
    onSuccess: (result, variables) => {
      setRuleStatusById((prev) => ({ ...prev, [variables.ruleId]: result.status }))
      toast.success(result.message)
    },
    onError: (err) => toast.error(normalizeErrorMessage(err)),
  })

  const payload = useMemo(() => {
    if (!data) return fallbackPayload

    const rules = (data.rules || []).map((rule) => {
      const status = ruleStatusById[rule.id] ?? rule.status
      return { ...rule, status, isActive: status === 'active' }
    })

    const recommendations = Array.isArray(data.recommendations) ? data.recommendations : []
    const displayedCount = Number(data.displayedSuggestions) || recommendations.length

    return {
      ...fallbackPayload,
      ...data,
      rules,
      recommendations: recommendations.slice(0, Math.max(displayedCount, 10)),
    }
  }, [data, ruleStatusById])

  const onRetry = useCallback(() => { void refetch() }, [refetch])
  const onApplyAll = useCallback(() => { 
    if (!applyAllMutation.isPending) applyAllMutation.mutate() 
  }, [applyAllMutation])
  const onOpenHistory = useCallback(() => {
    navigate('/products/competitor-tracking')
  }, [navigate])
  const onOpenProductDetail = useCallback((productId: string) => {
    if (productId.trim()) navigate(`/products/${productId.trim()}`)
  }, [navigate])
  const onToggleRule = useCallback((ruleId: string, nextActive: boolean) => {
    if (!toggleRuleMutation.isPending) toggleRuleMutation.mutate({ ruleId, isActive: nextActive })
  }, [toggleRuleMutation])

  return useMemo(() => ({
    isLoading,
    isError,
    isApplyingAll: applyAllMutation.isPending,
    isTogglingRule: toggleRuleMutation.isPending,
    errorMessage: isError ? normalizeErrorMessage(error) : null,
    payload,
    onRetry,
    onApplyAll,
    onOpenHistory,
    onOpenProductDetail,
    onToggleRule,
  }), [isLoading, isError, applyAllMutation.isPending, toggleRuleMutation.isPending, error, payload, onRetry, onApplyAll, onOpenHistory, onOpenProductDetail, onToggleRule])
}
