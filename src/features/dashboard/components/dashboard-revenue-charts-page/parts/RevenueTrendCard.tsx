/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
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
import { REVENUE_CHART_COLORS, CHART_COMMON_CONFIG } from '@/features/dashboard/logic/dashboardRevenueCharts.constants'
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

  const visibleEvents = useMemo(() => 
    timelineEvents.filter((event) => points.some((point) => point.isoDate === event.isoDate)),
    [timelineEvents, points]
  )

  return (
    <section className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="text-heading-2 text-secondary-900 leading-none">{title}</h3>
          <p className="mt-2 text-sm font-medium text-secondary-500 text-pretty">Phân tích xu hướng doanh thu tích hợp đa kênh.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: REVENUE_CHART_COLORS.PRIMARY }} />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-4 border-b-2 border-dashed" style={{ borderBottomColor: REVENUE_CHART_COLORS.SLATE_400 }} />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Kỳ trước</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-4 border-b-2" style={{ borderBottomColor: REVENUE_CHART_COLORS.VOUCHER }} />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-4 border-b-2" style={{ borderBottomColor: REVENUE_CHART_COLORS.PROMOTION }} />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">K.Mãi</span>
          </div>
          <div className="hidden h-4 w-px bg-slate-200 sm:block" />
          <ChartExportMenu label="Xuất trend" onExport={onExport} />
        </div>
      </header>


      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorShopee" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={REVENUE_CHART_COLORS.SHOPEE} stopOpacity={0.06}/>
                <stop offset="95%" stopColor={REVENUE_CHART_COLORS.SHOPEE} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLazada" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={REVENUE_CHART_COLORS.LAZADA} stopOpacity={0.06}/>
                <stop offset="95%" stopColor={REVENUE_CHART_COLORS.LAZADA} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTiktok" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={REVENUE_CHART_COLORS.TIKTOK} stopOpacity={0.03}/>
                <stop offset="95%" stopColor={REVENUE_CHART_COLORS.TIKTOK} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={CHART_COMMON_CONFIG.GRID_COLOR} strokeDasharray="3 3" />
            <XAxis 
              dataKey="dateLabel" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: REVENUE_CHART_COLORS.SLATE_400, fontSize: 11, fontWeight: 700, fontFamily: CHART_COMMON_CONFIG.FONT_FAMILY_MONO }} 
              dy={15}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              width={CHART_COMMON_CONFIG.YAXIS_WIDTH}
              tick={{ fill: REVENUE_CHART_COLORS.SLATE_400, fontSize: 10, fontWeight: 700, fontFamily: CHART_COMMON_CONFIG.FONT_FAMILY_MONO }}
              tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(0)}M` : val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: CHART_COMMON_CONFIG.TOOLTIP_BORDER_RADIUS, 
                border: `1px solid ${REVENUE_CHART_COLORS.SLATE_200}`, 
                boxShadow: CHART_COMMON_CONFIG.TOOLTIP_SHADOW, 
                padding: '16px' 
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 0' }}
              labelStyle={{ fontSize: '11px', color: REVENUE_CHART_COLORS.SLATE_500, marginBottom: '8px', fontWeight: 'black', textTransform: 'uppercase', letterSpacing: '1px' }}
              formatter={(value: any) => [formatCurrency(value), '']}
            />

            {visibleEvents.map((event) => (
              <ReferenceLine
                key={event.id}
                x={event.dateLabel}
                stroke={event.type === 'flash_sale' ? REVENUE_CHART_COLORS.FLASH_SALE : REVENUE_CHART_COLORS.EVENT}
                strokeDasharray="4 4"
                label={{
                  value: `${event.label} (+${event.impactLabel})`,
                  position: 'top',
                  fill: event.type === 'flash_sale' ? REVENUE_CHART_COLORS.FLASH_SALE_TEXT : REVENUE_CHART_COLORS.EVENT_TEXT,
                  fontSize: 10,
                  fontWeight: 800,
                  fontFamily: CHART_COMMON_CONFIG.FONT_FAMILY_SANS
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
              stroke={REVENUE_CHART_COLORS.SLATE_400} 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false} 
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="voucherRevenue"
              name="Doanh thu từ voucher"
              stroke={REVENUE_CHART_COLORS.VOUCHER}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="promotionRevenue"
              name="Doanh thu khuyến mãi"
              stroke={REVENUE_CHART_COLORS.PROMOTION}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Hiện tại (Tổng)" 
              stroke={REVENUE_CHART_COLORS.PRIMARY} 
              strokeWidth={3} 
              dot={{ r: 0 }} 
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: REVENUE_CHART_COLORS.PRIMARY }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
