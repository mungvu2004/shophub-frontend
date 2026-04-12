import { SentimentAnalysisHeader } from './SentimentAnalysisHeader'
import { SentimentAnalysisInsightsPanel } from './SentimentAnalysisInsightsPanel'
import { SentimentAnalysisReplyComposer } from './SentimentAnalysisReplyComposer'
import { SentimentAnalysisReviewList } from './SentimentAnalysisReviewList'
import { SentimentAnalysisScoreCard } from './SentimentAnalysisScoreCard'
import { SentimentAnalysisTimelineCard } from './SentimentAnalysisTimelineCard'
import type { CRMSentimentAnalysisViewModel } from '@/features/crm/logic/crmSentimentAnalysis.logic'
import type { CRMSentimentPlatformFilter } from '@/types/crm.types'

type CRMSentimentAnalysisViewProps = {
  model: CRMSentimentAnalysisViewModel
  isRefreshing: boolean
  selectedWeek: string
  onSelectWeek: (weekLabel: string) => void
  selectedPlatform: CRMSentimentPlatformFilter
  onSelectPlatform: (platform: CRMSentimentPlatformFilter) => void
  selectedReviewId: string | null
  activeReplyReviewId: string | null
  onSelectReview: (reviewId: string) => void
  onReplyReview: (reviewId: string) => void
  onSubmitReply: (content: string) => void
  onCancelReply: () => void
  isReplyPending: boolean
}

export function CRMSentimentAnalysisView({
  model,
  isRefreshing,
  selectedWeek,
  onSelectWeek,
  selectedPlatform,
  onSelectPlatform,
  selectedReviewId,
  activeReplyReviewId,
  onSelectReview,
  onReplyReview,
  onSubmitReply,
  onCancelReply,
  isReplyPending,
}: CRMSentimentAnalysisViewProps) {
  const activeReplyReview = model.reviews.items.find((item) => item.id === activeReplyReviewId) ?? null

  return (
    <div className="space-y-6 pb-8">
      <SentimentAnalysisHeader model={model} isRefreshing={isRefreshing} />

      <SentimentAnalysisTimelineCard
        title={model.chart.title}
        description={model.chart.description}
        annotationLabel={model.chart.annotationLabel}
        legend={model.chart.legend}
        points={model.chart.points}
        selectedWeek={selectedWeek}
        onSelectWeek={onSelectWeek}
      />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <SentimentAnalysisReviewList
            title={model.reviews.title}
            totalPrefix={model.reviews.totalPrefix}
            totalValue={model.reviews.totalValue}
            items={model.reviews.items}
            emptyLabel={model.reviews.emptyLabel}
            selectedReviewId={selectedReviewId}
            onSelectReview={onSelectReview}
            onReplyReview={onReplyReview}
          />

          {activeReplyReview ? (
            <SentimentAnalysisReplyComposer
              reviewId={activeReplyReview.id}
              customerName={activeReplyReview.customerName}
              comment={activeReplyReview.comment}
              isPending={isReplyPending}
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
            />
          ) : null}
        </div>

        <div className="space-y-5 xl:col-span-4">
          <SentimentAnalysisInsightsPanel
            title={model.insights.title}
            keywordTitle={model.insights.keywordTitle}
            keywords={model.insights.keywords}
            suggestionsTitle={model.insights.suggestionsTitle}
            suggestions={model.insights.suggestions}
            platformStats={model.insights.platformStats}
            selectedPlatform={selectedPlatform}
            onSelectPlatform={onSelectPlatform}
          />

          <SentimentAnalysisScoreCard
            label={model.score.label}
            valueLabel={model.score.valueLabel}
            targetLabel={model.score.targetLabel}
            targetValueLabel={model.score.targetValueLabel}
            changeLabel={model.score.changeLabel}
            progressPercent={model.score.progressPercent}
          />
        </div>
      </section>
    </div>
  )
}