import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react'

import { SearchInput } from '@/components/shared/SearchInput'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
  return (
    <section className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-slate-50">
              <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wide text-slate-500">Sản phẩm</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Doanh thu</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Giá vốn</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Lợi nhuận</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Biên (%)</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Xu hướng</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Đề xuất AI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="border-b border-slate-100">
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={row.imageUrl} alt={row.name} className="size-9 rounded-md object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{row.name}</p>
                      <p className="text-xs text-slate-500">{row.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-sm font-semibold text-slate-700">{row.revenueLabel}</TableCell>
                <TableCell className="py-3 text-sm text-slate-700">{row.costLabel}</TableCell>
                <TableCell className="py-3 text-sm font-semibold text-slate-900">{row.profitLabel}</TableCell>
                <TableCell className={`py-3 text-sm font-semibold ${row.marginClassName}`}>{row.marginLabel}</TableCell>
                <TableCell className="py-3">
                  <span className="inline-flex items-center gap-1 text-sm">
                    {row.trend === 'up' ? (
                      <TrendingUp className="size-4 text-emerald-600" />
                    ) : row.trend === 'down' ? (
                      <TrendingDown className="size-4 text-rose-600" />
                    ) : (
                      <MoveRight className="size-4 text-amber-600" />
                    )}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">{row.aiSuggestion}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[5, 10, 15]}
      />

      <div className="px-5 pb-5 text-xs text-slate-500">Hiển thị {rows.length} trên tổng {totalProducts} sản phẩm</div>
    </section>
  )
}
