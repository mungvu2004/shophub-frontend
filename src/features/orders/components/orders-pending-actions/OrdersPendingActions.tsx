import { useMemo, useState } from 'react'

import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { toast } from '@/components/ui/toast'
import { MESSAGES } from '@/constants/messages'
import { useProductData } from '@/features/products/hooks/useProductData'
import { OrderDetail } from '@/features/orders/components/order-detail/OrderDetail'
import {
  OrdersPendingActionsFormDialog,
  type PendingActionFormMode,
  type PendingActionFormValues,
} from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsFormDialog'
import { OrdersPendingActionsView } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsView'
import { useOrdersAllSelection } from '@/features/orders/hooks/useOrdersAllSelection'
import { useOrdersPendingActionsData } from '@/features/orders/hooks/useOrdersPendingActionsData'
import { useOrdersPendingActions } from '@/features/orders/hooks/useOrdersPendingActions'
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
import type { Order } from '@/types/order.types'

const EMPTY_DATE_FILTERS: OrdersPendingActionsDateFilters = {
  dateFrom: '',
  dateTo: '',
}

const EMPTY_FORM_VALUES: PendingActionFormValues = {
  orderCode: '',
  customerName: '',
  productName: '',
  amount: '',
  platform: 'shopee',
  status: 'Pending',
}

function splitCustomerName(fullName: string) {
  const normalized = fullName.trim().replace(/\s+/g, ' ')
  if (!normalized) return { buyerFirstName: 'Khách', buyerLastName: 'Ẩn danh' }

  const parts = normalized.split(' ')
  if (parts.length === 1) return { buyerFirstName: parts[0], buyerLastName: 'Khách hàng' }

  return {
    buyerFirstName: parts[0],
    buyerLastName: parts.slice(1).join(' '),
  }
}

function buildPendingActionPayload(values: PendingActionFormValues): Partial<Order> {
  const customer = splitCustomerName(values.customerName)
  const totalAmount = Number(values.amount)
  const safeAmount = Number.isFinite(totalAmount) && totalAmount > 0 ? totalAmount : 0
  const now = new Date().toISOString()

  return {
    externalOrderNumber: values.orderCode.trim(),
    externalOrderId: `manual-${Date.now()}`,
    buyerFirstName: customer.buyerFirstName,
    buyerLastName: customer.buyerLastName,
    platform: values.platform,
    totalAmount: safeAmount,
    currency: 'VND',
    status: values.status,
    source: 'manual',
    giftOption: false,
    isDeleted: false,
    createdAt: now,
    createdAt_platform: now,
    updatedAt: now,
    updatedAt_platform: now,
    sellerId: 'seller-001',
    connectionId: 'pc-001',
    paymentMethod: 'COD',
    items: [
      {
        id: `item-manual-${Date.now()}`,
        orderId: '',
        externalOrderItemId: `external-manual-item-${Date.now()}`,
        productName: values.productName.trim(),
        qty: 1,
        itemPrice: safeAmount,
        paidPrice: safeAmount,
        currency: 'VND',
        status: values.status,
        isFulfilledByPlatform: false,
        isDigital: false,
      },
    ],
  }
}

