import { ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MESSAGES } from '@/constants/messages'
import type { CRMReplyTemplate, CRMReviewItem } from '@/types/crm.types'

type CRMReplyComposerPanelProps = {
  selectedReview: CRMReviewItem | null
  templates: CRMReplyTemplate[]
  content: string
  selectedTone: 'important' | 'friendly'
  isPending: boolean
  isSavingDraft?: boolean
  onTemplateClick: (template: CRMReplyTemplate) => void
  onContentChange: (value: string) => void
  onToneChange: (tone: 'important' | 'friendly') => void
  onSaveDraft: () => void
  onSend: () => void
}

export function CRMReplyComposerPanel({
  selectedReview,
  templates,
  content,
  selectedTone,
  isPending,
  isSavingDraft = false,
  onTemplateClick,
  onContentChange,
  onToneChange,
  onSaveDraft,
  onSend,
}: CRMReplyComposerPanelProps) {
  if (!selectedReview) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Chọn một review để bắt đầu phản hồi.</p>
      </section>
    )
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xl font-bold text-slate-700">
        <ArrowLeft className="h-5 w-5 text-indigo-500" />
        Trả lời đánh giá
      </div>

      <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-600">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-red-500">Đang chọn</p>
        <p className="mt-1 line-clamp-2">"{selectedReview.comment}"</p>
        <p className="mt-2 text-right font-mono text-xs text-slate-400">ID: #{selectedReview.id}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-indigo-500">AI gợi ý phản hồi</p>

        {templates.map((template) => {
          const isSelected = selectedTone === template.tone

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                onToneChange(template.tone)
                onTemplateClick(template)
              }}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-colors',
                isSelected ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100',
              )}
            >
              <p className="text-xs font-bold uppercase tracking-[0.06em] text-slate-600">{template.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{template.content}</p>
            </button>
          )
        })}
      </div>

      <textarea
        className="h-36 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none focus:border-indigo-300"
        placeholder="Viết phản hồi của bạn..."
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
      />

      <label className="inline-flex items-center gap-2 text-xs text-slate-500">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
        Tự biên dịch sang ngôn ngữ của khách
      </label>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          className="h-11 flex-1 rounded-xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700"
          disabled={!content.trim() || isPending || isSavingDraft}
          onClick={onSend}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? MESSAGES.CRM.REVIEW.BUTTON.REPLY_LOADING : MESSAGES.CRM.REVIEW.BUTTON.REPLY}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-11 rounded-xl px-5 text-sm font-bold text-slate-600"
          disabled={!content.trim() || isPending || isSavingDraft}
          onClick={onSaveDraft}
        >
          {isSavingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSavingDraft ? MESSAGES.CRM.REVIEW.BUTTON.DRAFT_LOADING : MESSAGES.CRM.REVIEW.BUTTON.SAVE_DRAFT}
        </Button>
      </div>
    </section>
  )
}
