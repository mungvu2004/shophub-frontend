import { Clock3, Sparkles, Star } from 'lucide-react'

import type { CRMReviewInboxSummary } from '@/types/crm.types'

type CRMReviewInboxHeaderProps = {
  summary: CRMReviewInboxSummary | null
}

export function CRMReviewInboxHeader({ summary }: CRMReviewInboxHeaderProps) {
  return (
    <header className="space-y-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/70 p-5 shadow-sm">
      <div>
        <h1 className="text-[28px] font-bold text-slate-800">Hộp thư Review</h1>
        <p className="text-sm text-slate-500">Quản lý và phản hồi đánh giá từ đa sàn.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366F1]" aria-hidden />
          <span>Tỷ lệ phản hồi: {summary?.replyRatePercent ?? 0}%</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5" />
          <span>{summary?.avgReplyHours ?? 0} giờ TB</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-2">
          <Star className="h-3.5 w-3.5" />
          <span>Trust {summary?.trustScore ?? 0}/5</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
          <Sparkles className="h-3 w-3" />
          AI hỗ trợ phản hồi
        </span>
      </div>
    </header>
  )
}
