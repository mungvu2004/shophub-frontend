import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, FileText, Printer, Settings2 } from 'lucide-react'

import { DataTable, type DataTableColumn, type DataTableSortState } from '@/components/shared/DataTable'
import { Pagination } from '@/components/ui/pagination'
import {
  canToggleColumn,
  PENDING_ACTIONS_INITIAL_VISIBLE_COLUMNS,
  type PendingActionsTableColumnKey as ColumnKey,
} from '@/features/orders/logic/ordersPendingActionsTable.logic'
import type { OrdersPendingActionsTableRowModel } from '@/features/orders/logic/ordersPendingActions.types'
import { useLocation, useNavigate } from 'react-router-dom'

type OrdersPendingActionsTableProps = {
  rows: OrdersPendingActionsTableRowModel[]
  totalCount: number
  page: number
  pageSize: number
  onExportData: () => void
  selectedIds: string[]
  isAllSelected: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onOpenDetail?: (row: OrdersPendingActionsTableRowModel) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersPendingActionsTable({
  rows,
  totalCount,
  page,
  pageSize,
  onExportData,
  selectedIds,
  isAllSelected,
  onToggleAll,
  onToggleOne,
  onOpenDetail,
  onPageChange,
  onPageSizeChange,
}: OrdersPendingActionsTableProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sortState, setSortState] = useState<DataTableSortState>({ columnId: 'waiting', direction: 'desc' })
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>(PENDING_ACTIONS_INITIAL_VISIBLE_COLUMNS)
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false)
  const columnMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isColumnMenuOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!columnMenuRef.current?.contains(target)) {
        setIsColumnMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isColumnMenuOpen])

  const openOrderDetail = (row: OrdersPendingActionsTableRowModel) => {
    if (onOpenDetail) {
      onOpenDetail(row)
      return
    }

    navigate(`/orders/${row.id}`, {
      state: {
        backgroundLocation: location,
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

  const stopRowClickPropagation = (event: { stopPropagation: () => void }) => {
    event.stopPropagation()
  }

  const toggleColumn = (column: ColumnKey, checked: boolean) => {
    if (!canToggleColumn(visibleColumns, checked)) return

    setVisibleColumns((current) => ({
      ...current,
      [column]: checked,
    }))
  }

  const columns = useMemo<DataTableColumn<OrdersPendingActionsTableRowModel>[]>(() => {
    const base: DataTableColumn<OrdersPendingActionsTableRowModel>[] = [
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
        id: 'orderCode',
        header: 'Mã đơn',
        widthClassName: 'min-w-[92px]',
        cell: (row) => (
          <>
            <p className="font-mono text-[13px] font-semibold text-[#3525cd] hover:underline">{row.orderCode}</p>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="truncate">{row.customerName}</span>
              <span className="relative inline-flex h-4 w-4 items-center justify-center" title={row.customerNoteText}>
                <FileText className={`size-3.5 ${row.hasCustomerNote ? 'text-indigo-600' : 'text-slate-300'}`} />
                {row.hasCustomerNote ? <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" /> : null}
              </span>
            </div>
          </>
        ),
      },
    ]

    if (visibleColumns.platform) {
      base.push({
        id: 'platform',
        header: 'Sàn',
        align: 'center',
        widthClassName: 'min-w-[70px]',
        cell: (row) => (
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${row.platformMarkClass}`}
            title={row.platformLabel}
          >
            {row.platformMarkText}
          </span>
        ),
      })
    }

    if (visibleColumns.product) {
      base.push({
        id: 'product',
        header: 'Sản phẩm',
        widthClassName: 'min-w-[210px]',
        cell: (row) => (
          <div className="flex items-start gap-2">
            <img
              src={row.productThumbnailUrl}
              alt={row.productName}
              className="h-9 w-9 rounded-md border border-slate-200 object-cover"
              loading="lazy"
              onError={(event) => {
                const target = event.currentTarget
                target.onerror = null
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="52%" font-size="20" text-anchor="middle" fill="%2364758b" font-family="Arial">P</text></svg>'
              }}
            />
            <div className="min-w-0">
              <p className="text-[13px] text-slate-700" title={row.productName}>{row.productName}</p>
              <p className="text-[11px] text-slate-400">{row.productSku} • {row.productVariantLabel} • x{row.productQuantity}</p>
            </div>
          </div>
        ),
      })
    }

    if (visibleColumns.amount) {
      base.push({
        id: 'amount',
        header: 'Giá trị',
        sortable: true,
        sortAccessor: (row) => row.amountValue,
        accessor: (row) => row.amountLabel,
        align: 'right',
        widthClassName: 'min-w-[120px]',
        cellClassName: 'font-mono text-[13px] font-semibold text-slate-800',
      })
    }

    if (visibleColumns.waiting) {
      base.push({
        id: 'waiting',
        header: 'Chờ xử lý',
        sortable: true,
        sortAccessor: (row) => row.waitingMinutes,
        accessor: (row) => row.waitingLabel,
        align: 'right',
        widthClassName: 'min-w-[120px]',
        cellClassName: (row) => `font-mono text-[13px] font-semibold ${row.waitingClassName}`,
      })
    }

    if (visibleColumns.printStatus) {
      base.push({
        id: 'printStatus',
        header: 'Trạng thái in',
        align: 'center',
        widthClassName: 'min-w-[100px]',
        cell: (row) => (
          <span className="inline-flex" title={row.printStatusLabel}>
            <Printer
              className={`mx-auto size-4 ${row.printStatus === 'printed' ? 'text-emerald-600' : 'text-slate-300'}`}
              aria-label={row.printStatusLabel}
            />
          </span>
        ),
      })
    }

    if (visibleColumns.action) {
      base.push({
        id: 'action',
        header: 'Hành động',
        align: 'center',
        widthClassName: 'min-w-[140px]',
        cell: (row) => (
          <span className={`inline-flex h-7 min-w-[112px] items-center justify-center rounded-full px-2.5 text-[11px] font-semibold ${row.actionClassName}`}>
            {row.actionLabel}
          </span>
        ),
      })
    }

    if (visibleColumns.updated) {
      base.push({
        id: 'updated',
        header: 'Cập nhật',
        sortable: true,
        sortAccessor: (row) => row.updatedAtMs,
        accessor: (row) => row.updatedAtLabel,
        align: 'center',
        widthClassName: 'min-w-[110px]',
        cellClassName: 'font-mono text-[12px] text-slate-500',
      })
    }

    return base
  }, [isAllSelected, onToggleAll, onToggleOne, selectedIds, visibleColumns])

  const renderColumnToggleItem = (column: ColumnKey, label: string) => (
    <button
      key={column}
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-slate-100"
      onClick={() => {
        toggleColumn(column, !visibleColumns[column])
      }}
    >
      <span className="inline-flex min-w-4 items-center justify-center text-indigo-600">{visibleColumns[column] ? '✓' : ''}</span>
      {label}
    </button>
  )

  return (
    <section className="overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Danh sách đơn cần xử lý</p>
          <p className="mt-0.5 text-xs text-slate-500">Ưu tiên theo SLA, thao tác nhanh theo lô và kiểm soát trạng thái in.</p>
        </div>

        <div className="flex items-center gap-2">
        <div className="relative" ref={columnMenuRef}>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            aria-label="Tùy chỉnh cột"
            aria-expanded={isColumnMenuOpen}
            onClick={() => setIsColumnMenuOpen((current) => !current)}
          >
            <Settings2 className="size-3.5" />
            Cột
          </button>

          {isColumnMenuOpen ? (
            <div className="absolute right-0 top-10 z-50 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              <p className="px-1.5 py-1 text-xs font-medium text-slate-500">Hiển thị cột</p>
              <div className="my-1 h-px bg-slate-200" />
            {renderColumnToggleItem('platform', 'Sàn')}
            {renderColumnToggleItem('product', 'Sản phẩm')}
            {renderColumnToggleItem('amount', 'Giá trị')}
            {renderColumnToggleItem('waiting', 'Chờ xử lý')}
            {renderColumnToggleItem('printStatus', 'Trạng thái in')}
            {renderColumnToggleItem('action', 'Hành động')}
            {renderColumnToggleItem('updated', 'Cập nhật')}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onExportData}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          aria-label="Xuất dữ liệu đơn cần xử lý"
          title="Xuất CSV"
        >
          <Download className="size-3.5" />
          Xuất
        </button>
        </div>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(row) => row.id}
        tableClassName="w-full table-auto [&_th]:whitespace-nowrap [&_td]:align-middle [&_thead_tr]:h-10 [&_thead_tr]:border-b [&_thead_tr]:border-indigo-100 [&_thead_tr]:bg-gradient-to-r [&_thead_tr]:from-[#f0f3ff] [&_thead_tr]:to-[#f8faff] [&_thead_tr]:hover:bg-[#f0f3ff]"
        bodyClassName="bg-white"
        rowClassName="h-[68px] cursor-pointer hover:bg-indigo-50/20"
        onRowClick={(row) => openOrderDetail(row)}
        emptyText="Không có đơn nào cần xử lý theo bộ lọc hiện tại."
        sortState={sortState}
        onSortChange={(nextSort) => setSortState(nextSort)}
      />

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
