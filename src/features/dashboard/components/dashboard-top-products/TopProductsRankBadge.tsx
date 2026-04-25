import { ChevronUp, ChevronDown, Minus } from 'lucide-react'

type TopProductsRankBadgeProps = {
  change?: number
}

export function TopProductsRankBadge({ change }: TopProductsRankBadgeProps) {
  if (change === undefined || change === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-[10px] text-slate-400">
        <Minus className="h-3 w-3" />
      </div>
    )
  }

  const isUp = change > 0
  const absoluteChange = Math.abs(change)

  return (
    <div className={`flex flex-col items-center justify-center text-[10px] font-bold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
      {isUp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      <span>{absoluteChange}</span>
    </div>
  )
}
