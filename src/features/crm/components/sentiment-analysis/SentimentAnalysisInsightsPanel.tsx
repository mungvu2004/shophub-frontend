import { Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { CRMSentimentPlatformFilter } from '@/types/crm.types'

type SentimentAnalysisInsightsPanelProps = {
  title: string
  keywordTitle: string
  keywords: Array<{ label: string; percent: number }>
  suggestionsTitle: string
  suggestions: string[]
  platformStats: Array<{ id: CRMSentimentPlatformFilter; label: string; value: string }>
  selectedPlatform: CRMSentimentPlatformFilter
  onSelectPlatform: (platform: CRMSentimentPlatformFilter) => void
}

export function SentimentAnalysisInsightsPanel({
  title,
  keywordTitle,
  keywords,
  suggestionsTitle,
  suggestions,
  platformStats,
  selectedPlatform,
  onSelectPlatform,
}: SentimentAnalysisInsightsPanelProps) {
  return (
    <aside className="rounded-[22px] bg-[#f0f3ff] p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#4f46e5]" />
        <h2 className="text-sm font-bold text-[#111c2d]">{title}</h2>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {platformStats.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPlatform(item.id)}
            className={cn(
              'rounded-xl bg-white px-3 py-2 text-left text-[11px] font-semibold text-[#111c2d] shadow-sm transition-colors hover:bg-indigo-50',
              selectedPlatform === item.id ? 'ring-2 ring-indigo-300' : item.id === 'lazada' ? 'ring-1 ring-[#dbeafe]' : '',
            )}
          >
            <span className="block text-[10px] uppercase tracking-[0.08em] text-slate-500">{item.label}</span>
            <span className="mt-0.5 block text-sm text-[#4f46e5]">{item.value}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-[16px] border-l-2 border-[#6366f1] bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#4f46e5]">{keywordTitle}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span key={keyword.label} className="rounded-lg bg-[#e7eeff] px-3 py-2 text-[11px] font-semibold text-[#111c2d]">
              {keyword.label} ({keyword.percent}%)
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-[16px] bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-[#0f172a]">{suggestionsTitle}</p>
        <ul className="mt-3 space-y-3 text-sm leading-6 text-[#464555]">
          {suggestions.map((suggestion) => (
            <li key={suggestion} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4f46e5]" aria-hidden />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}