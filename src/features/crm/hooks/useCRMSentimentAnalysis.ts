import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { crmSentimentAnalysisService } from '@/features/crm/services/crmSentimentAnalysisService'
import type {
  CRMSentimentAnalysisResponse,
  CRMSentimentReviewItem,
  CRMSentimentFilters,
} from '@/types/crm.types'

export function useCRMSentimentAnalysis(filters: CRMSentimentFilters) {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['crm', 'sentiment-analysis', filters.productId, filters.platform, filters.weekLabel] as const,
    queryFn: (): Promise<CRMSentimentAnalysisResponse> =>
      crmSentimentAnalysisService.getAnalysis(filters),
    staleTime: 5 * 60 * 1000,
  })

  return {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  }
}

export function useCRMSentimentAnalysisActions() {
  const queryClient = useQueryClient()

  const sendReplyMutation = useMutation({
    mutationFn: (payload: {
      reviewId: string
      content: string
      tone: 'important' | 'friendly'
      isDraft: boolean
    }): Promise<CRMSentimentReviewItem> => crmSentimentAnalysisService.sendReply(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'sentiment-analysis'] })
    },
  })

  return {
    sendReplyMutation,
  }
}
