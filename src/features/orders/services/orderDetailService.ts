import { apiClient } from '@/services/apiClient'
import type { Order } from '@/types/order.types'

import { buildOrderDetailResponse } from '@/features/orders/logic/orderDetail.logic'
import type { GetOrderDetailParams, OrderDetailResponse } from '@/features/orders/logic/orderDetail.types'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
  error?: { message: string; code?: string }
}

class OrderDetailService {
  private normalizeOrderId(id: string) {
    return id.startsWith('pending-') ? id.replace('pending-', '') : id
  }

  async getOrderDetail(params: GetOrderDetailParams): Promise<OrderDetailResponse> {
    const normalizedId = this.normalizeOrderId(params.id)
    const candidates = normalizedId === params.id
      ? [params.id]
      : [normalizedId, params.id]

    for (const candidateId of candidates) {
      try {
        const response = await apiClient.get<ApiResponse<Order>>(`/orders/${candidateId}`)

        return buildOrderDetailResponse({
          id: candidateId,
          order: response.data.data,
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

  async confirmOrder(id: string) {
    const normalizedId = this.normalizeOrderId(id)
    const response = await apiClient.post<ApiResponse<{ updated: boolean; status: string }>>(`/orders/${normalizedId}/confirm`)
    return response.data.data
  }

  async shipOrder(id: string) {
    const normalizedId = this.normalizeOrderId(id)
    const response = await apiClient.post<ApiResponse<{ updated: boolean; status: string }>>(`/orders/${normalizedId}/ship`)
    return response.data.data
  }

  async cancelOrder(id: string) {
    const normalizedId = this.normalizeOrderId(id)
    const response = await apiClient.post<ApiResponse<{ updated: boolean; status: string }>>(`/orders/${normalizedId}/cancel`)
    return response.data.data
  }

  async refundOrder(id: string) {
    const normalizedId = this.normalizeOrderId(id)
    const response = await apiClient.post<ApiResponse<{ updated: boolean; status: string }>>(`/orders/${normalizedId}/refund`)
    return response.data.data
  }
}

export const orderDetailService = new OrderDetailService()