export function OrdersPendingActions() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'OrdersPendingActionsPage',
  })

  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<OrdersPendingActionsPlatformFilter>('all')
  const [sla, setSla] = useState<OrdersPendingActionsSlaFilter>('all')
  const [dateFilters, setDateFilters] = useState<OrdersPendingActionsDateFilters>(EMPTY_DATE_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null)
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
  const [activeDetailState, setActiveDetailState] = useState<{
    orderCode?: string
    platformLabel?: string
    customerName?: string
    productName?: string
    amountLabel?: string
    statusLabel?: string
    actionLabel?: string
  } | null>(null)
  const [rowDeleteState, setRowDeleteState] = useState<{ id: string; code: string; open: boolean }>({
    id: '',
    code: '',
    open: false,
  })
  const [formState, setFormState] = useState<{
    open: boolean
    mode: PendingActionFormMode
    orderId: string | null
    values: PendingActionFormValues
  }>({
    open: false,
    mode: 'create',
    orderId: null,
    values: EMPTY_FORM_VALUES,
  })

  const { data, isLoading, isFetching, isError, refetch } = useOrdersPendingActionsData({
    search,
    platform,
    sla,
    dateFrom: dateFilters.dateFrom,
    dateTo: dateFilters.dateTo,
    page,
    pageSize,
  })

  const {
    isProcessing,
    actionType,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkApprove,
    handleBulkCancel,
    handleBulkPrint,
  } = useOrdersPendingActions()

  const rowIds = useMemo(() => data?.items.map((item) => item.id) ?? [], [data?.items])
  const { selectedIds, selectedCount, isAllSelected, toggleAll, toggleOne, clearSelection } = useOrdersAllSelection(rowIds)

  const todayRange = buildTodayDateRange()
  const last7DaysRange = buildLastDaysDateRange(7)

  const isTodayActive = dateFilters.dateFrom === todayRange.dateFrom && dateFilters.dateTo === todayRange.dateTo
  const isLast7DaysActive = dateFilters.dateFrom === last7DaysRange.dateFrom && dateFilters.dateTo === last7DaysRange.dateTo

  const exportRowsCsv = (rows: OrdersPendingActionsTableRowModel[], fileName: string) => {
    if (rows.length === 0) {
      toast.info(MESSAGES.ORDERS.PENDING_ACTIONS.INFO.NO_ROWS_EXPORT)
      return
    }

    downloadCsvFile(fileName, buildOrdersPendingActionsCsv(rows))
    toast.success(MESSAGES.ORDERS.PENDING_ACTIONS.SUCCESS.EXPORT_CSV)
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
        isProcessing={isProcessing}
        actionType={actionType}
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
        onCreateOrder={() => {
          setFormState({
            open: true,
            mode: 'create',
            orderId: null,
            values: EMPTY_FORM_VALUES,
          })
        }}
        onEditOrder={(row) => {
          setFormState({
            open: true,
            mode: 'edit',
            orderId: row.id,
            values: {
              orderCode: row.orderCode,
              customerName: row.customerName,
              productName: row.productName,
              amount: String(row.amountValue),
              platform: row.platform,
              status: row.status,
            },
          })
        }}
        onDeleteOrder={(row) => {
          setRowDeleteState({
            id: row.id,
            code: row.orderCode,
            open: true,
          })
        }}
        onClearSelection={clearSelection}
        onExportVisibleCsv={() => exportRowsCsv(model.rows, 'pending-actions-list.csv')}
        onApproveSelected={async () => {
          await handleBulkApprove(selectedIds)
          clearSelection()
        }}
        onPrintSelected={async () => {
          await handleBulkPrint(selectedIds)
          clearSelection()
        }}
        onCancelSelected={() => {
          setIsCancelConfirmOpen(true)
        }}
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

      <ConfirmDialog
        open={isCancelConfirmOpen}
        onOpenChange={setIsCancelConfirmOpen}
        title="Xác nhận hủy đơn hàng"
        description={`Bạn có chắc chắn muốn hủy ${selectedCount} đơn hàng này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến tỷ lệ hủy đơn của shop.`}
        confirmText="Xác nhận hủy"
        isConfirming={isProcessing && actionType === 'deleting'}
        onConfirm={async () => {
          await handleBulkCancel(selectedIds)
          setIsCancelConfirmOpen(false)
          clearSelection()
        }}
      />

      <ConfirmDialog
        open={rowDeleteState.open}
        onOpenChange={(open) => setRowDeleteState((current) => ({ ...current, open }))}
        title={MESSAGES.ORDERS.PENDING_ACTIONS.FORM.DELETE_CONFIRM_TITLE}
        description={`Bạn có chắc chắn muốn xóa đơn ${rowDeleteState.code}? Hành động này không thể hoàn tác.`}
        confirmText="Xóa đơn"
        isConfirming={isProcessing && actionType === 'deleting'}
        onConfirm={async () => {
          await handleDelete(rowDeleteState.id)
          setRowDeleteState({ id: '', code: '', open: false })
          clearSelection()
        }}
      />

      <OrdersPendingActionsFormDialog
        open={formState.open}
        mode={formState.mode}
        isSubmitting={isProcessing && (actionType === 'creating' || actionType === 'updating')}
        values={formState.values}
        onValuesChange={(values) => {
          setFormState((current) => ({ ...current, values }))
        }}
        onOpenChange={(open) => {
          if (!open) {
            setFormState((current) => ({ ...current, open: false }))
            return
          }
          setFormState((current) => ({ ...current, open: true }))
        }}
        onSubmit={async (values) => {
          const payload = buildPendingActionPayload(values)
          const hasRequiredValues =
            values.orderCode.trim().length > 0
            && values.customerName.trim().length > 0
            && values.productName.trim().length > 0
            && Number(values.amount) > 0

          if (!hasRequiredValues) {
            toast.error(MESSAGES.ERROR.GENERAL)
            return
          }

          if (formState.mode === 'create') {
            await handleCreate(payload)
          } else if (formState.orderId) {
            await handleUpdate(formState.orderId, payload)
          }

          setFormState({
            open: false,
            mode: 'create',
            orderId: null,
            values: EMPTY_FORM_VALUES,
          })
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
