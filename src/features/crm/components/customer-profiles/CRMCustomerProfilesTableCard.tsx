import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
  return (
    <section className="overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0px_12px_32px_0px_rgba(15,23,42,0.06)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[rgba(240,243,255,0.5)] hover:bg-[rgba(240,243,255,0.5)]">
            <TableHead className="w-16 px-6 py-4">
              <div className="size-4 rounded-[4px] border border-slate-300 bg-white" />
            </TableHead>
            <TableHead className="w-[220px] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Khách hàng
            </TableHead>
            <TableHead className="w-[92px] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Sàn
            </TableHead>
            <TableHead className="w-[110px] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Tổng đơn
            </TableHead>
            <TableHead className="w-[150px] px-4 py-4 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Tổng chi tiêu
            </TableHead>
            <TableHead className="w-[138px] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Đơn gần nhất
            </TableHead>
            <TableHead className="w-[150px] px-4 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Phân khúc
            </TableHead>
            <TableHead className="w-[126px] px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`customer-skeleton-${index}`} className="hover:bg-transparent">
                  <TableCell className="px-6 py-6">
                    <div className="size-4 rounded-[4px] border border-slate-200 bg-slate-100" />
                  </TableCell>
                  <TableCell className="px-4 py-6">
                    <div className="h-5 w-40 rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-28 rounded bg-slate-100" />
                  </TableCell>
                  <TableCell className="px-4 py-6">
                    <div className="h-5 w-10 rounded bg-slate-100" />
                  </TableCell>
                  <TableCell className="px-4 py-6">
                    <div className="h-5 w-12 rounded bg-slate-100" />
                  </TableCell>
                  <TableCell className="px-4 py-6">
                    <div className="ml-auto h-5 w-28 rounded bg-slate-100" />
                  </TableCell>
                  <TableCell className="px-4 py-6">
                    <div className="h-5 w-24 rounded bg-slate-100" />
                  </TableCell>
                  <TableCell className="px-4 py-6">
                    <div className="h-6 w-24 rounded-full bg-slate-100" />
                  </TableCell>
                  <TableCell className="px-6 py-6">
                    <div className="ml-auto h-5 w-16 rounded bg-slate-100" />
                  </TableCell>
                </TableRow>
              ))
            : customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className={cn('hover:bg-slate-50/60', customer.id === selectedCustomerId && 'bg-slate-50')}
                >
                  <TableCell className="px-6 py-5 align-middle">
                    <div className="size-4 rounded-[4px] border border-slate-300 bg-white" />
                  </TableCell>
                  <TableCell className="px-4 py-5 align-middle">
                    <div className="flex items-center gap-3">
                      <img src={customer.avatarUrl} alt={customer.fullName} className="size-8 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{customer.fullName}</div>
                        <div className="text-xs text-slate-500">{customer.maskedPhone}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-5 align-middle">
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
                  </TableCell>
                  <TableCell className="px-4 py-5 align-middle font-mono text-sm text-slate-900">
                    {customer.totalOrdersLabel}
                  </TableCell>
                  <TableCell className="px-4 py-5 align-middle text-right font-mono text-sm text-slate-900">
                    {customer.totalSpendLabel}
                  </TableCell>
                  <TableCell className="px-4 py-5 align-middle text-sm text-slate-500">
                    {customer.lastOrderLabel}
                  </TableCell>
                  <TableCell className="px-4 py-5 align-middle">
                    <span className={cn('inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]', customer.segmentBadge.className)}>
                      {customer.segmentBadge.label}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 align-middle text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto rounded-none p-0 text-sm font-semibold text-[#3525cd] hover:bg-transparent hover:text-[#3525cd]"
                      onClick={() => onSelectCustomer(customer.id)}
                    >
                      {customer.detailLabel}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

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
