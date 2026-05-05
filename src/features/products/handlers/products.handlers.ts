import { http, HttpResponse } from 'msw'
import { mockProducts } from '@/mocks/data/products'
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

export const productsHandlers = [
  http.get('/api/products', async ({ request }) => {
    await delay(600)
    
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const status = (url.searchParams.get('status') ?? '').trim()
    const platform = (url.searchParams.get('platform') ?? '').trim()
    const category = (url.searchParams.get('category') ?? '').trim()
    const limit = Number(url.searchParams.get('limit') ?? 20)
    const offset = Number(url.searchParams.get('offset') ?? 0)

    let filtered = [...mockProducts]

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.variants?.some(v => v.internalSku.toLowerCase().includes(search))
      )
    }

    if (status && status !== 'all') {
      filtered = filtered.filter(product => product.status === status)
    }

    if (platform && platform !== 'all') {
      filtered = filtered.filter(product =>
        product.variants?.some(v =>
          v.listings?.some(l => l.platform === platform)
        )
      )
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(category.toLowerCase())
      )
    }

    const totalCount = filtered.length
    const paginated = filtered.slice(offset, offset + limit)
    const hasMore = offset + limit < totalCount

    return HttpResponse.json(createSuccessResponse({
      items: paginated,
      totalCount,
      hasMore,
    }))
  }),

  http.get('/api/products/:id', async ({ params }) => {
    await delay(500)
    
    const id = String(params.id)
    const product = mockProducts.find(p => p.id === id)

    if (!product) {
      return HttpResponse.json(
        createErrorResponse('Không tìm thấy sản phẩm'),
        { status: 404 }
      )
    }

    return HttpResponse.json(createSuccessResponse(product))
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
    
    if (index === -1) {
      return HttpResponse.json(
        createErrorResponse('Không tìm thấy sản phẩm'),
        { status: 404 }
      )
    }

    const updatedProduct: Product = {
      ...mockProducts[index],
      ...body,
      id: mockProducts[index].id,
      updatedAt: new Date().toISOString(),
    }

    mockProducts[index] = updatedProduct

    return HttpResponse.json(
      createSuccessResponse(updatedProduct, 'Cập nhật sản phẩm thành công')
    )
  }),

  http.delete('/api/products/:id', async ({ params }) => {
    await delay(800)
    
    const id = String(params.id)
    const index = mockProducts.findIndex(p => p.id === id)
    
    if (index === -1) {
      return HttpResponse.json(
        createErrorResponse('Không tìm thấy sản phẩm'),
        { status: 404 }
      )
    }

    mockProducts.splice(index, 1)

    return HttpResponse.json(
      createSuccessResponse(null, 'Xóa sản phẩm thành công')
    )
  }),

  http.patch('/api/products/:id/status', async ({ params, request }) => {
    await delay(600)
    
    const id = String(params.id)
    const body = await request.json() as { status: string }
    
    const index = mockProducts.findIndex(p => p.id === id)
    
    if (index === -1) {
      return HttpResponse.json(
        createErrorResponse('Không tìm thấy sản phẩm'),
        { status: 404 }
      )
    }

    mockProducts[index].status = body.status as Product['status']
    mockProducts[index].updatedAt = new Date().toISOString()

    return HttpResponse.json(
      createSuccessResponse(mockProducts[index], 'Thay đổi trạng thái thành công')
    )
  }),

  http.post('/api/products/sync', async ({ request }) => {
    await delay(1200)
    
    const body = await request.json() as { productIds: string[] }
    const { productIds } = body

    return HttpResponse.json(
      createSuccessResponse({ syncedCount: productIds.length }, `Đã đồng bộ ${productIds.length} sản phẩm`)
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
      createSuccessResponse({ deletedCount }, `Đã xóa ${deletedCount} sản phẩm`)
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
      createSuccessResponse({ updatedCount }, `Đã cập nhật ${updatedCount} sản phẩm`)
    )
  }),

  http.get('/api/products/:id/automation-triggers', async ({ params }) => {
    await delay(400)

    const id = String(params.id)
    const product = mockProducts.find(p => p.id === id)

    if (!product) {
      return HttpResponse.json(
        createErrorResponse('Không tìm thấy sản phẩm'),
        { status: 404 }
      )
    }

    const n = parseInt(id.replace('prod-', ''), 10) || 1
    const hasTriggers = n % 3 !== 0

    const items = hasTriggers ? [
      {
        id: `trigger-${id}-1`,
        name: 'Tự động đồng bộ giá Shopee',
        status: 'active' as const,
        scopeLabel: 'Giá bán',
        description: 'Cập nhật giá Shopee khi giá gốc thay đổi hơn 5%. Áp dụng trong giờ cao điểm.',
      },
      {
        id: `trigger-${id}-2`,
        name: 'Cảnh báo tồn kho thấp',
        status: n % 2 === 0 ? 'active' as const : 'paused' as const,
        scopeLabel: 'Kho hàng',
        description: `Gửi thông báo khi tồn kho khả dụng xuống dưới ${20 + n * 5} sản phẩm.`,
      },
      ...(n % 2 === 0 ? [{
        id: `trigger-${id}-3`,
        name: 'Đồng bộ TikTok Shop khi hết hàng',
        status: 'active' as const,
        scopeLabel: 'Đa kênh',
        description: 'Tự động ẩn sản phẩm trên TikTok Shop khi availableQty = 0.',
      }] : []),
    ] : []

    return HttpResponse.json(createSuccessResponse({
      productId: id,
      lastUpdatedAt: new Date().toISOString(),
      items,
    }))
  }),
]
