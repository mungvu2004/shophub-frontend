import { apiClient } from '@/services/apiClient'

import type {
  OrdersPendingActionItem,
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsResponse,
  OrdersPendingActionsSlaFilter,
  OrdersPendingActionsSummary,
} from '@/features/orders/logic/ordersPendingActions.types'
import type { PlatformCode } from '@/types/platform.types'

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
      amount: number
      status: string
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
        && typeof item.status === 'string'
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
      amount: item.amount,
      status: item.status,
      waitingMinutes: item.waitingMinutes,
      slaLevel: item.slaLevel,
      recommendedAction: item.recommendedAction,
      updatedAt: item.updatedAt,
    }))
}

class OrdersPendingActionsService {
  async getPendingActions(params: GetOrdersPendingActionsParams): Promise<OrdersPendingActionsResponse> {
    const response = await apiClient.get<OrdersPendingActionsApiResponse>('/orders/pending-actions', {
      params: {
        search: params.search,
        platform: params.platform && params.platform !== 'all' ? params.platform : undefined,
        sla: params.sla && params.sla !== 'all' ? params.sla : undefined,
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

export const ordersPendingActionsService = new OrdersPendingActionsService()
