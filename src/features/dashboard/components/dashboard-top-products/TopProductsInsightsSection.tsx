import { useMemo } from 'react'
import { AlertTriangle, Brain, Lightbulb, Info } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { DashboardTopProductsViewModel } from '@/features/dashboard/logic/dashboardTopProducts.types'

type TopProductsInsightsSectionProps = {
  insights: DashboardTopProductsViewModel['insights']
  contribution: DashboardTopProductsViewModel['contribution']
  totalLabel: string
}

const insightToneClassMap = {
  positive: 'border-emerald-100 bg-emerald-50/60',
  info: 'border-indigo-100 bg-indigo-50/60',
  warning: 'border-amber-100 bg-amber-50/60',
}

export function buildTopProductsContributionBackground(segments: DashboardTopProductsViewModel['contribution']) {
  if (segments.length === 0) {
    return '#cbd5e1' // slate-300
  }

  const total = segments.reduce((sum, item) => sum + item.percent, 0) || 1
  let start = 0

  const slices = segments.map((item) => {
    const angle = (item.percent / total) * 360
    const range = `${item.color} ${start.toFixed(2)}deg ${(start + angle).toFixed(2)}deg`
    start += angle
    return range
  })

  return `conic-gradient(${slices.join(', ')})`
}

function InsightIcon({ tone }: { tone: 'positive' | 'info' | 'warning' }) {
  if (tone === 'positive') return <Lightbulb className="h-4 w-4 text-emerald-600" />
  if (tone === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-600" />
  return <Brain className="h-4 w-4 text-indigo-600" />
}

function DonutChart({ segments, totalLabel }: { segments: DashboardTopProductsViewModel['contribution']; totalLabel: string }) {
  const background = useMemo(() => buildTopProductsContributionBackground(segments), [segments])
  const ariaLabel = useMemo(() => 
    `Biểu đồ phân bổ: ${segments.map(s => `${s.label} ${s.percent}%`).join(', ')}`,
    [segments]
  )

  return (
    <div
      className="relative mx-auto h-40 w-40 rounded-full"
      style={{ background }}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
        <div className="text-center">
          <p className="text-[28px] font-bold leading-7 text-slate-900">{totalLabel}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-500">Sản phẩm</p>
        </div>
      </div>
    </div>
  )
}

export function TopProductsInsightsSection({ insights, contribution, totalLabel }: TopProductsInsightsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-3">
        <header className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50">
            <Brain className="h-4 w-4 text-primary-600" />
          </span>
          <h4 className="text-sm font-bold text-slate-900">AI Gợi ý tối ưu</h4>
        </header>
        <p className="mt-1 text-xs text-slate-500">Dựa trên hành vi gần nhất từ dữ liệu top sản phẩm</p>

        <div className="mt-4 space-y-3">
          {insights.map((insight) => (
            <article key={insight.id} className={cn('rounded-xl border p-3', insightToneClassMap[insight.tone])}>
              <div className="flex items-start gap-2">
                <InsightIcon tone={insight.tone} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{insight.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2">
        <header className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Phân bổ Top {totalLabel}</h4>
          <span className="text-xs text-slate-400">
            <Info className="h-3.5 w-3.5" />
          </span>
        </header>

        <div className="mt-4">
          <DonutChart segments={contribution} totalLabel={totalLabel} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {contribution.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md px-2 py-1">
              <span className="inline-flex items-center gap-1 text-xs text-slate-700">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-900">{item.percent}%</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
