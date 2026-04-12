import { apiClient } from '@/services/apiClient'
import type { Product } from '@/types/product.types'

export interface GetProductsParams {
  search?: string
  status?: string
  platform?: string
  category?: string
  limit?: number
  offset?: number
}

export interface GetProductsResponse {
  items: Product[]
  totalCount: number
  hasMore: boolean
}

export interface ProductAutomationTrigger {
  id: string
  name: string
  status: 'active' | 'paused'
  scopeLabel: string
  description: string
}

export interface GetProductAutomationTriggersResponse {
  productId: string
  lastUpdatedAt: string
  items: ProductAutomationTrigger[]
}

export const productsService = {
  async getProducts(params: GetProductsParams = {}): Promise<GetProductsResponse> {
    const queryParams = new URLSearchParams()
    
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.platform) queryParams.append('platform', params.platform)
    if (params.category) queryParams.append('category', params.category)
    if (params.limit) queryParams.append('limit', String(params.limit))
    if (params.offset) queryParams.append('offset', String(params.offset))

    const response = await apiClient.get<GetProductsResponse>(
      `/products?${queryParams.toString()}`
    )

    return response.data
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  async getProductAutomationTriggers(id: string): Promise<GetProductAutomationTriggersResponse> {
    const response = await apiClient.get<GetProductAutomationTriggersResponse>(`/products/${id}/automation-triggers`)
    return response.data
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data)
    return response.data
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`)
  },

  async syncProducts(productIds: string[]): Promise<void> {
    await apiClient.post('/products/sync', { productIds })
  },
}
