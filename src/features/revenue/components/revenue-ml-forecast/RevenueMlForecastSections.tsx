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
import { AlertTriangle, CalendarDays, MoveRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  RevenueMlForecastActionPlanViewModel,
  RevenueMlForecastChartAnnotationViewModel,
  RevenueMlForecastChartLegendViewModel,
  RevenueMlForecastChartPointViewModel,
  RevenueMlForecastHeaderViewModel,
  RevenueMlForecastKpiCardViewModel,
  RevenueMlForecastScenarioCardViewModel,
} from '@/features/revenue/logic/revenueMlForecast.types'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'
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
}

const currencyFormatter = new Intl.NumberFormat('vi-VN')

function ForecastChartTooltip({ active, payload, label }: RevenueMlForecastTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs shadow-lg">
      <p className="mb-2 text-sm font-bold text-slate-700">{label}</p>
      <div className="space-y-2">
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
    </div>
  )
}

export function RevenueMlForecastHeaderSection({
  model,
  onRangeChange,
}: {
  model: RevenueMlForecastHeaderViewModel
  onRangeChange: (days: RevenueMlForecastRangeDays) => void
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.6px] text-[#3525cd]">{model.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-600">
            <span className="font-medium">{model.modelLabel}</span>
            <span className="size-1 rounded-full bg-slate-300" />
            <span>
              Độ chính xác 30 ngày:{' '}
              <strong className="text-[#3525cd] font-semibold text-[14px]">{model.accuracyLabel}</strong>
            </span>
            <span className="size-1 rounded-full bg-slate-300" />
            <span className="text-slate-500">{model.updateLabel}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="h-auto px-0 py-0 text-[13px] font-semibold text-[#3525cd] hover:bg-transparent hover:text-[#3525cd]"
        >
          {model.reportCtaLabel}
        </Button>
      </div>

      <div className="inline-flex rounded-lg bg-[#f0f3ff] p-1 w-fit">
        {model.rangeOptions.map((option) => (
          <button
            key={option.days}
            type="button"
            onClick={() => onRangeChange(option.days)}
            className={cn(
              'rounded-md px-4 py-2 text-xs font-bold transition-all',
              option.isActive
                ? 'bg-white text-[#3525cd] shadow-[0_2px_8px_rgba(53,37,205,0.12)]'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  )
}

export function RevenueMlForecastHeadlineCardsSection({
  cards,
}: {
  cards: RevenueMlForecastKpiCardViewModel[]
}) {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.id}
          className={cn(
            'rounded-2xl border bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]',
            card.accent === 'warning' ? 'border-l-4 border-l-amber-400 border-r border-b border-t-0 border-slate-100' : 'border-slate-100',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-slate-500">{card.label}</p>
            {card.tagLabel ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700 whitespace-nowrap">
                {card.tagLabel}
              </span>
            ) : null}
          </div>

          <p
            className={cn(
              'mt-4 text-[32px] font-bold leading-tight tracking-[-0.5px]',
              card.accent === 'warning' ? 'text-amber-600' : 'text-[#3525cd]',
            )}
          >
            {card.valueLabel}
          </p>

          <p className="mt-3 text-[13px] text-slate-600 font-medium">{card.subValueLabel}</p>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            {card.trendLabel ? (
              <span className={cn('text-[13px] font-bold', card.trendClassName)}>{card.trendLabel}</span>
            ) : card.ctaLabel ? (
              <div className="flex-1" />
            ) : null}

            {card.ctaLabel ? (
              <Button
                variant="ghost"
                className="h-auto px-0 py-0 text-[13px] font-bold text-[#3525cd] hover:bg-transparent gap-1"
              >
                {card.ctaLabel}
                <MoveRight className="size-4" />
              </Button>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  )
}

export function RevenueMlForecastChartSection({
  title,
  points,
  legends,
  annotations,
}: {
  title: string
  points: RevenueMlForecastChartPointViewModel[]
  legends: RevenueMlForecastChartLegendViewModel[]
  annotations: RevenueMlForecastChartAnnotationViewModel[]
}) {
  const todayLabel = points.find((point) => point.historical !== null && point.forecast !== null)?.label

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold text-slate-900">{title}</h2>

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

      <div className="h-[380px] rounded-xl border border-slate-50 bg-gradient-to-b from-slate-50/50 to-white px-3 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${Math.round(value / 1_000_000)}M`}
            />
            <Tooltip content={<ForecastChartTooltip />} cursor={{ stroke: '#e2e8f0', strokeDasharray: '4 4' }} />

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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {annotations.map((annotation) => (
          <article
            key={annotation.id}
            className={cn(
              'rounded-lg border-0 px-4 py-3.5 text-xs shadow-sm',
              annotation.tone === 'warning'
                ? 'border-0 bg-amber-50/80 text-amber-800'
                : 'border-0 bg-emerald-50/80 text-emerald-800',
            )}
          >
            <p className="font-bold text-sm">{annotation.title}</p>
            <p className="mt-1 opacity-90">{annotation.note} – {annotation.xLabel}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function RevenueMlForecastScenarioSection({
  title,
  actionLabel,
  scenarios,
  actionPlan,
}: {
  title: string
  actionLabel: string
  scenarios: RevenueMlForecastScenarioCardViewModel[]
  actionPlan: RevenueMlForecastActionPlanViewModel
}) {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr,1fr]">
      <article className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[22px] font-bold text-slate-900">{title}</h2>
          <Button
            variant="ghost"
            className="h-auto px-0 py-0 text-[12px] font-semibold text-[#3525cd] hover:bg-transparent gap-2"
          >
            <Sparkles className="size-3.5" />
            {actionLabel}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <article
              key={scenario.id}
              className={cn(
                'rounded-xl border-2 px-5 py-5 transition-all',
                scenario.isRecommended
                  ? 'border-[#4f46e5] bg-gradient-to-br from-[#eef0ff] to-[#f5f6ff] shadow-[0_4px_12px_rgba(79,70,229,0.15)]'
                  : 'border-slate-200 bg-white hover:border-slate-300',
              )}
            >
              {scenario.isRecommended ? (
                <span className="mb-3 inline-flex rounded-full bg-[#3525cd] px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-[0.5px]">
                  Được khuyến nghị
                </span>
              ) : null}
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-500">{scenario.title}</p>
              <p
                className={cn(
                  'mt-3 text-[28px] font-bold leading-tight tracking-[-0.3px]',
                  scenario.accent === 'negative'
                    ? 'text-rose-600'
                    : scenario.accent === 'positive'
                    ? 'text-emerald-600'
                    : 'text-[#3525cd]',
                )}
              >
                {scenario.valueLabel}
              </p>
              <p className="mt-3 text-[13px] text-slate-600 leading-relaxed">{scenario.note}</p>
            </article>
          ))}
        </div>
      </article>

      <article className="rounded-2xl bg-gradient-to-br from-[#3525cd] to-[#2d1fa8] px-7 py-7 text-white shadow-[0_12px_40px_rgba(53,37,205,0.35)]">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 text-indigo-200 shrink-0" />
          <h3 className="text-xl font-bold leading-tight">{actionPlan.title}</h3>
        </div>

        <ol className="mt-6 space-y-4">
          {actionPlan.steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3.5 text-[13px] leading-relaxed text-indigo-100">
              <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[12px] font-bold text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <Button className="mt-7 h-10 w-full rounded-lg bg-white text-[13px] font-bold text-[#3525cd] hover:bg-indigo-50 shadow-[0_4px_12px_rgba(255,255,255,0.2)]">
          <CalendarDays className="size-4" />
          {actionPlan.ctaLabel}
        </Button>
      </article>
    </section>
  )
}
