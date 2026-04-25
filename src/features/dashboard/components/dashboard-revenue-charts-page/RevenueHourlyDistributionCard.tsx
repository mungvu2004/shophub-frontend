import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'

import { ChartExportMenu } from '@/features/dashboard/components/dashboard-revenue-charts-page/ChartExportMenu'
import { CHART_COMMON_CONFIG, REVENUE_CHART_COLORS } from '@/features/dashboard/logic/dashboardRevenueCharts.constants'
import type { RevenueChartExportFormat, RevenueChartsHourlyPointViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueHourlyDistributionCardProps = {
  title: string
  peakHoursLabel: string
  points: RevenueChartsHourlyPointViewModel[]
  onExport: (format: RevenueChartExportFormat) => void
}

const formatCurrency = (value: number) => `${new Intl.NumberFormat('vi-VN').format(Math.round(value))}₫`

export function RevenueHourlyDistributionCard({
  title,
  peakHoursLabel,
  points,
  onExport,
}: RevenueHourlyDistributionCardProps) {
  return (
    <section className="h-full rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-lg font-bold tracking-tight text-secondary-900 sm:text-xl">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary-600 border border-primary-100">
            {peakHoursLabel}
          </span>
          <ChartExportMenu label="Xuất giờ" onExport={onExport} />
        </div>
      </header>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke={CHART_COMMON_CONFIG.GRID_COLOR} />
            <XAxis 
              dataKey="hourLabel" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: REVENUE_CHART_COLORS.SLATE_400, fontSize: 10, fontWeight: 700, fontFamily: CHART_COMMON_CONFIG.FONT_FAMILY_MONO }}
              interval={3}
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: REVENUE_CHART_COLORS.SLATE_400, fontSize: 10, fontWeight: 700, fontFamily: CHART_COMMON_CONFIG.FONT_FAMILY_MONO }}
              tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(0)}M` : val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
            />
            <Tooltip 
              cursor={{ fill: REVENUE_CHART_COLORS.SLATE_200, opacity: 0.5 }}
              contentStyle={{ 
                borderRadius: CHART_COMMON_CONFIG.TOOLTIP_BORDER_RADIUS, 
                border: `1px solid ${REVENUE_CHART_COLORS.SLATE_200}`, 
                boxShadow: CHART_COMMON_CONFIG.TOOLTIP_SHADOW,
                padding: '12px'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ fontSize: '10px', color: REVENUE_CHART_COLORS.SLATE_500, marginBottom: '6px', fontWeight: 'black', textTransform: 'uppercase' }}
              formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
            />

            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={20}>
              {points.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isPeak ? REVENUE_CHART_COLORS.PRIMARY : REVENUE_CHART_COLORS.SLATE_200} 
                  className="transition-colors duration-300 hover:fill-primary-400"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-sm" style={{ backgroundColor: REVENUE_CHART_COLORS.SLATE_200 }} />
          <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest">Giờ thường</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-sm" style={{ backgroundColor: REVENUE_CHART_COLORS.PRIMARY }} />
          <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest">Giờ cao điểm</span>
        </div>
      </div>
    </section>
  )
}
