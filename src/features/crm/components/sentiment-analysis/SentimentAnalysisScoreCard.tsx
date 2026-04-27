import { Target, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type SentimentAnalysisScoreCardProps = {
  label: string
  valueLabel: string
  targetLabel: string
  targetValueLabel: string
  changeLabel: string
  progressPercent: number
  className?: string
}

export function SentimentAnalysisScoreCard({
  label,
  valueLabel,
  targetLabel,
  targetValueLabel,
  changeLabel,
  progressPercent,
  className,
}: SentimentAnalysisScoreCardProps) {
  const isPositive = changeLabel.includes('+')

  return (
    <aside
      className={cn('rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {label}
            </h3>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-black tracking-tighter text-slate-900">
                {valueLabel}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">/ 100</span>
            </div>
          </div>

          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-tight',
              isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
            )}
          >
            <TrendingUp className={cn('size-2.5', !isPositive && 'rotate-180')} />
            {changeLabel}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-1.5">
              <Target className="size-3 text-indigo-500" />
              <span>
                {targetLabel}: {targetValueLabel}
              </span>
            </div>
            <span>{progressPercent}%</span>
          </div>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-indigo-600 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
