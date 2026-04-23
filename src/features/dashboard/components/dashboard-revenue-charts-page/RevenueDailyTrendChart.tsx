import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { RevenueChartsDailyTrendPointViewModel, RevenueChartsPlatformId } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueDailyTrendChartProps = {
  title: string
  points: RevenueChartsDailyTrendPointViewModel[]
  selectedPlatform: RevenueChartsPlatformId
}

type TooltipProps = {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; dataKey?: string | number }>
  label?: string
}

const formatCurrency = (value: number) => `${new Intl.NumberFormat('vi-VN').format(Math.round(value))}₫`

function DailyTrendTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey?.toString()} className="flex items-center justify-between gap-5 text-xs">
            <span className="font-semibold text-slate-700">{item.name}</span>
            <span className="font-bold text-slate-900">{formatCurrency(Number(item.value ?? 0))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RevenueDailyTrendChart({ title, points, selectedPlatform }: RevenueDailyTrendChartProps) {
  const showShopee = selectedPlatform === 'all' || selectedPlatform === 'shopee'
  const showLazada = selectedPlatform === 'all' || selectedPlatform === 'lazada'
  const showTiktok = selectedPlatform === 'all' || selectedPlatform === 'tiktok_shop'

  return (
    <section className="rounded-xl border border-indigo-100 bg-white px-6 pb-5 pt-6 shadow-sm">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          {showShopee && (
            <span className="inline-flex items-center gap-2">
              <i className="h-3 w-3 rounded-full bg-[#EE4D2D]" />Shopee
            </span>
          )}
          {showLazada && (
            <span className="inline-flex items-center gap-2">
              <i className="h-3 w-3 rounded-full bg-[#6366F1]" />Lazada
            </span>
          )}
          {showTiktok && (
            <span className="inline-flex items-center gap-2">
              <i className="h-3 w-3 rounded-full bg-[#3525CD]" />TikTok Shop
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <i className="h-[2px] w-4 border-b border-dashed border-slate-400" />Kỳ trước
          </span>
        </div>
      </header>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="#EEF2FF" />
            <YAxis hide />
            <XAxis dataKey="dateLabel" tickLine={false} axisLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
            <Tooltip content={<DailyTrendTooltip />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
            {showShopee && <Line type="monotone" dataKey="shopee" name="Shopee" stroke="#EE4D2D" strokeWidth={2.5} dot={false} />}
            {showLazada && <Line type="monotone" dataKey="lazada" name="Lazada" stroke="#6366F1" strokeWidth={2.5} dot={false} />}
            {showTiktok && <Line type="monotone" dataKey="tiktokShop" name="TikTok Shop" stroke="#3525CD" strokeWidth={2.5} dot={false} />}
            <Line type="monotone" dataKey="previousTotal" name="Kỳ trước" stroke="#94A3B8" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

