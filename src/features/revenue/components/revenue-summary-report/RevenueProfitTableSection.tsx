import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react'

import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { SearchInput } from '@/components/shared/SearchInput'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import type { RevenueSummaryReportViewModel } from '@/features/revenue/logic/revenueSummaryReport.logic'

type RevenueProfitTableSectionProps = {
  keyword: string
  onKeywordChange: (value: string) => void
  currentPage: number
  pageSize: number
  totalCount: number
  rows: RevenueSummaryReportViewModel['productProfitRows']
  totalProducts: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function RevenueProfitTableSection({
  keyword,
  onKeywordChange,
  currentPage,
  pageSize,
  totalCount,
  rows,
  totalProducts,
  onPageChange,
  onPageSizeChange,
}: RevenueProfitTableSectionProps) {
  const columns: DataTableColumn<RevenueSummaryReportViewModel['productProfitRows'][number]>[] = [
    {
      id: 'product',
      header: 'Sản phẩm',
      widthClassName: 'w-[33%] px-4',
      cellClassName: 'px-4',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <img src={row.imageUrl} alt={row.name} className="size-9 rounded-md object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-500">{row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'revenue',
      header: 'Doanh thu',
      accessor: (row) => row.revenueLabel,
      sortAccessor: (row) => row.revenueValue,
      sortable: true,
      widthClassName: 'w-[11%] pr-4',
      cellClassName: 'pr-4 font-mono text-sm font-semibold text-slate-700',
      align: 'right',
    },
    {
      id: 'cost',
      header: 'Giá vốn',
      accessor: (row) => row.costLabel,
      sortAccessor: (row) => row.costValue,
      sortable: true,
      widthClassName: 'w-[11%] pr-4',
      cellClassName: 'pr-4 font-mono text-sm text-slate-700',
      align: 'right',
    },
    {
      id: 'profit',
      header: 'Lợi nhuận',
      accessor: (row) => row.profitLabel,
      sortAccessor: (row) => row.profitValue,
      sortable: true,
      widthClassName: 'w-[11%] pr-4',
      cellClassName: 'pr-4 font-mono text-sm font-semibold text-slate-900',
      align: 'right',
    },
    {
      id: 'margin',
      header: 'Biên (%)',
      accessor: (row) => row.marginLabel,
      sortAccessor: (row) => row.marginValue,
      sortable: true,
      widthClassName: 'w-[8%] pr-4',
      cellClassName: (row) => `pr-4 font-mono text-sm font-semibold ${row.marginClassName}`,
      align: 'right',
    },
    {
      id: 'returnCancellationRate',
      header: 'Hoàn/Huỷ (%)',
      accessor: (row) => row.returnCancellationRateLabel,
      sortAccessor: (row) => row.returnCancellationRateValue,
      sortable: true,
      widthClassName: 'w-[8%] pr-4',
      cellClassName: (row) => `pr-4 font-mono text-sm font-semibold ${row.returnCancellationRateClassName}`,
      align: 'right',
    },
    {
      id: 'trend',
      header: 'Xu hướng',
      widthClassName: 'w-[6%] text-center',
      align: 'center',
      cell: (row) => (
        <span className="inline-flex items-center justify-center text-sm">
          {row.trend === 'up' ? (
            <TrendingUp className="size-4 text-emerald-600" />
          ) : row.trend === 'down' ? (
            <TrendingDown className="size-4 text-rose-600" />
          ) : (
            <MoveRight className="size-4 text-amber-600" />
          )}
        </span>
      ),
    },
    {
      id: 'aiSuggestion',
      header: 'Đề xuất AI',
      accessor: (row) => row.aiSuggestion,
      widthClassName: 'w-[12%]',
      cell: (row) => (
        <span className="inline-flex rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">{row.aiSuggestion}</span>
      ),
    },
  ]

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-35px_rgba(15,23,42,0.4)]">
      <header className="flex flex-col gap-3 border-b border-slate-100 bg-[linear-gradient(135deg,#eef2ff_0%,#ffffff_48%,#ecfeff_100%)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Lợi nhuận theo sản phẩm</h3>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">AI INSIGHTS</Badge>
        </div>

        <SearchInput
          value={keyword}
          onChange={onKeywordChange}
          placeholder="Tìm kiếm sản phẩm..."
        />
      </header>

      <div className="px-5 py-4">
        <DataTable
          rows={rows}
          columns={columns}
          rowKey={(row) => row.id}
          tableClassName="w-full table-fixed [&_th]:whitespace-nowrap [&_td]:align-middle"
          disableScroll
          emptyText="Không có sản phẩm phù hợp với bộ lọc hiện tại."
          initialSort={{ columnId: 'profit', direction: 'desc' }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
        <p className="text-[13px] text-slate-500">Hiển thị {rows.length} trên tổng {totalProducts} sản phẩm</p>
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[5, 10, 15]}
          compact
        />
      </div>
    </section>
  )
}
