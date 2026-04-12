import { useMemo, useState } from 'react'

import { OrdersAllView } from '@/features/orders/components/orders-all/OrdersAllView'
import { useOrdersAllData } from '@/features/orders/hooks/useOrdersAllData'
import { useOrdersAllSelection } from '@/features/orders/hooks/useOrdersAllSelection'
import { buildOrdersAllViewModel } from '@/features/orders/logic/ordersAll.logic'
import type { OrderPlatformFilter, OrderStatusFilter } from '@/features/orders/logic/ordersAll.types'

export function OrdersAll() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrderStatusFilter>('all')
  const [platform, setPlatform] = useState<OrderPlatformFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, isFetching, isError, refetch } = useOrdersAllData({
    search,
    status,
    platform,
    page,
    pageSize,
  })

  const rowIds = useMemo(() => data?.items.map((item) => item.id) ?? [], [data?.items])
  const { selectedIds, selectedCount, isAllSelected, toggleAll, toggleOne, clearSelection } = useOrdersAllSelection(rowIds)

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
      },
      selectedCount,
    })
  }, [data, page, pageSize, platform, search, selectedCount, status])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu đơn hàng...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không thể tải danh sách đơn hàng.</p>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          onClick={() => refetch()}
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
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
      selectedCount={selectedCount}
      selectedIds={selectedIds}
      isAllSelected={isAllSelected}
      onToggleAll={toggleAll}
      onToggleOne={toggleOne}
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
  )
}
