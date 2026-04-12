import { OrdersPendingActionsFilters } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsFilters'
import { OrdersPendingActionsHeader } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsHeader'
import { OrdersPendingActionsSummaryCards } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsSummaryCards'
import { OrdersPendingActionsTable } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsTable'
import type {
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsSlaFilter,
  OrdersPendingActionsViewModel,
} from '@/features/orders/logic/ordersPendingActions.types'

type OrdersPendingActionsViewProps = {
  model: OrdersPendingActionsViewModel
  isRefreshing: boolean
  onSearchChange: (value: string) => void
  onPlatformChange: (value: OrdersPendingActionsPlatformFilter) => void
  onSlaChange: (value: OrdersPendingActionsSlaFilter) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersPendingActionsView({
  model,
  isRefreshing,
  onSearchChange,
  onPlatformChange,
  onSlaChange,
  onPageChange,
  onPageSizeChange,
}: OrdersPendingActionsViewProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-indigo-100/70 bg-[radial-gradient(circle_at_top,#eef2ff,transparent_38%)] p-4 md:p-5">
      <OrdersPendingActionsHeader title={model.heading} description={model.description} isRefreshing={isRefreshing} />

      <OrdersPendingActionsSummaryCards cards={model.cards} />

      <OrdersPendingActionsFilters
        search={model.search}
        platform={model.platform}
        sla={model.sla}
        platformOptions={model.platformOptions}
        slaOptions={model.slaOptions}
        onSearchChange={onSearchChange}
        onPlatformChange={onPlatformChange}
        onSlaChange={onSlaChange}
      />

      <OrdersPendingActionsTable
        rows={model.rows}
        totalCount={model.totalCount}
        page={model.page}
        pageSize={model.pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
