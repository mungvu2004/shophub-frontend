import { Calendar } from 'lucide-react'

type TrendRangeSelectorProps = {
  value: number
  onChange: (days: number) => void
}

export function TrendRangeSelector({ value, onChange }: TrendRangeSelectorProps) {
  const ranges = [
    { label: '7 ngày', value: 7 },
    { label: '14 ngày', value: 14 },
    { label: '30 ngày', value: 30 },
  ]

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {ranges.map((range) => {
          const isActive = value === range.value

          return (
            <button
              key={range.value}
              type="button"
              onClick={() => onChange(range.value)}
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {isActive && <Calendar className="mr-1.5 h-3.5 w-3.5" />}
              {range.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
