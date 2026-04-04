import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowLeft, Lightbulb, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { InventoryAIForecastDetailViewModel } from '@/features/inventory/logic/inventoryAIForecastDetail.types'

type InventoryAIForecastDetailViewProps = {
  model: InventoryAIForecastDetailViewModel
  onBack: () => void
}

export function InventoryAIForecastDetailView({ model, onBack }: InventoryAIForecastDetailViewProps) {
  const chartData = model.chartPoints.map((point) => ({
    monthLabel: point.monthLabel,
    historical: point.historical,
    forecast: point.forecast,
    confidenceLow: point.confidenceRange[0],
    confidenceHigh: point.confidenceRange[1],
  }))

  return (
    <div className="space-y-8 rounded-xl bg-[#f9f9ff] p-8">
      <header className="space-y-1">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-indigo-700">{model.title}</h1>
        <p className="text-sm text-slate-600">{model.subtitle}</p>
      </header>

      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-600">
        <ArrowLeft className="h-4 w-4" />
        {model.backLabel}
      </button>

      <section className="space-y-8 rounded-xl bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-mono text-[22px] font-semibold text-slate-900">{model.skuTitle}</h2>
            <div className="mt-3 flex items-center gap-2">
              {model.tags.map((tag) => (
                <span key={tag} className="rounded bg-indigo-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Button className="bg-gradient-to-br from-indigo-700 to-indigo-600 px-6 hover:from-indigo-600 hover:to-indigo-600">
            Tạo lệnh nhập hàng
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Metric label="Tồn hiện tại" value={model.currentStockLabel} valueClassName="text-slate-900" />
          <Metric label="Bán TB/ngày" value={model.avgDailySalesLabel} valueClassName="text-slate-900" />
          <Metric label="Hết hàng dự kiến" value={model.stockoutDateLabel} valueClassName="text-red-700" />
          <Metric label="Gợi ý nhập" value={model.suggestedInboundLabel} valueClassName="text-indigo-700" />
        </div>
      </section>

      <section className="space-y-6 rounded-xl bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">{model.chartTitle}</h3>
          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500">
            <LegendTag colorClassName="bg-slate-900" label={model.chartLegend.history} />
            <LegendTag colorClassName="bg-indigo-600" dashed label={model.chartLegend.forecast} />
            <LegendTag colorClassName="bg-indigo-200" label={model.chartLegend.confidence} />
          </div>
        </div>

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid stroke="#eef2ff" vertical={false} />
              <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }} />
              <Tooltip />
              <Legend wrapperStyle={{ display: 'none' }} />
              <Area type="monotone" dataKey="confidenceHigh" stroke="none" fill="#e7e9ff" />
              <Area type="monotone" dataKey="confidenceLow" stroke="none" fill="#ffffff" />
              <Line type="monotone" dataKey="historical" stroke="#111c2d" strokeWidth={2.2} dot={false} connectNulls />
              <Line type="monotone" dataKey="forecast" stroke="#3525cd" strokeDasharray="6 4" strokeWidth={2.2} dot={{ r: 3 }} connectNulls />
              <ReferenceLine x="MAR" stroke="#cbd5e1" strokeDasharray="4 4" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <article className="space-y-6 rounded-xl bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            {model.factorsTitle}
          </h3>

          <div className="space-y-5">
            {model.factors.map((factor) => (
              <div key={factor.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-800">{factor.label}</span>
                  <span className="font-mono font-bold text-indigo-700">{factor.impactPercent}% <span className="text-[10px] text-slate-400">IMPACT</span></span>
                </div>
                <div className="h-2 rounded-full bg-indigo-100">
                  <div className="h-full rounded-full bg-indigo-700" style={{ width: `${Math.max(0, Math.min(100, factor.impactPercent))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-600 p-8 text-white shadow-[0_20px_25px_-5px_rgba(53,37,205,0.2)]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <p className="text-xs font-bold uppercase tracking-wider text-white/80">{model.aiTitle}</p>
          <p className="mt-4 text-[18px] leading-8">{model.aiSuggestionText}</p>

          <div className="mt-8 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-white/70">Tình trạng rủi ro</p>
                <p className="font-bold">{model.riskLabel}</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}

function Metric({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 font-mono text-[30px] font-bold leading-9 ${valueClassName ?? 'text-slate-900'}`}>{value}</p>
    </div>
  )
}

function LegendTag({
  colorClassName,
  label,
  dashed = false,
}: {
  colorClassName: string
  label: string
  dashed?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-[2px] w-3 ${colorClassName} ${dashed ? 'border border-dashed border-indigo-600 bg-transparent' : ''}`} />
      <span>{label}</span>
    </span>
  )
}
