import { http, HttpResponse, delay } from 'msw'
import type { Order } from '@/types/order.types'
import { mockOrders } from '@/mocks/data/orders'
import { mockOrdersReturns } from '@/mocks/data/ordersReturns'
import { mockRevenueOrders } from '@/mocks/data/dashboardRevenueOrders'

const pendingStatuses = new Set(['Pending', 'PendingPayment', 'Confirmed', 'Packed', 'ReadyToShip', 'Shipped'])

function createSuccessResponse<T>(data: T, message = 'Thành công') {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
}

function createErrorResponse(message: string, code = 'ERROR') {
  return {
    success: false,
    error: { message, code },
    timestamp: new Date().toISOString(),
  }
}

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
  // GET /api/orders - List orders
  http.get('/api/orders', async ({ request }) => {
    await delay(600)
    const url = new URL(request.url)

    const revenueDateFrom = url.searchParams.get('dateFrom')
    const revenueDateTo = url.searchParams.get('dateTo')

    // Revenue report endpoint
    if (
      revenueDateFrom
      && revenueDateTo
      && !url.searchParams.has('page')
      && !url.searchParams.has('statusGroup')
      && !url.searchParams.has('minAmount')
      && !url.searchParams.has('maxAmount')
    ) {
      const fromDate = new Date(`${revenueDateFrom}T00:00:00`).getTime()
      const toDate = new Date(`${revenueDateTo}T23:59:59`).getTime()

      const filteredOrders = mockRevenueOrders.filter((order) => {
        if (!order.createdAt) return false
        const orderTime = new Date(order.createdAt).getTime()
        return orderTime >= fromDate && orderTime <= toDate
      })

      return HttpResponse.json(
        createSuccessResponse({
          items: filteredOrders,
          totalCount: filteredOrders.length,
        }),
        { status: 200 }
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

      if (!matchSearch) return false

      if (statusGroup && statusGroup !== 'all') {
        if (statusGroup === 'pending') return pendingStatuses.has(order.status)
        if (statusGroup === 'delivered') return order.status === 'Delivered'
        if (statusGroup === 'returned') return order.status === 'Returned' || order.status === 'Refunded'
        if (statusGroup === 'cancelled') return order.status === 'Cancelled'
      }

      if (platform && platform !== 'all' && order.platform !== platform) return false

      if (dateFrom && new Date(order.createdAt || order.createdAt_platform).getTime() < dateFrom) return false
      if (dateTo && new Date(order.createdAt || order.createdAt_platform).getTime() > dateTo) return false

      if (minAmount !== undefined && order.totalAmount < minAmount) return false
      if (maxAmount !== undefined && order.totalAmount > maxAmount) return false

      return true
    })

    const sorted = baseFiltered.sort((a, b) => new Date(b.createdAt || b.createdAt_platform).getTime() - new Date(a.createdAt || a.createdAt_platform).getTime())

    const offset = (normalizedPage - 1) * normalizedPageSize
    const paginatedItems = sorted.slice(offset, offset + normalizedPageSize)
    const hasMore = offset + normalizedPageSize < sorted.length

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
      createSuccessResponse({
        items: paginatedItems,
        hasMore,
        nextCursor: hasMore ? String(normalizedPage + 1) : undefined,
        totalCount: sorted.length,
        summary,
      }),
      { status: 200 }
    )
  }),

  // GET /api/orders/:id - Get order by ID
  http.get('/api/orders/:id', async ({ params }) => {
    await delay(500)
    const id = params.id as string
    const order = mockOrders.find((o) => o.id === id)

    if (order) {
      return HttpResponse.json(createSuccessResponse(order), { status: 200 })
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy đơn hàng', 'NOT_FOUND'), { status: 404 })
  }),

  // POST /api/orders - Create order
  http.post('/api/orders', async ({ request }) => {
    await delay(700)
    const body = (await request.json()) as Partial<Order>

    const newOrder: Order = {
      ...body,
      id: `ord-new-${Date.now()}`,
      status: body.status || 'Pending',
      platform: body.platform || 'shopee',
      totalAmount: body.totalAmount || 0,
      createdAt: new Date().toISOString(),
      createdAt_platform: new Date().toISOString(),
    } as Order

    mockOrders.unshift(newOrder)

    return HttpResponse.json(
      createSuccessResponse(newOrder, 'Tạo đơn hàng thành công'),
      { status: 201 }
    )
  }),

  // PUT /api/orders/:id - Update order
  http.put('/api/orders/:id', async ({ params, request }) => {
    await delay(700)
    const id = params.id as string
    const body = (await request.json()) as Partial<Order>

    const index = mockOrders.findIndex((o) => o.id === id)
    if (index !== -1) {
      mockOrders[index] = { ...mockOrders[index], ...body, updatedAt: new Date().toISOString() }
      return HttpResponse.json(
        createSuccessResponse(mockOrders[index], 'Cập nhật đơn hàng thành công'),
        { status: 200 }
      )
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy đơn hàng', 'NOT_FOUND'), { status: 404 })
  }),

  // PATCH /api/orders/:id/status - Update order status
  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    await delay(600)
    const id = params.id as string
    const body = (await request.json()) as { status: Order['status'] }

    const order = mockOrders.find((o) => o.id === id)
    if (order) {
      order.status = body.status
      order.updatedAt = new Date().toISOString()
      order.updatedAt_platform = order.updatedAt

      for (const item of order.items ?? []) {
        item.status = body.status
      }

      return HttpResponse.json(
        createSuccessResponse(order, 'Cập nhật trạng thái thành công'),
        { status: 200 }
      )
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy đơn hàng', 'NOT_FOUND'), { status: 404 })
  }),

  // DELETE /api/orders/:id - Delete order
  http.delete('/api/orders/:id', async ({ params }) => {
    await delay(700)
    const id = params.id as string
    const index = mockOrders.findIndex((o) => o.id === id)

    if (index !== -1) {
      mockOrders.splice(index, 1)
      return HttpResponse.json(
        createSuccessResponse(null, 'Xóa đơn hàng thành công'),
        { status: 200 }
      )
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy đơn hàng', 'NOT_FOUND'), { status: 404 })
  }),

  // POST /api/orders/bulk-confirm - Bulk confirm orders
  http.post('/api/orders/bulk-confirm', async ({ request }) => {
    await delay(800)
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

    return HttpResponse.json(
      createSuccessResponse({ updatedCount }, `Đã xác nhận ${updatedCount} đơn hàng`),
      { status: 200 }
    )
  }),

  // POST /api/orders/bulk-delete - Bulk delete orders
  http.post('/api/orders/bulk-delete', async ({ request }) => {
    await delay(800)
    const body = (await request.json()) as { ids: string[] }
    const ids = body.ids || []

    let deletedCount = 0
    for (let i = mockOrders.length - 1; i >= 0; i--) {
      if (ids.includes(mockOrders[i].id)) {
        mockOrders.splice(i, 1)
        deletedCount++
      }
    }

    return HttpResponse.json(
      createSuccessResponse({ deletedCount }, `Đã xóa ${deletedCount} đơn hàng`),
      { status: 200 }
    )
  }),

  // POST /api/orders/bulk-status - Bulk update status
  http.patch('/api/orders/bulk-status', async ({ request }) => {
    await delay(800)
    const body = (await request.json()) as { ids: string[]; status: string }
    const { ids, status } = body

    let updatedCount = 0
    for (const order of mockOrders) {
      if (ids.includes(order.id)) {
        order.status = status as Order['status']
        order.updatedAt = new Date().toISOString()
        order.updatedAt_platform = order.updatedAt

        for (const item of order.items ?? []) {
          item.status = status as Order['status']
        }

        updatedCount++
      }
    }

    return HttpResponse.json(
      createSuccessResponse({ updatedCount }, `Đã cập nhật ${updatedCount} đơn hàng`),
      { status: 200 }
    )
  }),

  // POST /api/orders/:id/confirm - Confirm single order
  http.post('/api/orders/:id/confirm', async ({ params }) => {
    await delay(600)
    const id = params.id as string
    const order = mockOrders.find((o) => o.id === id)

    if (!order) {
      return HttpResponse.json(createErrorResponse('Không tìm thấy đơn hàng', 'NOT_FOUND'), { status: 404 })
    }

    if (pendingStatuses.has(order.status)) {
      order.status = 'Confirmed'
      order.updatedAt = new Date().toISOString()
      order.updatedAt_platform = order.updatedAt
      for (const item of order.items ?? []) {
        item.status = 'Confirmed'
      }
    }

    return HttpResponse.json(
      createSuccessResponse({ updated: true, status: order.status }, 'Xác nhận đơn hàng thành công'),
      { status: 200 }
    )
  }),

  // POST /api/orders/:id/cancel - Cancel order
  http.post('/api/orders/:id/cancel', async ({ params }) => {
    await delay(600)
    const id = params.id as string
    const order = mockOrders.find((o) => o.id === id)

    if (!order) {
      return HttpResponse.json(createErrorResponse('Không tìm thấy đơn hàng', 'NOT_FOUND'), { status: 404 })
    }

    if (order.status !== 'Delivered' && order.status !== 'Refunded') {
      order.status = 'Cancelled'
      order.updatedAt = new Date().toISOString()
      order.updatedAt_platform = order.updatedAt
      for (const item of order.items ?? []) {
        item.status = 'Cancelled'
      }
    }

    return HttpResponse.json(
      createSuccessResponse({ updated: true, status: order.status }, 'Hủy đơn hàng thành công'),
      { status: 200 }
    )
  }),

  // POST /api/orders/:id/ship - Ship order
  http.post('/api/orders/:id/ship', async ({ params }) => {
    await delay(600)
    const id = params.id as string
    const order = mockOrders.find((o) => o.id === id)

    if (!order) {
      return HttpResponse.json(createErrorResponse('Không tìm thấy đơn hàng', 'NOT_FOUND'), { status: 404 })
    }

    if (order.status === 'Confirmed' || order.status === 'Packed' || order.status === 'ReadyToShip') {
      order.status = 'Shipped'
      order.updatedAt = new Date().toISOString()
      order.updatedAt_platform = order.updatedAt
      for (const item of order.items ?? []) {
        item.status = 'Shipped'
      }
    }

    return HttpResponse.json(
      createSuccessResponse({ updated: true, status: order.status }, 'Giao hàng thành công'),
      { status: 200 }
    )
  }),

  // POST /api/orders/:id/refund - Refund order
  http.post('/api/orders/:id/refund', async ({ params }) => {
    await delay(600)
    const id = params.id as string
    const order = mockOrders.find((o) => o.id === id)

    if (!order) {
      return HttpResponse.json(createErrorResponse('Không tìm thấy đơn hàng', 'NOT_FOUND'), { status: 404 })
    }

    order.status = 'Refunded'
    order.updatedAt = new Date().toISOString()
    order.updatedAt_platform = order.updatedAt
    for (const item of order.items ?? []) {
      item.status = 'Refunded'
    }

    return HttpResponse.json(
      createSuccessResponse({ updated: true, status: order.status }, 'Hoàn tiền thành công'),
      { status: 200 }
    )
  }),

  // GET /api/orders/returns - Get returns
  http.get('/api/orders/returns', async ({ request }) => {
    await delay(600)
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

    const sorted = baseFiltered.sort((a, b) => new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime())

    const offset = (normalizedPage - 1) * normalizedPageSize
    const paginatedItems = sorted.slice(offset, offset + normalizedPageSize)
    const hasMore = offset + normalizedPageSize < sorted.length

    return HttpResponse.json(
      createSuccessResponse({
        items: paginatedItems,
        hasMore,
        nextCursor: hasMore ? String(normalizedPage + 1) : undefined,
        totalCount: sorted.length,
      }),
      { status: 200 }
    )
  }),
]
