import { useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { toast } from '@/components/ui/toast'
import { OrderDetail } from '@/features/orders/components/order-detail/OrderDetail'
import { OrdersAllView } from '@/features/orders/components/orders-all/OrdersAllView'
import { useOrdersAllData } from '@/features/orders/hooks/useOrdersAllData'
import { useOrdersAllSelection } from '@/features/orders/hooks/useOrdersAllSelection'
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
import { ordersAllService } from '@/features/orders/services/ordersAllService'
import type { Order } from '@/types/order.types'

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
  })

  const visibleOrders = data?.items ?? []
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
      toast.info('Không có đơn nào để xuất CSV.')
      return
    }

    const csv = buildOrdersAllCsv(orders)
    downloadCsvFile(fileName, csv)
    toast.success(`Đã xuất ${orders.length} đơn ra CSV.`)
  }

  const printWaybills = (orders: Order[]) => {
    if (orders.length === 0) {
      toast.info('Không có đơn nào để in vận đơn.')
      return
    }

    const html = buildOrdersAllPrintHtml(orders)
    const printed = openPrintWindowWithHtml(html)

    if (printed) {
      toast.success(`Đã mở bản in vận đơn cho ${orders.length} đơn.`)
    }
  }

  const confirmOrders = async (orders: Order[]) => {
    if (orders.length === 0) {
      toast.info('Không có đơn nào để xác nhận.')
      return
    }

    try {
      const result = await ordersAllService.bulkConfirmOrders(orders.map((order) => order.id))
      clearSelection()
      await refetch()
      toast.success(`Đã xác nhận ${result.updatedCount} đơn.`)
    } catch {
      toast.error('Không thể xác nhận hàng loạt lúc này.')
    }
  }

  const pushWarehouseOrders = async (orders: Order[]) => {
    if (orders.length === 0) {
      toast.info('Không có đơn nào để đẩy kho.')
      return
    }

    clearSelection()
    toast.success(`Đã gửi ${orders.length} đơn sang kho để xử lý.`)
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
      },
      selectedCount,
    })
  }, [advancedFilters, data, page, pageSize, platform, search, selectedCount, status])

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
        isRefreshing={isFetching}
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
        onConfirmVisible={() => confirmOrders(visibleOrders)}
        onExportVisibleCsv={() => exportOrdersCsv(visibleOrders, 'orders-list.csv')}
        onPrintVisibleWaybills={() => printWaybills(visibleOrders)}
        onConfirmSelected={() => confirmOrders(selectedOrders)}
        onExportSelectedCsv={() => exportOrdersCsv(selectedOrders, 'selected-orders.csv')}
        onPrintSelectedWaybills={() => printWaybills(selectedOrders)}
        onPushSelectedWarehouse={() => pushWarehouseOrders(selectedOrders)}
        onClearSelection={clearSelection}
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
