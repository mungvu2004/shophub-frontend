import type { CRMWeeklyInsight } from '@/types/crm.types'

type CRMWeeklyInsightCardProps = {
  insight: CRMWeeklyInsight | null
}

export function CRMWeeklyInsightCard({ insight }: CRMWeeklyInsightCardProps) {
  if (!insight) return null

  return (
    <article className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 p-5 text-white shadow-sm">
      <p className="text-xs font-semibold tracking-[0.1em] opacity-80">{insight.title}</p>
      <p className="mt-2 text-base font-medium leading-7">{insight.description}</p>
      <button type="button" className="mt-4 text-xs font-bold uppercase tracking-[0.08em]">
        {insight.ctaLabel} &rarr;
      </button>
    </article>
  )
}
