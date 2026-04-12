import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { crmSentimentAnalysisService } from '@/features/crm/services/crmSentimentAnalysisService'
import type {
  CRMSentimentAnalysisResponse,
  CRMSentimentPlatformFilter,
  CRMSentimentReviewItem,
} from '@/types/crm.types'

export function useCRMSentimentAnalysis(filters: {
  platform: CRMSentimentPlatformFilter
  weekLabel: string
}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['crm', 'sentiment-analysis', filters.platform, filters.weekLabel] as const,
    queryFn: (): Promise<CRMSentimentAnalysisResponse> =>
      crmSentimentAnalysisService.getAnalysis({
        platform: filters.platform,
        weekLabel: filters.weekLabel,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
  })

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
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