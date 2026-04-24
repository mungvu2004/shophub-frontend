import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'

import { ChartExportMenu } from '@/features/dashboard/components/dashboard-revenue-charts-page/ChartExportMenu'
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
      <header className="mb-6 flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-secondary-900 tracking-tight">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary-600 border border-primary-100">
            {peakHoursLabel}
          </span>
          <ChartExportMenu label="Xuất giờ" onExport={onExport} />
        </div>
      </header>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#F8FAFC" />
            <XAxis 
              dataKey="hourLabel" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
              interval={2}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(val) => `${val/1000000}M`}
            />
            <Tooltip 
              cursor={{ fill: '#F1F5F9', opacity: 0.5 }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: 'bold' }}
              formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={20}>
              {points.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isPeak ? '#4F46E5' : '#E2E8F0'} 
                  className="transition-colors duration-300 hover:fill-primary-400"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-sm bg-[#E2E8F0]" />
          <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest">Giờ thường</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-sm bg-[#4F46E5]" />
          <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest">Giờ cao điểm</span>
        </div>
      </div>
    </section>
  )
}
