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
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-slate-500">Ngày {label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey?.toString()} className="flex items-center justify-between gap-4">
            <span className="font-medium text-slate-600">{item.name}</span>
            <span className="font-bold text-slate-900">{toCurrencyLabel(Number(item.value ?? 0))}</span>
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
    <section className="flex h-full min-h-0 flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Doanh thu theo ngày</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{periodLabel}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          {shouldShowSeries('shopee') ? <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#f97316]" />Shopee</span> : null}
          {shouldShowSeries('tiktok') ? <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#1d4ed8]" />TikTok Shop</span> : null}
          {shouldShowSeries('lazada') ? <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#8b5cf6]" />Lazada</span> : null}
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full border border-slate-400" />{comparisonLabel}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white px-3 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyRevenue} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="shopeeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdba74" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#fdba74" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="tiktokGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="lazadaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={tickInterval}
              minTickGap={10}
              label={{ value: 'Ngày trong tháng', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 12 }}
              tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
            />
            <YAxis hide />
            <Tooltip content={<DailyRevenueTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="shopee" name="Shopee" stackId="1" hide={!shouldShowSeries('shopee')} stroke="#f97316" fill="url(#shopeeGradient)" strokeWidth={2.2} />
            <Area type="monotone" dataKey="tiktok" name="TikTok Shop" stackId="1" hide={!shouldShowSeries('tiktok')} stroke="#2563eb" fill="url(#tiktokGradient)" strokeWidth={2.2} />
            <Area type="monotone" dataKey="lazada" name="Lazada" stackId="1" hide={!shouldShowSeries('lazada')} stroke="#8b5cf6" fill="url(#lazadaGradient)" strokeWidth={2.2} />
            <Area
              type="monotone"
              dataKey="previous"
              name={comparisonLabel}
              stroke="#64748b"
              fill="transparent"
              strokeDasharray="6 4"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
