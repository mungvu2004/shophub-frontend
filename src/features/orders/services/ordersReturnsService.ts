import { apiClient } from '@/services/apiClient'

import type {
  OrdersReturnsItem,
  OrdersReturnsPlatformFilter,
  OrdersReturnsResponse,
  OrdersReturnsStatus,
  OrdersReturnsSummary,
} from '@/features/orders/logic/ordersReturns.types'
import type { PlatformCode } from '@/types/platform.types'

type OrdersReturnsApiResponse = {
  items?: unknown
  totalCount?: unknown
  hasMore?: unknown
  nextCursor?: unknown
  summary?: unknown
}

type GetOrdersReturnsParams = {
  search?: string
  platform?: OrdersReturnsPlatformFilter
  page?: number
  pageSize?: number
}

export type { GetOrdersReturnsParams }

const defaultSummary: OrdersReturnsSummary = {
  totalReturns: 0,
  totalCancellations: 0,
  impactedRevenue: 0,
  returnsDeltaPercent: 0,
  cancellationsDeltaPercent: 0,
  platformBreakdown: {
    shopee: 0,
    lazada: 0,
    tiktok_shop: 0,
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

function toSummary(value: unknown): OrdersReturnsSummary {
  if (!value || typeof value !== 'object') return { ...defaultSummary }

  const entry = value as Record<string, unknown>

  return {
    totalReturns: typeof entry.totalReturns === 'number' && Number.isFinite(entry.totalReturns) ? entry.totalReturns : 0,
    totalCancellations:
      typeof entry.totalCancellations === 'number' && Number.isFinite(entry.totalCancellations) ? entry.totalCancellations : 0,
    impactedRevenue: typeof entry.impactedRevenue === 'number' && Number.isFinite(entry.impactedRevenue) ? entry.impactedRevenue : 0,
    returnsDeltaPercent:
      typeof entry.returnsDeltaPercent === 'number' && Number.isFinite(entry.returnsDeltaPercent)
        ? entry.returnsDeltaPercent
        : 0,
    cancellationsDeltaPercent:
      typeof entry.cancellationsDeltaPercent === 'number' && Number.isFinite(entry.cancellationsDeltaPercent)
        ? entry.cancellationsDeltaPercent
        : 0,
    platformBreakdown: toPlatformBreakdown(entry.platformBreakdown),
  }
}

function isStatus(value: unknown): value is OrdersReturnsStatus {
  return value === 'processing' || value === 'cancelled' || value === 'awaiting_pickup' || value === 'refunded'
}

function isKind(value: unknown): value is 'return' | 'cancel' {
  return value === 'return' || value === 'cancel'
}

function isPlatform(value: unknown): value is PlatformCode {
  return value === 'shopee' || value === 'lazada' || value === 'tiktok_shop'
}

function toItems(value: unknown): OrdersReturnsItem[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .filter((item): item is Record<string, unknown> & {
      id: string
      orderCode: string
      orderKind: 'return' | 'cancel'
      platform: PlatformCode
      productName: string
      customerName: string
      amount: number
      status: OrdersReturnsStatus
      happenedAt: string
    } => {
      return (
        typeof item.id === 'string'
        && typeof item.orderCode === 'string'
        && isKind(item.orderKind)
        && isPlatform(item.platform)
        && typeof item.productName === 'string'
        && typeof item.customerName === 'string'
        && typeof item.amount === 'number'
        && Number.isFinite(item.amount)
        && isStatus(item.status)
        && typeof item.happenedAt === 'string'
      )
    })
    .map((item) => ({
      id: item.id,
      orderCode: item.orderCode,
      orderKind: item.orderKind,
      platform: item.platform,
      productName: item.productName,
      customerName: item.customerName,
      amount: item.amount,
      status: item.status,
      happenedAt: item.happenedAt,
    }))
}

class OrdersReturnsService {
  async getReturns(params: GetOrdersReturnsParams): Promise<OrdersReturnsResponse> {
    const response = await apiClient.get<OrdersReturnsApiResponse>('/orders/returns', {
      params: {
        search: params.search,
        platform: params.platform && params.platform !== 'all' ? params.platform : undefined,
        page: params.page,
        pageSize: params.pageSize,
      },
    })

    return {
      items: toItems(response.data?.items),
      totalCount: typeof response.data?.totalCount === 'number' && Number.isFinite(response.data.totalCount)
        ? response.data.totalCount
        : 0,
      hasMore: response.data?.hasMore === true,
      nextCursor: typeof response.data?.nextCursor === 'string' ? response.data.nextCursor : undefined,
      summary: toSummary(response.data?.summary),
    }
  }
}

export const ordersReturnsService = new OrdersReturnsService()
