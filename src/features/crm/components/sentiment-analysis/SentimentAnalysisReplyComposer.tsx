import { useState } from 'react'

import { Loader2, SendHorizontal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

type SentimentAnalysisReplyComposerProps = {
  reviewId: string
  customerName: string
  comment: string
  isPending: boolean
  onSubmit: (content: string) => void
  onCancel: () => void
}

export function SentimentAnalysisReplyComposer({
  reviewId,
  customerName,
  comment,
  isPending,
  onSubmit,
  onCancel,
}: SentimentAnalysisReplyComposerProps) {
  const [draft, setDraft] = useState('')
  const [prevReviewId, setPrevReviewId] = useState(reviewId)

  if (reviewId !== prevReviewId) {
    setPrevReviewId(reviewId)
    setDraft('')
  }

  return (
    <section className="rounded-[18px] border border-indigo-200 bg-indigo-50/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-indigo-600">Đang phản hồi</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{customerName} • #{reviewId}</p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">"{comment}"</p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
          aria-label="Đóng khung phản hồi"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Nhập nội dung phản hồi cho khách..."
        className="mt-4 h-28 w-full resize-none rounded-xl border border-indigo-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
      />

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending} className="h-9 rounded-lg px-3 text-sm">
          Hủy
        </Button>

        <Button
          type="button"
          onClick={() => onSubmit(draft)}
          disabled={!draft.trim() || isPending}
          className="h-9 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SendHorizontal className="mr-2 h-4 w-4" />}
          Gửi phản hồi
        </Button>
      </div>
    </section>
  )
}
