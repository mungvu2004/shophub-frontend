import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useCRUDActions, type ActionType } from '@/features/shared/hooks/useCRUDActions'
import { crmSentimentAnalysisService } from '@/features/crm/services/crmSentimentAnalysisService'
import { MESSAGES } from '@/constants/messages'
import type { CRMSentimentReviewItem } from '@/types/crm.types'

interface UseCRMSentimentActionsCallbacks {
  onSuccess?: () => void
}

interface UseCRMSentimentActionsReturn {
  isProcessing: boolean
  actionType: ActionType
  handleReply: (payload: {
    reviewId: string
    content: string
    tone: 'important' | 'friendly'
    isDraft: boolean
  }) => Promise<CRMSentimentReviewItem | undefined>
}

export function useCRMSentimentActions(
  callbacks?: UseCRMSentimentActionsCallbacks,
): UseCRMSentimentActionsReturn {
  const queryClient = useQueryClient()
  const crud = useCRUDActions<CRMSentimentReviewItem>()

  const invalidateSentiment = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['crm', 'sentiment-analysis'] })
  }, [queryClient])

  const handleReply = useCallback(
    async (payload: {
      reviewId: string
      content: string
      tone: 'important' | 'friendly'
      isDraft: boolean
    }) => {
      const messages = payload.isDraft
        ? {
            processing: MESSAGES.CRM.SENTIMENT.PROCESSING.REPLY,
            success: MESSAGES.CRM.REVIEW.SUCCESS.DRAFT,
            error: MESSAGES.CRM.REVIEW.ERROR.DRAFT,
          }
        : {
            processing: MESSAGES.CRM.SENTIMENT.PROCESSING.REPLY,
            success: MESSAGES.CRM.SENTIMENT.SUCCESS.REPLY,
            error: MESSAGES.CRM.SENTIMENT.ERROR.REPLY,
          }

      const result = await crud.handleUpdate(
        () => crmSentimentAnalysisService.sendReply(payload),
        {
          onSuccess: () => {
            invalidateSentiment()
            callbacks?.onSuccess?.()
          },
        },
        messages,
      )
      return result
    },
    [crud, invalidateSentiment, callbacks],
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      handleReply,
    }),
    [crud.isProcessing, crud.actionType, handleReply],
  )
}
