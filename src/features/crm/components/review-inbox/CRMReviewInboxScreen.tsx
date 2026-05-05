import { useCallback, useMemo, useState } from 'react'

import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { CRMReviewFilterBar } from '@/features/crm/components/review-inbox/CRMReviewFilterBar'
import { CRMReviewInboxHeader } from '@/features/crm/components/review-inbox/CRMReviewInboxHeader'
import { CRMReplyComposerPanel } from '@/features/crm/components/review-inbox/CRMReplyComposerPanel'
import { CRMReviewList } from '@/features/crm/components/review-inbox/CRMReviewList'
import { CRMWeeklyInsightCard } from '@/features/crm/components/review-inbox/CRMWeeklyInsightCard'
import {
  useCRMReplyTemplates,
  useCRMReviewInboxList,
  useCRMReviewInboxSummary,
} from '@/features/crm/hooks/useCRMReviewInbox'
import { useCRMReviewCRUDActions } from '@/features/crm/hooks/useCRMReviewCRUDActions'
import { useProductData } from '@/features/products/hooks/useProductData'
import { MESSAGES } from '@/constants/messages'
import type { CRMReplyTemplate, CRMReviewFilterStatus, CRMReviewSort } from '@/types/crm.types'

export function CRMReviewInboxScreen() {
  useProductData({ autoPreload: false, pageName: 'CRMReviewInboxPage' })

  const [status, setStatus] = useState<CRMReviewFilterStatus>('unreplied')
  const [sort, setSort] = useState<CRMReviewSort>('newest')
  const [selectedReviewIdState, setSelectedReviewIdState] = useState<string>()
  const [replyDraftByReviewId, setReplyDraftByReviewId] = useState<Record<string, string>>({})
  const [selectedTone, setSelectedTone] = useState<'important' | 'friendly'>('important')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [replyMode, setReplyMode] = useState<'send' | 'draft' | null>(null)
  const [markReadTargetId, setMarkReadTargetId] = useState<string | null>(null)

  const summaryQuery = useCRMReviewInboxSummary()
  const listQuery = useCRMReviewInboxList({ status, sort })

  const selectedReviewId = useMemo(() => {
    if (!listQuery.data?.length) return undefined
    const hasSelected = listQuery.data.some((item) => item.id === selectedReviewIdState)
    return hasSelected ? selectedReviewIdState : listQuery.data[0].id
  }, [listQuery.data, selectedReviewIdState])

  const selectedReview = useMemo(
    () => listQuery.data?.find((item) => item.id === selectedReviewId) ?? null,
    [listQuery.data, selectedReviewId],
  )

  const replyContent = useMemo(() => {
    if (!selectedReviewId) return ''
    const localDraft = replyDraftByReviewId[selectedReviewId]
    if (typeof localDraft === 'string') return localDraft
    if (selectedReview?.reply?.isDraft) return selectedReview.reply.content
    return ''
  }, [replyDraftByReviewId, selectedReview, selectedReviewId])

  const templatesQuery = useCRMReplyTemplates(selectedReviewId)

  const reviewCRUD = useCRMReviewCRUDActions(
    { status, sort },
    {
      onSuccess: () => {
        setDeleteTargetId(null)
        setMarkReadTargetId(null)
        setReplyMode(null)
      },
    },
  )

  const handleTemplateClick = useCallback(
    (template: CRMReplyTemplate) => {
      if (!selectedReviewId) return
      setReplyDraftByReviewId((prev) => ({ ...prev, [selectedReviewId]: template.content }))
    },
    [selectedReviewId],
  )

  const handleSaveReply = useCallback(
    async (isDraft: boolean) => {
      if (!selectedReviewId || !replyContent.trim()) return
      setReplyMode(isDraft ? 'draft' : 'send')
      try {
        await reviewCRUD.handleReply({
          reviewId: selectedReviewId,
          content: replyContent,
          tone: selectedTone,
          isDraft,
        })
        if (!isDraft) {
          setReplyDraftByReviewId((prev) => ({ ...prev, [selectedReviewId]: '' }))
        }
      } finally {
        setReplyMode(null)
      }
    },
    [selectedReviewId, replyContent, selectedTone, reviewCRUD],
  )

  const handleMarkRead = useCallback(
    async (reviewId: string) => {
      setMarkReadTargetId(reviewId)
      try {
        await reviewCRUD.handleMarkRead(reviewId)
      } finally {
        setMarkReadTargetId(null)
      }
    },
    [reviewCRUD],
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return
    await reviewCRUD.handleDelete(deleteTargetId)
    if (selectedReviewIdState === deleteTargetId) setSelectedReviewIdState(undefined)
  }, [deleteTargetId, reviewCRUD, selectedReviewIdState])

  const isSending = reviewCRUD.isProcessing && reviewCRUD.actionType === 'updating' && replyMode === 'send'
  const isDraftSaving = reviewCRUD.isProcessing && reviewCRUD.actionType === 'updating' && replyMode === 'draft'

  return (
    <div className="space-y-6 pb-6">
      <CRMReviewInboxHeader summary={summaryQuery.data?.summary ?? null} />

      <CRMReviewFilterBar
        status={status}
        sort={sort}
        summary={summaryQuery.data?.summary ?? null}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <CRMReviewList
            items={listQuery.data ?? []}
            isLoading={listQuery.isLoading}
            selectedReviewId={selectedReviewId}
            deletingReviewId={reviewCRUD.isProcessing && reviewCRUD.actionType === 'deleting' ? (deleteTargetId ?? undefined) : undefined}
            markReadingReviewId={reviewCRUD.isProcessing && reviewCRUD.actionType === 'status-changing' ? (markReadTargetId ?? undefined) : undefined}
            onSelect={setSelectedReviewIdState}
            onMarkRead={(reviewId) => void handleMarkRead(reviewId)}
            onDelete={(reviewId) => setDeleteTargetId(reviewId)}
          />
        </div>

        <div className="space-y-5 xl:col-span-5">
          <CRMReplyComposerPanel
            selectedReview={selectedReview}
            templates={templatesQuery.data ?? []}
            content={replyContent}
            selectedTone={selectedTone}
            isPending={isSending}
            isSavingDraft={isDraftSaving}
            onTemplateClick={handleTemplateClick}
            onContentChange={(value) => {
              if (!selectedReviewId) return
              setReplyDraftByReviewId((prev) => ({ ...prev, [selectedReviewId]: value }))
            }}
            onToneChange={setSelectedTone}
            onSaveDraft={() => void handleSaveReply(true)}
            onSend={() => void handleSaveReply(false)}
          />

          <CRMWeeklyInsightCard insight={summaryQuery.data?.weeklyInsight ?? null} />
        </div>
      </section>

      <ConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null) }}
        title={MESSAGES.CRM.REVIEW.CONFIRM.DELETE_TITLE}
        description={MESSAGES.CRM.REVIEW.CONFIRM.DELETE_DESC}
        confirmText={MESSAGES.CRM.REVIEW.BUTTON.DELETE}
        onConfirm={handleDeleteConfirm}
        isConfirming={reviewCRUD.isProcessing && reviewCRUD.actionType === 'deleting'}
        variant="danger"
      />
    </div>
  )
}
