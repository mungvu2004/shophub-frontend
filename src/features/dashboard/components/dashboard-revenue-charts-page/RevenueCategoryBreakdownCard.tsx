import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { RevenueChartsCategoryItemViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueCategoryBreakdownCardProps = {
  title: string
  items: RevenueChartsCategoryItemViewModel[]
}

export function RevenueCategoryBreakdownCard({ title, items }: RevenueCategoryBreakdownCardProps) {
  const chartData = items.map(item => ({
    name: item.label,
    value: parseFloat(item.valueLabel.replace(/[^\d]/g, '')) || 0,
    displayValue: item.valueLabel,
    color: item.barColor
  }))

  return (
    <section className="h-full rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="mb-6 text-xl font-bold text-secondary-900 tracking-tight">{title}</h3>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              formatter={(_: any, name: string, entry: any) => [entry.payload.displayValue, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '20px', color: '#64748b' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 border-t border-secondary-100 pt-6 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.barColor }} />
              <span className="font-semibold text-secondary-500">{item.label}</span>
            </div>
            <span className="font-mono font-bold text-secondary-900">{item.valueLabel}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
