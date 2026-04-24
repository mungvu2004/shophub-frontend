import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'

import { ChartExportMenu } from '@/features/dashboard/components/dashboard-revenue-charts-page/ChartExportMenu'
import type {
  RevenueChartExportFormat,
  RevenueChartsCategoryItemViewModel,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueCategoryBreakdownCardProps = {
  title: string
  items: RevenueChartsCategoryItemViewModel[]
  selectedCategoryId: string | null
  onCategorySelect: (categoryId: string) => void
  onExport: (format: RevenueChartExportFormat) => void
}

export function RevenueCategoryBreakdownCard({
  title,
  items,
  selectedCategoryId,
  onCategorySelect,
  onExport,
}: RevenueCategoryBreakdownCardProps) {
  const activeCategory = selectedCategoryId
    ? items.find((item) => item.id === selectedCategoryId) ?? items[0]
    : items[0]

  const chartData = items.map(item => ({
    id: item.id,
    name: item.label,
    value: item.revenue,
    displayValue: item.valueLabel,
    color: item.barColor
  }))

  return (
    <section className="h-full rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <header className="mb-6 flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-secondary-900 tracking-tight">{title}</h3>
        <ChartExportMenu label="Xuất donut" onExport={onExport} />
      </header>

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
              onClick={(_, index) => {
                const target = chartData[index]
                if (target) onCategorySelect(target.id)
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  stroke={entry.id === activeCategory?.id ? '#0F172A' : 'none'}
                  strokeWidth={entry.id === activeCategory?.id ? 1.2 : 0}
                />
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
          <button
            key={item.id}
            type="button"
            onClick={() => onCategorySelect(item.id)}
            className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition ${
              item.id === activeCategory?.id ? 'bg-secondary-100' : 'hover:bg-secondary-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.barColor }} />
              <span className="font-semibold text-secondary-500">{item.label}</span>
            </div>
            <span className="font-mono font-bold text-secondary-900">{item.valueLabel}</span>
          </button>
        ))}
      </div>

      {activeCategory ? (
        <div className="mt-6 border-t border-secondary-100 pt-5">
          <p className="mb-3 text-[11px] font-black uppercase tracking-wider text-secondary-500">
            Top sản phẩm trong danh mục: {activeCategory.label}
          </p>
          <div className="space-y-2">
            {activeCategory.products.map((product) => (
              <div key={product.id} className="rounded-lg border border-secondary-100 bg-secondary-50 px-3 py-2">
                <p className="text-xs font-bold text-secondary-900">{product.name}</p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-secondary-600">
                  <span>{product.revenueLabel}</span>
                  <span>{product.ordersLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
