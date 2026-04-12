import { apiClient } from '@/services/apiClient'
import type { Order } from '@/types/order.types'

import { buildOrderDetailResponse } from '@/features/orders/logic/orderDetail.logic'
import type { GetOrderDetailParams, OrderDetailResponse } from '@/features/orders/logic/orderDetail.types'

class OrderDetailService {
  async getOrderDetail(params: GetOrderDetailParams): Promise<OrderDetailResponse> {
    const candidates = params.id.startsWith('pending-')
      ? [params.id, params.id.replace('pending-', '')]
      : [params.id]

    for (const candidateId of candidates) {
      try {
        const response = await apiClient.get<Order>(`/orders/${candidateId}`)

        return buildOrderDetailResponse({
          id: candidateId,
          order: response.data,
          fallbackState: params.fallbackState,
        })
      } catch {
        // Try next candidate.
      }
    }

    return buildOrderDetailResponse({
      id: params.id,
      order: null,
      fallbackState: params.fallbackState,
    })
  }
}

export const orderDetailService = new OrderDetailService()
