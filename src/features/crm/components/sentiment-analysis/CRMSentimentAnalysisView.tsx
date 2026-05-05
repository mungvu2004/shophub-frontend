import { memo } from 'react'
import { SentimentAnalysisHeader } from './SentimentAnalysisHeader'
import { SentimentAnalysisInsightsPanel } from './SentimentAnalysisInsightsPanel'
import { SentimentAnalysisReplyComposer } from './SentimentAnalysisReplyComposer'
import { SentimentAnalysisReviewList } from './SentimentAnalysisReviewList'
import { SentimentAnalysisScoreCard } from './SentimentAnalysisScoreCard'
import { SentimentAnalysisTimelineCard } from './SentimentAnalysisTimelineCard'
import type { CRMSentimentAnalysisViewModel } from '@/features/crm/logic/crmSentimentAnalysis.logic'
import type { CRMSentimentPlatformFilter } from '@/types/crm.types'
import { cn } from '@/lib/utils'

type CRMSentimentAnalysisViewProps = {
  model: CRMSentimentAnalysisViewModel
  isRefreshing: boolean
  selectedProductId: string
  onSelectProduct: (productId: string) => void
  onRunAnalysis: () => void
  isRunningAnalysis: boolean
  analysisStatusVariant: 'running' | 'completed' | 'error'
  analysisStatusLabel: string
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

export const CRMSentimentAnalysisView = memo(function CRMSentimentAnalysisView({
  model,
  isRefreshing,
  selectedProductId,
  onSelectProduct,
  onRunAnalysis,
  isRunningAnalysis,
  analysisStatusVariant,
  analysisStatusLabel,
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
    <div className="flex min-h-screen flex-col">
      {/* Header - Fixed/Sticky if needed, but here following Page pattern */}
      <SentimentAnalysisHeader
        model={model}
        isRefreshing={isRefreshing}
        selectedProductId={selectedProductId}
        onSelectProduct={onSelectProduct}
        onRunAnalysis={onRunAnalysis}
        isRunningAnalysis={isRunningAnalysis}
        statusVariant={analysisStatusVariant}
        statusLabel={analysisStatusLabel}
      />

      <div
        className={cn(
          'mt-6 flex flex-1 gap-6 transition-opacity duration-300',
          isRefreshing ? 'opacity-70' : 'opacity-100',
        )}
      >
        {/* Main Content Area (Left) */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Timeline Chart - Hero of main area */}
          <SentimentAnalysisTimelineCard
            title={model.chart.title}
            description={model.chart.description}
            legend={model.chart.legend}
            points={model.chart.points}
            selectedWeek={selectedWeek}
            onSelectWeek={onSelectWeek}
          />

          {/* Review List */}
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

          {/* Floating Reply Composer - Positioned bottom fixed for focus */}
          {activeReplyReview && (
            <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-6 animate-in slide-in-from-bottom-10">
              <div className="w-full max-w-2xl">
                <SentimentAnalysisReplyComposer
                  key={activeReplyReview.id}
                  reviewId={activeReplyReview.id}
                  customerName={activeReplyReview.customerName}
                  comment={activeReplyReview.comment}
                  isPending={isReplyPending}
                  onSubmit={onSubmitReply}
                  onCancel={onCancelReply}
                />
              </div>
            </div>
          )}
        </main>

        {/* Sidebar Widgets (Right) */}
        <aside className="hidden w-80 shrink-0 xl:block">
          <div className="sticky top-6 space-y-6">
            <h3 className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Chỉ số & Phân tích
            </h3>

            {/* Score Card Widget */}
            <SentimentAnalysisScoreCard
              label={model.score.label}
              valueLabel={model.score.valueLabel}
              targetLabel={model.score.targetLabel}
              targetValueLabel={model.score.targetValueLabel}
              changeLabel={model.score.changeLabel}
              progressPercent={model.score.progressPercent}
            />

            {/* Insights Panel Widget */}
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

            {/* Decorative End-of-Sidebar info */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Kết thúc phân tích
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
})
