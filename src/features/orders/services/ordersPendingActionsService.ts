import { apiClient } from '@/services/apiClient'

import type {
  OrdersPendingActionItem,
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsResponse,
  OrdersPendingActionsSlaFilter,
  OrdersPendingActionsSummary,
} from '@/features/orders/logic/ordersPendingActions.types'
import type { PlatformCode } from '@/types/platform.types'
import type { Order, OrderStatus } from '@/types/order.types'

type OrdersPendingActionsApiResponse = {
  items?: unknown
  totalCount?: unknown
  hasMore?: unknown
  nextCursor?: unknown
  summary?: unknown
}

type GetOrdersPendingActionsParams = {
  search?: string
  platform?: OrdersPendingActionsPlatformFilter
  sla?: OrdersPendingActionsSlaFilter
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export type { GetOrdersPendingActionsParams }

const defaultSummary: OrdersPendingActionsSummary = {
  totalPending: 0,
  criticalCount: 0,
  warningCount: 0,
  avgWaitingMinutes: 0,
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

function toSummary(value: unknown): OrdersPendingActionsSummary {
  if (!value || typeof value !== 'object') return { ...defaultSummary }

  const entry = value as Record<string, unknown>

  return {
    totalPending: typeof entry.totalPending === 'number' && Number.isFinite(entry.totalPending) ? entry.totalPending : 0,
    criticalCount: typeof entry.criticalCount === 'number' && Number.isFinite(entry.criticalCount) ? entry.criticalCount : 0,
    warningCount: typeof entry.warningCount === 'number' && Number.isFinite(entry.warningCount) ? entry.warningCount : 0,
    avgWaitingMinutes:
      typeof entry.avgWaitingMinutes === 'number' && Number.isFinite(entry.avgWaitingMinutes) ? entry.avgWaitingMinutes : 0,
    platformBreakdown: toPlatformBreakdown(entry.platformBreakdown),
  }
}

function isPlatform(value: unknown): value is PlatformCode {
  return value === 'shopee' || value === 'lazada' || value === 'tiktok_shop'
}

function isSla(value: unknown): value is OrdersPendingActionItem['slaLevel'] {
  return value === 'critical' || value === 'warning' || value === 'safe'
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return value === 'Pending'
    || value === 'PendingPayment'
    || value === 'Confirmed'
    || value === 'Packed'
    || value === 'ReadyToShip'
    || value === 'Shipped'
    || value === 'Delivered'
    || value === 'FailedDelivery'
    || value === 'Cancelled'
    || value === 'Returned'
    || value === 'Refunded'
    || value === 'Lost'
}

function toItems(value: unknown): OrdersPendingActionItem[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .filter((item): item is Record<string, unknown> & {
      id: string
      orderCode: string
      platform: PlatformCode
      customerName: string
      productName: string
      sku?: string
      variantLabel?: string
      quantity?: number
      thumbnailUrl?: string
      customerNote?: string
      amount: number
      status: OrderStatus
      printStatus: OrdersPendingActionItem['printStatus']
      waitingMinutes: number
      slaLevel: OrdersPendingActionItem['slaLevel']
      recommendedAction: string
      updatedAt: string
    } => {
      return (
        typeof item.id === 'string'
        && typeof item.orderCode === 'string'
        && isPlatform(item.platform)
        && typeof item.customerName === 'string'
        && typeof item.productName === 'string'
        && typeof item.amount === 'number'
        && Number.isFinite(item.amount)
        && isOrderStatus(item.status)
        && (item.printStatus === 'printed' || item.printStatus === 'not_printed')
        && typeof item.waitingMinutes === 'number'
        && Number.isFinite(item.waitingMinutes)
        && isSla(item.slaLevel)
        && typeof item.recommendedAction === 'string'
        && typeof item.updatedAt === 'string'
      )
    })
    .map((item) => ({
      id: item.id,
      orderCode: item.orderCode,
      platform: item.platform,
      customerName: item.customerName,
      productName: item.productName,
      sku: typeof item.sku === 'string' ? item.sku : 'SKU-NA',
      variantLabel: typeof item.variantLabel === 'string' ? item.variantLabel : 'Mặc định',
      quantity: typeof item.quantity === 'number' && Number.isFinite(item.quantity) ? item.quantity : 1,
      thumbnailUrl: typeof item.thumbnailUrl === 'string' && item.thumbnailUrl.length > 0 ? item.thumbnailUrl : 'https://picsum.photos/seed/default/64/64',
      customerNote: typeof item.customerNote === 'string' ? item.customerNote : '',
      amount: item.amount,
      status: item.status,
      printStatus: item.printStatus,
      waitingMinutes: item.waitingMinutes,
      slaLevel: item.slaLevel,
      recommendedAction: item.recommendedAction,
      updatedAt: item.updatedAt,
    }))
}

class OrdersPendingActionsService {
  private normalizeOrderId(id: string) {
    return id.startsWith('pending-') ? id.replace('pending-', '') : id
  }

  async getPendingActions(params: GetOrdersPendingActionsParams): Promise<OrdersPendingActionsResponse> {
    const response = await apiClient.get<OrdersPendingActionsApiResponse>('/orders/pending-actions', {
      params: {
        search: params.search,
        platform: params.platform && params.platform !== 'all' ? params.platform : undefined,
        sla: params.sla && params.sla !== 'all' ? params.sla : undefined,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
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

  async bulkApprove(orderIds: string[]): Promise<void> {
    await apiClient.post('/orders/pending-actions/bulk-approve', { orderIds })
  }

  async bulkPrint(orderIds: string[]): Promise<void> {
    await apiClient.post('/orders/pending-actions/bulk-print', { orderIds })
  }

  async bulkCancel(orderIds: string[]): Promise<void> {
    await apiClient.post('/orders/pending-actions/bulk-cancel', { orderIds })
  }

  async createPendingAction(data: Partial<Order>): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', data)
    return response.data
  }

  async updatePendingAction(id: string, data: Partial<Order>): Promise<Order> {
    const normalizedId = this.normalizeOrderId(id)
    const response = await apiClient.put<Order>(`/orders/${normalizedId}`, data)
    return response.data
  }

  async deletePendingAction(id: string): Promise<void> {
    const normalizedId = this.normalizeOrderId(id)
    await apiClient.delete(`/orders/${normalizedId}`)
  }

  async updatePendingActionStatus(id: string, status: OrderStatus): Promise<void> {
    const normalizedId = this.normalizeOrderId(id)
    await apiClient.patch(`/orders/${normalizedId}/status`, { status })
  }
}

export const ordersPendingActionsService = new OrdersPendingActionsService()
