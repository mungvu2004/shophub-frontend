import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useCRUDActions, type ActionType } from '@/features/shared/hooks/useCRUDActions'
import { crmReviewInboxService } from '@/features/crm/services/crmReviewInboxService'
import { MESSAGES } from '@/constants/messages'
import type { CRMReviewDeleteResponse, CRMReviewFilterStatus, CRMReviewItem, CRMReviewSort } from '@/types/crm.types'

interface UseCRMReviewCRUDActionsCallbacks {
  onSuccess?: () => void
}

interface UseCRMReviewCRUDActionsReturn {
  isProcessing: boolean
  actionType: ActionType
  handleDelete: (reviewId: string) => Promise<void>
  handleTogglePriority: (reviewId: string, isPriority: boolean) => Promise<CRMReviewItem | undefined>
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
  const crudDelete = useCRUDActions<CRMReviewDeleteResponse>()
  const crudStatus = useCRUDActions<CRMReviewItem>()
  const crudReply = useCRUDActions<void>()

  const invalidateReviews = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'summary'] })
    void queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'list'] })
    void queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'list', filters] })
  }, [queryClient, filters])

  const handleDelete = useCallback(
    async (reviewId: string) => {
      await crudDelete.handleDelete(
        () => crmReviewInboxService.deleteReview(reviewId),
        {
          onSuccess: () => {
            invalidateReviews()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: MESSAGES.CRM.REVIEW.PROCESSING.DELETE,
          success: MESSAGES.CRM.REVIEW.SUCCESS.DELETE,
          error: MESSAGES.CRM.REVIEW.ERROR.DELETE,
        },
      )
    },
    [crudDelete, invalidateReviews, callbacks],
  )

  const handleTogglePriority = useCallback(
    async (reviewId: string, isPriority: boolean) => {
      const result = await crudStatus.handleStatusChange(
        () => crmReviewInboxService.togglePriority(reviewId, isPriority),
        {
          onSuccess: () => {
            invalidateReviews()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: MESSAGES.CRM.REVIEW.PROCESSING.MARK_READ,
          success: MESSAGES.CRM.REVIEW.SUCCESS.STATUS_CHANGE,
          error: MESSAGES.CRM.REVIEW.ERROR.MARK_READ,
        },
      )
      return result
    },
    [crudStatus, invalidateReviews, callbacks],
  )

  const handleReply = useCallback(
    async (payload: {
      reviewId: string
      content: string
      tone: 'important' | 'friendly'
      isDraft: boolean
    }) => {
      const messages = payload.isDraft
        ? {
            processing: MESSAGES.CRM.REVIEW.PROCESSING.DRAFT,
            success: MESSAGES.CRM.REVIEW.SUCCESS.DRAFT,
            error: MESSAGES.CRM.REVIEW.ERROR.DRAFT,
          }
        : {
            processing: MESSAGES.CRM.REVIEW.PROCESSING.REPLY,
            success: MESSAGES.CRM.REVIEW.SUCCESS.REPLY,
            error: MESSAGES.CRM.REVIEW.ERROR.REPLY,
          }

      await crudReply.handleUpdate(
        () => crmReviewInboxService.saveReply(payload),
        {
          onSuccess: () => {
            invalidateReviews()
            callbacks?.onSuccess?.()
          },
        },
        messages,
      )
    },
    [crudReply, invalidateReviews, callbacks],
  )

  const isProcessing = crudDelete.isProcessing || crudStatus.isProcessing || crudReply.isProcessing
  const actionType: ActionType =
    crudDelete.actionType ?? crudStatus.actionType ?? crudReply.actionType

  return useMemo(
    () => ({
      isProcessing,
      actionType,
      handleDelete,
      handleTogglePriority,
      handleReply,
    }),
    [isProcessing, actionType, handleDelete, handleTogglePriority, handleReply],
  )
}
