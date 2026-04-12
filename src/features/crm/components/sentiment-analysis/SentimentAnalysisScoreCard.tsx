import { ArrowUpRight } from 'lucide-react'

type SentimentAnalysisScoreCardProps = {
  label: string
  valueLabel: string
  targetLabel: string
  targetValueLabel: string
  changeLabel: string
  progressPercent: number
}

export function SentimentAnalysisScoreCard({
  label,
  valueLabel,
  targetLabel,
  targetValueLabel,
  changeLabel,
  progressPercent,
}: SentimentAnalysisScoreCardProps) {
  return (
    <aside className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#4f46e5] to-[#4338ca] p-6 text-white shadow-[0_20px_25px_-5px_rgba(199,210,254,1),0_8px_10px_-6px_rgba(199,210,254,1)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/80">{label}</p>
          <p className="mt-2 text-[38px] font-bold leading-none tracking-[-0.05em]">{valueLabel}</p>
        </div>

        <ArrowUpRight className="h-5 w-5 text-white/80" />
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-white/90">
          <span>{targetLabel}</span>
          <span>{targetValueLabel}</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white" style={{ width: `${progressPercent}%` }} />
        </div>

        <p className="pt-1 text-xs font-medium text-white/80">{changeLabel}</p>
      </div>
    </aside>
  )
}