import { useMemo, useState } from 'react'

import { OrdersPendingActionsView } from '@/features/orders/components/orders-pending-actions/OrdersPendingActionsView'
import { useOrdersPendingActionsData } from '@/features/orders/hooks/useOrdersPendingActionsData'
import { buildOrdersPendingActionsViewModel } from '@/features/orders/logic/ordersPendingActions.logic'
import type {
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsSlaFilter,
} from '@/features/orders/logic/ordersPendingActions.types'

export function OrdersPendingActions() {
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<OrdersPendingActionsPlatformFilter>('all')
  const [sla, setSla] = useState<OrdersPendingActionsSlaFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, isFetching, isError, refetch } = useOrdersPendingActionsData({
    search,
    platform,
    sla,
    page,
    pageSize,
  })

  const model = useMemo(() => {
    if (!data) return null

    return buildOrdersPendingActionsViewModel({
      response: data,
      query: {
        search,
        platform,
        sla,
        page,
        pageSize,
      },
    })
  }, [data, page, pageSize, platform, search, sla])

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải danh sách đơn cần xử lý...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không thể tải danh sách đơn cần xử lý.</p>
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
    <OrdersPendingActionsView
      model={model}
      isRefreshing={isFetching}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      onPlatformChange={(value) => {
        setPlatform(value)
        setPage(1)
      }}
      onSlaChange={(value) => {
        setSla(value)
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
