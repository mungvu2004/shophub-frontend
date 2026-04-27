import { ChevronDown } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

import type {
  DynamicPricingHistoryPoint,
  DynamicPricingHistorySummary,
} from '@/features/products/logic/productsDynamicPricing.types'
import { formatCurrency } from '@/features/products/components/products-dynamic-pricing/dynamicPricing.formatters'

type DynamicPricingPriceHistoryPanelProps = {
  points: DynamicPricingHistoryPoint[]
  summary: DynamicPricingHistorySummary
  periodLabel: string
  productName: string
}

export function DynamicPricingPriceHistoryPanel({
  points,
  summary,
  periodLabel,
  productName,
}: DynamicPricingPriceHistoryPanelProps) {
  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 shrink-0">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-800">Lịch sử giá</h4>
          <p className="mt-0.5 text-[11px] font-medium text-slate-500 truncate max-w-[180px]">{productName}</p>
        </div>
        <button type="button" className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
          {periodLabel}
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="flex-1 w-full p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="dateLabel" 
              hide={false} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fontWeight: 600, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              hide 
              domain={['dataMin - 5000', 'dataMax + 5000']} 
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-xl">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">{payload[0].payload.dateLabel}</p>
                      <div className="space-y-1.5">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold text-slate-500">{entry.name}:</span>
                            <span className="font-mono text-[10px] font-bold text-slate-900">{formatCurrency(Number(entry.value))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              name="Shopee"
              type="monotone"
              dataKey="shopeePrice"
              stroke="#ee4d2d"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              name="TikTok"
              type="monotone"
              dataKey="tiktokPrice"
              stroke="#000000"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              name="Lazada"
              type="monotone"
              dataKey="lazadaPrice"
              stroke="#0f146d"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              name="Đối thủ"
              type="monotone"
              dataKey="competitorAvgPrice"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Giá trung bình</span>
          <span className="font-mono text-xs font-black text-slate-900">{formatCurrency(summary.averagePrice)}</span>
        </div>
      </div>
    </aside>
  )
}
