import { delay, http, HttpResponse } from 'msw'

import { buildOrdersPendingActionsResponse } from '@/mocks/data/ordersPendingActions'
import { mockOrders } from '@/mocks/data/orders'
import type { Order } from '@/types/order.types'

type PendingActionsPlatform = 'all' | 'shopee' | 'lazada' | 'tiktok_shop'
type PendingActionsSla = 'all' | 'critical' | 'warning' | 'safe'

function resolveOrderId(orderId: string) {
  return orderId.startsWith('pending-') ? orderId.replace('pending-', '') : orderId
}

function parsePendingOrderIds(payload: unknown): string[] {
  if (!Array.isArray(payload)) return []

  return payload
    .filter((orderId): orderId is string => typeof orderId === 'string')
    .map((orderId) => resolveOrderId(orderId))
}

function touchOrder(order: Order, nextStatus?: Order['status']) {
  const now = new Date().toISOString()
  order.updatedAt = now
  order.updatedAt_platform = now

  if (nextStatus) {
    order.status = nextStatus
    for (const item of order.items ?? []) {
      item.status = nextStatus
    }
  }
}

function parsePlatform(value: string): PendingActionsPlatform {
  return value === 'shopee' || value === 'lazada' || value === 'tiktok_shop' ? value : 'all'
}

function parseSla(value: string): PendingActionsSla {
  return value === 'critical' || value === 'warning' || value === 'safe' ? value : 'all'
}

export const ordersPendingActionsHandlers = [
  http.get('/api/orders/pending-actions', async ({ request }) => {
    await delay(600)
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim()
    const platform = parsePlatform((url.searchParams.get('platform') ?? 'all').trim())
    const sla = parseSla((url.searchParams.get('sla') ?? 'all').trim())
    const dateFrom = (url.searchParams.get('dateFrom') ?? '').trim()
    const dateTo = (url.searchParams.get('dateTo') ?? '').trim()
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? url.searchParams.get('limit') ?? 10)

    const normalizedPage = Number.isNaN(page) || page < 1 ? 1 : page
    const normalizedPageSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize

    const payload = buildOrdersPendingActionsResponse({
      search,
      platform,
      sla,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page: normalizedPage,
      pageSize: normalizedPageSize,
    })

    return HttpResponse.json(payload, { status: 200 })
  }),

  http.post('/api/orders/pending-actions/bulk-approve', async ({ request }) => {
    await delay(700)
    const body = (await request.json().catch(() => null)) as { orderIds?: unknown } | null
    const orderIds = parsePendingOrderIds(body?.orderIds)

    for (const order of mockOrders) {
      if (!orderIds.includes(order.id)) continue
      touchOrder(order, 'ReadyToShip')
    }

    return HttpResponse.json({ success: true }, { status: 200 })
  }),

  http.post('/api/orders/pending-actions/bulk-print', async ({ request }) => {
    await delay(700)
    const body = (await request.json().catch(() => null)) as { orderIds?: unknown } | null
    const orderIds = parsePendingOrderIds(body?.orderIds)

    for (const order of mockOrders) {
      if (!orderIds.includes(order.id)) continue
      touchOrder(order, 'Packed')
    }

    return HttpResponse.json({ success: true }, { status: 200 })
  }),

  http.post('/api/orders/pending-actions/bulk-cancel', async ({ request }) => {
    await delay(700)
    const body = (await request.json().catch(() => null)) as { orderIds?: unknown } | null
    const orderIds = parsePendingOrderIds(body?.orderIds)

    for (const order of mockOrders) {
      if (!orderIds.includes(order.id)) continue
      touchOrder(order, 'Cancelled')
    }

    return HttpResponse.json({ success: true }, { status: 200 })
  }),
]
