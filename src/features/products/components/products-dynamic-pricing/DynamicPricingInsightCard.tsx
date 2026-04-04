import type { ReactNode } from 'react'

import { AlertTriangle, TrendingUp } from 'lucide-react'

import type { DynamicPricingInsight } from '@/features/products/logic/productsDynamicPricing.types'

type DynamicPricingInsightCardProps = {
  insight: DynamicPricingInsight
}

const toneStyles: Record<DynamicPricingInsight['tone'], string> = {
  primary: 'border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200',
  warning: 'border-slate-200 bg-white text-slate-900',
  success: 'border-slate-200 bg-white text-slate-900',
}

const toneLabelStyles: Record<DynamicPricingInsight['tone'], string> = {
  primary: 'text-indigo-100',
  warning: 'text-slate-400',
  success: 'text-slate-400',
}

const toneDescriptionStyles: Record<DynamicPricingInsight['tone'], string> = {
  primary: 'text-indigo-100/80',
  warning: 'text-slate-500',
  success: 'text-slate-500',
}

const iconMap: Record<DynamicPricingInsight['tone'], ReactNode> = {
  primary: null,
  warning: <AlertTriangle className="h-4 w-4 text-orange-500" aria-hidden />,
  success: <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden />,
}

export function DynamicPricingInsightCard({ insight }: DynamicPricingInsightCardProps) {
  return (
    <article className={`rounded-2xl border p-6 ${toneStyles[insight.tone]}`}>
      <div className="flex items-center gap-2">
        {iconMap[insight.tone]}
        <p className={`text-xs font-bold uppercase tracking-[0.12em] ${toneLabelStyles[insight.tone]}`}>{insight.title}</p>
      </div>

      <p className="mt-2 text-3xl font-black leading-tight">{insight.value}</p>
      <p className={`mt-3 text-sm ${toneDescriptionStyles[insight.tone]}`}>{insight.description}</p>
    </article>
  )
}
