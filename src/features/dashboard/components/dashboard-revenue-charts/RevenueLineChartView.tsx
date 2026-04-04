import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type {
  RevenueLineChartLegendItem,
  RevenueLineChartViewModel,
} from '@/features/dashboard/logic/revenueLineChart.types'

type RevenueLineChartViewProps = {
  model: RevenueLineChartViewModel
  isLoading?: boolean
  isError?: boolean
}

type RevenueTooltipItem = {
  dataKey?: string | number
  name?: string
  value?: number | string
}

type RevenueTooltipProps = {
  active?: boolean
  payload?: RevenueTooltipItem[]
  label?: string
}

const formatCurrency = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)} đ`

function ChartLegend({ items }: { items: RevenueLineChartLegendItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} aria-hidden />
          <span className="text-xs font-bold uppercase leading-4 text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function RevenueChartTooltip({ active, payload, label }: RevenueTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey?.toString()} className="flex items-center justify-between gap-4 text-xs">
            <span className="font-semibold text-slate-700">{item.name}</span>
            <span className="font-bold text-slate-900">{formatCurrency(Number(item.value ?? 0))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingChartSkeleton() {
  return (
    <div className="h-full animate-pulse">
      <div className="grid h-full grid-rows-4 gap-8">
        <div className="border-t border-slate-100" />
        <div className="border-t border-slate-100" />
        <div className="border-t border-slate-100" />
        <div className="border-t border-slate-100" />
      </div>
    </div>
  )
}

export function RevenueLineChartView({ model, isLoading, isError }: RevenueLineChartViewProps) {
  return (
    <article className="flex h-[476px] flex-col rounded-3xl border border-slate-100 bg-white px-8 pb-8 pt-8 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold leading-7 text-slate-900">{model.title}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{model.subtitle}</p>
        </div>

        <ChartLegend items={model.legend} />
      </header>

      <div className="mt-8 h-[248px] border-b border-l border-[#f0f3ff] pb-2 pl-px pt-2">
        {isLoading ? (
          <LoadingChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={model.points} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f8fafc" strokeWidth={1} />
              <YAxis hide />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={16}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip content={<RevenueChartTooltip />} cursor={{ stroke: '#E2E8F0', strokeDasharray: '3 3' }} />
              <Line type="monotone" dataKey="shopee" name="Shopee" stroke="#F97316" strokeWidth={3.5} dot={false} />
              <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#0F172A" strokeWidth={3.5} dot={false} />
              <Line type="monotone" dataKey="lazada" name="Lazada" stroke="#3525CD" strokeWidth={3.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {!isLoading && !isError && !model.hasData ? (
          <div className="mt-2 text-center text-sm font-medium text-slate-400">Chưa có dữ liệu doanh thu trong 7 ngày gần nhất.</div>
        ) : null}

        {isError ? <div className="mt-2 text-center text-sm font-medium text-rose-500">Không tải được dữ liệu doanh thu.</div> : null}
      </div>
    </article>
  )
}
