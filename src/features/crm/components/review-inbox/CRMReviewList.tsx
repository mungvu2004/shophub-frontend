import { CRMReviewCard } from '@/features/crm/components/review-inbox/CRMReviewCard'
import type { CRMReviewItem } from '@/types/crm.types'

type CRMReviewListProps = {
  items: CRMReviewItem[]
  selectedReviewId?: string
  isLoading: boolean
  onSelect: (reviewId: string) => void
  onMarkRead: (reviewId: string) => void
}

export function CRMReviewList({
  items,
  selectedReviewId,
  isLoading,
  onSelect,
  onMarkRead,
}: CRMReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`crm-review-skeleton-${index}`} className="h-60 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Không có review nào trong bộ lọc hiện tại.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((review) => (
        <CRMReviewCard
          key={review.id}
          review={review}
          isSelected={selectedReviewId === review.id}
          onSelect={onSelect}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  )
}
