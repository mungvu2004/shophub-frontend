import { SentimentAnalysisReviewCard } from './SentimentAnalysisReviewCard'

type SentimentAnalysisReviewListProps = {
  title: string
  totalPrefix: string
  totalValue: string
  items: Array<{
    id: string
    customerName: string
    comment: string
    timeLabel: string
    platformLabel: string
    platformClass: string
    sentimentLabel: string
    sentimentClass: string
    borderClass: string
    actionLabel: string
    stars: boolean[]
    isReplied: boolean
    weekLabel: string
  }>
  emptyLabel: string
  selectedReviewId: string | null
  onSelectReview: (reviewId: string) => void
  onReplyReview: (reviewId: string) => void
}

export function SentimentAnalysisReviewList({
  title,
  totalPrefix,
  totalValue,
  items,
  emptyLabel,
  selectedReviewId,
  onSelectReview,
  onReplyReview,
}: SentimentAnalysisReviewListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[20px] font-bold tracking-[-0.03em] text-[#111c2d]">{title}</h2>
        <div className="text-sm font-medium text-slate-500">
          <span>{totalPrefix}:</span>
          <span className="ml-2 font-semibold text-[#4f46e5]">{totalValue}</span>
        </div>
      </div>

      <div className="space-y-4">
        {items.length ? (
          items.map((review) => (
            <SentimentAnalysisReviewCard
              key={review.id}
              review={review}
              isSelected={selectedReviewId === review.id}
              onSelect={onSelectReview}
              onReply={onReplyReview}
            />
          ))
        ) : (
          <div className="rounded-[18px] border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">{emptyLabel}</div>
        )}
      </div>
    </section>
  )
}