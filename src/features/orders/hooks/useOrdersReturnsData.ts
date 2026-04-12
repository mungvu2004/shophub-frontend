import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type {
  OrdersReturnsPlatformFilter,
  OrdersReturnsResponse,
} from '@/features/orders/logic/ordersReturns.types'
import { ordersReturnsService, type GetOrdersReturnsParams } from '@/features/orders/services/ordersReturnsService'

export function useOrdersReturnsData(params: {
  search: string
  platform: OrdersReturnsPlatformFilter
  page: number
  pageSize: number
}) {
  const serviceParams: GetOrdersReturnsParams = {
    search: params.search,
    platform: params.platform,
    page: params.page,
    pageSize: params.pageSize,
  }

  const query = useQuery({
    queryKey: ['orders', 'returns', params.search, params.platform, params.page, params.pageSize] as const,
    queryFn: (): Promise<OrdersReturnsResponse> => ordersReturnsService.getReturns(serviceParams),
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
