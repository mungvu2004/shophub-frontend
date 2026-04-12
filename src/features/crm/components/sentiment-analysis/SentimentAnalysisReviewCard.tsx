import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

type SentimentAnalysisReviewCardProps = {
  review: {
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
  }
  isSelected: boolean
  onSelect: (reviewId: string) => void
  onReply: (reviewId: string) => void
}

export function SentimentAnalysisReviewCard({ review, isSelected, onSelect, onReply }: SentimentAnalysisReviewCardProps) {
  const initials = review.customerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <article
      onClick={() => onSelect(review.id)}
      className={cn(
        'cursor-pointer rounded-[18px] border border-slate-100 border-l-4 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all',
        isSelected ? 'ring-2 ring-indigo-200' : 'hover:shadow-md',
        review.borderClass,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
            {initials}
          </div>

          <div>
            <p className="text-sm font-bold text-[#111c2d]">{review.customerName}</p>
            <div className="mt-1 flex items-center gap-1">
              {review.stars.map((filled, index) => (
                <Star key={`${review.id}-star-${index}`} className={cn('h-3.5 w-3.5', filled ? 'fill-amber-400 text-amber-400' : 'text-slate-200')} />
              ))}
            </div>
          </div>
        </div>

        <span className={cn('rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]', review.sentimentClass)}>{review.sentimentLabel}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className={cn('rounded-md px-2.5 py-1 font-bold uppercase tracking-[0.08em]', review.platformClass)}>{review.platformLabel}</span>
        <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-500">{review.weekLabel}</span>
        <span className="font-mono text-slate-400">{review.timeLabel}</span>
      </div>

      <p className="mt-4 text-sm leading-7 text-[#111c2d]">{review.comment}</p>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onReply(review.id)
          }}
          className="inline-flex h-9 items-center rounded-xl px-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4f46e5] transition-colors hover:text-[#3525cd]"
        >
          {review.actionLabel}
        </button>
        {review.isReplied ? <span className="text-xs font-semibold text-emerald-600">Đã phản hồi</span> : null}
      </div>
    </article>
  )
}