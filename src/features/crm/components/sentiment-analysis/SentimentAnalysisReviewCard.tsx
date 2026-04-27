import { Star, Reply, CheckCircle2 } from 'lucide-react'
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
        'group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 transition-all',
        isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:border-indigo-200 hover:shadow-sm',
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Top: Customer & Rating */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
              {initials}
            </div>

            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900">{review.customerName}</p>
              <div className="flex items-center gap-0.5">
                {review.stars.map((filled, index) => (
                  <Star
                    key={index}
                    className={cn('size-3', filled ? 'fill-amber-400 text-amber-400' : 'text-slate-200')}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              {review.timeLabel}
            </span>
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest',
                review.platformClass,
              )}
            >
              {review.platformLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <p className="text-sm leading-relaxed text-slate-700">{review.comment}</p>
        </div>

        {/* Footer: Meta & Actions */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-500 border border-slate-100">
              {review.weekLabel}
            </div>
            {review.isReplied && (
              <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-600">
                <CheckCircle2 className="size-3" />
                Đã phản hồi
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onReply(review.id)
            }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all',
              review.isReplied
                ? 'text-slate-400 hover:text-indigo-600'
                : 'bg-indigo-600 text-white hover:bg-indigo-700',
            )}
          >
            <Reply className="size-3" />
            {review.isReplied ? 'Xem' : review.actionLabel}
          </button>
        </div>
      </div>
    </article>
  )
}
