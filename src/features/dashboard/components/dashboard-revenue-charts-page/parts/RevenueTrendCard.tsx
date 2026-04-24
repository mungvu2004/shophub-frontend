import {
  CartesianGrid,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
  ReferenceLine,
} from 'recharts'

import { ChartExportMenu } from '@/features/dashboard/components/dashboard-revenue-charts-page/ChartExportMenu'
import type {
  RevenueChartExportFormat,
  RevenueChartsDailyTrendPointViewModel,
  RevenueChartsPlatformId,
  RevenueChartsTimelineEventViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueTrendCardProps = {
  title: string
  points: RevenueChartsDailyTrendPointViewModel[]
  selectedPlatform: RevenueChartsPlatformId
  timelineEvents: RevenueChartsTimelineEventViewModel[]
  onExport: (format: RevenueChartExportFormat) => void
}

const formatCurrency = (value: number) => `${new Intl.NumberFormat('vi-VN').format(Math.round(value))}₫`

export function RevenueTrendCard({
  title,
  points,
  selectedPlatform,
  timelineEvents,
  onExport,
}: RevenueTrendCardProps) {
  const showAll = selectedPlatform === 'all'
  const showShopee = showAll || selectedPlatform === 'shopee'
  const showLazada = showAll || selectedPlatform === 'lazada'
  const showTiktok = showAll || selectedPlatform === 'tiktok_shop'

  const visibleEvents = timelineEvents.filter((event) => points.some((point) => point.isoDate === event.isoDate))

  return (
    <section className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="text-heading-2 text-secondary-900 leading-none">{title}</h3>
          <p className="mt-2 text-sm font-medium text-secondary-500 text-pretty">Phân tích xu hướng doanh thu tích hợp đa kênh.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-500/10" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">Tổng hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-5 border-b-2 border-dashed border-slate-400" />
            <span className="text-[11px] font-black uppercase tracking-wider text-secondary-500">Tổng kỳ trước</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-5 border-b-2 border-[#16A34A]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-secondary-500">Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-5 border-b-2 border-[#D97706]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-secondary-500">Khuyến mãi</span>
          </div>
          <ChartExportMenu label="Xuất trend" onExport={onExport} />
        </div>
      </header>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorShopee" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EE4D2D" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#EE4D2D" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLazada" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTiktok" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F8FAFC" strokeDasharray="3 3" />
            <XAxis 
              dataKey="dateLabel" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }} 
              dy={15}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 0' }}
              labelStyle={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: 'black', textTransform: 'uppercase', letterSpacing: '1px' }}
              formatter={(value: number) => [formatCurrency(value), '']}
            />

            {visibleEvents.map((event) => (
              <ReferenceLine
                key={event.id}
                x={event.dateLabel}
                stroke={event.type === 'flash_sale' ? '#EA580C' : '#0EA5E9'}
                strokeDasharray="4 4"
                label={{
                  value: `${event.label} (+${event.impactLabel})`,
                  position: 'top',
                  fill: event.type === 'flash_sale' ? '#C2410C' : '#0369A1',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            ))}
            
            {showShopee && (
              <Area type="monotone" dataKey="shopee" name="Shopee" stroke="none" fillOpacity={1} fill="url(#colorShopee)" />
            )}
            {showLazada && (
              <Area type="monotone" dataKey="lazada" name="Lazada" stroke="none" fillOpacity={1} fill="url(#colorLazada)" />
            )}
            {showTiktok && (
              <Area type="monotone" dataKey="tiktokShop" name="TikTok Shop" stroke="none" fillOpacity={1} fill="url(#colorTiktok)" />
            )}

            <Line 
              type="monotone" 
              dataKey="previousTotal" 
              name="Kỳ trước (Tổng)" 
              stroke="#94A3B8" 
              strokeWidth={2.5} 
              strokeDasharray="8 5" 
              dot={false} 
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="voucherRevenue"
              name="Doanh thu từ voucher"
              stroke="#16A34A"
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="promotionRevenue"
              name="Doanh thu khuyến mãi"
              stroke="#D97706"
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Hiện tại (Tổng)" 
              stroke="#4F46E5" 
              strokeWidth={4} 
              dot={{ r: 0 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#4F46E5' }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
