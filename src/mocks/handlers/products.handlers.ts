import { http, HttpResponse } from 'msw'
import { mockProducts } from '@/mocks/data/products'
import { productsCompetitorTrackingMock } from '@/mocks/data/productsCompetitorTracking'
import { productsDynamicPricingMock } from '@/mocks/data/productsDynamicPricing'
import type { Product } from '@/types/product.types'

const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms))

const createSuccessResponse = <T>(data: T, message?: string) => ({
  success: true as const,
  data,
  message: message || 'Thành công',
  timestamp: new Date().toISOString(),
})

const createErrorResponse = (message: string, code?: string) => ({
  success: false as const,
  error: { message, code: code || 'ERROR' },
  timestamp: new Date().toISOString(),
})

const buildProductAutomationTriggersImpl = (productId: string, productName: string) => {
  const suffix = productId.slice(-3)

  return [
    {
      id: `trigger-auto-confirm-${suffix}`,
      name: 'Xác nhận đơn tự động khi còn tồn',
      status: 'active',
      scopeLabel: 'Áp dụng: Shopee / TikTok Shop / Lazada',
      description: `Theo dõi SKU của ${productName} và tự xác nhận khi tồn kho khả dụng > 0.`,
    },
    {
      id: `trigger-low-stock-${suffix}`,
      name: 'Cảnh báo tồn kho thấp',
      status: Number(suffix) % 2 === 0 ? 'active' : 'paused',
      scopeLabel: 'Áp dụng: Kho chính + Kho Lazada',
      description: 'Gửi cảnh báo cho team vận hành khi tồn dưới ngưỡng đã cấu hình.',
    },
  ]
}

