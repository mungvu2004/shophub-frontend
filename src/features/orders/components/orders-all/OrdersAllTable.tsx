import { useMemo, useState } from 'react'
import { CheckCircle2, Copy, Download, Eye, MoreHorizontal, Printer } from 'lucide-react'

import { DataTable, type DataTableColumn, type DataTableSortState } from '@/components/shared/DataTable'
import { Pagination } from '@/components/ui/pagination'
import { toast } from '@/components/ui/toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  sortState: DataTableSortState
  onSortChange: (sort: DataTableSortState) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

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
  sortState,
  onSortChange,
  onPageChange,
  onPageSizeChange,
}: OrdersAllTableProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [printStatusOverrides, setPrintStatusOverrides] = useState<Record<string, boolean>>({})

  const isPrinted = (row: OrdersAllTableRowModel) => {
    if (Object.prototype.hasOwnProperty.call(printStatusOverrides, row.id)) {
      return printStatusOverrides[row.id]
    }

    return row.printStatus === 'printed'
  }

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

  const columns: DataTableColumn<OrdersAllTableRowModel>[] = useMemo(
    () => [
      {
        id: 'select',
        header: <input type="checkbox" checked={isAllSelected} onChange={onToggleAll} className="size-4 rounded border-slate-300" />,
        align: 'center',
        widthClassName: 'w-10',
        cellClassName: 'text-center',
        cell: (row) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(row.id)}
            onClick={stopRowClickPropagation}
            onChange={() => onToggleOne(row.id)}
            className="size-4 rounded border-slate-300"
          />
        ),
      },
      {
        id: 'code',
        header: 'Mã đơn',
        widthClassName: 'w-[110px]',
        cell: (row) => (
          <>
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
          </>
        ),
      },
      {
        id: 'platform',
        header: 'Sàn',
        align: 'center',
        widthClassName: 'w-[60px]',
        cell: (row) => (
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${platformMarkClassMap[row.platform]}`}
            title={row.platformLabel}
            aria-label={`Sàn ${row.platformLabel}`}
          >
            {platformMarkTextMap[row.platform]}
          </span>
        ),
      },
      {
        id: 'product',
        header: 'Sản phẩm',
        widthClassName: 'min-w-[180px]',
        cellClassName: 'max-w-0',
        cell: (row) => (
          <>
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
          </>
        ),
      },
      {
        id: 'amount',
        header: 'Giá trị',
        sortable: true,
        sortAccessor: (row) => row.amountValue,
        accessor: (row) => row.amountLabel,
        align: 'right',
        widthClassName: 'w-[140px]',
        cellClassName: 'font-mono text-[14px] font-bold text-slate-900',
      },
      {
        id: 'status',
        header: 'Trạng thái',
        sortable: true,
        sortAccessor: (row) => statusSortWeight[row.status],
        align: 'center',
        widthClassName: 'w-[150px]',
        cell: (row) => renderStatus(row),
      },
      {
        id: 'printStatus',
        header: 'Trạng thái in',
        sortable: true,
        sortAccessor: (row) => (isPrinted(row) ? 1 : 0),
        align: 'center',
        widthClassName: 'w-[120px]',
        cell: (row) => (
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
        ),
      },
      {
        id: 'updated',
        header: 'Cập nhật',
        sortable: true,
        sortAccessor: (row) => row.updatedAtMs,
        align: 'center',
        widthClassName: 'w-[110px]',
        cell: (row) => (
          <span className={`inline-flex text-[12px] ${row.updatedTone === 'danger' ? 'font-semibold text-rose-600' : 'text-slate-500'}`}>
            {row.updatedAgoLabel}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Tác vụ',
        align: 'center',
        widthClassName: 'w-[70px]',
        cell: (row) => {
          const isSelected = selectedIds.includes(row.id)

          return (
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
          )
        },
      },
    ],
    [isAllSelected, onToggleAll, selectedIds, onToggleOne, isPrinted, renderStatus],
  )

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)]">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Danh sách đơn hàng</p>
          <p className="mt-1 text-xs text-slate-500">Phản ứng nhanh theo trạng thái và thao tác ngay trong từng dòng.</p>
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
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <DataTable
            rows={rows}
            columns={columns}
            rowKey={(row) => row.id}
            tableClassName="w-full min-w-[1000px] table-fixed [&_th]:whitespace-nowrap [&_td]:align-middle"
            disableScroll
            emptyText="Không có đơn hàng phù hợp với bộ lọc hiện tại."
            sortState={sortState}
            onSortChange={onSortChange}
            rowClassName={(row) => {
              const isSelected = selectedIds.includes(row.id)
              const isDangerRow = row.updatedTone === 'danger'

              return isSelected
                ? 'bg-indigo-50/75 hover:bg-indigo-50/75'
                : isDangerRow
                  ? 'bg-rose-50/35 hover:bg-rose-50/35'
                  : 'hover:bg-slate-50/90'
            }}
            onRowClick={(row) => openOrderDetail(row)}
          />
        </div>
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
