import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { type ActionType } from '@/features/shared/hooks/useCRUDActions'
import { crmReviewInboxService } from '@/features/crm/services/crmReviewInboxService'
import { useCRMEntityActions } from '@/features/crm/hooks/useCRMEntityActions'
import { MESSAGES } from '@/constants/messages'
import type { CRMReviewDeleteResponse, CRMReviewFilterStatus, CRMReviewItem, CRMReviewSort } from '@/types/crm.types'

type CRMReviewStatusChangeInput =
  | { reviewId: string; type: 'mark-read' }
  | { reviewId: string; type: 'priority'; isPriority: boolean }

type CRMReviewProcessingAction = 'reply' | 'draft' | 'delete' | 'mark-read' | 'priority' | null

interface UseCRMReviewCRUDActionsCallbacks {
  onSuccess?: () => void
}

interface UseCRMReviewCRUDActionsReturn {
  isProcessing: boolean
  actionType: ActionType
  processingReviewId: string | null
  processingAction: CRMReviewProcessingAction
  handleCreate: () => Promise<undefined>
  handleUpdate: (payload: {
    reviewId: string
    content: string
    tone: 'important' | 'friendly'
    isDraft: boolean
  }) => Promise<void | undefined>
  handleDelete: (reviewId: string) => Promise<CRMReviewDeleteResponse | undefined>
  handleStatusChange: (payload: CRMReviewStatusChangeInput) => Promise<CRMReviewItem | undefined>
  handleTogglePriority: (reviewId: string, isPriority: boolean) => Promise<CRMReviewItem | undefined>
  handleMarkRead: (reviewId: string) => Promise<CRMReviewItem | undefined>
  handleReply: (payload: {
    reviewId: string
    content: string
    tone: 'important' | 'friendly'
    isDraft: boolean
  }) => Promise<void>
}

export function useCRMReviewCRUDActions(
  filters: { status: CRMReviewFilterStatus; sort: CRMReviewSort },
  callbacks?: UseCRMReviewCRUDActionsCallbacks,
): UseCRMReviewCRUDActionsReturn {
  const queryClient = useQueryClient()

  const invalidateReviews = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'summary'] })
    void queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'list'] })
    void queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'list', filters] })
  }, [queryClient, filters])

  const actions = useCRMEntityActions<
    never,
    [],
    void,
    [{ reviewId: string; content: string; tone: 'important' | 'friendly'; isDraft: boolean }],
    CRMReviewDeleteResponse,
    [string],
    CRMReviewItem,
    [CRMReviewStatusChangeInput]
  >({
    update: {
      action: (payload) => crmReviewInboxService.saveReply(payload),
      messages: {
        processing: MESSAGES.CRM.REVIEW.PROCESSING.REPLY,
        success: MESSAGES.CRM.REVIEW.SUCCESS.REPLY,
        error: MESSAGES.CRM.REVIEW.ERROR.REPLY,
      },
    },
    delete: {
      action: (reviewId) => crmReviewInboxService.deleteReview(reviewId),
      messages: {
        processing: MESSAGES.CRM.REVIEW.PROCESSING.DELETE,
        success: MESSAGES.CRM.REVIEW.SUCCESS.DELETE,
        error: MESSAGES.CRM.REVIEW.ERROR.DELETE,
      },
    },
    statusChange: {
      action: (payload) => {
        if (payload.type === 'priority') {
          return crmReviewInboxService.togglePriority(payload.reviewId, payload.isPriority)
        }

        return crmReviewInboxService.markRead(payload.reviewId)
      },
      messages: {
        processing: MESSAGES.CRM.REVIEW.PROCESSING.MARK_READ,
        success: MESSAGES.CRM.REVIEW.SUCCESS.MARK_READ,
        error: MESSAGES.CRM.REVIEW.ERROR.MARK_READ,
      },
    },
    callbacks: {
      onSuccess: () => {
        invalidateReviews()
        callbacks?.onSuccess?.()
      },
    },
  })

  const processingReviewId = null
  const processingAction: CRMReviewProcessingAction = null

  const handleReply = useCallback(
    async (payload: {
      reviewId: string
      content: string
      tone: 'important' | 'friendly'
      isDraft: boolean
    }) => actions.handleUpdate(payload),
    [actions],
  )

  const handleTogglePriority = useCallback(
    async (reviewId: string, isPriority: boolean) =>
      actions.handleStatusChange({ reviewId, type: 'priority', isPriority }),
    [actions],
  )

  const handleMarkRead = useCallback(
    async (reviewId: string) => actions.handleStatusChange({ reviewId, type: 'mark-read' }),
    [actions],
  )

  return useMemo(
    () => ({
      isProcessing: actions.isProcessing,
      actionType: actions.actionType,
      processingReviewId,
      processingAction,
      handleCreate: actions.handleCreate,
      handleUpdate: actions.handleUpdate,
      handleDelete: actions.handleDelete,
      handleStatusChange: actions.handleStatusChange,
      handleTogglePriority,
      handleMarkRead,
      handleReply,
    }),
    [actions, processingReviewId, processingAction, handleTogglePriority, handleMarkRead, handleReply],
  )
}
