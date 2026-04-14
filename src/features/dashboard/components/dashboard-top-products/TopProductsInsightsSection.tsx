import { AlertTriangle, Brain, Lightbulb } from 'lucide-react'

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
    return '#e2e8f0'
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
  return (
    <div
      className="relative mx-auto h-40 w-40 rounded-full"
      style={{
        background: buildTopProductsContributionBackground(segments),
      }}
    >
      <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
        <div className="text-center">
          <p className="text-[28px] font-bold leading-7 text-[#111c2d]">{totalLabel}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#64748b]">Sản phẩm</p>
        </div>
      </div>
    </div>
  )
}

export function TopProductsInsightsSection({ insights, contribution, totalLabel }: TopProductsInsightsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <article className="rounded-2xl border border-[#e7eeff] bg-white p-5 shadow-sm lg:col-span-3">
        <header className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#eef2ff]">
            <Brain className="h-4 w-4 text-[#4338ca]" />
          </span>
          <h4 className="text-sm font-bold text-[#111c2d]">AI Gợi ý tối ưu</h4>
        </header>
        <p className="mt-1 text-xs text-[#64748b]">Dựa trên hành vi gần nhất từ dữ liệu top sản phẩm</p>

        <div className="mt-4 space-y-3">
          {insights.map((insight) => (
            <article key={insight.id} className={cn('rounded-xl border p-3', insightToneClassMap[insight.tone])}>
              <div className="flex items-start gap-2">
                <InsightIcon tone={insight.tone} />
                <div>
                  <p className="text-sm font-semibold text-[#111c2d]">{insight.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#475569]">{insight.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-[#e7eeff] bg-white p-5 shadow-sm lg:col-span-2">
        <header className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#111c2d]">Phân bổ Top {totalLabel}</h4>
          <span className="text-xs text-[#64748b]">i</span>
        </header>

        <div className="mt-4">
          <DonutChart segments={contribution} totalLabel={totalLabel} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {contribution.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md px-2 py-1">
              <span className="inline-flex items-center gap-1 text-xs text-[#334155]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="font-mono text-xs font-semibold text-[#111c2d]">{item.percent}%</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
