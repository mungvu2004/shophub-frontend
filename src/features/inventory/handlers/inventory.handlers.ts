import { http, HttpResponse, delay } from 'msw'
import type { StockLevel } from '@/types/inventory.types'
import type { PlatformCode } from '@/types/platform.types'
import {
  mockInventoryAIForecast,
  mockInventoryAIForecastDetails,
  mockInventoryAlerts,
  mockStockLevels,
  mockWarehouses,
} from '@/mocks/data/inventory'
import { mockAdjustments } from '@/mocks/data/inventoryAdjustments'
import { buildInventoryStockMovementsResponse } from '@/mocks/data/inventoryStockMovements'

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

export const inventoryHandlers = [
  // GET /api/inventory - List SKUs
  http.get('/api/inventory', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const statusFilter = url.searchParams.get('status')?.split(',').filter(Boolean) || []
    const categoryFilter = url.searchParams.get('category')?.split(',').filter(Boolean) || []
    const platformFilter = url.searchParams.get('platform')?.split(',').filter(Boolean) || []
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const offset = Number(url.searchParams.get('offset') ?? 0)

    const filtered = mockStockLevels.filter((stock) => {
      const matchSearch = !search ||
        stock.sku.toLowerCase().includes(search) ||
        (stock.productName ?? '').toLowerCase().includes(search)

      const matchCategory = categoryFilter.length === 0 || (stock.category && categoryFilter.includes(stock.category))

      const channelStock = stock.channelStock ?? { shopee: 0, tiktok: 0, lazada: 0 }
      const matchPlatform = platformFilter.length === 0 || platformFilter.some(p => {
        if (p === 'shopee') return (channelStock.shopee ?? 0) > 0
        if (p === 'tiktok') return (channelStock.tiktok ?? 0) > 0
        if (p === 'lazada') return (channelStock.lazada ?? 0) > 0
        return false
      })

      const isDiscontinued = (stock as StockLevel & { isDiscontinued?: boolean }).isDiscontinued || false
      const isOut = stock.availableQty === 0 && !isDiscontinued
      const isLow = stock.availableQty > 0 && stock.availableQty <= (stock.minThreshold || 15) && !isDiscontinued
      const derivedStatus = isDiscontinued ? 'out-of-stock' : isOut ? 'out-of-stock' : isLow ? 'low-stock' : 'in-stock'

      const matchStatus = statusFilter.length === 0 || statusFilter.includes(derivedStatus)

      return matchSearch && matchCategory && matchPlatform && matchStatus
    })

    return HttpResponse.json(
      createSuccessResponse({
        items: filtered.slice(offset, offset + limit),
        totalCount: filtered.length,
        hasMore: offset + limit < filtered.length,
      }),
      { status: 200 }
    )
  }),

  // POST /api/inventory - Create SKU
  http.post('/api/inventory', async ({ request }) => {
    await delay(700)
    const body = (await request.json()) as Partial<StockLevel>

    const newSku: StockLevel = {
      id: `sl-${Date.now()}`,
      sku: body.sku || `SKU-${Date.now()}`,
      variantId: body.variantId || `var-${Date.now()}`,
      variantName: body.variantName || 'Tên hiển thị mặc định',
      productName: body.productName || 'Sản phẩm mới',
      category: body.category || 'Khác',
      warehouseId: body.warehouseId || 'wh-001',
      warehouseName: body.warehouseName || 'Main Warehouse',
      physicalQty: body.physicalQty || 0,
      reservedQty: 0,
      availableQty: body.physicalQty || 0,
      onOrder: 0,
      channelStock: { shopee: 0, tiktok: 0, lazada: 0 },
      minThreshold: 15,
      maxThreshold: 250,
      updatedAt: new Date().toISOString(),
    }

    mockStockLevels.push(newSku)

    return HttpResponse.json(
      createSuccessResponse(newSku, 'Tạo SKU thành công'),
      { status: 201 }
    )
  }),

  // PUT /api/inventory/:id - Update SKU
  http.put('/api/inventory/:id', async ({ params, request }) => {
    await delay(700)
    const id = params.id as string
    const body = (await request.json()) as Partial<StockLevel>

    const index = mockStockLevels.findIndex((s) => s.id === id)
    if (index !== -1) {
      mockStockLevels[index] = { ...mockStockLevels[index], ...body, updatedAt: new Date().toISOString() }
      return HttpResponse.json(
        createSuccessResponse(mockStockLevels[index], 'Cập nhật SKU thành công'),
        { status: 200 }
      )
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy SKU', 'NOT_FOUND'), { status: 404 })
  }),

  // DELETE /api/inventory - Bulk delete SKUs
  http.delete('/api/inventory', async ({ request }) => {
    await delay(700)
    const body = (await request.json()) as { ids: string[] }
    const ids = body.ids || []

    let deletedCount = 0
    for (let i = mockStockLevels.length - 1; i >= 0; i--) {
      if (ids.includes(mockStockLevels[i].id)) {
        mockStockLevels.splice(i, 1)
        deletedCount++
      }
    }

    return HttpResponse.json(
      createSuccessResponse({ deletedCount }, `Đã xóa ${deletedCount} SKU`),
      { status: 200 }
    )
  }),

  // GET /api/inventory/summary - Summary
  http.get('/api/inventory/summary', async () => {
    await delay(400)
    const summary = {
      totalSKUs: mockStockLevels.length,
      totalValue: '₫ 125,480,000',
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      lowStockCount: mockStockLevels.filter(s => s.availableQty <= (s.minThreshold || 15)).length
    }

    return HttpResponse.json(createSuccessResponse(summary), { status: 200 })
  }),

  // GET /api/inventory/categories - Categories
  http.get('/api/inventory/categories', async () => {
    await delay(300)
    const categories = Array.from(new Set(mockStockLevels.map(s => s.category).filter(Boolean)))
    return HttpResponse.json(createSuccessResponse(categories), { status: 200 })
  }),

  // GET /api/inventory/alerts - Alerts
  http.get('/api/inventory/alerts', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const severity = url.searchParams.get('severity')
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const offset = Number(url.searchParams.get('offset') ?? 0)

    let filtered = mockInventoryAlerts
    if (severity && severity !== 'all') {
      filtered = filtered.filter(a => a.severity === severity)
    }

    return HttpResponse.json(
      createSuccessResponse({
        items: filtered.slice(offset, offset + limit),
        totalCount: filtered.length,
        unreadCount: filtered.filter(a => !a.isResolved).length,
      }),
      { status: 200 }
    )
  }),

  // PUT /api/inventory/alerts/:id - Resolve alert
  http.put('/api/inventory/alerts/:id', async ({ params, request }) => {
    await delay(500)
    const id = params.id as string
    const body = (await request.json()) as { isResolved: boolean; resolvedAt: string }

    const alert = mockInventoryAlerts.find((a) => a.id === id)
    if (alert) {
      alert.isResolved = body.isResolved
      alert.resolvedAt = body.resolvedAt
      return HttpResponse.json(createSuccessResponse(alert, 'Cập nhật cảnh báo thành công'), { status: 200 })
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy cảnh báo', 'NOT_FOUND'), { status: 404 })
  }),

  // GET /api/inventory/warehouses - Warehouses
  http.get('/api/inventory/warehouses', async () => {
    await delay(300)
    return HttpResponse.json(createSuccessResponse(mockWarehouses), { status: 200 })
  }),

  // POST /api/inventory/adjust - Adjust stock
  http.post('/api/inventory/adjust', async ({ request }) => {
    await delay(700)
    const body = (await request.json()) as {
      skuId: string
      quantity: number
      reason: string
      type: 'in' | 'out'
    }

    const index = mockStockLevels.findIndex((s) => s.id === body.skuId)
    if (index !== -1) {
      const adjustment = body.type === 'in' ? body.quantity : -body.quantity
      mockStockLevels[index].physicalQty += adjustment
      mockStockLevels[index].availableQty += adjustment
      mockStockLevels[index].updatedAt = new Date().toISOString()

      return HttpResponse.json(
        createSuccessResponse(mockStockLevels[index], 'Điều chỉnh tồn kho thành công'),
        { status: 200 }
      )
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy SKU', 'NOT_FOUND'), { status: 404 })
  }),

  // GET /api/inventory/stock-movements - Stock movements
  http.get('/api/inventory/stock-movements', async ({ request }) => {
    await delay(600)
    const url = new URL(request.url)

    const platform = url.searchParams.get('platform')
    const movementGroup = url.searchParams.get('movementGroup')
    const warehouseId = url.searchParams.get('warehouseId')

    const payload = buildInventoryStockMovementsResponse({
      search: url.searchParams.get('search') ?? undefined,
      platform: (platform === 'all' ? undefined : platform as PlatformCode) ?? undefined,
      movementGroup: (movementGroup === 'all' ? 'all' : movementGroup as 'inbound' | 'outbound' | 'transfer' | 'order' | 'adjustment' | 'loss') ?? undefined,
      warehouseId: (warehouseId === 'all' ? undefined : warehouseId) ?? undefined,
      page: Number(url.searchParams.get('page') ?? 1),
      pageSize: Number(url.searchParams.get('pageSize') ?? 10),
    })

    return HttpResponse.json(createSuccessResponse(payload), { status: 200 })
  }),

  // GET /api/inventory/adjustments - Adjustments list
  http.get('/api/inventory/adjustments', async () => {
    await delay(500)
    return HttpResponse.json(createSuccessResponse(mockAdjustments), { status: 200 })
  }),

  // POST /api/inventory/adjustments/:id/approve - Approve
  http.post('/api/inventory/adjustments/:id/approve', async ({ params }) => {
    await delay(700)
    const id = params.id as string
    const index = mockAdjustments.findIndex((a) => a.id === id)

    if (index !== -1) {
      mockAdjustments[index].status = 'APPROVED'
      mockAdjustments[index].approvedAt = new Date().toISOString()

      // Apply adjustment to stock from items
      const adjustment = mockAdjustments[index] as (typeof mockAdjustments[number]) & { items?: Array<{ stockLevelId: string; difference: number }> }
      if (adjustment.items && Array.isArray(adjustment.items)) {
        for (const item of adjustment.items) {
          const skuIndex = mockStockLevels.findIndex((s) => s.id === item.stockLevelId)
          if (skuIndex !== -1) {
            mockStockLevels[skuIndex].physicalQty += item.difference
            mockStockLevels[skuIndex].availableQty += item.difference
            mockStockLevels[skuIndex].updatedAt = new Date().toISOString()
          }
        }
      }

      return HttpResponse.json(
        createSuccessResponse({ success: true, status: 'APPROVED' }, 'Đã phê duyệt điều chỉnh'),
        { status: 200 }
      )
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy điều chỉnh', 'NOT_FOUND'), { status: 404 })
  }),

  // POST /api/inventory/adjustments/:id/reject - Reject
  http.post('/api/inventory/adjustments/:id/reject', async ({ params, request }) => {
    await delay(700)
    const id = params.id as string
    const body = (await request.json()) as { reason?: string }
    const index = mockAdjustments.findIndex((a) => a.id === id)

    if (index !== -1) {
      const adj = mockAdjustments[index] as (typeof mockAdjustments[number]) & { rejectionReason?: string }
      adj.status = 'REJECTED'
      adj.approvedAt = new Date().toISOString()
      adj.rejectionReason = body.reason

      return HttpResponse.json(
        createSuccessResponse({ success: true, status: 'REJECTED', reason: body.reason }, 'Đã từ chối điều chỉnh'),
        { status: 200 }
      )
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy điều chỉnh', 'NOT_FOUND'), { status: 404 })
  }),

  // GET /api/inventory/ai-forecast - AI Forecast
  http.get('/api/inventory/ai-forecast', async () => {
    await delay(400)
    return HttpResponse.json(createSuccessResponse(mockInventoryAIForecast), { status: 200 })
  }),

  // GET /api/inventory/ai-forecast/detail/:sku - AI Forecast detail
  http.get('/api/inventory/ai-forecast/detail/:sku', async ({ params }) => {
    await delay(400)
    const sku = String(params.sku ?? '').toUpperCase()
    const details = mockInventoryAIForecastDetails[sku as keyof typeof mockInventoryAIForecastDetails]
      || mockInventoryAIForecastDetails['AT-WHT-XL']

    return HttpResponse.json(createSuccessResponse(details), { status: 200 })
  }),

  // GET /api/inventory/:id - Get SKU by ID (must be last to avoid shadowing specific routes)
  http.get('/api/inventory/:id', async ({ params }) => {
    await delay(400)
    const id = params.id as string
    const sku = mockStockLevels.find((s) => s.id === id)

    if (sku) {
      return HttpResponse.json(createSuccessResponse(sku), { status: 200 })
    }

    return HttpResponse.json(createErrorResponse('Không tìm thấy SKU', 'NOT_FOUND'), { status: 404 })
  }),
]
