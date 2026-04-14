import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStatusTone } from '@/features/orders/logic/ordersAll.logic'
import type { OrdersAllTableRowModel } from '@/features/orders/logic/ordersAll.types'
import { useNavigate } from 'react-router-dom'

const statusBadgeClassMap = {
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  slate: 'border-slate-200 bg-slate-50 text-slate-600',
}

const platformBadgeClassMap = {
  shopee: 'border-orange-200 bg-orange-50 text-orange-700',
  lazada: 'border-blue-200 bg-blue-50 text-blue-700',
  tiktok_shop: 'border-neutral-300 bg-neutral-100 text-neutral-800',
}

const platformDotClassMap = {
  shopee: 'bg-orange-500',
  lazada: 'bg-blue-500',
  tiktok_shop: 'bg-neutral-700',
}

type OrdersAllTableProps = {
  rows: OrdersAllTableRowModel[]
  totalCount: number
  page: number
  pageSize: number
  selectedIds: string[]
  isAllSelected: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersAllTable({
  rows,
  totalCount,
  page,
  pageSize,
  selectedIds,
  isAllSelected,
  onToggleAll,
  onToggleOne,
  onPageChange,
  onPageSizeChange,
}: OrdersAllTableProps) {
  const navigate = useNavigate()

  const openOrderDetail = (row: OrdersAllTableRowModel) => {
    navigate(`/orders/${row.id}`, {
      state: {
        orderCode: row.code,
        platformLabel: row.platformLabel,
        customerName: row.buyerName,
        productName: row.productLabel,
        amountLabel: row.amountLabel,
        statusLabel: row.statusLabel,
      },
    })
  }

  const renderStatus = (row: OrdersAllTableRowModel) => {
    const tone = getStatusTone(row.status)

    const statusText = tone === 'amber' || tone === 'rose' ? row.statusShortLabel : row.statusLabel
    return (
      <span className={`inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-semibold tracking-wide ${statusBadgeClassMap[tone]}`}>
        {statusText}
      </span>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-5 py-4">
        <p className="text-sm font-semibold text-slate-800">Danh sách đơn</p>
        <p className="mt-1 text-xs text-slate-500">Theo dõi trạng thái xử lý, doanh thu và mức độ ưu tiên theo thời gian thực.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="h-11 border-b border-slate-100 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="w-10 text-center">
              <input type="checkbox" checked={isAllSelected} onChange={onToggleAll} className="size-4 rounded border-slate-300" />
            </TableHead>
            <TableHead className="w-[120px] text-[11px] font-semibold tracking-[0.6px] text-slate-500">MÃ ĐƠN</TableHead>
            <TableHead className="min-w-[220px] text-[11px] font-semibold tracking-[0.6px] text-slate-500">KHÁCH HÀNG</TableHead>
            <TableHead className="w-[120px] text-[11px] font-semibold tracking-[0.6px] text-slate-500">SÀN</TableHead>
            <TableHead className="min-w-[220px] text-[11px] font-semibold tracking-[0.6px] text-slate-500">SẢN PHẨM</TableHead>
            <TableHead className="w-[140px] text-right text-[11px] font-semibold tracking-[0.6px] text-slate-500">TỔNG TIỀN</TableHead>
            <TableHead className="w-[160px] text-[11px] font-semibold tracking-[0.6px] text-slate-500">TRẠNG THÁI</TableHead>
            <TableHead className="w-[130px] text-[11px] font-semibold tracking-[0.6px] text-slate-500">CẬP NHẬT</TableHead>
            <TableHead className="w-10 text-right text-[11px] font-semibold tracking-[0.6px] text-slate-500">...</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-10 text-center text-sm text-slate-500">
                Không có đơn hàng phù hợp với bộ lọc hiện tại.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const isSelected = selectedIds.includes(row.id)
              const isDangerRow = row.updatedTone === 'danger'
              const rowBgClass = isSelected
                ? 'bg-indigo-50/70'
                : isDangerRow
                  ? 'bg-rose-50/40'
                  : 'bg-white'

              const customerInitial = row.buyerName.charAt(0).toUpperCase() || '#'

              return (
                <TableRow
                  key={row.id}
                  className={`h-[74px] cursor-pointer border-b border-slate-100 transition-colors ${rowBgClass} hover:bg-slate-50`}
                  onClick={(event) => {
                    const target = event.target as HTMLElement
                    if (target.closest('input,button,a')) return
                    openOrderDetail(row)
                  }}
                >
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleOne(row.id)}
                      className="size-4 rounded border-slate-300"
                    />
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      className="font-mono text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
                      onClick={() => openOrderDetail(row)}
                    >
                      {row.code}
                    </button>
                    <p className="mt-1 text-[11px] text-slate-400">Chi tiết đơn</p>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                        {customerInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-slate-800">{row.buyerName}</p>
                        <p className="truncate text-[11px] text-slate-500">{row.statusLabel}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${platformBadgeClassMap[row.platform]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${platformDotClassMap[row.platform]}`} />
                      {row.platformLabel}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-[260px]">
                    <p className="truncate text-[13px] text-slate-700">{row.productLabel}</p>
                  </TableCell>

                  <TableCell className="text-right">
                    <p className="font-mono text-[14px] font-bold text-slate-900">{row.amountLabel}</p>
                  </TableCell>

                  <TableCell>{renderStatus(row)}</TableCell>

                  <TableCell>
                    <span className={`inline-flex text-[12px] ${row.updatedTone === 'danger' ? 'font-semibold text-rose-600' : 'text-slate-500'}`}>
                      {row.updatedAgoLabel}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => openOrderDetail(row)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Xem chi tiết đơn hàng"
                    >
                      ...
                    </button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
        <p className="text-[13px] text-slate-600">
          Đang hiển thị {Math.min((page - 1) * pageSize + 1, totalCount)}-{Math.min(page * pageSize, totalCount)} trên tổng số {totalCount} đơn hàng
        </p>
        <Pagination
          currentPage={page}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 20, 50]}
          compact
        />
      </div>
    </section>
  )
}
