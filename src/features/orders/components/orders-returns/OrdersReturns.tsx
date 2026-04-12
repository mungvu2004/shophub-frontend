import { useMemo, useState } from 'react'

import { OrdersReturnsView } from '@/features/orders/components/orders-returns/OrdersReturnsView'
import { useOrdersReturnsData } from '@/features/orders/hooks/useOrdersReturnsData'
import { useOrdersReturnsViewMode } from '@/features/orders/hooks/useOrdersReturnsViewMode'
import { buildOrdersReturnsViewModel } from '@/features/orders/logic/ordersReturns.logic'
import type { OrdersReturnsPlatformFilter } from '@/features/orders/logic/ordersReturns.types'

export function OrdersReturns() {
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<OrdersReturnsPlatformFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { mode, setMode } = useOrdersReturnsViewMode('timeline')

  const { data, isLoading, isFetching, isError, refetch } = useOrdersReturnsData({
    search,
    platform,
    page,
    pageSize,
  })

  const model = useMemo(() => {
    if (!data) return null

    return buildOrdersReturnsViewModel({
      response: data,
      query: {
        search,
        platform,
        page,
        pageSize,
      },
    })
  }, [data, page, pageSize, platform, search])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu hoàn/hủy...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không thể tải dữ liệu hoàn/hủy đơn hàng.</p>
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
    <OrdersReturnsView
      model={model}
      viewMode={mode}
      isRefreshing={isFetching}
      onViewModeChange={setMode}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      onPlatformChange={(value) => {
        setPlatform(value)
        setPage(1)
      }}
      onPageChange={setPage}
      onPageSizeChange={(value) => {
        setPageSize(value)
        setPage(1)
      }}
    />
  )
}
