import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import {
  crmCustomerProfileOrderFilters,
  type CRMCustomerProfileOrderFilter,
} from '@/features/crm/logic/crmCustomerProfiles.logic'

type CRMCustomerProfileOrderHistoryCardProps = {
  selectedCustomer: {
    orderFilterOptions: typeof crmCustomerProfileOrderFilters
    selectedFilterLabel: string
    orders: Array<{
      id: string
      orderCode: string
      dateLabel: string
      productName: string
      amountLabel: string
      statusLabel: string
      statusTone: 'success' | 'neutral'
      platformLabel: string
      platformClassName: string
    }>
    emptyOrdersLabel: string
  } | null
  selectedFilter: CRMCustomerProfileOrderFilter
  onFilterChange: (value: CRMCustomerProfileOrderFilter) => void
}

export function CRMCustomerProfileOrderHistoryCard({
  selectedCustomer,
  selectedFilter,
  onFilterChange,
}: CRMCustomerProfileOrderHistoryCardProps) {
  if (!selectedCustomer) return null

  return (
    <Card className="overflow-hidden rounded-[12px] border-0 bg-white p-0 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-[16px] font-semibold text-slate-900">Lịch sử đơn hàng</div>

        <div className="flex flex-wrap gap-1 rounded-lg bg-[#f0f3ff] p-1">
          {crmCustomerProfileOrderFilters.map((filter) => (
            <Button
              key={filter.id}
              type="button"
              variant={selectedFilter === filter.id ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'h-8 rounded-md px-4 text-xs font-bold',
                selectedFilter === filter.id
                  ? 'bg-white text-slate-900 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-white'
                  : 'text-slate-500 hover:bg-transparent hover:text-slate-900',
              )}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {selectedCustomer.orders.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-[rgba(240,243,255,0.2)] text-[10px] uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-8 py-3 text-left font-bold">Mã đơn</th>
                <th className="px-4 py-3 text-left font-bold">Ngày</th>
                <th className="px-4 py-3 text-left font-bold">Sản phẩm</th>
                <th className="px-4 py-3 text-right font-bold">Giá trị</th>
                <th className="px-8 py-3 text-right font-bold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {selectedCustomer.orders.map((order, index) => (
                <tr key={order.id} className={cn(index > 0 && 'border-t border-slate-100')}>
                  <td className="px-8 py-5 font-mono text-xs font-semibold text-[#3525cd]">{order.orderCode}</td>
                  <td className="px-4 py-5 text-xs text-slate-900">{order.dateLabel}</td>
                  <td className="px-4 py-5 text-xs text-slate-900">{order.productName}</td>
                  <td className="px-4 py-5 text-right font-mono text-xs text-slate-900">{order.amountLabel} ₫</td>
                  <td className="px-8 py-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          order.statusTone === 'success' ? 'bg-emerald-500' : 'bg-slate-400',
                        )}
                      />
                      <span className="text-xs font-medium text-slate-900">{order.statusLabel}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-8 py-10 text-sm text-slate-500">{selectedCustomer.emptyOrdersLabel}</div>
      )}
    </Card>
  )
}
