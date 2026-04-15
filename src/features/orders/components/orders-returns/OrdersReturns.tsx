import { useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { OrderDetail } from '@/features/orders/components/order-detail/OrderDetail'
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
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null)
  const [activeDetailState, setActiveDetailState] = useState<{
    orderCode?: string
    platformLabel?: string
    customerName?: string
    productName?: string
    amountLabel?: string
    statusLabel?: string
  } | null>(null)

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
    return <DataLoadErrorState title="Không thể tải dữ liệu hoàn/hủy đơn hàng." onRetry={() => refetch()} />
  }

  const openDetailPopup = (row: { id: string; orderCode: string; platformLabel: string; customerName: string; productName: string; amountLabel: string; statusLabel: string }) => {
    setActiveDetailId(row.id)
    setActiveDetailState({
      orderCode: row.orderCode,
      platformLabel: row.platformLabel,
      customerName: row.customerName,
      productName: row.productName,
      amountLabel: row.amountLabel,
      statusLabel: row.statusLabel,
    })
  }

  return (
    <>
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
        onOpenDetail={openDetailPopup}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value)
          setPage(1)
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
