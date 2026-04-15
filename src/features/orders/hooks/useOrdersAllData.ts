import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { OrderPlatformFilter, OrderStatusFilter, OrdersAllResponse } from '@/features/orders/logic/ordersAll.types'
import { ordersAllService, type GetOrdersAllParams } from '@/features/orders/services/ordersAllService'

function toOptionalNumber(value: string) {
  if (value.trim().length === 0) return undefined

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function useOrdersAllData(params: {
  search: string
  status: OrderStatusFilter
  platform: OrderPlatformFilter
  page: number
  pageSize: number
  dateFrom: string
  dateTo: string
  minAmount: string
  maxAmount: string
}) {
  const serviceParams: GetOrdersAllParams = {
    search: params.search,
    status: params.status,
    platform: params.platform,
    page: params.page,
    pageSize: params.pageSize,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
    minAmount: toOptionalNumber(params.minAmount),
    maxAmount: toOptionalNumber(params.maxAmount),
  }

  const query = useQuery({
    queryKey: [
      'orders',
      'all',
      params.search,
      params.status,
      params.platform,
      params.page,
      params.pageSize,
      params.dateFrom,
      params.dateTo,
      params.minAmount,
      params.maxAmount,
    ] as const,
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
