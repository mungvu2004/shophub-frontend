import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type {
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsResponse,
  OrdersPendingActionsSlaFilter,
} from '@/features/orders/logic/ordersPendingActions.types'
import {
  ordersPendingActionsService,
  type GetOrdersPendingActionsParams,
} from '@/features/orders/services/ordersPendingActionsService'

export function useOrdersPendingActionsData(params: {
  search: string
  platform: OrdersPendingActionsPlatformFilter
  sla: OrdersPendingActionsSlaFilter
  dateFrom: string
  dateTo: string
  page: number
  pageSize: number
}) {
  const serviceParams: GetOrdersPendingActionsParams = {
    search: params.search,
    platform: params.platform,
    sla: params.sla,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    page: params.page,
    pageSize: params.pageSize,
  }

  const query = useQuery({
    queryKey: [
      'orders',
      'pending-actions',
      params.search,
      params.platform,
      params.sla,
      params.dateFrom,
      params.dateTo,
      params.page,
      params.pageSize,
    ] as const,
    queryFn: (): Promise<OrdersPendingActionsResponse> => ordersPendingActionsService.getPendingActions(serviceParams),
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
