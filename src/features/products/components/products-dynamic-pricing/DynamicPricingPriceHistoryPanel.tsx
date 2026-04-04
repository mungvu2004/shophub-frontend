import { ChevronDown } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

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
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-800">Lịch sử giá</h4>
          <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
            {periodLabel}
            <ChevronDown className="h-3 w-3" aria-hidden />
          </button>
        </div>

        <p className="mt-3 text-sm font-semibold text-slate-700">{productName}</p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Shopee
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            TikTok
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            Lazada
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <span className="h-0.5 w-3 bg-slate-300" />
            Đối thủ
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={points}>
            <XAxis
              dataKey="dateLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis hide domain={['dataMin - 2000', 'dataMax + 2000']} />
            <Line type="monotone" dataKey="shopeePrice" stroke="#f97316" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="tiktokPrice" stroke="#0f172a" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="lazadaPrice" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
            <Line
              type="monotone"
              dataKey="competitorAvgPrice"
              stroke="#cbd5e1"
              strokeDasharray="5 4"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Giá thấp nhất</span>
          <span className="font-mono font-semibold text-indigo-600">{formatCurrency(summary.lowestPrice)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-slate-500">Giá trung bình</span>
          <span className="font-mono font-semibold text-slate-800">{formatCurrency(summary.averagePrice)}</span>
        </div>
      </div>
    </aside>
  )
}
