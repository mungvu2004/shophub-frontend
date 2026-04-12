import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { OrdersReturnsTableRowModel } from '@/features/orders/logic/ordersReturns.types'
import { useNavigate } from 'react-router-dom'

type OrdersReturnsTableProps = {
  rows: OrdersReturnsTableRowModel[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersReturnsTable({
  rows,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: OrdersReturnsTableProps) {
  const navigate = useNavigate()

  const openOrderDetail = (row: OrdersReturnsTableRowModel) => {
    navigate(`/orders/${row.id}`, {
      state: {
        orderCode: row.orderCode,
        platformLabel: row.platformLabel,
        customerName: row.customerName,
        productName: row.productName,
        amountLabel: row.amountLabel,
        statusLabel: row.statusLabel,
      },
    })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-100">
      <Table>
        <TableHeader>
          <TableRow className="h-10 border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-[120px] text-[11px] font-bold tracking-[0.55px] text-slate-500">MÃ ĐƠN</TableHead>
            <TableHead className="text-[11px] font-bold tracking-[0.55px] text-slate-500">SẢN PHẨM</TableHead>
            <TableHead className="w-[96px] text-[11px] font-bold tracking-[0.55px] text-slate-500">SÀN</TableHead>
            <TableHead className="w-[130px] text-right text-[11px] font-bold tracking-[0.55px] text-slate-500">GIÁ TRỊ</TableHead>
            <TableHead className="w-[130px] text-[11px] font-bold tracking-[0.55px] text-slate-500">TRẠNG THÁI</TableHead>
            <TableHead className="w-[90px] text-right text-[11px] font-bold tracking-[0.55px] text-slate-500">GIỜ</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                Không có dữ liệu hoàn/hủy theo bộ lọc hiện tại.
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
                  <div className="space-y-1">
                    <p className="font-mono text-[13px] font-semibold text-[#3525cd] hover:underline">{row.orderCode}</p>
                    <p className={`text-[10px] font-bold uppercase ${row.orderKindTone === 'rose' ? 'text-[#ba1a1a]' : 'text-[#777587]'}`}>
                      {row.orderKindLabel}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-[14px] font-semibold text-[#111c2d]">{row.productName}</p>
                  <p className="text-[12px] text-[#464555]">{row.customerName}</p>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    <span className={`h-1.5 w-1.5 rounded-full ${row.platformDotClass}`} />
                    {row.platformLabel}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-[14px] font-bold text-slate-800">{row.amountLabel}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${row.statusClassName}`}>
                    {row.statusLabel}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-[13px] text-slate-500">{row.timeLabel}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4">
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
