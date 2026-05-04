import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, FileText } from 'lucide-react'
import { toast } from 'sonner'

import { Pagination } from '@/components/ui/pagination'
import { DataTable, type DataTableColumn, type DataTableSortState } from '@/components/shared/DataTable'
import type { OrdersReturnsTableRowModel } from '@/features/orders/logic/ordersReturns.types'
import { OrdersReturnsActionButtons } from './OrdersReturnsActionButtons'
import { ordersReturnsService } from '../../services/ordersReturnsService'

type OrdersReturnsTableProps = {
  rows: OrdersReturnsTableRowModel[]
  totalCount: number
  page: number
  pageSize: number
  onOpenDetail?: (row: OrdersReturnsTableRowModel) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersReturnsTable({
  rows,
  totalCount,
  page,
  pageSize,
  onOpenDetail,
  onPageChange,
  onPageSizeChange,
}: OrdersReturnsTableProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sortState, setSortState] = useState<DataTableSortState>({ columnId: 'orderCode', direction: 'desc' })

  const openOrderDetail = (row: OrdersReturnsTableRowModel) => {
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
        isAbuseFlagged: row.isAbuseFlagged,
        hasEvidence: row.hasEvidence,
        reason: row.reason,
        happenedAtLabel: row.happenedAtLabel,
        sku: row.sku,
        skuDetails: row.skuDetails,
      },
    })
  }

  const handleAction = async (e: React.MouseEvent, type: 'approve' | 'reject' | 'auto-refund', orderId: string, orderCode: string) => {
    e.stopPropagation()
    const loadingToast = toast.loading(`Đang xử lý ${orderCode}...`)
    try {
      if (type === 'approve') await ordersReturnsService.approveReturn(orderId)
      if (type === 'reject') await ordersReturnsService.rejectReturn(orderId)
      if (type === 'auto-refund') await ordersReturnsService.autoRefund(orderId)
      
      toast.success(`${type === 'approve' ? 'Phê duyệt' : type === 'reject' ? 'Từ chối' : 'Hoàn tiền'} đơn hàng ${orderCode} thành công`, { id: loadingToast })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(`Có lỗi xảy ra khi xử lý đơn hàng ${orderCode}`, { id: loadingToast })
    }
  }

  const columns: DataTableColumn<OrdersReturnsTableRowModel>[] = [
    {
      id: 'orderCode',
      header: 'MÃ ĐƠN',
      sortable: true,
      accessor: 'orderCode',
      widthClassName: 'w-[120px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="font-mono text-[13px] font-semibold text-indigo-700 hover:underline dark:text-indigo-400">{row.orderCode}</p>
            {row.isAbuseFlagged && (
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            )}
          </div>
          <p className={`text-[10px] font-bold uppercase ${row.orderKindTone === 'rose' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
            {row.orderKindLabel}
          </p>
        </div>
      ),
    },
    {
      id: 'productName',
      header: 'SẢN PHẨM & KHÁCH HÀNG',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cell: (row) => (
        <div className="flex items-start gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">{row.productName}</p>
              {row.hasEvidence && (
                <FileText className="h-3.5 w-3.5 text-slate-400" />
              )}
            </div>
            <p className="text-[12px] text-slate-600 dark:text-slate-400">{row.customerName}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'platformLabel',
      header: 'SÀN',
      widthClassName: 'w-[96px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cell: (row) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <span className={`h-1.5 w-1.5 rounded-full ${row.platformDotClass}`} />
          {row.platformLabel}
        </span>
      ),
    },
    {
      id: 'amountLabel',
      header: 'GIÁ TRỊ',
      sortable: true,
      accessor: (row) => row.amountLabel,
      sortAccessor: (row) => Number(row.amountLabel.replace(/[^0-9]/g, '')),
      widthClassName: 'w-[120px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cellClassName: 'font-mono text-[14px] font-bold text-slate-800 dark:text-slate-200',
      align: 'right',
    },
    {
      id: 'actions',
      header: 'THAO TÁC',
      widthClassName: 'w-[220px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cell: (row) => (
        <OrdersReturnsActionButtons
          status={row.statusLabel}
          canAutoRefund={row.canAutoRefund}
          onApprove={(e) => handleAction(e, 'approve', row.id, row.orderCode)}
          onReject={(e) => handleAction(e, 'reject', row.id, row.orderCode)}
          onAutoRefund={(e) => handleAction(e, 'auto-refund', row.id, row.orderCode)}
        />
      ),
    },
    {
      id: 'statusLabel',
      header: 'TRẠNG THÁI',
      sortable: true,
      accessor: 'statusLabel',
      widthClassName: 'w-[130px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cell: (row) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${row.statusClassName}`}>
          {row.statusLabel}
        </span>
      ),
    },
  ]

  return (
    <section className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(row) => row.id}
        tableClassName="h-full"
        emptyText="Không có dữ liệu hoàn/hủy theo bộ lọc hiện tại."
        rowClassName="h-14 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
        onRowClick={openOrderDetail}
        sortState={sortState}
        onSortChange={setSortState}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
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
