import { useEffect, useMemo, useRef } from 'react'

import type { DataTableSortState } from '@/components/shared/DataTable'
import { OrdersAllBulkActions } from '@/features/orders/components/orders-all/OrdersAllBulkActions'
import { OrdersAllFilters } from '@/features/orders/components/orders-all/OrdersAllFilters'
import { OrdersAllHeader } from '@/features/orders/components/orders-all/OrdersAllHeader'
import { OrdersAllSummaryBar } from '@/features/orders/components/orders-all/OrdersAllSummaryBar'
import { OrdersAllStatusTabs } from '@/features/orders/components/orders-all/OrdersAllStatusTabs'
import { OrdersAllTable } from '@/features/orders/components/orders-all/OrdersAllTable'
import type { OrdersAllTableRowModel } from '@/features/orders/logic/ordersAll.types'
import { buildOrdersAllCharts, type OrdersAllChartItem } from '@/features/orders/logic/ordersAll.logic'
import type {
  OrderPlatformFilter,
  OrderStatusFilter,
  OrdersAllAdvancedFilters,
  OrdersAllViewModel,
} from '@/features/orders/logic/ordersAll.types'

type OrdersAllViewProps = {
  model: OrdersAllViewModel
  isRefreshing: boolean
  onSearchChange: (value: string) => void
  onStatusChange: (value: OrderStatusFilter) => void
  onPlatformChange: (value: OrderPlatformFilter) => void
  isTodayActive: boolean
  isLast7DaysActive: boolean
  advancedFilters: OrdersAllAdvancedFilters
  advancedFilterCount: number
  onTodayToggle: () => void
  onLast7DaysToggle: () => void
  onAdvancedFiltersApply: (filters: OrdersAllAdvancedFilters) => void
  onAdvancedFiltersReset: () => void
  selectedCount: number
  selectedIds: string[]
  isAllSelected: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onOpenDetail?: (row: OrdersAllTableRowModel) => void
  onConfirmVisible: () => void
  onExportVisibleCsv: () => void
  onPrintVisibleWaybills: () => void
  onConfirmSelected: () => void
  onExportSelectedCsv: () => void
  onPrintSelectedWaybills: () => void
  onPushSelectedWarehouse: () => void
  onClearSelection: () => void
  sortState: DataTableSortState
  onSortChange: (sort: DataTableSortState) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function OrdersStatusDistributionChart({ items }: { items: OrdersAllChartItem[] }) {
  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.4)]">
      <h3 className="text-sm font-semibold text-slate-900">Phân bố trạng thái</h3>
      <p className="mt-1 text-xs text-slate-500">Theo bộ lọc hiện tại</p>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="font-semibold text-slate-600">{item.count} đơn ({item.percent}%)</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function OrdersPlatformMixChart({ items }: { items: OrdersAllChartItem[] }) {
  const gradient = useMemo(() => {
    const validItems = items.filter((item) => item.count > 0)
    if (validItems.length === 0) return 'conic-gradient(#e2e8f0 0 100%)'

    let current = 0
    const segments = validItems.map((item) => {
      const start = current
      const end = current + item.percent
      current = end
      return `${item.color} ${start}% ${end}%`
    })

    return `conic-gradient(${segments.join(',')})`
  }, [items])

  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.4)]">
      <h3 className="text-sm font-semibold text-slate-900">Tỷ trọng theo sàn</h3>
      <p className="mt-1 text-xs text-slate-500">Dựa trên các dòng đơn đang hiển thị</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-28 w-28 shrink-0 rounded-full" style={{ background: gradient }}>
          <div className="absolute inset-3 rounded-full bg-white" />
        </div>

        <div className="flex-1 space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
              <span className="font-semibold text-slate-600">{item.count} ({item.percent}%)</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export function OrdersAllView({
  model,
  isRefreshing,
  onSearchChange,
  onStatusChange,
  onPlatformChange,
  isTodayActive,
  isLast7DaysActive,
  advancedFilters,
  advancedFilterCount,
  onTodayToggle,
  onLast7DaysToggle,
  onAdvancedFiltersApply,
  onAdvancedFiltersReset,
  selectedCount,
  selectedIds,
  isAllSelected,
  onToggleAll,
  onToggleOne,
  onOpenDetail,
  onConfirmVisible,
  onExportVisibleCsv,
  onPrintVisibleWaybills,
  onConfirmSelected,
  onExportSelectedCsv,
  onPrintSelectedWaybills,
  onPushSelectedWarehouse,
  onClearSelection,
  sortState,
  onSortChange,
  onPageChange,
  onPageSizeChange,
}: OrdersAllViewProps) {
  const tableTopRef = useRef<HTMLDivElement | null>(null)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    const top = tableTopRef.current?.getBoundingClientRect().top
    if (typeof top !== 'number') return

    window.scrollTo({
      top: Math.max(0, window.scrollY + top - 180),
      behavior: 'smooth',
    })
  }, [model.page, model.pageSize])

  const charts = useMemo(
    () => buildOrdersAllCharts({ rows: model.rows, statusTabs: model.statusTabs }),
    [model.rows, model.statusTabs],
  )

  return (
    <div className="space-y-3 pb-8 pt-1">
      <OrdersAllHeader
        title={model.title}
        totalOrders={model.totalCount}
        pendingOrders={model.statusTabs.find((tab) => tab.id === 'pending_group')?.count ?? 0}
        isRefreshing={isRefreshing}
        onConfirmBatch={onConfirmVisible}
        onExportCsv={onExportVisibleCsv}
        onPrintWaybills={onPrintVisibleWaybills}
      />

      <section className="space-y-3 rounded-xl bg-white px-6 pb-3 pt-4 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <OrdersAllFilters
          search={model.filters.search}
          platform={model.filters.platform}
          platformOptions={model.platformOptions}
          isTodayActive={isTodayActive}
          isLast7DaysActive={isLast7DaysActive}
          advancedFilters={advancedFilters}
          advancedFilterCount={advancedFilterCount}
          onSearchChange={onSearchChange}
          onPlatformChange={onPlatformChange}
          onTodayToggle={onTodayToggle}
          onLast7DaysToggle={onLast7DaysToggle}
          onAdvancedFiltersApply={onAdvancedFiltersApply}
          onAdvancedFiltersReset={onAdvancedFiltersReset}
        />

        <OrdersAllStatusTabs tabs={model.statusTabs} activeStatus={model.filters.status} onStatusChange={onStatusChange} />
      </section>

      <OrdersAllBulkActions
        selectedCount={selectedCount}
        onConfirmSelected={onConfirmSelected}
        onExportSelectedCsv={onExportSelectedCsv}
        onPrintSelectedWaybills={onPrintSelectedWaybills}
        onPushSelectedWarehouse={onPushSelectedWarehouse}
        onClearSelection={onClearSelection}
      />

      <OrdersAllSummaryBar
        totalOrdersLabel={model.summaryLabel.totalOrders}
        totalRevenueLabel={model.summaryLabel.totalRevenue}
        pendingLabel={model.summaryLabel.pending}
      />

      <div ref={tableTopRef} className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <OrdersAllTable
            rows={model.rows}
            totalCount={model.totalCount}
            page={model.page}
            pageSize={model.pageSize}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            onToggleAll={onToggleAll}
            onToggleOne={onToggleOne}
            onOpenDetail={onOpenDetail}
            onExportData={onExportVisibleCsv}
            sortState={sortState}
            onSortChange={onSortChange}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>

        <aside className="space-y-3 xl:sticky xl:top-20">
          <OrdersStatusDistributionChart items={charts.statusItems} />
          <OrdersPlatformMixChart items={charts.platformItems} />
        </aside>
      </div>
    </div>
  )
}
