import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMemo } from 'react'

import type { RevenueSummaryReportViewModel } from '@/features/revenue/logic/revenueSummaryReport.logic'
import { toCurrencyLabel } from '@/features/revenue/components/revenue-summary-report/revenueSummaryReport.formatters'

type RevenueTopProductsSectionProps = {
  topProducts: RevenueSummaryReportViewModel['topProducts']
  onViewDetails: () => void
}

type RevenueCostBreakdownSectionProps = {
  costBreakdown: RevenueSummaryReportViewModel['costBreakdown']
}

type RevenueProfitFlowSectionProps = {
  profitFlow: RevenueSummaryReportViewModel['profitFlow']
  profitFlowMax: number
}

type ProfitFlowTooltipProps = {
  active?: boolean
  payload?: Array<{
    payload?: {
      label: string
      amount: number
      amountLabel: string
    }
  }>
}

function ProfitFlowTooltip({ active, payload }: ProfitFlowTooltipProps) {
  if (!active || !payload?.length || !payload[0]?.payload) {
    return null
  }

  const item = payload[0].payload

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-700">{item.label}</p>
      <p className="mt-1 font-bold text-slate-900">{item.amountLabel}</p>
    </div>
  )
}

export function RevenueTopProductsSection({
  topProducts,
  onViewDetails,
}: RevenueTopProductsSectionProps) {
  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Doanh thu theo sản phẩm - Top 15</h3>
        <button
          type="button"
          onClick={onViewDetails}
          className="text-xs font-semibold text-indigo-700 hover:underline"
        >
          Chi tiết
        </button>
      </div>

      <div className="space-y-2 overflow-hidden">
        {topProducts.map((product) => (
          <div key={product.id} className="grid grid-cols-[30px_1fr_auto] items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">{product.rank}</span>
            <div className="h-8 overflow-hidden rounded-full bg-indigo-100">
              <div
                className="flex h-full items-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 px-4 text-xs font-semibold text-white"
                style={{ width: `${Math.max(product.ratioPercent, 20)}%` }}
              >
                {product.name}
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-700">{product.valueLabel}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function RevenueCostBreakdownSection({
  costBreakdown,
}: RevenueCostBreakdownSectionProps) {
  return (
    <article className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Phân tích Chi phí</h3>
      <p className="mt-1 text-xs text-slate-500">Bóc tách Chi phí vận hành theo nhóm</p>

      <div className="mt-2 grid flex-1 min-h-0 grid-cols-[110px_1fr] items-center gap-2">
        <div className="h-28 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={costBreakdown} dataKey="amount" nameKey="label" innerRadius={30} outerRadius={44} paddingAngle={2}>
                {costBreakdown.map((item) => (
                  <Cell key={item.id} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {costBreakdown.map((item) => (
            <div key={item.id} className="grid grid-cols-[12px_1fr_auto] items-center gap-2 text-xs">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-600">{item.label}</span>
              <span className="text-right font-semibold text-slate-800">{item.percentLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export function RevenueProfitFlowSection({
  profitFlow,
  profitFlowMax,
}: RevenueProfitFlowSectionProps) {
  const waterfallData = useMemo(() => {
    let runningTotal = 0

    return profitFlow.map((item) => {
      let start = runningTotal
      let end = runningTotal

      if (item.kind === 'decrease') {
        end = runningTotal - item.amount
        runningTotal = end
      } else if (item.kind === 'total') {
        start = 0
        end = item.amount
        runningTotal = item.amount
      } else {
        end = runningTotal + item.amount
        runningTotal = end
      }

      return {
        ...item,
        base: Math.min(start, end),
        delta: Math.abs(end - start),
      }
    })
  }, [profitFlow])

  const maxValue = Math.max(
    1,
    profitFlowMax,
    waterfallData.reduce((acc, item) => Math.max(acc, item.base + item.delta), 0),
  )

  return (
        <article className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Dòng chảy lợi nhuận (Waterfall)</h3>
          <p className="mt-1 text-xs text-slate-500">Doanh thu gộp trừ các chi phí để ra lợi nhuận ròng</p>

          <div className="mt-3 flex-1 min-h-0 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 8, right: 4, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  width={62}
                  domain={[0, maxValue * 1.1]}
                  tickFormatter={(value) => toCurrencyLabel(Number(value)).replace(' ₫', '')}
                />
                <Tooltip content={<ProfitFlowTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="base" stackId="flow" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="delta" stackId="flow" radius={[6, 6, 0, 0]}>
                  {waterfallData.map((item) => (
                    <Cell
                      key={item.id}
                      fill={item.kind === 'decrease' ? '#dc2626' : '#16a34a'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center gap-4 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-emerald-600" />
              Tăng / Tổng
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-red-600" />
              Chi phí giảm trừ
            </span>
          </div>
    </article>
  )
}
