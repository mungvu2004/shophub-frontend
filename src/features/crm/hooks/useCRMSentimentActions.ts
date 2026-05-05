import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { type ActionType } from '@/features/shared/hooks/useCRUDActions'
import { crmSentimentAnalysisService } from '@/features/crm/services/crmSentimentAnalysisService'
import { useCRMEntityActions } from '@/features/crm/hooks/useCRMEntityActions'
import { MESSAGES } from '@/constants/messages'
import type { CRMSentimentReviewItem } from '@/types/crm.types'

type CRMSentimentRunResult = {
  productId: string
  status: 'running' | 'completed'
}

type CRMSentimentProcessingAction = 'reply' | 'run-analysis' | null

interface UseCRMSentimentActionsCallbacks {
  onSuccess?: () => void
}

interface UseCRMSentimentActionsReturn {
  isProcessing: boolean
  actionType: ActionType
  processingAction: CRMSentimentProcessingAction
  processingReviewId: string | null
  handleCreate: () => Promise<undefined>
  handleUpdate: (payload: {
    reviewId: string
    content: string
    tone: 'important' | 'friendly'
    isDraft: boolean
  }) => Promise<CRMSentimentReviewItem | undefined>
  handleDelete: () => Promise<undefined>
  handleStatusChange: (productId: string) => Promise<CRMSentimentRunResult | undefined>
  handleReply: (payload: {
    reviewId: string
    content: string
    tone: 'important' | 'friendly'
    isDraft: boolean
  }) => Promise<CRMSentimentReviewItem | undefined>
  handleRunAnalysis: (productId: string) => Promise<CRMSentimentRunResult | undefined>
}

export function useCRMSentimentActions(
  callbacks?: UseCRMSentimentActionsCallbacks,
): UseCRMSentimentActionsReturn {
  const queryClient = useQueryClient()

  const invalidateSentiment = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['crm', 'sentiment-analysis'] })
  }, [queryClient])

  const actions = useCRMEntityActions<
    never,
    [],
    CRMSentimentReviewItem,
    [{ reviewId: string; content: string; tone: 'important' | 'friendly'; isDraft: boolean }],
    never,
    [],
    CRMSentimentRunResult,
    [string]
  >({
    update: {
      action: (payload) => crmSentimentAnalysisService.sendReply(payload),
      messages: {
        processing: MESSAGES.CRM.SENTIMENT.PROCESSING.REPLY,
        success: MESSAGES.CRM.SENTIMENT.SUCCESS.REPLY,
        error: MESSAGES.CRM.SENTIMENT.ERROR.REPLY,
      },
    },
    statusChange: {
      action: (productId) => crmSentimentAnalysisService.runAnalysis(productId),
      messages: {
        processing: MESSAGES.CRM.SENTIMENT.PROCESSING.RUN_ANALYSIS,
        success: MESSAGES.CRM.SENTIMENT.SUCCESS.RUN_ANALYSIS,
        error: MESSAGES.CRM.SENTIMENT.ERROR.RUN_ANALYSIS,
      },
    },
    callbacks: {
      onSuccess: () => {
        invalidateSentiment()
        callbacks?.onSuccess?.()
      },
    },
  })

  const handleReply = useCallback(
    async (payload: {
      reviewId: string
      content: string
      tone: 'important' | 'friendly'
      isDraft: boolean
    }) => actions.handleUpdate(payload),
    [actions],
  )

  const handleRunAnalysis = useCallback(
    async (productId: string) => actions.handleStatusChange(productId),
    [actions],
  )

  return useMemo(
    () => ({
      isProcessing: actions.isProcessing,
      actionType: actions.actionType,
      processingAction: null,
      processingReviewId: null,
      handleCreate: actions.handleCreate,
      handleUpdate: actions.handleUpdate,
      handleDelete: actions.handleDelete,
      handleStatusChange: actions.handleStatusChange,
      handleReply,
      handleRunAnalysis,
    }),
    [actions, handleReply, handleRunAnalysis],
  )
}
