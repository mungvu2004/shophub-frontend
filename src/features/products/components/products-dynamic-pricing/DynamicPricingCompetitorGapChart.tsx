import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts'
import type { DynamicPricingCompetitorGap } from '@/features/products/logic/productsDynamicPricing.types'
import { formatCurrency, formatPercent } from '@/features/products/components/products-dynamic-pricing/dynamicPricing.formatters'

type DynamicPricingCompetitorGapChartProps = {
  gaps: DynamicPricingCompetitorGap[]
}

export function DynamicPricingCompetitorGapChart({ gaps }: DynamicPricingCompetitorGapChartProps) {
  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 shrink-0">
        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-800">Khoảng cách giá đối thủ</h4>
        <p className="mt-1 text-[11px] text-slate-500">So sánh giá hiện tại với trung bình thị trường</p>
      </div>

      <div className="flex-1 w-full p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={gaps} 
            layout="vertical" 
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide domain={[-15, 15]} />
            <YAxis 
              dataKey="platform" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
              width={80}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as DynamicPricingCompetitorGap
                  return (
                    <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">{data.platform}</p>
                      <p className={['text-sm font-bold', data.gapPercent < 0 ? 'text-emerald-600' : 'text-rose-500'].join(' ')}>
                        {data.gapPercent < 0 ? 'Thấp hơn' : 'Cao hơn'} {formatPercent(Math.abs(data.gapPercent))}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">Giá đối thủ: {formatCurrency(data.competitorPrice)}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="gapPercent" radius={[0, 4, 4, 0]} barSize={24}>
              {gaps.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.gapPercent < 0 ? '#10b981' : '#f43f5e'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-[10px] font-bold text-slate-500 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Lợi thế giá (Thấp hơn)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Giá cao hơn
          </span>
        </div>
      </div>
    </aside>
  )
}
