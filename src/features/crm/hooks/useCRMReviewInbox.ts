import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { crmReviewInboxService } from '@/features/crm/services/crmReviewInboxService'
import type { CRMReviewFilterStatus, CRMReviewSort } from '@/types/crm.types'

export function useCRMReviewInboxSummary() {
  return useQuery({
    queryKey: ['crm', 'review-inbox', 'summary'],
    queryFn: () => crmReviewInboxService.getSummary(),
    staleTime: 2 * 60 * 1000,
  })
}

export function useCRMReviewInboxList(filters: {
  status: CRMReviewFilterStatus
  sort: CRMReviewSort
}) {
  return useQuery({
    queryKey: ['crm', 'review-inbox', 'list', filters],
    queryFn: () => crmReviewInboxService.getReviewInbox(filters),
    staleTime: 60 * 1000,
  })
}

export function useCRMReplyTemplates(reviewId?: string) {
  return useQuery({
    queryKey: ['crm', 'review-inbox', 'templates', reviewId],
    queryFn: () => crmReviewInboxService.getReplyTemplates(reviewId ?? ''),
    enabled: Boolean(reviewId),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCRMReviewActions(filters: {
  status: CRMReviewFilterStatus
  sort: CRMReviewSort
}) {
  const queryClient = useQueryClient()

  const syncReviewInboxQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'summary'] })
    queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'list'] })
    queryClient.invalidateQueries({ queryKey: ['crm', 'review-inbox', 'list', filters] })
  }

  const markReadMutation = useMutation({
    mutationFn: (reviewId: string) => crmReviewInboxService.markRead(reviewId),
    onSuccess: syncReviewInboxQueries,
  })

  const sendReplyMutation = useMutation({
    mutationFn: (payload: {
      reviewId: string
      content: string
      tone: 'important' | 'friendly'
      isDraft: boolean
    }) => crmReviewInboxService.saveReply(payload),
    onSuccess: syncReviewInboxQueries,
  })

  return {
    markReadMutation,
    sendReplyMutation,
  }
}
