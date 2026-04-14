import { AlertTriangle, BadgeAlert, CircleAlert, PackageSearch } from 'lucide-react'

import type { AIInsightItem, AIInsightsColumnViewModel } from '@/features/dashboard/logic/aiInsightsColumn.types'

type AIInsightsColumnViewProps = {
  model: AIInsightsColumnViewModel
}

const itemClassByTone: Record<AIInsightItem['tone'], string> = {
  critical: 'bg-orange-50 border-orange-100',
  warning: 'bg-[#f9f9ff] border-[#f0f3ff]',
  low: 'bg-[#f9f9ff] border-[#f0f3ff]',
}

const tagClassByTone: Record<AIInsightItem['tone'], string> = {
  critical: 'text-orange-600',
  warning: 'text-amber-600',
  low: 'text-slate-400',
}

const unitsClassByTone: Record<AIInsightItem['tone'], string> = {
  critical: 'text-[#BA1A1A]',
  warning: 'text-amber-600',
  low: 'text-slate-600',
}

function InsightIcon({ tone }: { tone: AIInsightItem['tone'] }) {
  if (tone === 'critical') return <AlertTriangle className="h-5 w-5 text-orange-500" />
  if (tone === 'warning') return <CircleAlert className="h-5 w-5 text-amber-500" />
  return <PackageSearch className="h-5 w-5 text-slate-400" />
}

export function AIInsightsColumnView({ model }: AIInsightsColumnViewProps) {
  return (
    <article className="flex h-[580px] flex-col overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
      <header className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-400 p-6">
        <div className="flex items-center gap-3">
          <BadgeAlert className="h-5 w-5 text-white" />
          <h3 className="text-lg font-bold leading-7 text-white">
            Cảnh báo Tồn kho
          </h3>
        </div>

        <span className="rounded-md bg-white/20 px-2 py-1 text-[10px] font-black uppercase leading-[15px] tracking-[0.1em] text-white">
          AI INSIGHT
        </span>
      </header>

      <div className="flex-1 space-y-4 p-6">
        {model.items.map((item) => (
          <article key={item.id} className={`flex items-center gap-4 rounded-2xl border p-4 ${itemClassByTone[item.tone]}`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <InsightIcon tone={item.tone} />
            </div>

            <div className="min-w-0">
              <p className={`text-[10px] font-bold uppercase tracking-[0.05em] ${tagClassByTone[item.tone]}`}>{item.tag}</p>
              <p className="mt-1 truncate text-sm font-bold text-slate-900">{item.productName}</p>
              <p className="text-xs text-slate-500">
                <span>Còn lại: </span>
                <span className={`font-bold ${unitsClassByTone[item.tone]}`}>{String(item.remainingUnits).padStart(2, '0')} units</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      <footer className="bg-[#f0f3ff80] p-4 text-center text-xs font-bold uppercase tracking-[0.1em] text-indigo-700">
        {model.ctaLabel}
      </footer>
    </article>
  )
}
