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

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
  error?: { message: string; code?: string }
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

    const response = await apiClient.get<ApiResponse<GetProductsResponse>>(
      `/products?${queryParams.toString()}`
    )

    return response.data.data
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data.data
  },

  async getProductAutomationTriggers(id: string): Promise<GetProductAutomationTriggersResponse> {
    const response = await apiClient.get<ApiResponse<GetProductAutomationTriggersResponse>>(`/products/${id}/automation-triggers`)
    return response.data.data
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data)
    return response.data.data
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/products/${id}`)
  },

  async syncProducts(productIds: string[]): Promise<{ syncedCount: number }> {
    const response = await apiClient.post<ApiResponse<{ syncedCount: number }>>('/products/sync', { productIds })
    return response.data.data
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data)
    return response.data.data
  },

  async updateProductStatus(id: string, status: string): Promise<Product> {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/status`, { status })
    return response.data.data
  },

  async bulkDeleteProducts(ids: string[]): Promise<{ deletedCount: number }> {
    const response = await apiClient.post<ApiResponse<{ deletedCount: number }>>('/products/bulk-delete', { ids })
    return response.data.data
  },

  async bulkUpdateProductStatus(ids: string[], status: string): Promise<{ updatedCount: number }> {
    const response = await apiClient.patch<ApiResponse<{ updatedCount: number }>>('/products/bulk-status', { ids, status })
    return response.data.data
  },
}
