import { ChevronDown } from 'lucide-react'

import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CustomerProfilesTableItem = {
  id: string
  avatarUrl: string
  fullName: string
  maskedPhone: string
  customerCode: string
  platformBadges: Array<{ id: string; label: string; className: string }>
  totalOrdersLabel: string
  totalSpendLabel: string
  lastOrderLabel: string
  segmentBadge: { label: string; className: string }
  detailLabel: string
}

type CRMCustomerProfilesTableCardProps = {
  customers: CustomerProfilesTableItem[]
  selectedCustomerId: string
  isLoading?: boolean
  onSelectCustomer: (customerId: string) => void
  onViewDetails: () => void
}

export function CRMCustomerProfilesTableCard({
  customers,
  selectedCustomerId,
  isLoading = false,
  onSelectCustomer,
  onViewDetails,
}: CRMCustomerProfilesTableCardProps) {
  const columns: DataTableColumn<CustomerProfilesTableItem>[] = [
    {
      id: 'checkbox',
      header: <div className="size-4 rounded-[4px] border border-slate-300 bg-white" />,
      widthClassName: 'w-16 px-6',
      headerClassName: 'py-4',
      cellClassName: 'px-6 align-middle',
      cell: () => <div className="size-4 rounded-[4px] border border-slate-300 bg-white" />,
    },
    {
      id: 'customer',
      header: 'Khách hàng',
      widthClassName: 'w-[220px] px-4',
      headerClassName: 'py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500',
      cellClassName: 'px-4 align-middle',
      cell: (customer) => (
        <div className="flex items-center gap-3">
          <img src={customer.avatarUrl} alt={customer.fullName} className="size-8 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold text-slate-900">{customer.fullName}</div>
            <div className="text-xs text-slate-500">{customer.maskedPhone}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'platform',
      header: 'Sàn',
      widthClassName: 'w-[92px] px-4',
      headerClassName: 'py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500',
      cellClassName: 'px-4 align-middle',
      cell: (customer) => (
        <div className="flex flex-wrap gap-1.5">
          {customer.platformBadges.map((badge) => (
            <span
              key={`${customer.id}-${badge.id}`}
              className={cn('inline-flex size-5 items-center justify-center rounded-[4px] text-[10px] font-bold uppercase', badge.className)}
              title={badge.label}
            >
              {badge.label.slice(0, 1)}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'totalOrdersLabel',
      header: 'Tổng đơn',
      accessor: (customer) => customer.totalOrdersLabel,
      widthClassName: 'w-[110px] px-4',
      headerClassName: 'py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500',
      cellClassName: 'px-4 align-middle font-mono text-sm text-slate-900',
    },
    {
      id: 'totalSpendLabel',
      header: 'Tổng chi tiêu',
      accessor: (customer) => customer.totalSpendLabel,
      align: 'right',
      widthClassName: 'w-[150px] px-4',
      headerClassName: 'py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500',
      cellClassName: 'px-4 align-middle font-mono text-sm text-slate-900',
    },
    {
      id: 'lastOrderLabel',
      header: 'Đơn gần nhất',
      accessor: (customer) => customer.lastOrderLabel,
      widthClassName: 'w-[138px] px-4',
      headerClassName: 'py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500',
      cellClassName: 'px-4 align-middle text-sm text-slate-500',
    },
    {
      id: 'segment',
      header: 'Phân khúc',
      widthClassName: 'w-[150px] px-4',
      headerClassName: 'py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500',
      cellClassName: 'px-4 align-middle',
      cell: (customer) => (
        <span className={cn('inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]', customer.segmentBadge.className)}>
          {customer.segmentBadge.label}
        </span>
      ),
    },
    {
      id: 'action',
      header: 'Hành động',
      align: 'right',
      widthClassName: 'w-[126px] px-6',
      headerClassName: 'py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500',
      cellClassName: 'px-6 align-middle',
      cell: (customer) => (
        <Button
          type="button"
          variant="ghost"
          className="h-auto rounded-none p-0 text-sm font-semibold text-[#3525cd] hover:bg-transparent hover:text-[#3525cd]"
          onClick={(event) => {
            event.stopPropagation()
            onSelectCustomer(customer.id)
          }}
        >
          {customer.detailLabel}
        </Button>
      ),
    },
  ]

  return (
    <section className="overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0px_12px_32px_0px_rgba(15,23,42,0.06)]">
      {isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`customer-skeleton-${index}`} className="h-16 rounded-lg bg-slate-100/80" />
          ))}
        </div>
      ) : (
        <DataTable
          rows={customers}
          columns={columns}
          rowKey={(customer) => customer.id}
          tableClassName="[&_thead_tr]:bg-[rgba(240,243,255,0.5)] [&_thead_tr]:hover:bg-[rgba(240,243,255,0.5)]"
          rowClassName={(customer) => cn('hover:bg-slate-50/60', customer.id === selectedCustomerId && 'bg-slate-50')}
        />
      )}

      <div className="border-t border-slate-100 bg-[rgba(240,243,255,0.3)] px-6 py-4 text-center">
        <Button
          type="button"
          variant="ghost"
          className="h-auto gap-2 rounded-none p-0 text-sm font-semibold text-[#3525cd] hover:bg-transparent hover:text-[#3525cd]"
          onClick={onViewDetails}
        >
          Xem chi tiết khách hàng
          <ChevronDown className="size-4" />
        </Button>
      </div>
    </section>
  )
}
