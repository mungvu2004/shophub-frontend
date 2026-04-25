import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { RevenueSummaryReportViewModel } from '@/features/revenue/logic/revenueSummaryReport.logic'
import { toCurrencyLabel } from '@/features/revenue/components/revenue-summary-report/revenueSummaryReport.formatters'
import type { RevenueSummaryPlatformFilter } from '@/types/revenue.types'
import { REVENUE_COLORS, CHART_CONFIG } from '@/features/revenue/logic/revenueSummary.constants'

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

function DailyRevenueTooltip({ active, payload, label }: RevenueTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-xs shadow-xl ring-1 ring-secondary-200/50">
      <p className="mb-1.5 font-bold text-secondary-500 uppercase tracking-widest text-[10px]">Ngày {label}</p>
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={item.dataKey?.toString()} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: item.dataKey === 'shopee' ? REVENUE_COLORS.SHOPEE : item.dataKey === 'tiktok' ? REVENUE_COLORS.TIKTOK : item.dataKey === 'lazada' ? REVENUE_COLORS.LAZADA : REVENUE_COLORS.PREVIOUS }} />
              <span className="font-semibold text-secondary-600">{item.name}</span>
            </div>
            <span className="font-bold font-mono text-secondary-900">{toCurrencyLabel(Number(item.value ?? 0))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

type RevenueDailyChartSectionProps = {
  periodLabel: string
  comparisonLabel: string
  dailyRevenue: RevenueSummaryReportViewModel['dailyRevenue']
  selectedPlatform: RevenueSummaryPlatformFilter
}

export function RevenueDailyChartSection({
  periodLabel,
  comparisonLabel,
  dailyRevenue,
  selectedPlatform,
}: RevenueDailyChartSectionProps) {
  const tickInterval = dailyRevenue.length > 16 ? 1 : 0

  const shouldShowSeries = (platform: Exclude<RevenueSummaryPlatformFilter, 'all'>) => {
    return selectedPlatform === 'all' || selectedPlatform === platform
  }

  return (
    <section className="flex flex-col rounded-xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-secondary-900 tracking-tight">Doanh thu theo ngày</h2>
          <p className="mt-1 text-sm font-semibold text-secondary-500">{periodLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-secondary-500">
          {shouldShowSeries('shopee') ? <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full" style={{ backgroundColor: REVENUE_COLORS.SHOPEE }} />Shopee</span> : null}
          {shouldShowSeries('tiktok') ? <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full" style={{ backgroundColor: REVENUE_COLORS.TIKTOK }} />TikTok Shop</span> : null}
          {shouldShowSeries('lazada') ? <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full" style={{ backgroundColor: REVENUE_COLORS.LAZADA }} />Lazada</span> : null}
          <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full border border-secondary-400" />{comparisonLabel}</span>
        </div>
      </div>

      <div className="h-[320px] w-full min-h-0 flex-1 rounded-xl border border-secondary-100 bg-secondary-50/20 px-2 py-5 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyRevenue} margin={{ top: 10, right: 15, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={CHART_CONFIG.GRID_COLOR} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={tickInterval}
              minTickGap={15}
              tick={{ fontSize: 10, fill: CHART_CONFIG.TICK_COLOR, fontWeight: 700, fontFamily: CHART_CONFIG.FONT_FAMILY_MONO }}
            />
            <YAxis hide />
            <Tooltip content={<DailyRevenueTooltip />} cursor={{ stroke: REVENUE_COLORS.PRIMARY, strokeDasharray: '6 6', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="shopee" name="Shopee" stackId="1" hide={!shouldShowSeries('shopee')} stroke={REVENUE_COLORS.SHOPEE} fill={REVENUE_COLORS.SHOPEE} fillOpacity={0.08} strokeWidth={2.5} animationDuration={1000} />
            <Area type="monotone" dataKey="tiktok" name="TikTok Shop" stackId="1" hide={!shouldShowSeries('tiktok')} stroke={REVENUE_COLORS.TIKTOK} fill={REVENUE_COLORS.TIKTOK} fillOpacity={0.08} strokeWidth={2.5} animationDuration={1200} />
            <Area type="monotone" dataKey="lazada" name="Lazada" stackId="1" hide={!shouldShowSeries('lazada')} stroke={REVENUE_COLORS.LAZADA} fill={REVENUE_COLORS.LAZADA} fillOpacity={0.08} strokeWidth={2.5} animationDuration={1400} />
            <Area
              type="monotone"
              dataKey="previous"
              name={comparisonLabel}
              stroke={REVENUE_COLORS.PREVIOUS}
              fill="transparent"
              strokeDasharray="6 6"
              strokeWidth={2}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
