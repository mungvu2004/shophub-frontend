import { Clock3, Sparkles, Star, MessageSquareQuote } from 'lucide-react'

import type { CRMReviewInboxSummary } from '@/types/crm.types'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

type CRMReviewInboxHeaderProps = {
  summary: CRMReviewInboxSummary | null
}

export function CRMReviewInboxHeader({ summary }: CRMReviewInboxHeaderProps) {
  return (
    <ThemedPageHeader
      title="Hộp thư Review"
      subtitle="Quản lý và phản hồi đánh giá từ đa sàn."
      theme="crm"
      badge={{ text: 'Đánh giá', icon: <MessageSquareQuote className="size-3.5" /> }}
    >
      <div className="flex flex-wrap items-center gap-4 text-sm text-purple-900 font-medium bg-white/60 p-3 rounded-xl backdrop-blur border border-purple-200/50 shadow-sm w-full lg:w-auto">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_#A855F7] animate-pulse" aria-hidden />
          <span>Tỷ lệ phản hồi: {summary?.replyRatePercent ?? 0}%</span>
        </div>
        <span className="text-purple-300 hidden sm:inline">•</span>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-purple-600" />
          <span>{summary?.avgReplyHours ?? 0} giờ TB</span>
        </div>
        <span className="text-purple-300 hidden sm:inline">•</span>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-purple-600" />
          <span>Trust {summary?.trustScore ?? 0}/5</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/80 px-2.5 py-1 text-xs font-bold text-purple-700">
          <Sparkles className="h-3 w-3" />
          AI hỗ trợ phản hồi
        </span>
      </div>
    </ThemedPageHeader>
  )
}
