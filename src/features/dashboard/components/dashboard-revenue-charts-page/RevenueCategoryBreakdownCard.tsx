import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { ChartExportMenu } from '@/features/dashboard/components/dashboard-revenue-charts-page/ChartExportMenu'
import { CHART_COMMON_CONFIG, REVENUE_CHART_COLORS, CATEGORY_CHART_COLORS } from '@/features/dashboard/logic/dashboardRevenueCharts.constants'
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

  const chartData = items.map((item, index) => ({
    id: item.id,
    name: item.label,
    value: item.revenue,
    displayValue: item.valueLabel,
    color: CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length]
  }))

  return (
    <section className="h-full rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all hover:shadow-md flex flex-col">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-secondary-900 sm:text-xl">{title}</h3>
          <p className="mt-1 text-sm text-secondary-500">Phân tích tỷ trọng doanh thu theo từng nhóm ngành hàng.</p>
        </div>
        <ChartExportMenu label="Xuất báo cáo" onExport={onExport} />
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Cột 1: Biểu đồ Donut */}
        <div className="h-[240px] lg:col-span-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={80}
                outerRadius={100}
                paddingAngle={6}
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
                    className="cursor-pointer transition-all duration-300 hover:opacity-100 hover:brightness-110"
                    stroke={entry.id === activeCategory?.id ? REVENUE_CHART_COLORS.SLATE_900 : '#fff'}
                    strokeWidth={entry.id === activeCategory?.id ? 2 : 1}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: CHART_COMMON_CONFIG.TOOLTIP_BORDER_RADIUS, 
                  border: `1px solid ${REVENUE_CHART_COLORS.SLATE_200}`, 
                  boxShadow: CHART_COMMON_CONFIG.TOOLTIP_SHADOW 
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                formatter={(_value, name, entry) => {
                  const payload = entry?.payload as { displayValue?: string } | undefined
                  return [payload?.displayValue ?? '', name]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-tighter text-secondary-400">Tổng cộng</span>
            <span className="text-xl font-black text-secondary-900 leading-none">100%</span>
          </div>
        </div>

        {/* Cột 2: Legend */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[280px] overflow-y-auto pr-3 custom-scrollbar">
          {chartData.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCategorySelect(item.id)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-xs transition-all duration-200 active:scale-[0.98] ${
                item.id === activeCategory?.id 
                  ? 'bg-secondary-900 text-white shadow-lg shadow-secondary-900/20' 
                  : 'bg-secondary-50 hover:bg-secondary-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full shadow-sm ring-2 ring-white/20" style={{ backgroundColor: item.color }} />
                <span className={`font-bold tracking-tight ${item.id === activeCategory?.id ? 'text-white' : 'text-secondary-600'}`}>
                  {item.name}
                </span>
              </div>
              <span className={`font-mono font-black ${item.id === activeCategory?.id ? 'text-indigo-300' : 'text-secondary-900'}`}>
                {item.displayValue}
              </span>
            </button>
          ))}
        </div>

        {/* Cột 3: Top Sản phẩm */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-50/50 border border-slate-100 p-5 self-stretch flex flex-col">
          {activeCategory ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Dẫn đầu danh mục</h4>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100">
                  {activeCategory.label}
                </span>
              </div>
              <div className="space-y-2.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
                {activeCategory.products.slice(0, 5).map((product, idx) => (
                  <div key={product.id} className="flex items-center gap-3 group/item p-1.5 rounded-xl transition-colors hover:bg-white/50">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[10px] font-black text-slate-400 shadow-sm border border-slate-100 group-hover/item:text-indigo-600 group-hover/item:border-indigo-100 transition-colors">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[11px] font-bold text-secondary-800">{product.name}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black text-indigo-600">{product.revenueLabel}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-medium text-slate-400">{product.ordersLabel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded-xl bg-white py-2 text-[10px] font-black uppercase tracking-wider text-slate-500 border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                Xem toàn bộ danh mục
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
