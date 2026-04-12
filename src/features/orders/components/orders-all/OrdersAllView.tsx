import { OrdersAllBulkActions } from '@/features/orders/components/orders-all/OrdersAllBulkActions'
import { OrdersAllFilters } from '@/features/orders/components/orders-all/OrdersAllFilters'
import { OrdersAllHeader } from '@/features/orders/components/orders-all/OrdersAllHeader'
import { OrdersAllSummaryBar } from '@/features/orders/components/orders-all/OrdersAllSummaryBar'
import { OrdersAllStatusTabs } from '@/features/orders/components/orders-all/OrdersAllStatusTabs'
import { OrdersAllTable } from '@/features/orders/components/orders-all/OrdersAllTable'
import type { OrderPlatformFilter, OrderStatusFilter, OrdersAllViewModel } from '@/features/orders/logic/ordersAll.types'

type OrdersAllViewProps = {
  model: OrdersAllViewModel
  isRefreshing: boolean
  onSearchChange: (value: string) => void
  onStatusChange: (value: OrderStatusFilter) => void
  onPlatformChange: (value: OrderPlatformFilter) => void
  selectedCount: number
  selectedIds: string[]
  isAllSelected: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onClearSelection: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersAllView({
  model,
  isRefreshing,
  onSearchChange,
  onStatusChange,
  onPlatformChange,
  selectedCount,
  selectedIds,
  isAllSelected,
  onToggleAll,
  onToggleOne,
  onClearSelection,
  onPageChange,
  onPageSizeChange,
}: OrdersAllViewProps) {
  return (
    <div className="space-y-3 pb-8 pt-1">
      <OrdersAllHeader
        title={model.title}
        totalOrders={model.totalCount}
        pendingOrders={model.statusTabs.find((tab) => tab.id === 'pending_group')?.count ?? 0}
        isRefreshing={isRefreshing}
      />

      <section className="space-y-3 rounded-xl bg-white px-6 pb-3 pt-4 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <OrdersAllFilters
          search={model.filters.search}
          platform={model.filters.platform}
          platformOptions={model.platformOptions}
          onSearchChange={onSearchChange}
          onPlatformChange={onPlatformChange}
        />

        <OrdersAllStatusTabs tabs={model.statusTabs} activeStatus={model.filters.status} onStatusChange={onStatusChange} />
      </section>

      <OrdersAllBulkActions selectedCount={selectedCount} onClearSelection={onClearSelection} />

      <OrdersAllSummaryBar
        totalOrdersLabel={model.summaryLabel.totalOrders}
        totalRevenueLabel={model.summaryLabel.totalRevenue}
        pendingLabel={model.summaryLabel.pending}
      />

      <OrdersAllTable
        rows={model.rows}
        totalCount={model.totalCount}
        page={model.page}
        pageSize={model.pageSize}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        onToggleAll={onToggleAll}
        onToggleOne={onToggleOne}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
