import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { OrdersPendingActionsTableRowModel } from '@/features/orders/logic/ordersPendingActions.types'
import { useNavigate } from 'react-router-dom'

type OrdersPendingActionsTableProps = {
  rows: OrdersPendingActionsTableRowModel[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersPendingActionsTable({
  rows,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: OrdersPendingActionsTableProps) {
  const navigate = useNavigate()

  const openOrderDetail = (row: OrdersPendingActionsTableRowModel) => {
    navigate(`/orders/${row.id}`, {
      state: {
        orderCode: row.orderCode,
        platformLabel: row.platformLabel,
        customerName: row.customerName,
        productName: row.productName,
        amountLabel: row.amountLabel,
        statusLabel: row.statusLabel,
        actionLabel: row.actionLabel,
      },
    })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <Table>
        <TableHeader>
          <TableRow className="h-10 border-b border-indigo-100 bg-gradient-to-r from-[#f0f3ff] to-[#f8faff] hover:bg-[#f0f3ff]">
            <TableHead className="w-[130px] text-[11px] font-bold tracking-[0.55px] text-slate-500">MÃ ĐƠN</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.55px] text-slate-500">KHÁCH HÀNG</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.55px] text-slate-500">SẢN PHẨM</TableHead>
            <TableHead className="w-[96px] text-[11px] font-bold tracking-[0.55px] text-slate-500">SÀN</TableHead>
            <TableHead className="w-[120px] text-right text-[11px] font-bold tracking-[0.55px] text-slate-500">GIÁ TRỊ</TableHead>
            <TableHead className="w-[110px] text-right text-[11px] font-bold tracking-[0.55px] text-slate-500">CHỜ XỬ LÝ</TableHead>
            <TableHead className="w-[170px] text-[11px] font-bold tracking-[0.55px] text-slate-500">HÀNH ĐỘNG</TableHead>
            <TableHead className="w-[96px] text-right text-[11px] font-bold tracking-[0.55px] text-slate-500">CẬP NHẬT</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white">
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-sm text-slate-500">
                Không có đơn nào cần xử lý theo bộ lọc hiện tại.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                className="h-14 cursor-pointer border-b border-slate-100 bg-white hover:bg-indigo-50/20"
                onClick={() => openOrderDetail(row)}
              >
                <TableCell>
                  <p className="font-mono text-[13px] font-semibold text-[#3525cd] hover:underline">{row.orderCode}</p>
                  <p className="text-[10px] font-semibold uppercase text-slate-400">{row.statusLabel}</p>
                </TableCell>
                <TableCell className="text-[13px] font-medium text-slate-700">{row.customerName}</TableCell>
                <TableCell className="text-[13px] text-slate-700">{row.productName}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    <span className={`h-1.5 w-1.5 rounded-full ${row.platformDotClass}`} />
                    {row.platformLabel}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-[13px] font-semibold text-slate-800">{row.amountLabel}</TableCell>
                <TableCell className={`text-right font-mono text-[13px] font-semibold ${row.waitingClassName}`}>{row.waitingLabel}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-md px-2 py-1 text-[11px] font-semibold ${row.actionClassName}`}>{row.actionLabel}</span>
                </TableCell>
                <TableCell className="text-right font-mono text-[12px] text-slate-500">{row.updatedAtLabel}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-4">
        <p className="text-[13px] text-slate-500">
          Đang hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)} trên tổng số {totalCount} dòng
        </p>
        <Pagination
          currentPage={page}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[5, 10, 20]}
          compact
        />
      </div>
    </section>
  )
}
