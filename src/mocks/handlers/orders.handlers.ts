import { http, HttpResponse } from 'msw'

import { mockRevenueOrders } from '@/mocks/data/dashboardRevenueOrders'
import { mockOrders } from '@/mocks/data/orders'
import { mockOrdersReturns } from '@/mocks/data/ordersReturns'
import { buildOrdersPendingActionsResponse } from '@/mocks/data/ordersPendingActions'

const pendingStatuses = new Set(['Pending', 'PendingPayment', 'Confirmed', 'Packed', 'ReadyToShip', 'Shipped'])

function parseNumber(value: string | null) {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseDateTime(value: string | null) {
  if (!value) return undefined
  const parsed = new Date(value).getTime()
  return Number.isFinite(parsed) ? parsed : undefined
}

export const ordersHandlers = [
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url)

    const revenueDateFrom = url.searchParams.get('dateFrom')
    const revenueDateTo = url.searchParams.get('dateTo')

    if (
      revenueDateFrom
      && revenueDateTo
      && !url.searchParams.has('page')
      && !url.searchParams.has('statusGroup')
      && !url.searchParams.has('minAmount')
      && !url.searchParams.has('maxAmount')
    ) {
      // Use local date parsing by providing a time string without 'Z'
      const fromDate = new Date(`${revenueDateFrom}T00:00:00`).getTime()
      const toDate = new Date(`${revenueDateTo}T23:59:59`).getTime()

      const filteredOrders = mockRevenueOrders.filter((order) => {
        if (!order.createdAt) return false
        const orderTime = new Date(order.createdAt).getTime()
        return orderTime >= fromDate && orderTime <= toDate
      })

      return HttpResponse.json(
        {
          items: filteredOrders,
          data: filteredOrders,
          totalCount: filteredOrders.length,
        },
        { status: 200 },
      )
    }

    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const statusGroup = (url.searchParams.get('statusGroup') ?? 'all').trim()
    const platform = (url.searchParams.get('platform') ?? '').trim()
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? url.searchParams.get('limit') ?? 10)
    const dateFrom = parseDateTime(url.searchParams.get('dateFrom'))
    const dateTo = parseDateTime(url.searchParams.get('dateTo'))
    const minAmount = parseNumber(url.searchParams.get('minAmount'))
    const maxAmount = parseNumber(url.searchParams.get('maxAmount'))

    const normalizedPage = Number.isNaN(page) || page < 1 ? 1 : page
    const normalizedPageSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize

    const baseFiltered = mockOrders.filter((order) => {
      const fullName = `${order.buyerFirstName ?? ''} ${order.buyerLastName ?? ''}`.toLowerCase()
      const matchSearch =
        !search
        || order.id.toLowerCase().includes(search)
        || order.externalOrderId.toLowerCase().includes(search)
        || (order.externalOrderNumber ?? '').toLowerCase().includes(search)
        || fullName.includes(search)
      const matchPlatform = !platform || order.platform === platform
      const orderTime = new Date(order.createdAt || order.createdAt_platform).getTime()
      const matchDateFrom = typeof dateFrom !== 'number' || orderTime >= dateFrom
      const matchDateTo = typeof dateTo !== 'number' || orderTime <= dateTo
      const matchMinAmount = typeof minAmount !== 'number' || order.totalAmount >= minAmount
      const matchMaxAmount = typeof maxAmount !== 'number' || order.totalAmount <= maxAmount

      return matchSearch && matchPlatform && matchDateFrom && matchDateTo && matchMinAmount && matchMaxAmount
    })

    const filtered = baseFiltered.filter((order) => {
      if (statusGroup === 'all') return true
      if (statusGroup === 'pending_group') return pendingStatuses.has(order.status)
      if (statusGroup === 'shipping_group') return order.status === 'Shipped'
      if (statusGroup === 'delivered') return order.status === 'Delivered'
      if (statusGroup === 'return_group') {
        return order.status === 'Returned'
          || order.status === 'Refunded'
          || order.status === 'Cancelled'
          || order.status === 'FailedDelivery'
          || order.status === 'Lost'
      }

      return true
    })

    const offset = (normalizedPage - 1) * normalizedPageSize
    const paginatedItems = filtered.slice(offset, offset + normalizedPageSize)
    const hasMore = offset + normalizedPageSize < filtered.length

    const summary = {
      totalOrders: baseFiltered.length,
      pendingOrders: baseFiltered.filter((order) => pendingStatuses.has(order.status)).length,
      deliveredOrders: baseFiltered.filter((order) => order.status === 'Delivered').length,
      totalRevenue: baseFiltered.reduce((sum, order) => sum + order.totalAmount, 0),
      platformBreakdown: {
        shopee: baseFiltered.filter((order) => order.platform === 'shopee').length,
        lazada: baseFiltered.filter((order) => order.platform === 'lazada').length,
        tiktok_shop: baseFiltered.filter((order) => order.platform === 'tiktok_shop').length,
      },
      statusBreakdown: {
        pendingGroup: baseFiltered.filter((order) => pendingStatuses.has(order.status)).length,
        shipping: baseFiltered.filter((order) => order.status === 'Shipped').length,
        delivered: baseFiltered.filter((order) => order.status === 'Delivered').length,
        returnGroup: baseFiltered.filter((order) => order.status === 'Returned'
          || order.status === 'Refunded'
          || order.status === 'Cancelled'
          || order.status === 'FailedDelivery'
          || order.status === 'Lost').length,
      },
    }

    return HttpResponse.json(
      {
        items: paginatedItems,
        hasMore,
        nextCursor: hasMore ? String(normalizedPage + 1) : undefined,
        totalCount: filtered.length,
        summary,
      },
      { status: 200 },
    )
  }),

  http.post('/api/orders/bulk-confirm', async ({ request }) => {
    const body = (await request.json().catch(() => null)) as { orderIds?: unknown } | null
    const orderIds = Array.isArray(body?.orderIds)
      ? body.orderIds.filter((item): item is string => typeof item === 'string')
      : []

    let updatedCount = 0

    for (const order of mockOrders) {
      if (!orderIds.includes(order.id)) continue

      if (pendingStatuses.has(order.status)) {
        order.status = 'Confirmed'
        order.updatedAt = new Date().toISOString()
        order.updatedAt_platform = order.updatedAt

        for (const item of order.items ?? []) {
          item.status = 'Confirmed'
        }

        updatedCount += 1
      }
    }

    return HttpResponse.json({ updatedCount }, { status: 200 })
  }),

  http.post('/api/orders/:id/confirm', ({ params }) => {
    const order = mockOrders.find((item) => item.id === params.id)

    if (!order) {
      return HttpResponse.json({ status: 404, title: 'Not Found', detail: 'Order not found' }, { status: 404 })
    }

    if (pendingStatuses.has(order.status)) {
      order.status = 'Confirmed'
      order.updatedAt = new Date().toISOString()
      order.updatedAt_platform = order.updatedAt
      for (const item of order.items ?? []) {
        item.status = 'Confirmed'
      }
    }

    return HttpResponse.json({ updated: true, status: order.status }, { status: 200 })
  }),

  http.post('/api/orders/:id/cancel', ({ params }) => {
    const order = mockOrders.find((item) => item.id === params.id)

    if (!order) {
      return HttpResponse.json({ status: 404, title: 'Not Found', detail: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'Delivered' && order.status !== 'Refunded') {
      order.status = 'Cancelled'
      order.updatedAt = new Date().toISOString()
      order.updatedAt_platform = order.updatedAt
      for (const item of order.items ?? []) {
        item.status = 'Cancelled'
      }
    }

    return HttpResponse.json({ updated: true, status: order.status }, { status: 200 })
  }),

  http.post('/api/orders/:id/refund', ({ params }) => {
    const order = mockOrders.find((item) => item.id === params.id)

    if (!order) {
      return HttpResponse.json({ status: 404, title: 'Not Found', detail: 'Order not found' }, { status: 404 })
    }

    order.status = 'Refunded'
    order.updatedAt = new Date().toISOString()
    order.updatedAt_platform = order.updatedAt
    for (const item of order.items ?? []) {
      item.status = 'Refunded'
    }

    return HttpResponse.json({ updated: true, status: order.status }, { status: 200 })
  }),

  http.get('/api/orders/returns', ({ request }) => {
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const platform = (url.searchParams.get('platform') ?? '').trim()
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? url.searchParams.get('limit') ?? 10)

    const normalizedPage = Number.isNaN(page) || page < 1 ? 1 : page
    const normalizedPageSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize

    const baseFiltered = mockOrdersReturns.filter((item) => {
      const target = `${item.orderCode} ${item.productName} ${item.customerName}`.toLowerCase()
      const matchSearch = !search || target.includes(search)
      const matchPlatform = !platform || item.platform === platform
      return matchSearch && matchPlatform
    })

    const sortedItems = [...baseFiltered].sort((a, b) => new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime())
    const offset = (normalizedPage - 1) * normalizedPageSize
    const paginatedItems = sortedItems.slice(offset, offset + normalizedPageSize)
    const hasMore = offset + normalizedPageSize < sortedItems.length

    const summary = {
      totalReturns: baseFiltered.filter((item) => item.orderKind === 'return').length,
      totalCancellations: baseFiltered.filter((item) => item.orderKind === 'cancel').length,
      impactedRevenue: baseFiltered.reduce((sum, item) => sum + item.amount, 0),
      returnsDeltaPercent: 12,
      cancellationsDeltaPercent: -5,
      platformBreakdown: {
        shopee: baseFiltered.filter((item) => item.platform === 'shopee').length,
        lazada: baseFiltered.filter((item) => item.platform === 'lazada').length,
        tiktok_shop: baseFiltered.filter((item) => item.platform === 'tiktok_shop').length,
      },
    }

    return HttpResponse.json(
      {
        items: paginatedItems,
        hasMore,
        nextCursor: hasMore ? String(normalizedPage + 1) : undefined,
        totalCount: sortedItems.length,
        summary,
      },
      { status: 200 },
    )
  }),

  http.get('/api/orders/pending-actions', ({ request }) => {
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim()
    const platform = (url.searchParams.get('platform') ?? 'all').trim()
    const sla = (url.searchParams.get('sla') ?? 'all').trim()
    const dateFrom = (url.searchParams.get('dateFrom') ?? '').trim()
    const dateTo = (url.searchParams.get('dateTo') ?? '').trim()
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? url.searchParams.get('limit') ?? 10)

    const normalizedPage = Number.isNaN(page) || page < 1 ? 1 : page
    const normalizedPageSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize

    const payload = buildOrdersPendingActionsResponse({
      search,
      platform: platform === 'all' || platform === 'shopee' || platform === 'lazada' || platform === 'tiktok_shop'
        ? platform
        : 'all',
      sla: sla === 'all' || sla === 'critical' || sla === 'warning' || sla === 'safe' ? sla : 'all',
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page: normalizedPage,
      pageSize: normalizedPageSize,
    })

    return HttpResponse.json(payload, { status: 200 })
  }),

  http.get('/api/orders/:id', ({ params }) => {
    const found = mockOrders.find((order) => order.id === params.id)

    if (!found) {
      return HttpResponse.json({ status: 404, title: 'Not Found', detail: 'Order not found' }, { status: 404 })
    }

    return HttpResponse.json(found, { status: 200 })
  }),
]
