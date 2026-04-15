import { mockOrders } from '@/mocks/data/orders'
import type {
  OrdersPendingActionItem,
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsResponse,
  OrdersPendingActionsSlaFilter,
} from '@/features/orders/logic/ordersPendingActions.types'

type BuildOrdersPendingActionsParams = {
  search?: string
  platform?: OrdersPendingActionsPlatformFilter
  sla?: OrdersPendingActionsSlaFilter
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

const pendingStatuses = new Set(['Pending', 'PendingPayment', 'Confirmed', 'Packed', 'ReadyToShip', 'Shipped'])

function computeWaitingMinutes(index: number): number {
  const pattern = [35, 68, 96, 130, 165, 48, 82, 118]
  return pattern[index % pattern.length]
}

function toSlaLevel(waitingMinutes: number): OrdersPendingActionItem['slaLevel'] {
  if (waitingMinutes > 120) return 'critical'
  if (waitingMinutes >= 60) return 'warning'
  return 'safe'
}

function toRecommendedAction(level: OrdersPendingActionItem['slaLevel']): string {
  if (level === 'critical') return 'Ưu tiên xác nhận và đẩy kho ngay'
  if (level === 'warning') return 'Nhắc ca vận hành xử lý trong 30 phút'
  return 'Theo dõi và gom lô xử lý'
}

function toDateMs(value?: string) {
  if (!value) return undefined
  const ms = new Date(value).getTime()
  return Number.isFinite(ms) ? ms : undefined
}

function toPendingItems(): OrdersPendingActionItem[] {
  return mockOrders
    .filter((order) => pendingStatuses.has(order.status))
    .map((order, index) => {
      const waitingMinutes = computeWaitingMinutes(index)
      const slaLevel = toSlaLevel(waitingMinutes)
      const customerName = `${order.buyerFirstName ?? ''} ${order.buyerLastName ?? ''}`.trim() || 'Khách ẩn danh'
      const firstItem = order.items?.[0]

      return {
        id: `pending-${order.id}`,
        orderCode: order.externalOrderNumber ?? order.externalOrderId,
        platform: order.platform,
        customerName,
        productName: firstItem?.productName ?? 'Sản phẩm chưa đồng bộ',
        sku: firstItem?.externalSkuRef ?? 'SKU-NA',
        variantLabel: firstItem?.variantAttributes ?? 'Mặc định',
        quantity: firstItem?.qty ?? 1,
        thumbnailUrl: `https://picsum.photos/seed/${order.id}/64/64`,
        customerNote: order.giftMessage || (index % 3 === 0 ? 'Giao trong giờ hành chính' : ''),
        amount: order.totalAmount,
        status: order.status,
        printStatus: order.status === 'Shipped' || order.status === 'Packed' ? 'printed' : 'not_printed',
        waitingMinutes,
        slaLevel,
        recommendedAction: toRecommendedAction(slaLevel),
        updatedAt: order.updatedAt,
      }
    })
}

function filterBySla(items: OrdersPendingActionItem[], sla: OrdersPendingActionsSlaFilter): OrdersPendingActionItem[] {
  if (sla === 'all') return items
  return items.filter((item) => item.slaLevel === sla)
}

export function buildOrdersPendingActionsResponse(params: BuildOrdersPendingActionsParams): OrdersPendingActionsResponse {
  const search = (params.search ?? '').trim().toLowerCase()
  const platform = params.platform ?? 'all'
  const sla = params.sla ?? 'all'
  const dateFrom = toDateMs(params.dateFrom)
  const dateTo = toDateMs(params.dateTo)
  const page = params.page && params.page > 0 ? params.page : 1
  const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 10

  const allPending = toPendingItems()

  const filteredBySearch = allPending.filter((item) => {
    const target = `${item.orderCode} ${item.customerName} ${item.productName}`.toLowerCase()
    return !search || target.includes(search)
  })

  const filteredByPlatform = filteredBySearch.filter((item) => platform === 'all' || item.platform === platform)
  const filteredByDate = filteredByPlatform.filter((item) => {
    const updatedMs = new Date(item.updatedAt).getTime()
    const matchFrom = typeof dateFrom !== 'number' || updatedMs >= dateFrom
    const matchTo = typeof dateTo !== 'number' || updatedMs <= dateTo
    return matchFrom && matchTo
  })
  const filtered = filterBySla(filteredByDate, sla)

  const sortedItems = [...filtered].sort((a, b) => b.waitingMinutes - a.waitingMinutes)

  const offset = (page - 1) * pageSize
  const paginatedItems = sortedItems.slice(offset, offset + pageSize)
  const hasMore = offset + pageSize < sortedItems.length

  const waitingTotal = filteredByDate.reduce((sum, item) => sum + item.waitingMinutes, 0)

  return {
    items: paginatedItems,
    totalCount: sortedItems.length,
    hasMore,
    nextCursor: hasMore ? String(page + 1) : undefined,
    summary: {
      totalPending: filteredByDate.length,
      criticalCount: filteredByDate.filter((item) => item.slaLevel === 'critical').length,
      warningCount: filteredByDate.filter((item) => item.slaLevel === 'warning').length,
      avgWaitingMinutes: filteredByDate.length > 0 ? waitingTotal / filteredByDate.length : 0,
      platformBreakdown: {
        shopee: filteredByDate.filter((item) => item.platform === 'shopee').length,
        lazada: filteredByDate.filter((item) => item.platform === 'lazada').length,
        tiktok_shop: filteredByDate.filter((item) => item.platform === 'tiktok_shop').length,
      },
    },
  }
}
