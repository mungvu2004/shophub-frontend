import { MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react'

import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
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
  const columns: DataTableColumn<DynamicPricingRecommendation>[] = [
    {
      id: 'product',
      header: 'Sản phẩm',
      widthClassName: 'px-6',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cellClassName: 'px-6 align-middle',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <img src={item.imageUrl} alt={item.productName} className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">{item.productName}</p>
            <p className="text-[10px] font-semibold uppercase text-slate-400">SKU: {item.sku}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'platform',
      header: 'Sàn',
      align: 'center',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cell: (item) => (
        <Badge variant="outline" className="text-xs font-semibold">
          {platformLabelMap[item.platform]}
        </Badge>
      ),
    },
    {
      id: 'currentPrice',
      header: 'Giá hiện tại',
      accessor: (item) => formatCurrency(item.currentPrice),
      sortAccessor: (item) => item.currentPrice,
      sortable: true,
      align: 'right',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cellClassName: 'font-mono text-sm text-slate-600',
    },
    {
      id: 'aiPrice',
      header: 'Giá AI gợi ý',
      accessor: (item) => formatCurrency(item.aiPrice),
      sortAccessor: (item) => item.aiPrice,
      sortable: true,
      align: 'right',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cellClassName: 'font-mono text-sm font-bold text-indigo-600',
    },
    {
      id: 'changePercent',
      header: 'Chênh lệch',
      sortable: true,
      sortAccessor: (item) => item.changePercent,
      align: 'center',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cell: (item) => {
        const isGrowth = item.changePercent >= 0

        return (
          <span
            className={[
              'inline-flex items-center gap-1 text-xs font-bold',
              isGrowth ? 'text-emerald-600' : 'text-rose-500',
            ].join(' ')}
          >
            {isGrowth ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatPercent(item.changePercent)}
          </span>
        )
      },
    },
    {
      id: 'reason',
      header: 'Lý do',
      accessor: (item) => item.reason,
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cellClassName: 'max-w-[180px] whitespace-normal text-xs text-slate-500',
    },
    {
      id: 'confidence',
      header: 'Độ tin cậy',
      sortable: true,
      sortAccessor: (item) => item.confidence,
      align: 'center',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cell: (item) => (
        <div className="flex items-center justify-center gap-1">{confidencePill(item.confidence)}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Hành động',
      align: 'right',
      widthClassName: 'px-6',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cellClassName: 'px-6',
      cell: (item) => (
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
      ),
    },
  ]

  return (
    <DataTable
      rows={rows}
      columns={columns}
      rowKey={(row) => row.id}
      tableClassName="[&_thead_tr]:bg-slate-50/80 [&_thead_tr]:hover:bg-slate-50/80"
      onRowClick={(row) => onOpenProductDetail(row.productId)}
      disableScroll
    />
  )
}
