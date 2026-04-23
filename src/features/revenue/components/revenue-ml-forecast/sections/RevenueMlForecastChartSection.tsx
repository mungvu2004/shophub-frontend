import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  RevenueMlForecastChartAnnotationViewModel,
  RevenueMlForecastChartLegendViewModel,
  RevenueMlForecastChartPointViewModel,
} from '@/features/revenue/logic/revenueMlForecast.types'
import { cn } from '@/lib/utils'

type RevenueMlForecastTooltipItem = {
  dataKey?: string | number
  name?: string
  value?: number | string
}

type RevenueMlForecastTooltipProps = {
  active?: boolean
  payload?: RevenueMlForecastTooltipItem[]
  label?: string
  annotations: RevenueMlForecastChartAnnotationViewModel[]
  selectedScenarioLabel?: string
}

const currencyFormatter = new Intl.NumberFormat('vi-VN')

function ForecastChartTooltip({ active, payload, label, annotations, selectedScenarioLabel }: RevenueMlForecastTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const historicalValue = payload.find((item) => item.dataKey === 'historical')?.value
  const forecastValue = payload.find((item) => item.dataKey === 'forecast')?.value
  const matchedAnnotation = annotations.find((annotation) => annotation.xLabel === label)

  const forecastChangeLabel =
    typeof historicalValue === 'number' && typeof forecastValue === 'number' && historicalValue > 0
      ? `${forecastValue >= historicalValue ? 'Tăng' : 'Giảm'} ${Math.abs(((forecastValue - historicalValue) / historicalValue) * 100).toFixed(1)}% so với lịch sử`
      : null

  return (
    <div className="max-w-[280px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-slate-700">{label}</p>
        {matchedAnnotation ? (
          <span
            className={cn(
              'rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.8px]',
              matchedAnnotation.tone === 'warning'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-700',
            )}
          >
            Sự kiện
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        {payload.map((item) => {
          const key = String(item.dataKey ?? '')

          if (item.value == null || key === 'confidenceLow' || key === 'confidenceHigh') {
            return null
          }

          return (
            <div key={key} className="flex items-center justify-between gap-6">
              <span className="font-medium text-slate-600">{item.name}</span>
              <span className="font-bold text-slate-900">{currencyFormatter.format(Number(item.value))} ₫</span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 space-y-2 rounded-lg bg-slate-50 px-3 py-2">
        {forecastChangeLabel ? <p className="font-semibold text-slate-700">{forecastChangeLabel}</p> : null}
        {matchedAnnotation ? <p className="text-slate-600">{matchedAnnotation.title}: {matchedAnnotation.note}</p> : null}
        {selectedScenarioLabel ? <p className="text-slate-600">Kịch bản đang xem: {selectedScenarioLabel}</p> : null}
      </div>
    </div>
  )
}

export function RevenueMlForecastChartSection({
  title,
  points,
  legends,
  annotations,
  selectedScenarioLabel,
}: {
  title: string
  points: RevenueMlForecastChartPointViewModel[]
  legends: RevenueMlForecastChartLegendViewModel[]
  annotations: RevenueMlForecastChartAnnotationViewModel[]
  selectedScenarioLabel: string
}) {
  const todayLabel = points.find((point) => point.historical !== null && point.forecast !== null)?.label

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[22px] font-bold text-slate-900">{title}</h2>
          {selectedScenarioLabel ? <p className="mt-1 text-[13px] text-slate-500">Đang xem kịch bản: {selectedScenarioLabel}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[12px] font-semibold text-slate-600">
          {legends.map((item) => (
            <span key={item.id} className="inline-flex items-center gap-2.5">
              <span
                className={cn(
                  item.type === 'block' ? 'size-2.5 rounded-sm' : 'h-[2.5px] w-5',
                  item.type === 'dashed' ? 'border-t-2 border-dashed' : '',
                )}
                style={{
                  backgroundColor: item.type === 'block' || item.type === 'line' ? item.color : 'transparent',
                  borderColor: item.type === 'dashed' ? item.color : undefined,
                }}
              />
              <span className="text-slate-600">{item.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="h-[300px] rounded-xl border border-slate-50 bg-gradient-to-b from-slate-50/50 to-white px-3 py-4 lg:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `${Math.round(value / 1_000_000)}M`}
              />
              <Tooltip
                content={<ForecastChartTooltip annotations={annotations} selectedScenarioLabel={selectedScenarioLabel} />}
                cursor={{ stroke: '#e2e8f0', strokeDasharray: '4 4' }}
              />

              <Area
                type="monotone"
                dataKey="confidenceHigh"
                name="Biên trên"
                stroke="transparent"
                fill="#e0e7ff"
                fillOpacity={0.55}
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="confidenceLow"
                name="Biên dưới"
                stroke="transparent"
                fill="#ffffff"
                fillOpacity={1}
                connectNulls
              />

              <Line
                type="monotone"
                dataKey="historical"
                name="Lịch sử"
                stroke="#111c2d"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#111c2d' }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Dự báo AI"
                stroke="#3525cd"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ r: 2, fill: '#3525cd' }}
                connectNulls
              />

              {annotations.map((annotation) => (
                <ReferenceLine
                  key={annotation.id}
                  x={annotation.xLabel}
                  stroke={annotation.tone === 'warning' ? '#f59e0b' : '#10b981'}
                  strokeOpacity={0.35}
                  strokeDasharray="5 5"
                  label={{
                    value: annotation.title,
                    position: 'insideTop',
                    fill: annotation.tone === 'warning' ? '#b45309' : '#047857',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              ))}

              {todayLabel ? (
                <ReferenceLine
                  x={todayLabel}
                  stroke="#cbd5e1"
                  strokeDasharray="3 3"
                  label={{ value: 'TODAY', position: 'insideTop', fill: '#0f172a', fontSize: 10, fontWeight: 700 }}
                />
              ) : null}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {annotations.length > 0 ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {annotations.map((annotation) => (
              <article
                key={annotation.id}
                className={cn(
                  'rounded-xl border px-4 py-3 text-xs shadow-sm',
                  annotation.tone === 'warning'
                    ? 'border-amber-200 bg-amber-50/85 text-amber-900'
                    : 'border-emerald-200 bg-emerald-50/85 text-emerald-900',
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-[1.2px] opacity-70">Event marker</p>
                <p className="mt-1 text-sm font-bold">{annotation.title}</p>
                <p className="mt-1 leading-relaxed opacity-90">
                  {annotation.note} <span className="font-semibold">· {annotation.xLabel}</span>
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
