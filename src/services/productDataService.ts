/**
 * Centralized Product Data Service
 * 
 * This service aggregates product data from multiple sources:
 * - Products API (/products/*)
 * - Orders (order items contain product info)
 * - Inventory (stock levels contain product info)
 * - Revenue (product profits)
 * - Dashboard (top products)
 * 
 * All data is normalized to a unified ProductDataDto format
 */

import { apiClient } from './apiClient'
import type { Product, ProductVariant } from '@/types/product.types'
import type { OrderItem } from '@/types/order.types'
import type { StockLevel } from '@/types/inventory.types'

/**
 * Unified product data entity
 * Combines all product information from all sources
 */
export interface ProductDataDto {
  // Core product identity
  id: string
  sellerId: string
  name: string
  sku?: string // Primary SKU
  category?: string
  brand?: string
  model?: string
  status: 'Active' | 'Inactive' | 'Deleted'
  isDeleted: boolean

  // Media
  imageUrl?: string
  imageUrls?: string[]
  description?: string
  shortDescription?: string

  // Pricing & Variants
  basePrice?: number
  salePrice?: number
  variants?: ProductVariant[]

  // Stock/Inventory
  totalStock?: number
  availableStock?: number
  reservedQty?: number
  physicalQty?: number
  minThreshold?: number
  maxThreshold?: number
  warehouseName?: string

  // Metrics (from Orders, Revenue, Dashboard)
  soldQty?: number
  revenue?: number
  avgPrice?: number
  returnRate?: number
  qualityScore?: number
  trendPercent?: number
  profitMargin?: number

  // Platform mappings
  platformMappings?: Array<{
    platform: string
    externalProductId: string
    externalSkuId: string
    currentListedPrice?: number
  }>

  // Metadata
  source: 'products_api' | 'order_item' | 'inventory' | 'revenue' | 'dashboard' | 'crm'
  source_raw?: any // Original data from source for reference
  createdAt?: string
  updatedAt?: string
  lastSyncedAt?: string
}

/**
 * Product Data Service
 * Handles all product data fetching and normalization
 */
class ProductDataService {
  /**
   * Fetch product by ID from Products API
   */
  async getProductById(productId: string): Promise<ProductDataDto | null> {
    try {
      const response = await apiClient.get<{ data: Product }>(`/products/${productId}`)
      const product = response.data.data
      return this.normalizeProduct(product, 'products_api')
    } catch {
      return null
    }
  }

  /**
   * Fetch all products from Products API
   */
  async getAllProducts(limit?: number): Promise<ProductDataDto[]> {
    try {
      const response = await apiClient.get<{ data: Product[] }>('/products', {
        params: limit ? { limit } : {},
      })
      return response.data.data.map((product: Product) => this.normalizeProduct(product, 'products_api'))
    } catch {
      return []
    }
  }

  /**
   * Search products by name/sku
   */
  async searchProducts(query: string): Promise<ProductDataDto[]> {
    try {
      const response = await apiClient.get<{ data: Product[] }>('/products/search', {
        params: { q: query },
      })
      return response.data.data.map((product: Product) => this.normalizeProduct(product, 'products_api'))
    } catch {
      return []
    }
  }

  /**
   * Extract and normalize product data from order item
   */
  normalizeFromOrderItem(item: OrderItem): ProductDataDto {
    return {
      id: item.productId || `order-item-${item.id}`,
      sellerId: '',
      name: item.productName,
      sku: item.externalSkuRef,
      status: 'Active',
      isDeleted: false,
      basePrice: item.itemPrice,
      salePrice: item.paidPrice,
      soldQty: item.qty,
      source: 'order_item',
      source_raw: item,
      updatedAt: new Date().toISOString(),
    }
  }

  /**
   * Extract and normalize product data from inventory stock level
   */
  normalizeFromStockLevel(stock: StockLevel): ProductDataDto {
    return {
      id: stock.variantId || `stock-${stock.id}`,
      sellerId: '',
      name: stock.productName || 'Unknown Product',
      sku: stock.sku,
      category: stock.category,
      status: 'Active',
      isDeleted: false,
      imageUrl: stock.productImage,
      totalStock: stock.physicalQty + stock.reservedQty,
      availableStock: stock.availableQty,
      reservedQty: stock.reservedQty,
      physicalQty: stock.physicalQty,
      minThreshold: stock.minThreshold,
      maxThreshold: stock.maxThreshold,
      warehouseName: stock.warehouseName,
      source: 'inventory',
      source_raw: stock,
      lastSyncedAt: stock.updatedAt,
    }
  }

  /**
   * Public method to normalize a Product to ProductDataDto
   * Used by Products module hooks to sync with ProductStore
   */
  normalizeFromProduct(product: Product): ProductDataDto {
    return this.normalizeProduct(product, 'products_api')
  }

  /**
   * Normalize full product from Products API
   */
  private normalizeProduct(product: Product, source: 'products_api'): ProductDataDto {
    const primaryVariant = product.variants?.[0]
    return {
      id: product.id,
      sellerId: product.sellerId,
      name: product.name,
      sku: primaryVariant?.internalSku,
      category: '', // Not available in Product type
      brand: product.brand,
      model: product.model,
      status: product.status,
      isDeleted: product.isDeleted,
      description: product.description,
      shortDescription: product.shortDescription,
      basePrice: primaryVariant?.basePrice,
      salePrice: primaryVariant?.salePrice,
      imageUrl: primaryVariant?.mainImageUrl,
      imageUrls: primaryVariant?.imagesJson,
      totalStock: product.stock,
      soldQty: product.sold,
      revenue: product.revenue,
      profitMargin: product.margin,
      qualityScore: product.qualityScore,
      trendPercent: product.trendData ? product.trendData[0]?.value : undefined,
      variants: product.variants,
      platformMappings: primaryVariant?.listings?.map((listing) => ({
        platform: listing.platform,
        externalProductId: listing.externalProductId,
        externalSkuId: listing.externalSkuId,
        currentListedPrice: listing.currentListedPrice,
      })),
      source,
      source_raw: product,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }

  /**
   * Merge multiple product data sources into one unified view
   * Later source overrides earlier
   */
  mergeProducts(...products: ProductDataDto[]): ProductDataDto {
    if (products.length === 0) {
      throw new Error('No products to merge')
    }

    const merged = { ...products[0] }

    for (let i = 1; i < products.length; i++) {
      const current = products[i]
      merged.name = current.name || merged.name
      merged.sku = current.sku || merged.sku
      merged.category = current.category || merged.category
      merged.brand = current.brand || merged.brand
      merged.status = current.status || merged.status
      merged.description = current.description || merged.description
      merged.imageUrl = current.imageUrl || merged.imageUrl
      merged.basePrice = current.basePrice ?? merged.basePrice
      merged.salePrice = current.salePrice ?? merged.salePrice
      merged.totalStock = current.totalStock ?? merged.totalStock
      merged.availableStock = current.availableStock ?? merged.availableStock
      merged.soldQty = current.soldQty ?? merged.soldQty
      merged.revenue = current.revenue ?? merged.revenue
      merged.profitMargin = current.profitMargin ?? merged.profitMargin
      merged.updatedAt = new Date(Math.max(
        new Date(current.updatedAt || 0).getTime(),
        new Date(merged.updatedAt || 0).getTime()
      )).toISOString()
    }

    return merged
  }
}

export const productDataService = new ProductDataService()
