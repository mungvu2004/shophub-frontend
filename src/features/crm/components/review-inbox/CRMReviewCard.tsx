import { Loader2, Sparkles, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CRMStatusBadge } from '@/features/crm/components/shared/CRMStatusBadge'
import {
  buildStars,
  formatTimeAgo,
  getPlatformBadgeClass,
  getPlatformLabel,
  getReviewBorderClass,
  getSentimentClass,
  getSentimentLabel,
} from '@/features/crm/logic/crmReviewInbox.logic'
import { MESSAGES } from '@/constants/messages'
import type { CRMReviewItem } from '@/types/crm.types'

type CRMReviewCardProps = {
  review: CRMReviewItem
  isSelected: boolean
  isDeleting?: boolean
  isMarkingRead?: boolean
  onSelect: (reviewId: string) => void
  onMarkRead: (reviewId: string) => void
  onDelete: (reviewId: string) => void
}

export function CRMReviewCard({
  review,
  isSelected,
  isDeleting = false,
  isMarkingRead = false,
  onSelect,
  onMarkRead,
  onDelete,
}: CRMReviewCardProps) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm transition-all',
        getReviewBorderClass(review),
        isSelected ? 'ring-2 ring-indigo-200' : 'hover:border-slate-200',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center">
            {buildStars(review.rating).map((filled, index) => (
              <span key={`${review.id}-star-${index}`} className={filled ? 'text-amber-400' : 'text-slate-200'}>
                ★
              </span>
            ))}
          </div>

          <span className={cn('rounded-md px-2 py-1 text-[10px] font-bold uppercase', getPlatformBadgeClass(review.platform))}>
            {getPlatformLabel(review.platform)}
          </span>

          <span className="font-mono text-[11px] text-slate-400">{formatTimeAgo(review.createdAt)}</span>

          {review.isPriority && (
            <CRMStatusBadge variant="priority" label={MESSAGES.CRM.REVIEW.STATUS.PRIORITY} />
          )}

          <CRMStatusBadge
            variant={review.isReplied ? 'replied' : 'unreplied'}
            label={review.isReplied ? MESSAGES.CRM.REVIEW.STATUS.REPLIED : MESSAGES.CRM.REVIEW.STATUS.UNREPLIED}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
          disabled={isDeleting}
          onClick={() => onDelete(review.id)}
        >
          {isDeleting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1 h-4 w-4" />}
          {isDeleting ? MESSAGES.CRM.REVIEW.BUTTON.DELETE_LOADING : MESSAGES.CRM.REVIEW.BUTTON.DELETE}
        </Button>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-semibold text-indigo-600">{review.productName}</p>
        <p className="text-xs text-slate-400">
          Khách hàng: {review.customerName} {review.customerMaskedPhone}
        </p>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">{review.comment}</p>

      <div className={cn('mt-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold', getSentimentClass(review.ai.sentiment))}>
        <Sparkles className="h-3.5 w-3.5" />
        AI: {getSentimentLabel(review.ai.sentiment)} {review.ai.confidence}%
        <span className="font-medium">· {review.ai.topics.join(', ')}</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="h-9 rounded-xl bg-orange-500 px-4 text-xs font-bold text-white hover:bg-orange-600"
          onClick={() => onSelect(review.id)}
          disabled={isDeleting}
        >
          Trả lời ngay
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-9 rounded-xl px-4 text-xs font-bold text-slate-500"
          onClick={() => onMarkRead(review.id)}
          disabled={isDeleting || isMarkingRead}
        >
          {isMarkingRead && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isMarkingRead ? MESSAGES.CRM.REVIEW.BUTTON.MARK_READ_LOADING : MESSAGES.CRM.REVIEW.BUTTON.MARK_READ}
        </Button>
      </div>
    </article>
  )
}
