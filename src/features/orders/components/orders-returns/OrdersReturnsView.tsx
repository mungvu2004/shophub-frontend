import { OrdersReturnsFilters } from '@/features/orders/components/orders-returns/OrdersReturnsFilters'
import { OrdersReturnsHeader } from '@/features/orders/components/orders-returns/OrdersReturnsHeader'
import { OrdersReturnsSummaryCards } from '@/features/orders/components/orders-returns/OrdersReturnsSummaryCards'
import { OrdersReturnsTable } from '@/features/orders/components/orders-returns/OrdersReturnsTable'
import { OrdersReturnsTimeline } from '@/features/orders/components/orders-returns/OrdersReturnsTimeline'
import { OrdersReturnsViewModeToggle } from '@/features/orders/components/orders-returns/OrdersReturnsViewModeToggle'
import type {
  OrdersReturnsPlatformFilter,
  OrdersReturnsTimelineItemModel,
  OrdersReturnsViewMode,
  OrdersReturnsTableRowModel,
  OrdersReturnsViewModel,
} from '@/features/orders/logic/ordersReturns.types'

type OrdersReturnsViewProps = {
  model: OrdersReturnsViewModel
  viewMode: OrdersReturnsViewMode
  isRefreshing: boolean
  onViewModeChange: (mode: OrdersReturnsViewMode) => void
  onSearchChange: (value: string) => void
  onPlatformChange: (value: OrdersReturnsPlatformFilter) => void
  onOpenDetail: (row: OrdersReturnsTableRowModel | OrdersReturnsTimelineItemModel) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function OrdersReturnsView({
  model,
  viewMode,
  isRefreshing,
  onViewModeChange,
  onSearchChange,
  onPlatformChange,
  onOpenDetail,
  onPageChange,
  onPageSizeChange,
}: OrdersReturnsViewProps) {
  return (
    <div className="space-y-4 pb-8 pt-1">
      <OrdersReturnsHeader
        title={model.title}
        subtitle={model.subtitleLabel}
        dateRangeLabel={model.dateRangeLabel}
        isRefreshing={isRefreshing}
      />

      <OrdersReturnsSummaryCards cards={model.statCards} />

      <section className="space-y-3 rounded-xl border border-slate-100 bg-white px-6 pb-4 pt-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <OrdersReturnsFilters
            search={model.filters.search}
            platform={model.filters.platform}
            platformOptions={model.platformOptions}
            onSearchChange={onSearchChange}
            onPlatformChange={onPlatformChange}
          />
          <OrdersReturnsViewModeToggle mode={viewMode} onModeChange={onViewModeChange} />
        </div>

        {viewMode === 'timeline' ? (
          <OrdersReturnsTimeline groups={model.timelineGroups} onOpenDetail={onOpenDetail} />
        ) : (
          <OrdersReturnsTable
            rows={model.tableRows}
            totalCount={model.totalCount}
            page={model.page}
            pageSize={model.pageSize}
            onOpenDetail={onOpenDetail}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </section>
    </div>
  )
}
