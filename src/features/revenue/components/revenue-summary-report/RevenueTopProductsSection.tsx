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
import { Sparkles } from 'lucide-react'

import type { RevenueSummaryReportViewModel } from '@/features/revenue/logic/revenueSummaryReport.logic'
import { toCurrencyLabel } from '@/features/revenue/components/revenue-summary-report/revenueSummaryReport.formatters'
import { REVENUE_COLORS, CHART_CONFIG, REVENUE_LAYOUT } from '@/features/revenue/logic/revenueSummary.constants'

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
    <div className="rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-secondary-200/50">
      <p className="font-bold text-secondary-700 uppercase tracking-tight text-[10px] mb-1">{item.label}</p>
      <p className="font-bold font-mono text-secondary-900">{item.amountLabel}</p>
    </div>
  )
}

export function RevenueTopProductsSection({
  topProducts,
  onViewDetails,
}: RevenueTopProductsSectionProps) {
  // Sử dụng layout constant để giới hạn số lượng hiển thị
  const displayProducts = topProducts.slice(0, REVENUE_LAYOUT.TOP_PRODUCTS_LIMIT)

  return (
    <section className="flex flex-col rounded-xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-secondary-900 tracking-tight">Doanh thu theo sản phẩm</h3>
          <p className="text-[10px] text-secondary-500 font-bold uppercase tracking-widest mt-0.5">Top {REVENUE_LAYOUT.TOP_PRODUCTS_LIMIT} dẫn đầu</p>
        </div>
        <button
          type="button"
          onClick={onViewDetails}
          className="group inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-tight transition-colors"
        >
          Chi tiết
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {displayProducts.map((product) => (
          <div key={product.id} className="grid grid-cols-[28px_1fr_auto] items-center gap-3">
            <span className="text-[10px] font-bold font-mono text-secondary-400">#{product.rank.toString().padStart(2, '0')}</span>
            <div className="relative h-7 w-full overflow-hidden rounded-md bg-secondary-50 border border-secondary-100">
              <div
                className="flex h-full items-center rounded-[4px] bg-primary-500/90 px-3 transition-all duration-700 ease-out"
                style={{ width: `${Math.max(product.ratioPercent, 15)}%` }}
              >
                <span className="truncate text-[10px] font-bold text-white uppercase tracking-tight">
                  {product.name}
                </span>
              </div>
            </div>
            <span className="text-sm font-bold font-mono text-secondary-800 tabular-nums">{product.valueLabel}</span>
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
    <article className="flex flex-col rounded-xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-lg font-bold text-secondary-900 tracking-tight">Phân tích Chi phí</h3>
      <p className="mt-0.5 text-xs text-secondary-500 font-medium">Bóc tách vận hành theo nhóm</p>

      <div className="mt-8 flex flex-1 items-center gap-8">
        <div className="h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={costBreakdown} 
                dataKey="amount" 
                nameKey="label" 
                innerRadius={38} 
                outerRadius={58} 
                paddingAngle={4}
                stroke="none"
              >
                {costBreakdown.map((item) => (
                  <Cell key={item.id} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3">
          {costBreakdown.map((item) => (
            <div key={item.id} className="grid grid-cols-[10px_1fr_auto] items-center gap-3 text-xs">
              <span className="size-2 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-secondary-600 truncate">{item.label}</span>
              <span className="text-right font-bold font-mono text-secondary-900 tabular-nums">{item.percentLabel}</span>
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
    <article className="flex flex-col rounded-xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-secondary-900 tracking-tight">Dòng chảy lợi nhuận</h3>
          <p className="mt-0.5 text-[10px] text-secondary-500 font-bold uppercase tracking-widest">Waterfall Analysis</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary-50 border border-primary-100 text-primary-700 text-[10px] font-bold">
          <Sparkles className="size-3" />
          AI ANALYZED
        </div>
      </div>

      <div className="h-[280px] w-full min-h-0 rounded-xl border border-secondary-100 bg-secondary-50/30 p-5 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={CHART_CONFIG.GRID_COLOR} />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 10, fill: CHART_CONFIG.TICK_COLOR, fontWeight: 700 }} 
              tickLine={false} 
              axisLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: CHART_CONFIG.TICK_COLOR, fontWeight: 600, fontFamily: CHART_CONFIG.FONT_FAMILY_MONO }}
              tickLine={false}
              axisLine={false}
              width={55}
              domain={[0, maxValue * 1.1]}
              tickFormatter={(value) => toCurrencyLabel(Number(value)).replace(' ₫', '')}
            />
            <Tooltip content={<ProfitFlowTooltip />} cursor={{ fill: REVENUE_COLORS.PRIMARY, fillOpacity: 0.03 }} />
            <Bar dataKey="base" stackId="flow" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="delta" stackId="flow" radius={[4, 4, 0, 0]} animationDuration={1500}>
              {waterfallData.map((item) => (
                <Cell
                  key={item.id}
                  fill={item.kind === 'decrease' ? REVENUE_COLORS.DANGER : item.kind === 'total' ? REVENUE_COLORS.PRIMARY : REVENUE_COLORS.SUCCESS}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-secondary-500">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-sm" style={{ backgroundColor: REVENUE_COLORS.SUCCESS }} />
          Tăng / Tổng
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-sm" style={{ backgroundColor: REVENUE_COLORS.DANGER }} />
          Chi phí
        </span>
      </div>
    </article>
  )
}
