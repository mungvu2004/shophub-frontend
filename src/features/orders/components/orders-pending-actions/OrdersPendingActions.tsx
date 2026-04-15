import { useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { toast } from '@/components/ui/toast'
import { OrderDetail } from '@/features/orders/components/order-detail/OrderDetail'
import { OrdersPendingActionsView } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsView'
import { useOrdersAllSelection } from '@/features/orders/hooks/useOrdersAllSelection'
import { useOrdersPendingActionsData } from '@/features/orders/hooks/useOrdersPendingActionsData'
import {
  buildLastDaysDateRange,
  buildOrdersPendingActionsCsv,
  buildOrdersPendingActionsViewModel,
  buildTodayDateRange,
  downloadCsvFile,
} from '@/features/orders/logic/ordersPendingActions.logic'
import type {
  OrdersPendingActionsDateFilters,
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsSlaFilter,
  OrdersPendingActionsTableRowModel,
} from '@/features/orders/logic/ordersPendingActions.types'

const EMPTY_DATE_FILTERS: OrdersPendingActionsDateFilters = {
  dateFrom: '',
  dateTo: '',
}

function pickRowsByIds(rows: OrdersPendingActionsTableRowModel[], ids: string[]) {
  const idSet = new Set(ids)
  return rows.filter((row) => idSet.has(row.id))
}

export function OrdersPendingActions() {
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<OrdersPendingActionsPlatformFilter>('all')
  const [sla, setSla] = useState<OrdersPendingActionsSlaFilter>('all')
  const [dateFilters, setDateFilters] = useState<OrdersPendingActionsDateFilters>(EMPTY_DATE_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null)
  const [activeDetailState, setActiveDetailState] = useState<{
    orderCode?: string
    platformLabel?: string
    customerName?: string
    productName?: string
    amountLabel?: string
    statusLabel?: string
    actionLabel?: string
  } | null>(null)

  const { data, isLoading, isFetching, isError, refetch } = useOrdersPendingActionsData({
    search,
    platform,
    sla,
    dateFrom: dateFilters.dateFrom,
    dateTo: dateFilters.dateTo,
    page,
    pageSize,
  })

  const rowIds = useMemo(() => data?.items.map((item) => item.id) ?? [], [data?.items])
  const { selectedIds, selectedCount, isAllSelected, toggleAll, toggleOne, clearSelection } = useOrdersAllSelection(rowIds)

  const rowsFromData = useMemo(() => {
    if (!data) return []
    return buildOrdersPendingActionsViewModel({
      response: data,
      query: {
        search,
        platform,
        sla,
        dateFrom: dateFilters.dateFrom,
        dateTo: dateFilters.dateTo,
        page,
        pageSize,
      },
    }).rows
  }, [data, dateFilters.dateFrom, dateFilters.dateTo, page, pageSize, platform, search, sla])
  const selectedRows = useMemo(() => pickRowsByIds(rowsFromData, selectedIds), [rowsFromData, selectedIds])

  const todayRange = buildTodayDateRange()
  const last7DaysRange = buildLastDaysDateRange(7)

  const isTodayActive = dateFilters.dateFrom === todayRange.dateFrom && dateFilters.dateTo === todayRange.dateTo
  const isLast7DaysActive = dateFilters.dateFrom === last7DaysRange.dateFrom && dateFilters.dateTo === last7DaysRange.dateTo

  const exportRowsCsv = (rows: OrdersPendingActionsTableRowModel[], fileName: string) => {
    if (rows.length === 0) {
      toast.info('Không có đơn nào để xuất CSV.')
      return
    }

    downloadCsvFile(fileName, buildOrdersPendingActionsCsv(rows))
    toast.success(`Đã xuất ${rows.length} đơn ra CSV.`)
  }

  const runBulkAction = (rows: OrdersPendingActionsTableRowModel[], actionLabel: string) => {
    if (rows.length === 0) {
      toast.info('Vui lòng chọn đơn để thao tác.')
      return
    }

    clearSelection()
    toast.success(`${actionLabel} ${rows.length} đơn thành công.`)
  }

  const openDetailPopup = (row: OrdersPendingActionsTableRowModel) => {
    setActiveDetailId(row.id)
    setActiveDetailState({
      orderCode: row.orderCode,
      platformLabel: row.platformLabel,
      customerName: row.customerName,
      productName: row.productName,
      amountLabel: row.amountLabel,
      statusLabel: row.statusLabel,
      actionLabel: row.actionLabel,
    })
  }

  const model = useMemo(() => {
    if (!data) return null

    return buildOrdersPendingActionsViewModel({
      response: data,
      query: {
        search,
        platform,
        sla,
        dateFrom: dateFilters.dateFrom,
        dateTo: dateFilters.dateTo,
        page,
        pageSize,
      },
    })
  }, [data, dateFilters.dateFrom, dateFilters.dateTo, page, pageSize, platform, search, sla])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải danh sách đơn cần xử lý...</div>
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không thể tải danh sách đơn cần xử lý." onRetry={() => refetch()} />
  }

  return (
    <>
      <OrdersPendingActionsView
        model={model}
        isRefreshing={isFetching}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
          clearSelection()
        }}
        onPlatformChange={(value) => {
          setPlatform(value)
          setPage(1)
          clearSelection()
        }}
        onSlaChange={(value) => {
          setSla(value)
          setPage(1)
          clearSelection()
        }}
        dateFilters={dateFilters}
        isTodayActive={isTodayActive}
        isLast7DaysActive={isLast7DaysActive}
        onTodayToggle={() => {
          setDateFilters(isTodayActive ? EMPTY_DATE_FILTERS : todayRange)
          setPage(1)
          clearSelection()
        }}
        onLast7DaysToggle={() => {
          setDateFilters(isLast7DaysActive ? EMPTY_DATE_FILTERS : last7DaysRange)
          setPage(1)
          clearSelection()
        }}
        onDateFiltersApply={(filters) => {
          setDateFilters(filters)
          setPage(1)
          clearSelection()
        }}
        onDateFiltersReset={() => {
          setDateFilters(EMPTY_DATE_FILTERS)
          setPage(1)
          clearSelection()
        }}
        selectedIds={selectedIds}
        selectedCount={selectedCount}
        isAllSelected={isAllSelected}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onOpenDetail={openDetailPopup}
        onClearSelection={clearSelection}
        onExportVisibleCsv={() => exportRowsCsv(model.rows, 'pending-actions-list.csv')}
        onApproveSelected={() => runBulkAction(selectedRows, 'Đã duyệt')}
        onPrintSelected={() => runBulkAction(selectedRows, 'Đã in mã vận đơn cho')}
        onCancelSelected={() => runBulkAction(selectedRows, 'Đã hủy')}
        onPageChange={(nextPage) => {
          setPage(nextPage)
          clearSelection()
        }}
        onPageSizeChange={(value) => {
          setPageSize(value)
          setPage(1)
          clearSelection()
        }}
      />

      {activeDetailId ? (
        <OrderDetail
          orderId={activeDetailId ?? undefined}
          fallbackState={activeDetailState}
          isModalPresentation
          onClose={() => {
            setActiveDetailId(null)
            setActiveDetailState(null)
          }}
        />
      ) : null}
    </>
  )
}