const generateProductFromId = (id: string): Product | null => {
  if (!id.startsWith('prod-')) return null

  const baseProduct = mockProducts[Math.abs(id.charCodeAt(0) - id.charCodeAt(id.length - 1)) % mockProducts.length]

  if (!baseProduct) return null

  return {
    ...baseProduct,
    id,
    name: `${baseProduct.name} (Variant)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

const buildProductAutomationTriggers = buildProductAutomationTriggersImpl

export const productsHandlers = [
  // Competitor tracking
  http.get('/api/products/competitor-tracking', async () => {
    await delay(600)
    return HttpResponse.json(productsCompetitorTrackingMock, { status: 200 })
  }),

  // Dynamic pricing
  http.get('/api/products/dynamic-pricing', async () => {
    await delay(600)
    return HttpResponse.json(productsDynamicPricingMock, { status: 200 })
  }),

  http.post('/api/products/dynamic-pricing/apply-all', async () => {
    await delay(1000)
    return HttpResponse.json(
      {
        success: true,
        appliedCount: productsDynamicPricingMock.totalSuggestions,
        message: `Đã áp dụng ${productsDynamicPricingMock.totalSuggestions} gợi ý giá AI thành công`,
      },
      { status: 200 }
    )
  }),

  http.patch('/api/products/dynamic-pricing/rules/:id', async ({ params, request }) => {
    await delay(600)
    const body = (await request.json()) as { isActive?: boolean }
    const ruleId = String(params.id ?? '')
    const status = body.isActive ? 'active' : 'inactive'

    return HttpResponse.json(
      {
        success: true,
        ruleId,
        status,
        message: `Đã ${status === 'active' ? 'bật' : 'tắt'} quy tắc thành công`,
      },
      { status: 200 }
    )
  }),

  // CRUD Operations - Standardized
  http.get('/api/products', async ({ request }) => {
    await delay(600)

    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const status = (url.searchParams.get('status') ?? '').trim()
    const category = (url.searchParams.get('category') ?? '').trim()
    const platform = (url.searchParams.get('platform') ?? '').trim()
    const limit = Number(url.searchParams.get('limit') ?? 20)
    const offset = Number(url.searchParams.get('offset') ?? 0)

    let filtered = [...mockProducts]

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.variants.some(v => v.internalSku.toLowerCase().includes(search))
      )
    }

    if (status && status !== 'all') {
      filtered = filtered.filter(product => product.status === status)
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(product =>
        product.brand?.toLowerCase().includes(category.toLowerCase())
      )
    }

    if (platform && platform !== 'all') {
      filtered = filtered.filter(product =>
        product.variants.some(v => v.listings.some(l => l.platform === platform))
      )
    }

    const totalCount = filtered.length
    const hasMore = totalCount > offset + limit
    const items = filtered.slice(offset, offset + (Number.isNaN(limit) ? 20 : limit))

    return HttpResponse.json(createSuccessResponse({ items, totalCount, hasMore }))
  }),

  http.get('/api/products/:id', async ({ params }) => {
    await delay(500)
    const found = mockProducts.find(product => product.id === params.id)

    if (!found && typeof params.id === 'string' && params.id.startsWith('prod-')) {
      const generatedProduct = generateProductFromId(params.id as string)
      if (generatedProduct) {
        return HttpResponse.json(createSuccessResponse(generatedProduct))
      }
    }

    if (!found) {
      return HttpResponse.json(
        createErrorResponse('Không tìm thấy sản phẩm'),
        { status: 404 }
      )
    }

    return HttpResponse.json(createSuccessResponse(found))
  }),

  http.get('/api/products/:id/automation-triggers', async ({ params }) => {
    await delay(500)
    const found = mockProducts.find(product => product.id === params.id)

    if (!found && typeof params.id === 'string' && params.id.startsWith('prod-')) {
      const generatedProduct = generateProductFromId(params.id as string)
      if (generatedProduct) {
        return HttpResponse.json(
          createSuccessResponse({
            productId: generatedProduct.id,
            lastUpdatedAt: new Date().toISOString(),
            items: buildProductAutomationTriggers(generatedProduct.id, generatedProduct.name),
          })
        )
      }
    }

    if (!found) {
      return HttpResponse.json(
        createErrorResponse('Không tìm thấy sản phẩm'),
        { status: 404 }
      )
    }

    return HttpResponse.json(
      createSuccessResponse({
        productId: found.id,
        lastUpdatedAt: new Date().toISOString(),
        items: buildProductAutomationTriggers(found.id, found.name),
      })
    )
  }),

  http.post('/api/products', async ({ request }) => {
    await delay(1000)

    const body = await request.json() as Partial<Product>

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sellerId: 'seller-001',
      name: body.name || 'Sản phẩm mới',
      description: body.description || '',
      shortDescription: body.shortDescription || '',
      brand: body.brand || '',
      model: body.model || '',
      warrantyInfo: body.warrantyInfo || '',
      status: body.status || 'Active',
      source: 'manual',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variants: body.variants || [{
        id: `var-${Date.now()}`,
        productId: `prod-${Date.now()}`,
        internalSku: `SKU-${Date.now()}`,
        name: 'Mặc định',
        basePrice: 0,
        salePrice: 0,
        status: 'Active',
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        listings: [],
      }],
      stock: 0,
      sold: 0,
      revenue: 0,
      margin: 0,
    }

    mockProducts.unshift(newProduct)

    return HttpResponse.json(
      createSuccessResponse(newProduct, 'Thêm sản phẩm thành công'),
      { status: 201 }
    )
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    await delay(800)

    const id = String(params.id)
    const body = await request.json() as Partial<Product>

    const index = mockProducts.findIndex(p => p.id === id)

    if (index !== -1) {
      const updatedProduct: Product = {
        ...mockProducts[index],
        ...body,
        id: mockProducts[index].id,
        updatedAt: new Date().toISOString(),
      }
      mockProducts[index] = updatedProduct
      return HttpResponse.json(createSuccessResponse(updatedProduct, 'Cập nhật sản phẩm thành công'))
    }

    if (typeof params.id === 'string' && params.id.startsWith('prod-')) {
      const generatedProduct = generateProductFromId(params.id as string)
      if (generatedProduct) {
        const updated = {
          ...generatedProduct,
          ...body,
          updatedAt: new Date().toISOString(),
        }
        return HttpResponse.json(createSuccessResponse(updated, 'Cập nhật sản phẩm thành công'))
      }
    }

    return HttpResponse.json(
      createErrorResponse('Không tìm thấy sản phẩm'),
      { status: 404 }
    )
  }),

  http.delete('/api/products/:id', async ({ params }) => {
    await delay(800)

    const id = String(params.id)
    const index = mockProducts.findIndex(p => p.id === id)

    if (index !== -1) {
      mockProducts.splice(index, 1)
      return HttpResponse.json(createSuccessResponse(null, 'Xóa sản phẩm thành công'))
    }

    if (typeof params.id === 'string' && params.id.startsWith('prod-')) {
      const generatedProduct = generateProductFromId(params.id as string)
      if (generatedProduct) {
        return HttpResponse.json(createSuccessResponse(null, 'Xóa sản phẩm thành công'))
      }
    }

    return HttpResponse.json(
      createErrorResponse('Không tìm thấy sản phẩm'),
      { status: 404 }
    )
  }),

  http.patch('/api/products/:id/status', async ({ params, request }) => {
    await delay(600)

    const id = String(params.id)
    const body = await request.json() as { status: string }

    const index = mockProducts.findIndex(p => p.id === id)

    if (index !== -1) {
      mockProducts[index].status = body.status as Product['status']
      mockProducts[index].updatedAt = new Date().toISOString()
      return HttpResponse.json(createSuccessResponse(mockProducts[index], 'Thay đổi trạng thái thành công'))
    }

    return HttpResponse.json(
      createErrorResponse('Không tìm thấy sản phẩm'),
      { status: 404 }
    )
  }),

  http.post('/api/products/sync', async ({ request }) => {
    await delay(1200)

    const body = await request.json() as { productIds: string[] }
    const { productIds } = body

    return HttpResponse.json(
      createSuccessResponse(
        { syncedCount: productIds.length },
        `Đã đồng bộ ${productIds.length} sản phẩm thành công`
      )
    )
  }),

  http.post('/api/products/bulk-delete', async ({ request }) => {
    await delay(1000)

    const body = await request.json() as { ids: string[] }
    const { ids } = body

    let deletedCount = 0
    ids.forEach(id => {
      const index = mockProducts.findIndex(p => p.id === id)
      if (index !== -1) {
        mockProducts.splice(index, 1)
        deletedCount++
      }
    })

    return HttpResponse.json(
      createSuccessResponse({ deletedCount }, `Đã xóa ${deletedCount} sản phẩm thành công`)
    )
  }),

  http.patch('/api/products/bulk-status', async ({ request }) => {
    await delay(800)

    const body = await request.json() as { ids: string[]; status: string }
    const { ids, status } = body

    let updatedCount = 0
    ids.forEach(id => {
      const product = mockProducts.find(p => p.id === id)
      if (product) {
        product.status = status as Product['status']
        product.updatedAt = new Date().toISOString()
        updatedCount++
      }
    })

    return HttpResponse.json(
      createSuccessResponse({ updatedCount }, `Đã cập nhật ${updatedCount} sản phẩm thành công`)
    )
  }),
]
