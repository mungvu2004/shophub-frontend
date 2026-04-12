import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStatusTone } from '@/features/orders/logic/ordersAll.logic'
import type { OrdersAllTableRowModel } from '@/features/orders/logic/ordersAll.types'
import { useNavigate } from 'react-router-dom'

const statusBadgeClassMap = {
  amber: 'bg-[#ba1a1a] text-white',
  blue: 'text-[#2563eb]',
  emerald: 'text-[#059669]',
  rose: 'bg-[#ba1a1a] text-white',
  slate: 'text-slate-500',
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

    if (tone === 'blue' || tone === 'emerald') {
      const dotClass = tone === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
      return (
        <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${statusBadgeClassMap[tone]}`}>
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          {row.statusShortLabel}
        </span>
      )
    }

    if (tone === 'slate') {
      return <span className={`text-[13px] font-semibold ${statusBadgeClassMap[tone]}`}>{row.statusShortLabel}</span>
    }

    return (
      <span className={`inline-flex h-6 items-center rounded-md px-3 text-[11px] font-bold ${statusBadgeClassMap[tone]}`}>
        {row.statusShortLabel}
      </span>
    )
  }

  return (
    <section>
      <div className="overflow-hidden rounded-xl bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <Table>
        <TableHeader>
          <TableRow className="h-10 border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-10 text-center">
              <input type="checkbox" checked={isAllSelected} onChange={onToggleAll} className="size-4" />
            </TableHead>
            <TableHead className="w-[96px] text-[11px] font-bold tracking-[0.55px] text-slate-500">MÃ ĐƠN</TableHead>
            <TableHead className="w-[160px] text-[11px] font-bold tracking-[0.55px] text-slate-500">KHÁCH HÀNG</TableHead>
            <TableHead className="w-[104px] text-[11px] font-bold tracking-[0.55px] text-slate-500">SÀN</TableHead>
            <TableHead className="w-[220px] text-[11px] font-bold tracking-[0.55px] text-slate-500">SẢN PHẨM</TableHead>
            <TableHead className="w-[120px] text-right text-[11px] font-bold tracking-[0.55px] text-slate-500">TỔNG TIỀN</TableHead>
            <TableHead className="w-[128px] text-[11px] font-bold tracking-[0.55px] text-slate-500">TRẠNG THÁI</TableHead>
            <TableHead className="w-[110px] text-[11px] font-bold tracking-[0.55px] text-slate-500">CẬP NHẬT</TableHead>
            <TableHead className="w-10 text-right text-[11px] font-bold tracking-[0.55px] text-slate-500">HÀNH ĐỘNG</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-8 text-center text-sm text-slate-500">
                Không có đơn hàng phù hợp với bộ lọc hiện tại.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const isSelected = selectedIds.includes(row.id)
              const platformDotClass = row.platform === 'shopee' ? 'bg-orange-500' : row.platform === 'lazada' ? 'bg-blue-600' : 'bg-black'
              const isDangerRow = row.updatedTone === 'danger'
              const rowBgClass = isSelected ? 'bg-[#f0f4ff]' : isDangerRow ? 'bg-[#fff5f5]' : 'bg-white'

              return (
                <TableRow
                  key={row.id}
                  className={`h-14 cursor-pointer border-b border-slate-100 ${rowBgClass}`}
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
                      className="size-4"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-[12px] font-semibold text-slate-600">
                    <button
                      type="button"
                      className="text-left text-indigo-600 hover:underline"
                      onClick={() => openOrderDetail(row)}
                    >
                      {row.code}
                    </button>
                  </TableCell>
                  <TableCell className="text-[14px] font-medium text-slate-800">{row.buyerName}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      <span className={`h-1.5 w-1.5 rounded-full ${platformDotClass}`} />
                      {row.platformLabel}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-[12px] text-slate-600">{row.productLabel}</TableCell>
                  <TableCell className="text-right font-mono text-[14px] font-bold text-slate-800">{row.amountLabel}</TableCell>
                  <TableCell>
                    {renderStatus(row)}
                  </TableCell>
                  <TableCell className={`text-[12px] ${row.updatedTone === 'danger' ? 'font-bold text-[#ba1a1a]' : 'text-slate-400'}`}>
                    {row.updatedAgoLabel}
                  </TableCell>
                  <TableCell className="text-right text-slate-500">⋮</TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4">
        <p className="text-[13px] text-slate-500">
          Đang hiển thị {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)} trên tổng số {totalCount} đơn hàng
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
      </div>
    </section>
  )
}
