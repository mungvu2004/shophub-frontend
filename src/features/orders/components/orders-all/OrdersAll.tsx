import { useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { toast } from '@/components/ui/toast'
import type { DataTableSortState } from '@/components/shared/DataTable'
import { OrderDetail } from '@/features/orders/components/order-detail/OrderDetail'
import { OrdersAllView } from '@/features/orders/components/orders-all/OrdersAllView'
import { useOrdersAllData } from '@/features/orders/hooks/useOrdersAllData'
import { useOrdersAllSelection } from '@/features/orders/hooks/useOrdersAllSelection'
import { useOrderActions } from '@/features/orders/hooks/useOrderActions'
import {
  buildOrdersAllCsv,
  buildLastDaysDateRange,
  buildOrdersAllPrintHtml,
  buildOrdersAllViewModel,
  buildTodayDateRange,
  countOrdersAllActiveAdvancedFilters,
  downloadCsvFile,
  openPrintWindowWithHtml,
} from '@/features/orders/logic/ordersAll.logic'
import type {
  OrderPlatformFilter,
  OrderStatusFilter,
  OrdersAllAdvancedFilters,
} from '@/features/orders/logic/ordersAll.types'
import type { Order } from '@/types/order.types'
import { MESSAGES } from '@/constants/messages'

const EMPTY_ADVANCED_FILTERS: OrdersAllAdvancedFilters = {
  dateFrom: '',
  dateTo: '',
  minAmount: '',
  maxAmount: '',
}

function pickOrdersByIds(orders: Order[], ids: string[]) {
  const idSet = new Set(ids)
  return orders.filter((order) => idSet.has(order.id))
}

export function OrdersAll() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrderStatusFilter>('all')
  const [platform, setPlatform] = useState<OrderPlatformFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortState, setSortState] = useState<DataTableSortState>({ columnId: 'updated', direction: 'desc' })
  const [advancedFilters, setAdvancedFilters] = useState<OrdersAllAdvancedFilters>(EMPTY_ADVANCED_FILTERS)
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
  const [confirmDialogState, setConfirmDialogState] = useState<{
    isOpen: boolean
    orders: Order[]
  }>({ isOpen: false, orders: [] })
  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean
    orderId: string | null
    orderCode: string | null
  }>({ isOpen: false, orderId: null, orderCode: null })
  const [cancelDialogState, setCancelDialogState] = useState<{
    isOpen: boolean
    orderId: string | null
    orderCode: string | null
  }>({ isOpen: false, orderId: null, orderCode: null })
  const [shipDialogState, setShipDialogState] = useState<{
    isOpen: boolean
    orderId: string | null
    orderCode: string | null
  }>({ isOpen: false, orderId: null, orderCode: null })
  const [confirmOneDialogState, setConfirmOneDialogState] = useState<{
    isOpen: boolean
    orderId: string | null
    orderCode: string | null
  }>({ isOpen: false, orderId: null, orderCode: null })

  const { data, isLoading, isFetching, isError, refetch } = useOrdersAllData({
    search,
    status,
    platform,
    page,
    pageSize,
    dateFrom: advancedFilters.dateFrom,
    dateTo: advancedFilters.dateTo,
    minAmount: advancedFilters.minAmount,
    maxAmount: advancedFilters.maxAmount,
    sortBy: sortState.columnId,
    sortDirection: sortState.direction,
  })

  const { isProcessing, actionType, handleDelete, handleBulkConfirm, handleShip, handleCancel } = useOrderActions(() => {
    refetch()
  })

  const visibleOrders = useMemo(() => data?.items ?? [], [data?.items])
  const rowIds = useMemo(() => data?.items.map((item) => item.id) ?? [], [data?.items])
  const { selectedIds, selectedCount, isAllSelected, toggleAll, toggleOne, clearSelection } = useOrdersAllSelection(rowIds)
  const selectedOrders = useMemo(() => pickOrdersByIds(visibleOrders, selectedIds), [selectedIds, visibleOrders])

  const todayRange = buildTodayDateRange()
  const last7DaysRange = buildLastDaysDateRange(7)
  const isTodayActive =
    advancedFilters.dateFrom === todayRange.dateFrom
    && advancedFilters.dateTo === todayRange.dateTo
    && advancedFilters.minAmount.trim().length === 0
    && advancedFilters.maxAmount.trim().length === 0

  const isLast7DaysActive =
    advancedFilters.dateFrom === last7DaysRange.dateFrom
    && advancedFilters.dateTo === last7DaysRange.dateTo
    && advancedFilters.minAmount.trim().length === 0
    && advancedFilters.maxAmount.trim().length === 0

  const activeAdvancedFilterCount = useMemo(
    () => countOrdersAllActiveAdvancedFilters(advancedFilters),
    [advancedFilters],
  )

  const exportOrdersCsv = (orders: Order[], fileName: string) => {
    if (orders.length === 0) {
      toast.info(MESSAGES.ORDERS.GENERAL.INFO.NO_DATA_EXPORT)
      return
    }

    const csv = buildOrdersAllCsv(orders)
    downloadCsvFile(fileName, csv)
    toast.success(MESSAGES.ORDERS.GENERAL.SUCCESS.EXPORT_CSV.replace('{count}', orders.length.toString()))
  }

  const printWaybills = (orders: Order[]) => {
    if (orders.length === 0) {
      toast.info('Không có đơn nào để in vận đơn.')
      return
    }

    const html = buildOrdersAllPrintHtml(orders)
    const printed = openPrintWindowWithHtml(html)

    if (printed) {
      toast.success(MESSAGES.ORDERS.GENERAL.SUCCESS.PRINT_WAYBILLS.replace('{count}', orders.length.toString()))
    }
  }

  const handleConfirmBatch = async () => {
    const orders = confirmDialogState.orders
    if (orders.length === 0) return

    const result = await handleBulkConfirm(orders.map((order) => order.id))
    if (result) {
      clearSelection()
      setConfirmDialogState({ isOpen: false, orders: [] })
    }
  }

  const pushWarehouseOrders = async (orders: Order[]) => {
    if (orders.length === 0) {
      toast.info(MESSAGES.ORDERS.GENERAL.INFO.NO_SELECTION)
      return
    }

    clearSelection()
    toast.success(MESSAGES.ORDERS.GENERAL.SUCCESS.PUSH_WAREHOUSE.replace('{count}', orders.length.toString()))
  }

  const openDetailPopup = (order: Order) => {
    setActiveDetailId(order.id)
    setActiveDetailState({
      orderCode: order.externalOrderNumber || order.externalOrderId || order.id,
      platformLabel: order.platform === 'shopee' ? 'Shopee' : order.platform === 'lazada' ? 'Lazada' : 'TikTok',
      customerName: `${order.buyerFirstName ?? ''} ${order.buyerLastName ?? ''}`.trim() || undefined,
      productName: order.items?.[0]?.productName,
      amountLabel: `${Math.max(0, Math.round(order.totalAmount)).toLocaleString('vi-VN')} ₫`,
      statusLabel: order.status,
    })
  }

  const model = useMemo(() => {
    if (!data) return null

    return buildOrdersAllViewModel({
      response: data,
      query: {
        search,
        status,
        platform,
        page,
        pageSize,
        dateFrom: advancedFilters.dateFrom,
        dateTo: advancedFilters.dateTo,
        minAmount: advancedFilters.minAmount,
        maxAmount: advancedFilters.maxAmount,
        sortBy: sortState.columnId,
        sortDirection: sortState.direction,
      },
      selectedCount,
    })
  }, [advancedFilters, data, page, pageSize, platform, search, selectedCount, sortState.columnId, sortState.direction, status])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu đơn hàng...</div>
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không thể tải danh sách đơn hàng." onRetry={() => refetch()} />
  }

  return (
    <>
      <OrdersAllView
        model={model}
        isRefreshing={isFetching || isProcessing}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
          clearSelection()
        }}
        onStatusChange={(value) => {
          setStatus(value)
          setPage(1)
          clearSelection()
        }}
        onPlatformChange={(value) => {
          setPlatform(value)
          setPage(1)
          clearSelection()
        }}
        isTodayActive={isTodayActive}
        isLast7DaysActive={isLast7DaysActive}
        advancedFilters={advancedFilters}
        advancedFilterCount={activeAdvancedFilterCount}
        onTodayToggle={() => {
          if (isTodayActive) {
            setAdvancedFilters(EMPTY_ADVANCED_FILTERS)
          } else {
            setAdvancedFilters({
              ...EMPTY_ADVANCED_FILTERS,
              ...todayRange,
            })
          }

          setPage(1)
          clearSelection()
        }}
        onAdvancedFiltersApply={(filters) => {
          setAdvancedFilters(filters)
          setPage(1)
          clearSelection()
        }}
        onLast7DaysToggle={() => {
          if (isLast7DaysActive) {
            setAdvancedFilters(EMPTY_ADVANCED_FILTERS)
          } else {
            setAdvancedFilters({
              ...EMPTY_ADVANCED_FILTERS,
              ...last7DaysRange,
            })
          }

          setPage(1)
          clearSelection()
        }}
        onAdvancedFiltersReset={() => {
          setAdvancedFilters(EMPTY_ADVANCED_FILTERS)
          setPage(1)
          clearSelection()
        }}
        selectedCount={selectedCount}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onOpenDetail={(row) => {
          const order = visibleOrders.find((item) => item.id === row.id)
          if (order) {
            openDetailPopup(order)
          }
        }}
        onDeleteVisible={(row) => {
          setDeleteDialogState({
            isOpen: true,
            orderId: row.id,
            orderCode: row.code,
          })
        }}
        onCancelVisible={(row) => {
          setCancelDialogState({
            isOpen: true,
            orderId: row.id,
            orderCode: row.code,
          })
        }}
        onShipVisible={(row) => {
          setShipDialogState({
            isOpen: true,
            orderId: row.id,
            orderCode: row.code,
          })
        }}
        onConfirmOneVisible={(row) => {
          setConfirmOneDialogState({
            isOpen: true,
            orderId: row.id,
            orderCode: row.code,
          })
        }}
        onConfirmVisible={() => {
          if (visibleOrders.length === 0) {
            toast.info('Không có đơn nào để xác nhận.')
            return
          }
          setConfirmDialogState({ isOpen: true, orders: visibleOrders })
        }}
        onExportVisibleCsv={() => exportOrdersCsv(visibleOrders, 'orders-list.csv')}
        onPrintVisibleWaybills={() => printWaybills(visibleOrders)}
        onConfirmSelected={() => {
          if (selectedOrders.length === 0) {
            toast.info('Không có đơn nào để xác nhận.')
            return
          }
          setConfirmDialogState({ isOpen: true, orders: selectedOrders })
        }}
        onExportSelectedCsv={() => exportOrdersCsv(selectedOrders, 'selected-orders.csv')}
        onPrintSelectedWaybills={() => printWaybills(selectedOrders)}
        onPushSelectedWarehouse={() => pushWarehouseOrders(selectedOrders)}
        onClearSelection={clearSelection}
        sortState={sortState}
        onSortChange={(nextSort) => {
          setSortState(nextSort)
          setPage(1)
          clearSelection()
        }}
        onPageChange={(value) => {
          setPage(value)
          clearSelection()
        }}
        onPageSizeChange={(value) => {
          setPageSize(value)
          setPage(1)
          clearSelection()
        }}
      />

      <ConfirmDialog
        open={confirmDialogState.isOpen}
        onOpenChange={(open) => {
          if (!open) setConfirmDialogState({ isOpen: false, orders: [] })
        }}
        onConfirm={handleConfirmBatch}
        title={MESSAGES.ORDERS.GENERAL.CONFIRM.CONFIRM_BULK_TITLE}
        description={MESSAGES.ORDERS.GENERAL.CONFIRM.CONFIRM_BULK_DESC.replace('{count}', confirmDialogState.orders.length.toString())}
        confirmText="Xác nhận"
        isConfirming={isProcessing && actionType === 'status-changing'}
        variant="default"
      />

      <ConfirmDialog
        open={deleteDialogState.isOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteDialogState({ isOpen: false, orderId: null, orderCode: null })
        }}
        onConfirm={async () => {
          if (deleteDialogState.orderId) {
            await handleDelete(deleteDialogState.orderId)
            setDeleteDialogState({ isOpen: false, orderId: null, orderCode: null })
          }
        }}
        title={MESSAGES.CONFIRM.DELETE_TITLE}
        description={MESSAGES.ORDERS.GENERAL.CONFIRM.DELETE_DESC.replace('{code}', deleteDialogState.orderCode ?? '')}
        confirmText="Xóa"
        isConfirming={isProcessing && actionType === 'deleting'}
        variant="danger"
      />

      <ConfirmDialog
        open={cancelDialogState.isOpen}
        onOpenChange={(open) => {
          if (!open) setCancelDialogState({ isOpen: false, orderId: null, orderCode: null })
        }}
        onConfirm={async () => {
          if (cancelDialogState.orderId) {
            await handleCancel(cancelDialogState.orderId)
            setCancelDialogState({ isOpen: false, orderId: null, orderCode: null })
          }
        }}
        title={MESSAGES.ORDERS.GENERAL.CONFIRM.CANCEL_TITLE}
        description={MESSAGES.ORDERS.GENERAL.CONFIRM.CANCEL_DESC.replace('{code}', cancelDialogState.orderCode ?? '')}
        confirmText="Hủy đơn"
        isConfirming={isProcessing && actionType === 'status-changing'}
        variant="danger"
      />

      <ConfirmDialog
        open={shipDialogState.isOpen}
        onOpenChange={(open) => {
          if (!open) setShipDialogState({ isOpen: false, orderId: null, orderCode: null })
        }}
        onConfirm={async () => {
          if (shipDialogState.orderId) {
            await handleShip(shipDialogState.orderId)
            setShipDialogState({ isOpen: false, orderId: null, orderCode: null })
          }
        }}
        title={MESSAGES.ORDERS.GENERAL.CONFIRM.SHIP_TITLE}
        description={MESSAGES.ORDERS.GENERAL.CONFIRM.SHIP_DESC.replace('{code}', shipDialogState.orderCode ?? '')}
        confirmText="Bàn giao"
        isConfirming={isProcessing && actionType === 'status-changing'}
        variant="default"
      />

      <ConfirmDialog
        open={confirmOneDialogState.isOpen}
        onOpenChange={(open) => {
          if (!open) setConfirmOneDialogState({ isOpen: false, orderId: null, orderCode: null })
        }}
        onConfirm={async () => {
          if (confirmOneDialogState.orderId) {
            await handleBulkConfirm([confirmOneDialogState.orderId])
            setConfirmOneDialogState({ isOpen: false, orderId: null, orderCode: null })
          }
        }}
        title={MESSAGES.ORDERS.GENERAL.CONFIRM.CONFIRM_BULK_TITLE}
        description={`Bạn có chắc chắn muốn xác nhận đơn hàng ${confirmOneDialogState.orderCode}?`}
        confirmText="Xác nhận"
        isConfirming={isProcessing && actionType === 'status-changing'}
        variant="default"
      />

      {activeDetailId ? (
        <OrderDetail
          orderId={activeDetailId}
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
