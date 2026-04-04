import { CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { RevenueRange } from '@/types/revenue.types'

type RevenueSummaryHeaderProps = {
  title: string
  selectedRange: RevenueRange
  onRangeChange: (range: RevenueRange) => void
}

const ranges: Array<{ value: RevenueRange; label: string }> = [
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
  { value: 'quarter', label: 'Quý' },
  { value: 'year', label: 'Năm' },
]

export function RevenueSummaryHeader({ title, selectedRange, onRangeChange }: RevenueSummaryHeaderProps) {
  return (
    <header className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl bg-indigo-50 p-1">
          {ranges.map((range) => {
            const isActive = selectedRange === range.value

            return (
              <button
                key={range.value}
                type="button"
                onClick={() => onRangeChange(range.value)}
                className={
                  isActive
                    ? 'rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm'
                    : 'rounded-lg px-4 py-1.5 text-xs font-semibold text-slate-600'
                }
              >
                {range.label}
              </button>
            )
          })}
        </div>

        <Button variant="outline" size="lg" className="gap-2 bg-white">
          <CalendarDays className="size-4" />
          <span>Xuất PDF</span>
        </Button>
      </div>
    </header>
  )
}
