import { useCallback, useEffect, useMemo, useState } from 'react'

import { buildCRMSentimentAnalysisViewModel } from '@/features/crm/logic/crmSentimentAnalysis.logic'
import { useCRMSentimentAnalysis, useCRMSentimentAnalysisActions } from '@/features/crm/hooks/useCRMSentimentAnalysis'
import type { CRMSentimentPlatformFilter } from '@/types/crm.types'

import { CRMSentimentAnalysisView } from './CRMSentimentAnalysisView'

export function CRMSentimentAnalysis() {
  const [selectedWeek, setSelectedWeek] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<CRMSentimentPlatformFilter>('all')
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<string | null>(null)

  const { data, isLoading, isFetching, isError, refetch } = useCRMSentimentAnalysis({
    platform: selectedPlatform,
    weekLabel: selectedWeek,
  })
  const { sendReplyMutation } = useCRMSentimentAnalysisActions()

  const model = useMemo(() => {
    if (!data) return null

    return buildCRMSentimentAnalysisViewModel(data)
  }, [data])

  const activeReplyReview = useMemo(() => {
    if (!model || !activeReplyReviewId) return null

    return model.reviews.items.find((item) => item.id === activeReplyReviewId) ?? null
  }, [activeReplyReviewId, model])

  useEffect(() => {
    if (!model?.reviews.items.length) {
      setSelectedReviewId(null)
      setActiveReplyReviewId(null)
      return
    }

    if (!selectedReviewId || !model.reviews.items.some((item) => item.id === selectedReviewId)) {
      setSelectedReviewId(model.reviews.items[0].id)
    }

    if (activeReplyReviewId && !model.reviews.items.some((item) => item.id === activeReplyReviewId)) {
      setActiveReplyReviewId(null)
    }
  }, [activeReplyReviewId, model, selectedReviewId])

  const handleReplySubmit = useCallback(
    (content: string) => {
      if (!activeReplyReview || !content.trim()) return

      sendReplyMutation.mutate(
        {
          reviewId: activeReplyReview.id,
          content: content.trim(),
          tone: 'important',
          isDraft: false,
        },
        {
          onSuccess: () => {
            setActiveReplyReviewId(null)
          },
        },
      )
    },
    [activeReplyReview, sendReplyMutation],
  )

  if (isLoading && !model) {
    return (
      <div className="space-y-4 pb-8">
        <div className="h-24 animate-pulse rounded-2xl bg-white/70" />
        <div className="h-[352px] animate-pulse rounded-2xl bg-white/70" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="h-[420px] animate-pulse rounded-2xl bg-white/70 xl:col-span-8" />
          <div className="space-y-6 xl:col-span-4">
            <div className="h-[320px] animate-pulse rounded-2xl bg-white/70" />
            <div className="h-[220px] animate-pulse rounded-2xl bg-white/70" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !model) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không tải được dữ liệu sentiment analysis.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <CRMSentimentAnalysisView
      model={model}
      isRefreshing={isFetching}
      selectedWeek={selectedWeek}
      onSelectWeek={setSelectedWeek}
      selectedPlatform={selectedPlatform}
      onSelectPlatform={setSelectedPlatform}
      selectedReviewId={selectedReviewId}
      onSelectReview={setSelectedReviewId}
      onReplyReview={(reviewId) => {
        setSelectedReviewId(reviewId)
        setActiveReplyReviewId(reviewId)
      }}
      onSubmitReply={handleReplySubmit}
      onCancelReply={() => setActiveReplyReviewId(null)}
      isReplyPending={sendReplyMutation.isPending}
      activeReplyReviewId={activeReplyReviewId}
    />
  )
}