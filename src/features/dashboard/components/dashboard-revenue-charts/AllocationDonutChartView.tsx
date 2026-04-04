import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import type { AllocationDonutChartViewModel } from '@/features/dashboard/logic/allocationDonutChart.types'

type AllocationDonutChartViewProps = {
  model: AllocationDonutChartViewModel
  isLoading?: boolean
  isError?: boolean
}

function LegendItem({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <p className="pl-4 text-sm font-bold leading-5 text-slate-900">{value} đơn</p>
    </div>
  )
}

export function AllocationDonutChartView({ model, isLoading, isError }: AllocationDonutChartViewProps) {
  const data = model.hasData ? model.slices : [{ key: 'placeholder', value: 1, color: '#F97316' }]

  return (
    <article className="flex h-[476px] flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <h3 className="text-lg font-bold leading-7 text-slate-900">{model.title}</h3>

      <div className="mt-4 flex items-center justify-center">
        <div className="relative h-56 w-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="key"
                cx="50%"
                cy="50%"
                innerRadius={78}
                outerRadius={112}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[30px] font-bold leading-9 text-slate-900">{model.totalOrders}</p>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{model.unitLabel}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-4">
        {model.slices.map((slice) => (
          <LegendItem key={slice.key} label={slice.label} value={slice.value} color={slice.color} />
        ))}
      </div>

      {!isLoading && !isError && !model.hasData ? (
        <p className="mt-4 text-center text-sm font-medium text-slate-400">Chưa có dữ liệu đơn hàng để phân bổ.</p>
      ) : null}

      {isError ? <p className="mt-4 text-center text-sm font-medium text-rose-500">Không tải được dữ liệu phân bổ đơn hàng.</p> : null}
    </article>
  )
}
