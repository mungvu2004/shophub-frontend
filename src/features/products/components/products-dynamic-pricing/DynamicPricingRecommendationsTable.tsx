import { MoreHorizontal, TrendingDown, TrendingUp, MoveRight } from 'lucide-react'

import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import type { DynamicPricingRecommendation, DynamicPricingPayload } from '@/features/products/logic/productsDynamicPricing.types'
import {
  formatCurrency,
  formatPercent,
  platformLabelMap,
} from '@/features/products/components/products-dynamic-pricing/dynamicPricing.formatters'

type DynamicPricingRecommendationsTableProps = {
  rows: DynamicPricingRecommendation[]
  onOpenProductDetail: (productId: string) => void
  headers: DynamicPricingPayload['tableHeaders']
  approveLabel: string
}

const confidencePill = (score: number) => (
  <div className="flex items-center justify-center gap-1" aria-label={`Độ tin cậy: ${score}/4`}>
    {Array.from({ length: 4 }, (_, index) => (
      <span
        key={`${score}-${index}`}
        className={['h-3 w-1.5 rounded-full', index < (score || 0) ? 'bg-indigo-500' : 'bg-indigo-200'].join(' ')}
      />
    ))}
  </div>
)

export function DynamicPricingRecommendationsTable({ rows, onOpenProductDetail, headers, approveLabel }: DynamicPricingRecommendationsTableProps) {
  // Safe Guard: Nếu rows không phải mảng, trả về null
  if (!Array.isArray(rows)) return <div className="p-10 text-center text-slate-400">Đang chuẩn bị dữ liệu...</div>

  const columns: DataTableColumn<DynamicPricingRecommendation>[] = [
    {
      id: 'product',
      header: headers?.product || 'Sản phẩm',
      widthClassName: 'px-6',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cellClassName: 'px-6 align-middle',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
            <img 
              src={item.imageUrl} 
              alt={item.productName || ''} 
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40' }}
            />
          </div>
          <div>
            <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">{item.productName || 'N/A'}</p>
            <p className="text-[10px] font-semibold uppercase text-slate-400">SKU: {item.sku || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'platform',
      header: headers?.platform || 'Sàn',
      align: 'center',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cell: (item) => (
        <Badge variant="outline" className="text-xs font-semibold">
          {platformLabelMap[item.platform] || item.platform}
        </Badge>
      ),
    },
    {
      id: 'pricing',
      header: headers?.pricing || 'Phân tích giá',
      align: 'left',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cell: (item) => {
        const isGrowth = (item.changePercent || 0) >= 0
        return (
          <div className="flex flex-col gap-1 py-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400 line-through">
                {formatCurrency(item.currentPrice || 0)}
              </span>
              <MoveRight className="h-3 w-3 text-slate-300" />
              <span className="font-mono text-sm font-bold text-indigo-600">
                {formatCurrency(item.aiPrice || 0)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={[
                  'inline-flex items-center gap-0.5 text-[10px] font-bold',
                  isGrowth ? 'text-emerald-600' : 'text-rose-500',
                ].join(' ')}
              >
                {isGrowth ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                {formatPercent(Math.abs(item.changePercent || 0))}
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[10px] font-medium text-slate-500 italic truncate max-w-[120px]">
                {item.reason || 'Cập nhật giá theo thị trường'}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      id: 'confidence',
      header: headers?.confidence || 'Độ tin cậy',
      sortable: true,
      sortAccessor: (item) => item.confidence,
      align: 'center',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cell: (item) => confidencePill(item.confidence),
    },
    {
      id: 'actions',
      header: headers?.actions || 'Xác nhận',
      align: 'right',
      widthClassName: 'px-6',
      headerClassName: 'h-14 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400',
      cellClassName: 'px-6',
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 transition-colors"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            {approveLabel || 'Duyệt'}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={(event) => {
              event.stopPropagation()
              onOpenProductDetail(item.productId)
            }}
            aria-label="Xem chi tiết sản phẩm"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </button>
        </div>
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
      emptyText="Chưa có gợi ý giá mới nào cần xác nhận."
    />
  )
}
