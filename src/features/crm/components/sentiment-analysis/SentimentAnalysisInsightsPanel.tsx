import { Sparkles, BarChart3, Hash } from 'lucide-react'
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
  className?: string
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
  className,
}: SentimentAnalysisInsightsPanelProps) {
  return (
    <aside className={cn('space-y-6', className)}>
      {/* Platform Distribution */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 px-1">
          <BarChart3 className="size-4 text-indigo-500" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Phân bổ kênh</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {platformStats.map((item) => (
            <button
              key={`platform-${item.id}`}
              type="button"
              onClick={() => onSelectPlatform(item.id)}
              className={cn(
                'flex flex-col items-start rounded-xl p-3 text-left transition-all',
                selectedPlatform === item.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
              )}
            >
              <span
                className={cn(
                  'text-[8px] font-black uppercase tracking-tight',
                  selectedPlatform === item.id ? 'text-slate-400' : 'text-slate-400',
                )}
              >
                {item.label}
              </span>
              <span className="mt-0.5 font-mono text-xs font-black">{item.value}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Keywords */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 px-1">
          <Hash className="size-4 text-indigo-500" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900">{keywordTitle}</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((keyword, idx) => (
            <div
              key={`keyword-${keyword.label}-${idx}`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 transition-all hover:border-indigo-100 hover:bg-indigo-50"
            >
              <span className="text-[10px] font-bold text-slate-700">{keyword.label}</span>
              <span className="font-mono text-[9px] font-black text-indigo-600">{keyword.percent}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Suggestions */}
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-indigo-600" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-indigo-900">{title}</h2>
          </div>
        </div>

        <div className="space-y-3">
          <p className="px-1 text-[9px] font-black uppercase tracking-widest text-indigo-400">
            {suggestionsTitle}
          </p>
          <div className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <div
                key={`suggestion-${idx}`}
                className="flex gap-3 rounded-xl border border-indigo-100 bg-white p-3 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow-sm">
                  {idx + 1}
                </div>
                <p className="text-xs font-medium leading-relaxed text-slate-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </aside>
  )
}
