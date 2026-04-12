import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { OrderPlatformFilter, OrderStatusFilter, OrdersAllResponse } from '@/features/orders/logic/ordersAll.types'
import { ordersAllService, type GetOrdersAllParams } from '@/features/orders/services/ordersAllService'

export function useOrdersAllData(params: {
  search: string
  status: OrderStatusFilter
  platform: OrderPlatformFilter
  page: number
  pageSize: number
}) {
  const serviceParams: GetOrdersAllParams = {
    search: params.search,
    status: params.status,
    platform: params.platform,
    page: params.page,
    pageSize: params.pageSize,
  }

  const query = useQuery({
    queryKey: ['orders', 'all', params.search, params.status, params.platform, params.page, params.pageSize] as const,
    queryFn: (): Promise<OrdersAllResponse> => ordersAllService.getOrders(serviceParams),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
