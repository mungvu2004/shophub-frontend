/**
 * Tests for Product Data Service
 */

import { describe, it, expect } from 'vitest'
import { productDataService, type ProductDataDto } from '@/services/productDataService'
import type { Product } from '@/types/product.types'
import type { OrderItem } from '@/types/order.types'
import type { StockLevel } from '@/types/inventory.types'

// Mock data
const mockProduct: Product = {
  id: 'prod-1',
  sellerId: 'seller-1',
  name: 'Test Product',
  status: 'Active',
  isDeleted: false,
  source: 'manual',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  variants: [
    {
      id: 'var-1',
      productId: 'prod-1',
      internalSku: 'SKU-001',
      basePrice: 100,
      status: 'Active',
      isDeleted: false,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      listings: [],
    },
  ],
}

const mockOrderItem: OrderItem = {
  id: 'order-item-1',
  orderId: 'order-1',
  productId: 'prod-1',
  productName: 'Test Product from Order',
  externalOrderItemId: 'ext-item-1',
  qty: 2,
  itemPrice: 50,
  paidPrice: 45,
  status: 'Delivered',
  isFulfilledByPlatform: false,
  isDigital: false,
}

const mockStockLevel: StockLevel = {
  id: 'stock-1',
  sku: 'SKU-001',
  variantId: 'var-1',
  variantName: 'Default Variant',
  productName: 'Test Product from Stock',
  warehouseId: 'wh-1',
  warehouseName: 'Main Warehouse',
  physicalQty: 100,
  reservedQty: 10,
  availableQty: 90,
  minThreshold: 20,
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('ProductDataService', () => {
  describe('normalizeProduct', () => {
    it('should normalize full product from API', () => {
      const result = productDataService['normalizeProduct'](mockProduct, 'products_api')

      expect(result.id).toBe('prod-1')
      expect(result.name).toBe('Test Product')
      expect(result.status).toBe('Active')
      expect(result.source).toBe('products_api')
      expect(result.variants).toBeDefined()
    })
  })

  describe('normalizeFromOrderItem', () => {
    it('should extract product data from order item', () => {
      const result = productDataService.normalizeFromOrderItem(mockOrderItem)

      expect(result.id).toBe('prod-1')
      expect(result.name).toBe('Test Product from Order')
      expect(result.sku).toBe(undefined)
      expect(result.source).toBe('order_item')
      expect(result.soldQty).toBe(2)
      expect(result.basePrice).toBe(50)
      expect(result.salePrice).toBe(45)
    })
  })

  describe('normalizeFromStockLevel', () => {
    it('should extract product data from stock level', () => {
      const result = productDataService.normalizeFromStockLevel(mockStockLevel)

      expect(result.id).toBe('var-1')
      expect(result.name).toBe('Test Product from Stock')
      expect(result.sku).toBe('SKU-001')
      expect(result.source).toBe('inventory')
      expect(result.totalStock).toBe(110) // physicalQty + reservedQty
      expect(result.availableStock).toBe(90)
      expect(result.minThreshold).toBe(20)
    })
  })

  describe('mergeProducts', () => {
    it('should merge multiple product sources', () => {
      const product1: ProductDataDto = {
        id: 'prod-1',
        sellerId: 'seller-1',
        name: 'Product',
        status: 'Active',
        isDeleted: false,
        source: 'products_api',
      }

      const product2: ProductDataDto = {
        id: 'prod-1',
        sellerId: 'seller-1',
        name: 'Product Updated',
        status: 'Active',
        isDeleted: false,
        soldQty: 100,
        revenue: 5000,
        source: 'order_item',
      }

      const merged = productDataService.mergeProducts(product1, product2)

      expect(merged.name).toBe('Product Updated')
      expect(merged.soldQty).toBe(100)
      expect(merged.revenue).toBe(5000)
    })

    it('should throw error when merging empty array', () => {
      expect(() => productDataService.mergeProducts()).toThrow()
    })
  })
})
