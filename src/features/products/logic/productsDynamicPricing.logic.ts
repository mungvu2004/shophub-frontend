import { useMemo, useState } from 'react'
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

const normalizeErrorMessage = (error: unknown): string => {
  if (!error) return 'Không thể tải dữ liệu định giá động'

  const apiError = error as Partial<ApiError>
  if (typeof apiError.message === 'string' && apiError.message.trim()) {
    return apiError.message
  }

  return 'Không thể tải dữ liệu định giá động'
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
    onError: (mutationError: unknown) => {
      const message = normalizeErrorMessage(mutationError)
      toast.error(message)
    },
  })
  const toggleRuleMutation = useMutation({
    mutationFn: ({ ruleId, isActive }: { ruleId: string; isActive: boolean }) =>
      productsDynamicPricingService.updateRuleStatus(ruleId, isActive),
    onSuccess: (result, variables) => {
      setRuleStatusById((prev) => ({
        ...prev,
        [variables.ruleId]: result.status,
      }))
      toast.success(result.message)
    },
    onError: (mutationError: unknown) => {
      const message = normalizeErrorMessage(mutationError)
      toast.error(message)
    },
  })

  const payload = useMemo(() => {
    if (!data) return fallbackPayload

    const rules = data.rules.map((rule) => {
      const status = ruleStatusById[rule.id] ?? rule.status
      return {
        ...rule,
        status,
        isActive: status === 'active',
      }
    })

    return {
      ...data,
      rules,
      recommendations: data.recommendations.slice(0, Math.max(data.displayedSuggestions, 0)),
    }
  }, [data, ruleStatusById])

  return {
    isLoading,
    isError,
    isApplyingAll: applyAllMutation.isPending,
    isTogglingRule: toggleRuleMutation.isPending,
    errorMessage: isError ? normalizeErrorMessage(error) : null,
    payload,
    onRetry: () => {
      void refetch()
    },
    onApplyAll: () => {
      if (applyAllMutation.isPending) return
      applyAllMutation.mutate()
    },
    onOpenHistory: () => {
      navigate('/products/competitor-tracking')
      toast.info('Đã chuyển sang màn hình lịch sử thay đổi giá')
    },
    onOpenProductDetail: (productId: string) => {
      const normalizedProductId = productId.trim()
      if (!normalizedProductId) return
      navigate(`/products/${normalizedProductId}`)
    },
    onToggleRule: (ruleId: string, nextActive: boolean) => {
      if (toggleRuleMutation.isPending) return

      const normalizedRuleId = ruleId.trim()
      if (!normalizedRuleId) return

      toggleRuleMutation.mutate({
        ruleId: normalizedRuleId,
        isActive: nextActive,
      })
    },
  }
}
