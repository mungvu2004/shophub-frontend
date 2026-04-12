import { useQuery } from '@tanstack/react-query'

import type { GetOrderDetailParams, OrderDetailResponse } from '@/features/orders/logic/orderDetail.types'
import { orderDetailService } from '@/features/orders/services/orderDetailService'

export function useOrderDetailData(params: GetOrderDetailParams) {
  const query = useQuery({
    queryKey: ['orders', 'detail', params.id, params.fallbackState?.orderCode] as const,
    queryFn: (): Promise<OrderDetailResponse> => orderDetailService.getOrderDetail(params),
    staleTime: 60 * 1000,
    enabled: params.id.trim().length > 0,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  }
}
