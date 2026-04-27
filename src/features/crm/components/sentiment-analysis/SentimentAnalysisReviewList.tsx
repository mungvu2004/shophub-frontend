import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SentimentAnalysisReviewCard } from './SentimentAnalysisReviewCard'

type SentimentAnalysisReviewListProps = {
  title: string
  totalPrefix: string
  totalValue: string
  items: any[]
  emptyLabel: string
  selectedReviewId: string | null
  onSelectReview: (reviewId: string) => void
  onReplyReview: (reviewId: string) => void
  className?: string
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
  className,
}: SentimentAnalysisReviewListProps) {
  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Inbox className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {totalPrefix}
              </span>
              <span className="font-mono text-xs font-black text-indigo-600">{totalValue}</span>
            </div>
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((review) => (
            <SentimentAnalysisReviewCard
              key={review.id}
              review={review}
              isSelected={selectedReviewId === review.id}
              onSelect={onSelectReview}
              onReply={onReplyReview}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 px-6 py-16 text-center">
          <p className="text-sm font-bold text-slate-400">{emptyLabel}</p>
        </div>
      )}
    </section>
  )
}
