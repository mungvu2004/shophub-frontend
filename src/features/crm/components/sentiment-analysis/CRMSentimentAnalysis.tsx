import { useCallback, useMemo, useState, startTransition } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { buildCRMSentimentAnalysisViewModel } from '@/features/crm/logic/crmSentimentAnalysis.logic'
import { useCRMSentimentAnalysis, useCRMSentimentAnalysisActions } from '@/features/crm/hooks/useCRMSentimentAnalysis'
import type { CRMSentimentPlatformFilter } from '@/types/crm.types'
import { mockProducts } from '@/mocks/data/products'

import { CRMSentimentAnalysisView } from './CRMSentimentAnalysisView'

export function CRMSentimentAnalysis() {
  const [selectedProductId, setSelectedProductId] = useState<string>(mockProducts[0].id)

  const [selectedWeek, setSelectedWeek] = useState<string>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<CRMSentimentPlatformFilter>('all')
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<string | null>(null)

  const { data, isLoading, isFetching, isError, refetch } = useCRMSentimentAnalysis({
    productId: selectedProductId,
    platform: selectedPlatform,
    weekLabel: selectedWeek,
  })
  const { sendReplyMutation } = useCRMSentimentAnalysisActions()

  const handleSelectProduct = useCallback((id: string) => {
    // Đổi sản phẩm là tác vụ ưu tiên cao nhất
    setSelectedProductId(id)
    
    // Các filter phụ có thể cập nhật sau
    setSelectedWeek('all')
    setSelectedPlatform('all')
    setSelectedReviewId(null)
    setActiveReplyReviewId(null)
  }, [])

  const handleSelectWeek = useCallback((week: string) => {
    startTransition(() => {
      setSelectedWeek(week)
    })
  }, [])

  const handleSelectPlatform = useCallback((platform: CRMSentimentPlatformFilter) => {
    startTransition(() => {
      setSelectedPlatform(platform)
    })
  }, [])

  const model = useMemo(() => {
    if (!data) return null

    return buildCRMSentimentAnalysisViewModel(data)
  }, [data])

  const activeReplyReview = useMemo(() => {
    if (!model || !activeReplyReviewId) return null

    return model.reviews.items.find((item) => item.id === activeReplyReviewId) ?? null
  }, [activeReplyReviewId, model])

  const [prevModel, setPrevModel] = useState(model)
  if (model !== prevModel) {
    setPrevModel(model)
    if (!model?.reviews.items.length) {
      if (selectedReviewId !== null) setSelectedReviewId(null)
      if (activeReplyReviewId !== null) setActiveReplyReviewId(null)
    } else {
      const firstId = model.reviews.items[0].id
      const currentStillExists = model.reviews.items.some((item) => item.id === selectedReviewId)

      if (!selectedReviewId || !currentStillExists) {
        setSelectedReviewId(firstId)
      }

      if (activeReplyReviewId && !model.reviews.items.some((item) => item.id === activeReplyReviewId)) {
        setActiveReplyReviewId(null)
      }
    }
  }

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
    return <DataLoadErrorState title="Không tải được dữ liệu sentiment analysis." onRetry={() => refetch()} />
  }

  return (
    <CRMSentimentAnalysisView
      model={model}
      isRefreshing={isFetching}
      selectedProductId={selectedProductId}
      onSelectProduct={handleSelectProduct}
      selectedWeek={selectedWeek}
      onSelectWeek={handleSelectWeek}
      selectedPlatform={selectedPlatform}
      onSelectPlatform={handleSelectPlatform}
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
