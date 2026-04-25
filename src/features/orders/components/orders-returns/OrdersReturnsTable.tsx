import { Pagination } from '@/components/ui/pagination'
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import type { OrdersReturnsTableRowModel } from '@/features/orders/logic/ordersReturns.types'
import { useLocation, useNavigate } from 'react-router-dom'

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
      },
    })
  }

  const columns: DataTableColumn<OrdersReturnsTableRowModel>[] = [
    {
      id: 'orderCode',
      header: 'MÃ ĐƠN',
      widthClassName: 'w-[120px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cell: (row) => (
        <div className="space-y-1">
          <p className="font-mono text-[13px] font-semibold text-indigo-700 hover:underline dark:text-indigo-400">{row.orderCode}</p>
          <p className={`text-[10px] font-bold uppercase ${row.orderKindTone === 'rose' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
            {row.orderKindLabel}
          </p>
        </div>
      ),
    },
    {
      id: 'productName',
      header: 'SẢN PHẨM',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cell: (row) => (
        <>
          <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">{row.productName}</p>
          <p className="text-[12px] text-slate-600 dark:text-slate-400">{row.customerName}</p>
        </>
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
      accessor: (row) => row.amountLabel,
      widthClassName: 'w-[130px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cellClassName: 'font-mono text-[14px] font-bold text-slate-800 dark:text-slate-200',
      align: 'right',
    },
    {
      id: 'statusLabel',
      header: 'TRẠNG THÁI',
      widthClassName: 'w-[130px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cell: (row) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${row.statusClassName}`}>
          {row.statusLabel}
        </span>
      ),
    },
    {
      id: 'timeLabel',
      header: 'GIỜ',
      accessor: (row) => row.timeLabel,
      widthClassName: 'w-[90px]',
      headerClassName: 'text-[11px] font-bold tracking-[0.55px] text-slate-500 dark:text-slate-400',
      cellClassName: 'font-mono text-[13px] text-slate-600 dark:text-slate-400',
      align: 'right',
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
