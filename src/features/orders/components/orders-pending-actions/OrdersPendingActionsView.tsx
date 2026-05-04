import { Button } from '@/components/ui/button'
import { OrdersPendingActionsFilters } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsFilters'
import { OrdersPendingActionsHeader } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsHeader'
import { OrdersPendingActionsSummaryCards } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsSummaryCards'
import { OrdersPendingActionsTable } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsTable'
import { buildPendingActionsCharts } from '@/features/orders/logic/ordersPendingActionsTable.logic'
import type {
  OrdersPendingActionsDateFilters,
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsSlaFilter,
  OrdersPendingActionsTableRowModel,
  OrdersPendingActionsViewModel,
} from '@/features/orders/logic/ordersPendingActions.types'
import type { ActionType } from '@/features/shared/hooks/useCRUDActions'

type OrdersPendingActionsViewProps = {
  model: OrdersPendingActionsViewModel
  isRefreshing: boolean
  isProcessing: boolean
  actionType: ActionType
  onSearchChange: (value: string) => void
  onPlatformChange: (value: OrdersPendingActionsPlatformFilter) => void
  onSlaChange: (value: OrdersPendingActionsSlaFilter) => void
  dateFilters: OrdersPendingActionsDateFilters
  isTodayActive: boolean
  isLast7DaysActive: boolean
  onTodayToggle: () => void
  onLast7DaysToggle: () => void
  onDateFiltersApply: (filters: OrdersPendingActionsDateFilters) => void
  onDateFiltersReset: () => void
  selectedIds: string[]
  selectedCount: number
  isAllSelected: boolean
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onOpenDetail: (row: OrdersPendingActionsTableRowModel) => void
  onCreateOrder: () => void
  onEditOrder: (row: OrdersPendingActionsTableRowModel) => void
  onDeleteOrder: (row: OrdersPendingActionsTableRowModel) => void
  onClearSelection: () => void
  onExportVisibleCsv: () => void
  onApproveSelected: () => void
  onPrintSelected: () => void
  onCancelSelected: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

type ChartItem = {
  label: string
  count: number
  percent: number
  colorClass: string
}

function PendingActionsSlaChart({ items }: { items: ChartItem[] }) {
  const max = Math.max(1, ...items.map((item) => item.count))

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <h3 className="text-sm font-semibold text-slate-900">Phân bố SLA</h3>
      <p className="mt-1 text-xs text-slate-500">Theo danh sách đang hiển thị</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-2 py-3">
            <div className="relative flex h-20 w-8 items-end rounded-md bg-slate-100">
              <div
                className={`w-full rounded-md ${item.colorClass}`}
                style={{ height: `${Math.max(10, (item.count / max) * 100)}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-slate-700">{item.label}</p>
              <p className="text-[11px] text-slate-500">{item.count} ({item.percent}%)</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

function PendingActionsPlatformChart({ items }: { items: ChartItem[] }) {
  const valid = items.filter((item) => item.count > 0)
  const gradient = valid.length
    ? `conic-gradient(${valid
        .map((item, index) => {
          const before = valid.slice(0, index).reduce((sum, current) => sum + current.percent, 0)
          const after = before + item.percent
          const color = item.colorClass === 'bg-orange-500'
            ? '#f97316'
            : item.colorClass === 'bg-blue-500'
              ? '#3b82f6'
              : '#0f172a'
          return `${color} ${before}% ${after}%`
        })
        .join(',')})`
    : 'conic-gradient(#e2e8f0 0 100%)'

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <h3 className="text-sm font-semibold text-slate-900">Tỷ trọng theo sàn</h3>
      <p className="mt-1 text-xs text-slate-500">Giúp phân bổ nguồn lực xử lý</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 rounded-full" style={{ background: gradient }}>
          <div className="absolute inset-3 rounded-full bg-white" />
        </div>

        <div className="flex-1 space-y-2">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="font-semibold text-slate-600">{item.count} ({item.percent}%)</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export function OrdersPendingActionsView({
  model,
  isRefreshing,
  isProcessing,
  actionType,
  onSearchChange,
  onPlatformChange,
  onSlaChange,
  dateFilters,
  isTodayActive,
  isLast7DaysActive,
  onTodayToggle,
  onLast7DaysToggle,
  onDateFiltersApply,
  onDateFiltersReset,
  selectedIds,
  selectedCount,
  isAllSelected,
  onToggleAll,
  onToggleOne,
  onOpenDetail,
  onCreateOrder,
  onEditOrder,
  onDeleteOrder,
  onClearSelection,
  onExportVisibleCsv,
  onApproveSelected,
  onPrintSelected,
  onCancelSelected,
  onPageChange,
  onPageSizeChange,
}: OrdersPendingActionsViewProps) {
  const charts = buildPendingActionsCharts(model.rows)

  return (
    <div className="space-y-5">
      <OrdersPendingActionsHeader
        title={model.heading}
        description={model.description}
        isRefreshing={isRefreshing}
      />

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
        dateFilters={dateFilters}
        isTodayActive={isTodayActive}
        isLast7DaysActive={isLast7DaysActive}
        onTodayToggle={onTodayToggle}
        onLast7DaysToggle={onLast7DaysToggle}
        onDateFiltersApply={onDateFiltersApply}
        onDateFiltersReset={onDateFiltersReset}
      />

      {selectedCount > 0 ? (
        <section className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="pointer-events-auto flex w-full max-w-5xl flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.55)] backdrop-blur">
            <p className="mr-1 text-[13px] font-semibold text-slate-700">Đã chọn {selectedCount} đơn</p>
            <Button
              variant="default"
              size="sm"
              isLoading={isProcessing && actionType === 'status-changing'}
              loadingText="Đang duyệt..."
              disabled={isProcessing && actionType !== 'status-changing'}
              onClick={onApproveSelected}
            >
              Duyệt hàng loạt
            </Button>
            <Button
              variant="secondary"
              size="sm"
              isLoading={isProcessing && actionType === 'updating'}
              loadingText="Đang in..."
              disabled={isProcessing && actionType !== 'updating'}
              className="border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              onClick={onPrintSelected}
            >
              In vận đơn
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isProcessing && actionType === 'deleting'}
              loadingText="Đang hủy..."
              disabled={isProcessing && actionType !== 'deleting'}
              className="border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
              onClick={onCancelSelected}
            >
              Hủy đơn
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500"
              onClick={onClearSelection}
              disabled={isProcessing}
            >
              Đóng
            </Button>
          </div>
        </section>
      ) : null}

      <div className="grid items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-3 xl:sticky xl:top-20">
          <PendingActionsSlaChart
            items={charts.slaItems as ChartItem[]}
          />

          <PendingActionsPlatformChart
            items={charts.platformItems as ChartItem[]}
          />
        </aside>

          <OrdersPendingActionsTable
            rows={model.rows}
            totalCount={model.totalCount}
            page={model.page}
            pageSize={model.pageSize}
            onExportData={onExportVisibleCsv}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            onToggleAll={onToggleAll}
            onToggleOne={onToggleOne}
            onOpenDetail={onOpenDetail}
            isProcessing={isProcessing}
            actionType={actionType}
            onCreateOrder={onCreateOrder}
            onEditOrder={onEditOrder}
            onDeleteOrder={onDeleteOrder}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
      </div>
    </div>
  )
}
