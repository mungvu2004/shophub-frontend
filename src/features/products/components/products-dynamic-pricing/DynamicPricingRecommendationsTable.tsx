import { MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { DynamicPricingRecommendation } from '@/features/products/logic/productsDynamicPricing.types'
import {
  formatCurrency,
  formatPercent,
  platformLabelMap,
} from '@/features/products/components/products-dynamic-pricing/dynamicPricing.formatters'

type DynamicPricingRecommendationsTableProps = {
  rows: DynamicPricingRecommendation[]
  onOpenProductDetail: (productId: string) => void
}

const confidencePill = (score: number) =>
  Array.from({ length: 4 }, (_, index) => (
    <span
      key={`${score}-${index}`}
      className={['h-3 w-1.5 rounded-full', index < score ? 'bg-indigo-500' : 'bg-indigo-200'].join(' ')}
    />
  ))

export function DynamicPricingRecommendationsTable({ rows, onOpenProductDetail }: DynamicPricingRecommendationsTableProps) {
  return (
    <Table disableScroll>
      <TableHeader className="bg-slate-50/80">
        <TableRow className="border-b border-slate-100 hover:bg-slate-50/80">
          <TableHead className="h-14 px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Sản phẩm</TableHead>
          <TableHead className="h-14 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Sàn</TableHead>
          <TableHead className="h-14 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Giá hiện tại</TableHead>
          <TableHead className="h-14 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Giá AI gợi ý</TableHead>
          <TableHead className="h-14 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Chênh lệch</TableHead>
          <TableHead className="h-14 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Lý do</TableHead>
          <TableHead className="h-14 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Độ tin cậy</TableHead>
          <TableHead className="h-14 px-6 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Hành động</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((item) => {
          const isGrowth = item.changePercent >= 0

          return (
            <TableRow
              key={item.id}
              className="cursor-pointer border-slate-100 hover:bg-indigo-50/40"
              onClick={() => onOpenProductDetail(item.productId)}
            >
              <TableCell className="px-6 py-4 align-middle">
                <div className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.productName} className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">{item.productName}</p>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">SKU: {item.sku}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Badge variant="outline" className="text-xs font-semibold">
                  {platformLabelMap[item.platform]}
                </Badge>
              </TableCell>

              <TableCell className="text-right font-mono text-sm text-slate-600">{formatCurrency(item.currentPrice)}</TableCell>
              <TableCell className="text-right font-mono text-sm font-bold text-indigo-600">{formatCurrency(item.aiPrice)}</TableCell>

              <TableCell className="text-center">
                <span
                  className={[
                    'inline-flex items-center gap-1 text-xs font-bold',
                    isGrowth ? 'text-emerald-600' : 'text-rose-500',
                  ].join(' ')}
                >
                  {isGrowth ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {formatPercent(item.changePercent)}
                </span>
              </TableCell>

              <TableCell className="max-w-[180px] whitespace-normal text-xs text-slate-500">{item.reason}</TableCell>

              <TableCell>
                <div className="flex items-center justify-center gap-1">{confidencePill(item.confidence)}</div>
              </TableCell>

              <TableCell className="px-6 text-right">
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpenProductDetail(item.productId)
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" aria-hidden />
                </button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
