import { useMemo, useState } from 'react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { useProductData } from '@/features/products/hooks/useProductData'
import { OrdersReturnsView } from '@/features/orders/components/orders-returns/OrdersReturnsView'
import { OrdersReturnsDetailDialog } from '@/features/orders/components/orders-returns/OrdersReturnsDetailDialog'
import { useOrdersReturnsData } from '@/features/orders/hooks/useOrdersReturnsData'
import { useOrdersReturnsViewMode } from '@/features/orders/hooks/useOrdersReturnsViewMode'
import { buildOrdersReturnsViewModel } from '@/features/orders/logic/ordersReturns.logic'
import type { OrdersReturnsPlatformFilter, OrdersReturnsTableRowModel, OrdersReturnsTimelineItemModel } from '@/features/orders/logic/ordersReturns.types'

export function OrdersReturns() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'OrdersReturnsPage',
  })

  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<OrdersReturnsPlatformFilter>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<OrdersReturnsTableRowModel | OrdersReturnsTimelineItemModel | null>(null)

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
    return <PageSkeleton />
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không thể tải dữ liệu hoàn/hủy đơn hàng." onRetry={() => refetch()} />
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
        onOpenDetail={setSelectedOrder}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value)
          setPage(1)
        }}
      />

      <OrdersReturnsDetailDialog
        isOpen={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
      />
    </>
  )
}
