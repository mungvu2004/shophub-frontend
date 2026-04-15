import { apiClient } from '@/services/apiClient'

import type {
  OrderPlatformFilter,
  OrderStatusFilter,
  OrdersAllResponse,
  OrdersSummary,
} from '@/features/orders/logic/ordersAll.types'
import type { Order } from '@/types/order.types'
import type { PlatformCode } from '@/types/platform.types'

type OrdersAllApiResponse = {
  items?: unknown
  totalCount?: unknown
  hasMore?: unknown
  nextCursor?: unknown
  summary?: unknown
}

type GetOrdersAllParams = {
  search?: string
  status?: OrderStatusFilter
  platform?: OrderPlatformFilter
  page?: number
  pageSize?: number
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
}

export type { GetOrdersAllParams }

const defaultSummary: OrdersSummary = {
  totalOrders: 0,
  pendingOrders: 0,
  deliveredOrders: 0,
  totalRevenue: 0,
  platformBreakdown: {
    shopee: 0,
    lazada: 0,
    tiktok_shop: 0,
  },
  statusBreakdown: {
    pendingGroup: 0,
    shipping: 0,
    delivered: 0,
    returnGroup: 0,
  },
}

function toPlatformBreakdown(value: unknown): Record<PlatformCode, number> {
  if (!value || typeof value !== 'object') return { ...defaultSummary.platformBreakdown }

  const entry = value as Record<string, unknown>

  return {
    shopee: typeof entry.shopee === 'number' && Number.isFinite(entry.shopee) ? entry.shopee : 0,
    lazada: typeof entry.lazada === 'number' && Number.isFinite(entry.lazada) ? entry.lazada : 0,
    tiktok_shop: typeof entry.tiktok_shop === 'number' && Number.isFinite(entry.tiktok_shop) ? entry.tiktok_shop : 0,
  }
}

function toSummary(value: unknown): OrdersSummary {
  if (!value || typeof value !== 'object') return defaultSummary

  const entry = value as Record<string, unknown>

  return {
    totalOrders: typeof entry.totalOrders === 'number' && Number.isFinite(entry.totalOrders) ? entry.totalOrders : 0,
    pendingOrders: typeof entry.pendingOrders === 'number' && Number.isFinite(entry.pendingOrders) ? entry.pendingOrders : 0,
    deliveredOrders: typeof entry.deliveredOrders === 'number' && Number.isFinite(entry.deliveredOrders) ? entry.deliveredOrders : 0,
    totalRevenue: typeof entry.totalRevenue === 'number' && Number.isFinite(entry.totalRevenue) ? entry.totalRevenue : 0,
    platformBreakdown: toPlatformBreakdown(entry.platformBreakdown),
    statusBreakdown:
      entry.statusBreakdown && typeof entry.statusBreakdown === 'object'
        ? {
            pendingGroup:
              typeof (entry.statusBreakdown as Record<string, unknown>).pendingGroup === 'number'
              && Number.isFinite((entry.statusBreakdown as Record<string, unknown>).pendingGroup)
                ? ((entry.statusBreakdown as Record<string, unknown>).pendingGroup as number)
                : 0,
            shipping:
              typeof (entry.statusBreakdown as Record<string, unknown>).shipping === 'number'
              && Number.isFinite((entry.statusBreakdown as Record<string, unknown>).shipping)
                ? ((entry.statusBreakdown as Record<string, unknown>).shipping as number)
                : 0,
            delivered:
              typeof (entry.statusBreakdown as Record<string, unknown>).delivered === 'number'
              && Number.isFinite((entry.statusBreakdown as Record<string, unknown>).delivered)
                ? ((entry.statusBreakdown as Record<string, unknown>).delivered as number)
                : 0,
            returnGroup:
              typeof (entry.statusBreakdown as Record<string, unknown>).returnGroup === 'number'
              && Number.isFinite((entry.statusBreakdown as Record<string, unknown>).returnGroup)
                ? ((entry.statusBreakdown as Record<string, unknown>).returnGroup as number)
                : 0,
          }
        : { ...defaultSummary.statusBreakdown },
  }
}

function toOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) return []

  return value.filter((item): item is Order => Boolean(item && typeof item === 'object'))
}

class OrdersAllService {
  async getOrders(params: GetOrdersAllParams): Promise<OrdersAllResponse> {
    const response = await apiClient.get<OrdersAllApiResponse>('/orders', {
      params: {
        search: params.search,
        statusGroup: params.status && params.status !== 'all' ? params.status : undefined,
        platform: params.platform && params.platform !== 'all' ? params.platform : undefined,
        page: params.page,
        pageSize: params.pageSize,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        minAmount: params.minAmount,
        maxAmount: params.maxAmount,
      },
    })

    return {
      items: toOrders(response.data?.items),
      totalCount: typeof response.data?.totalCount === 'number' ? response.data.totalCount : 0,
      hasMore: response.data?.hasMore === true,
      nextCursor: typeof response.data?.nextCursor === 'string' ? response.data.nextCursor : undefined,
      summary: toSummary(response.data?.summary),
    }
  }

  async bulkConfirmOrders(orderIds: string[]): Promise<{ updatedCount: number }> {
    const response = await apiClient.post<{ updatedCount?: unknown }>('/orders/bulk-confirm', {
      orderIds,
    })

    return {
      updatedCount: typeof response.data?.updatedCount === 'number' && Number.isFinite(response.data.updatedCount)
        ? response.data.updatedCount
        : 0,
    }
  }
}

export const ordersAllService = new OrdersAllService()
