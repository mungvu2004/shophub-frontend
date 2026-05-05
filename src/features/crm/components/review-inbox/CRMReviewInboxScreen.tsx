import { useMemo, useState } from 'react'

import { CRMReviewFilterBar } from '@/features/crm/components/review-inbox/CRMReviewFilterBar'
import { CRMReviewInboxHeader } from '@/features/crm/components/review-inbox/CRMReviewInboxHeader'
import { CRMReplyComposerPanel } from '@/features/crm/components/review-inbox/CRMReplyComposerPanel'
import { CRMReviewList } from '@/features/crm/components/review-inbox/CRMReviewList'
import { CRMWeeklyInsightCard } from '@/features/crm/components/review-inbox/CRMWeeklyInsightCard'
import {
  useCRMReplyTemplates,
  useCRMReviewActions,
  useCRMReviewInboxList,
  useCRMReviewInboxSummary,
} from '@/features/crm/hooks/useCRMReviewInbox'
import { useProductData } from '@/features/products/hooks/useProductData'
import type { CRMReplyTemplate, CRMReviewFilterStatus, CRMReviewSort } from '@/types/crm.types'

export function CRMReviewInboxScreen() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'CRMReviewInboxPage',
  })

  const [status, setStatus] = useState<CRMReviewFilterStatus>('unreplied')
  const [sort, setSort] = useState<CRMReviewSort>('newest')
  const [selectedReviewIdState, setSelectedReviewIdState] = useState<string>()
  const [replyDraftByReviewId, setReplyDraftByReviewId] = useState<Record<string, string>>({})
  const [selectedTone, setSelectedTone] = useState<'important' | 'friendly'>('important')

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
  const { markReadMutation, sendReplyMutation } = useCRMReviewActions({ status, sort })

  const handleTemplateClick = (template: CRMReplyTemplate) => {
    if (!selectedReviewId) return

    setReplyDraftByReviewId((prev) => ({
      ...prev,
      [selectedReviewId]: template.content,
    }))
  }

  const handleSaveReply = (isDraft: boolean) => {
    if (!selectedReviewId || !replyContent.trim()) return

    sendReplyMutation.mutate(
      {
        reviewId: selectedReviewId,
        content: replyContent,
        tone: selectedTone,
        isDraft,
      },
      {
        onSuccess: () => {
          if (!isDraft) {
            setReplyDraftByReviewId((prev) => ({
              ...prev,
              [selectedReviewId]: '',
            }))
          }
        },
      },
    )
  }

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
            onSelect={setSelectedReviewIdState}
            onMarkRead={(reviewId) => markReadMutation.mutate(reviewId)}
          />
        </div>

        <div className="space-y-5 xl:col-span-5">
          <CRMReplyComposerPanel
            selectedReview={selectedReview}
            templates={templatesQuery.data ?? []}
            content={replyContent}
            selectedTone={selectedTone}
            isPending={sendReplyMutation.isPending}
            onTemplateClick={handleTemplateClick}
            onContentChange={(value) => {
              if (!selectedReviewId) return

              setReplyDraftByReviewId((prev) => ({
                ...prev,
                [selectedReviewId]: value,
              }))
            }}
            onToneChange={setSelectedTone}
            onSaveDraft={() => handleSaveReply(true)}
            onSend={() => handleSaveReply(false)}
          />

          <CRMWeeklyInsightCard insight={summaryQuery.data?.weeklyInsight ?? null} />
        </div>
      </section>
    </div>
  )
}
