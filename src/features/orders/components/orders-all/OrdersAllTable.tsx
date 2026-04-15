import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Copy, Download, Eye, MoreHorizontal, Printer } from 'lucide-react'

import { Pagination } from '@/components/ui/pagination'
import { toast } from '@/components/ui/toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStatusTone } from '@/features/orders/logic/ordersAll.logic'
import type { OrdersAllTableRowModel } from '@/features/orders/logic/ordersAll.types'
import { useLocation, useNavigate } from 'react-router-dom'

const statusBadgeClassMap = {
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  slate: 'border-slate-200 bg-slate-50 text-slate-600',
}

const platformMarkClassMap = {
  shopee: 'bg-orange-100 text-orange-700',
  lazada: 'bg-blue-100 text-blue-700',
  tiktok_shop: 'bg-neutral-200 text-neutral-800',
}

const platformMarkTextMap = {
  shopee: 'S',
  lazada: 'L',
  tiktok_shop: 'T',
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
  onOpenDetail?: (row: OrdersAllTableRowModel) => void
  onExportData: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

type SortKey = 'amount' | 'status' | 'printStatus' | 'updated'
type SortDirection = 'asc' | 'desc'

const statusSortWeight: Record<OrdersAllTableRowModel['status'], number> = {
  Pending: 1,
  PendingPayment: 2,
  Confirmed: 3,
  Packed: 4,
  ReadyToShip: 5,
  Shipped: 6,
  Delivered: 7,
  FailedDelivery: 8,
  Cancelled: 9,
  Returned: 10,
  Refunded: 11,
  Lost: 12,
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
  onOpenDetail,
  onExportData,
  onPageChange,
  onPageSizeChange,
}: OrdersAllTableProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sortKey, setSortKey] = useState<SortKey>('updated')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [printStatusOverrides, setPrintStatusOverrides] = useState<Record<string, boolean>>({})

  const isPrinted = (row: OrdersAllTableRowModel) => {
    if (Object.prototype.hasOwnProperty.call(printStatusOverrides, row.id)) {
      return printStatusOverrides[row.id]
    }

    return row.printStatus === 'printed'
  }

  const sortedRows = useMemo(() => {
    const sorted = [...rows]

    const compare = (a: OrdersAllTableRowModel, b: OrdersAllTableRowModel) => {
      if (sortKey === 'amount') {
        return a.amountValue - b.amountValue
      }

      if (sortKey === 'status') {
        return statusSortWeight[a.status] - statusSortWeight[b.status]
      }

      if (sortKey === 'printStatus') {
        const aValue = isPrinted(a) ? 1 : 0
        const bValue = isPrinted(b) ? 1 : 0
        return aValue - bValue
      }

      return a.updatedAtMs - b.updatedAtMs
    }

    sorted.sort((a, b) => {
      const result = compare(a, b)
      if (result === 0) {
        return a.code.localeCompare(b.code)
      }

      return sortDirection === 'asc' ? result : -result
    })

    return sorted
  }, [rows, sortDirection, sortKey, printStatusOverrides])

  const togglePrintStatus = (row: OrdersAllTableRowModel) => {
    setPrintStatusOverrides((current) => {
      const nextValue = !isPrinted(row)
      toast.success(nextValue ? `Đã đánh dấu in ${row.code}.` : `Đã chuyển ${row.code} về chưa in.`)

      return {
        ...current,
        [row.id]: nextValue,
      }
    })
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('desc')
  }

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="size-3.5 text-slate-400" />
    if (sortDirection === 'asc') return <ArrowUp className="size-3.5 text-indigo-600" />
    return <ArrowDown className="size-3.5 text-indigo-600" />
  }

  const handleCopyOrderCode = async (orderCode: string) => {
    try {
      await navigator.clipboard.writeText(orderCode)
      toast.success(`Đã sao chép mã đơn ${orderCode}.`)
    } catch {
      toast.error('Không thể sao chép mã đơn trên trình duyệt hiện tại.')
    }
  }

  const openOrderDetail = (row: OrdersAllTableRowModel) => {
    if (onOpenDetail) {
      onOpenDetail(row)
      return
    }

    navigate(`/orders/${row.id}`, {
      state: {
        backgroundLocation: location,
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

    const statusText = row.statusLabel
    return (
      <span className={`inline-flex h-7 min-w-[118px] items-center justify-center whitespace-nowrap rounded-full border px-2.5 text-[11px] font-semibold ${statusBadgeClassMap[tone]}`}>
        {statusText}
      </span>
    )
  }

  const stopRowClickPropagation = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-35px_rgba(15,23,42,0.4)]">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-[linear-gradient(135deg,#eef2ff_0%,#ffffff_48%,#ecfeff_100%)] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Danh sách đơn hàng</p>
          <p className="mt-1 text-xs text-slate-500">Theo dõi đơn quan trọng, phản ứng nhanh theo trạng thái và thao tác ngay trong từng dòng.</p>
        </div>

        <button
          type="button"
          onClick={onExportData}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          aria-label="Xuất dữ liệu đơn hàng"
          title="Xuất CSV"
        >
          <Download className="size-3.5" />
          Xuất
        </button>
      </div>

      <div className="px-5 py-4">
        <Table disableScroll className="w-full table-fixed [&_th]:whitespace-nowrap [&_td]:align-middle">
        <TableHeader>
          <TableRow className="h-11 border-b border-slate-100 bg-slate-50/90 hover:bg-slate-50/90">
            <TableHead className="w-10 text-center">
              <input type="checkbox" checked={isAllSelected} onChange={onToggleAll} className="size-4 rounded border-slate-300" />
            </TableHead>
            <TableHead className="w-[11%] text-[11px] font-semibold tracking-[0.2px] text-slate-500">Mã đơn</TableHead>
            <TableHead className="w-[8%] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">Sàn</TableHead>
            <TableHead className="w-[15%] text-[11px] font-semibold tracking-[0.2px] text-slate-500">Sản phẩm</TableHead>
            <TableHead className="w-[16%] text-right text-[11px] font-semibold tracking-[0.2px] text-slate-500">
              <button type="button" className="ml-auto inline-flex items-center gap-2" onClick={() => toggleSort('amount')}>
                Giá trị
                {renderSortIcon('amount')}
              </button>
            </TableHead>
            <TableHead className="w-[17%] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">
              <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort('status')}>
                Trạng thái
                {renderSortIcon('status')}
              </button>
            </TableHead>
            <TableHead className="w-[14%] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">
              <button type="button" className="inline-flex items-center justify-center gap-2" onClick={() => toggleSort('printStatus')}>
                Trạng thái in
                {renderSortIcon('printStatus')}
              </button>
            </TableHead>
            <TableHead className="w-[11%] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">
              <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort('updated')}>
                Cập nhật
                {renderSortIcon('updated')}
              </button>
            </TableHead>
            <TableHead className="w-[6%] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">Tác vụ</TableHead>
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
            sortedRows.map((row) => {
              const isSelected = selectedIds.includes(row.id)
              const isDangerRow = row.updatedTone === 'danger'
              const rowBgClass = isSelected
                ? 'bg-indigo-50/75'
                : isDangerRow
                  ? 'bg-rose-50/35'
                  : 'bg-white'

              return (
                <TableRow
                  key={row.id}
                  className={`min-h-[72px] cursor-pointer border-b border-slate-100 transition-colors ${rowBgClass} hover:bg-slate-50/90`}
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
                      onClick={stopRowClickPropagation}
                      onChange={() => onToggleOne(row.id)}
                      className="size-4 rounded border-slate-300"
                    />
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      className="font-mono text-[12px] font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
                      onClick={(event) => {
                        stopRowClickPropagation(event)
                        openOrderDetail(row)
                      }}
                    >
                      {row.code}
                    </button>
                    <p className="mt-1 truncate text-[11px] text-slate-400">{row.buyerName}</p>
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${platformMarkClassMap[row.platform]}`}
                      title={row.platformLabel}
                      aria-label={`Sàn ${row.platformLabel}`}
                    >
                      {platformMarkTextMap[row.platform]}
                    </span>
                  </TableCell>

                  <TableCell className="max-w-0">
                    <p
                      className="overflow-hidden text-[13px] leading-5 text-slate-700 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
                      title={row.productLabel}
                    >
                      {row.firstProductName}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">
                      SL: {row.totalQuantity}
                      {row.productCount > 1 ? ` • +${row.productCount - 1} sản phẩm` : ' • 1 sản phẩm'}
                    </p>
                  </TableCell>

                  <TableCell className="text-right">
                    <p className="font-mono text-[14px] font-bold text-slate-900">{row.amountLabel}</p>
                  </TableCell>

                  <TableCell className="text-center">{renderStatus(row)}</TableCell>

                  <TableCell className="text-center">
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-slate-100"
                      title={isPrinted(row) ? 'Đã in - bấm để chuyển chưa in' : 'Chưa in - bấm để đánh dấu đã in'}
                      aria-label={isPrinted(row) ? 'Đã in' : 'Chưa in'}
                      onClick={(event) => {
                        stopRowClickPropagation(event)
                        togglePrintStatus(row)
                      }}
                    >
                      <Printer className={`size-4 ${isPrinted(row) ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </button>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className={`inline-flex text-[12px] ${row.updatedTone === 'danger' ? 'font-semibold text-rose-600' : 'text-slate-500'}`}>
                      {row.updatedAgoLabel}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        onClick={stopRowClickPropagation}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        aria-label={`Tác vụ đơn ${row.code}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48" onClick={stopRowClickPropagation}>
                        <DropdownMenuItem className="cursor-pointer" onClick={(event) => {
                          stopRowClickPropagation(event)
                          openOrderDetail(row)
                        }}>
                          <Eye className="size-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={(event) => {
                          stopRowClickPropagation(event)
                          void handleCopyOrderCode(row.code)
                        }}>
                          <Copy className="size-4" />
                          Sao chép mã đơn
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={(event) => {
                          stopRowClickPropagation(event)
                          onToggleOne(row.id)
                        }}>
                          <CheckCircle2 className="size-4" />
                          {isSelected ? 'Bỏ chọn đơn này' : 'Chọn đơn này'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
        </Table>
      </div>

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
