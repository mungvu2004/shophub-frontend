import { ArrowLeft, ChevronDown, Download, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CRMSentimentAnalysisViewModel } from '@/features/crm/logic/crmSentimentAnalysis.logic'

type SentimentAnalysisHeaderProps = {
  model: CRMSentimentAnalysisViewModel
  isRefreshing: boolean
}

export function SentimentAnalysisHeader({ model, isRefreshing }: SentimentAnalysisHeaderProps) {
  return (
    <header className="space-y-5 rounded-[28px] border border-white/60 bg-gradient-to-r from-white via-[#fafbff] to-[#f5f7ff] bg-abstract-geometric p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] xl:p-8">
      <div className="flex items-center justify-between gap-4 text-sm">
        <button type="button" className="inline-flex items-center gap-2 font-medium text-[#4f46e5] transition-colors hover:text-[#3525cd]">
          <ArrowLeft className="h-3.5 w-3.5" />
          {model.breadcrumbLabel}
        </button>

        <span className="text-xs text-slate-400">{model.backLabel}</span>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#111c2d] md:text-[34px]">{model.title}</h1>
            <ChevronDown className="mt-1 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>{model.skuLabel}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-[#4f46e5]">{model.subtitle}</span>
            {isRefreshing ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang cập nhật
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-11 rounded-xl bg-[#dee8ff] px-4 text-sm font-semibold text-[#111c2d] shadow-none hover:bg-[#d6e2ff]"
          >
            <Download className="mr-2 h-4 w-4" />
            {model.reportButtonLabel}
          </Button>

          <Button
            type="button"
            className={cn(
              'h-11 rounded-xl px-5 text-sm font-semibold text-white',
              'bg-gradient-to-r from-[#3525cd] to-[#4f46e5] shadow-[0_10px_15px_-3px_rgba(199,210,254,1),0_4px_6px_-4px_rgba(199,210,254,1)]',
            )}
          >
            {model.compareButtonLabel}
          </Button>
        </div>
      </div>
    </header>
  )
}