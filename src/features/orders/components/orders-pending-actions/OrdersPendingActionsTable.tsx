import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Download, FileText, Printer, Settings2 } from 'lucide-react'

import { Pagination } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  canToggleColumn,
  countVisibleDataColumns,
  PENDING_ACTIONS_INITIAL_VISIBLE_COLUMNS,
  sortPendingActionsRows,
  type PendingActionsTableColumnKey as ColumnKey,
  type PendingActionsTableSortDirection as SortDirection,
  type PendingActionsTableSortKey as SortKey,
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
  const [sortKey, setSortKey] = useState<SortKey>('waiting')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
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

  const sortedRows = useMemo(() => sortPendingActionsRows(rows, sortKey, sortDirection), [rows, sortDirection, sortKey])

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

  const visibleDataColumnCount = countVisibleDataColumns(visibleColumns)

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

      <Table className="w-full table-auto [&_th]:whitespace-nowrap [&_td]:align-middle">
        <TableHeader>
          <TableRow className="h-10 border-b border-indigo-100 bg-gradient-to-r from-[#f0f3ff] to-[#f8faff] hover:bg-[#f0f3ff]">
            <TableHead className="w-10 text-center">
              <input type="checkbox" checked={isAllSelected} onChange={onToggleAll} className="size-4 rounded border-slate-300" />
            </TableHead>
            <TableHead className="min-w-[92px] text-[11px] font-semibold tracking-[0.2px] text-slate-500">Mã đơn</TableHead>
            {visibleColumns.platform ? <TableHead className="min-w-[70px] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">Sàn</TableHead> : null}
            {visibleColumns.product ? <TableHead className="min-w-[210px] text-[11px] font-semibold tracking-[0.2px] text-slate-500">Sản phẩm</TableHead> : null}
            {visibleColumns.amount ? <TableHead className="min-w-[120px] text-right text-[11px] font-semibold tracking-[0.2px] text-slate-500">
              <button type="button" className="ml-auto inline-flex items-center gap-2" onClick={() => toggleSort('amount')}>
                Giá trị
                {renderSortIcon('amount')}
              </button>
            </TableHead> : null}
            {visibleColumns.waiting ? <TableHead className="min-w-[120px] text-right text-[11px] font-semibold tracking-[0.2px] text-slate-500">
              <button type="button" className="ml-auto inline-flex items-center gap-2" onClick={() => toggleSort('waiting')}>
                Chờ xử lý
                {renderSortIcon('waiting')}
              </button>
            </TableHead> : null}
            {visibleColumns.printStatus ? <TableHead className="min-w-[100px] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">Trạng thái in</TableHead> : null}
            {visibleColumns.action ? <TableHead className="min-w-[140px] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">Hành động</TableHead> : null}
            {visibleColumns.updated ? <TableHead className="min-w-[110px] text-center text-[11px] font-semibold tracking-[0.2px] text-slate-500">
              <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort('updated')}>
                Cập nhật
                {renderSortIcon('updated')}
              </button>
            </TableHead> : null}
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white">
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={1 + visibleDataColumnCount + 1} className="py-8 text-center text-sm text-slate-500">
                Không có đơn nào cần xử lý theo bộ lọc hiện tại.
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row) => (
              <TableRow
                key={row.id}
                className="h-[68px] cursor-pointer border-b border-slate-100 bg-white hover:bg-indigo-50/20"
                onClick={() => openOrderDetail(row)}
              >
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onClick={stopRowClickPropagation}
                    onChange={() => onToggleOne(row.id)}
                    className="size-4 rounded border-slate-300"
                  />
                </TableCell>
                <TableCell>
                  <p className="font-mono text-[13px] font-semibold text-[#3525cd] hover:underline">{row.orderCode}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="truncate">{row.customerName}</span>
                    <span className="relative inline-flex h-4 w-4 items-center justify-center" title={row.customerNoteText}>
                      <FileText className={`size-3.5 ${row.hasCustomerNote ? 'text-indigo-600' : 'text-slate-300'}`} />
                      {row.hasCustomerNote ? <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" /> : null}
                    </span>
                  </div>
                </TableCell>
                {visibleColumns.platform ? <TableCell className="text-center">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${row.platformMarkClass}`}
                    title={row.platformLabel}
                  >
                    {row.platformMarkText}
                  </span>
                </TableCell> : null}
                {visibleColumns.product ? <TableCell>
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
                </TableCell> : null}
                {visibleColumns.amount ? <TableCell className="text-right font-mono text-[13px] font-semibold text-slate-800">{row.amountLabel}</TableCell> : null}
                {visibleColumns.waiting ? <TableCell className={`text-right font-mono text-[13px] font-semibold ${row.waitingClassName}`}>{row.waitingLabel}</TableCell> : null}
                {visibleColumns.printStatus ? <TableCell className="text-center">
                  <span className="inline-flex" title={row.printStatusLabel}>
                    <Printer
                      className={`mx-auto size-4 ${row.printStatus === 'printed' ? 'text-emerald-600' : 'text-slate-300'}`}
                      aria-label={row.printStatusLabel}
                    />
                  </span>
                </TableCell> : null}
                {visibleColumns.action ? <TableCell className="text-center">
                  <span className={`inline-flex h-7 min-w-[112px] items-center justify-center rounded-full px-2.5 text-[11px] font-semibold ${row.actionClassName}`}>
                    {row.actionLabel}
                  </span>
                </TableCell> : null}
                {visibleColumns.updated ? <TableCell className="text-center font-mono text-[12px] text-slate-500">{row.updatedAtLabel}</TableCell> : null}
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
