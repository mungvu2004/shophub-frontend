/**
 * Tests for Product Store
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useProductStore } from '@/stores/productStore'
import type { ProductDataDto } from '@/services/productDataService'

// Mock data
const mockProduct: ProductDataDto = {
  id: 'prod-1',
  sellerId: 'seller-1',
  name: 'Test Product',
  sku: 'SKU-001',
  status: 'Active',
  isDeleted: false,
  source: 'products_api',
}

const mockProduct2: ProductDataDto = {
  id: 'prod-2',
  sellerId: 'seller-1',
  name: 'Second Product',
  sku: 'SKU-002',
  status: 'Active',
  isDeleted: false,
  source: 'products_api',
}

describe('ProductStore', () => {
  beforeEach(() => {
    useProductStore.getState().clearCache()
  })

  afterEach(() => {
    useProductStore.getState().clearCache()
  })

  describe('addProduct', () => {
    it('should add single product to cache', () => {
      const store = useProductStore.getState()
      store.addProduct(mockProduct)

      expect(store.getProduct('prod-1')).toEqual(mockProduct)
    })

    it('should update product if already exists', () => {
      const store = useProductStore.getState()
      store.addProduct(mockProduct)

      const updated = { ...mockProduct, name: 'Updated Name' }
      store.addProduct(updated)

      expect(store.getProduct('prod-1')?.name).toBe('Updated Name')
    })
  })

  describe('addProducts', () => {
    it('should add multiple products', () => {
      const store = useProductStore.getState()
      store.addProducts([mockProduct, mockProduct2])

      expect(store.getProductsByIds(['prod-1', 'prod-2'])).toHaveLength(2)
    })
  })

  describe('getProduct', () => {
    it('should return product from cache', () => {
      const store = useProductStore.getState()
      store.addProduct(mockProduct)

      const result = store.getProduct('prod-1')
      expect(result).toEqual(mockProduct)
    })

    it('should return undefined for non-existent product', () => {
      const store = useProductStore.getState()
      expect(store.getProduct('non-existent')).toBeUndefined()
    })
  })

  describe('searchProducts', () => {
    it('should search by product name', () => {
      const store = useProductStore.getState()
      store.addProducts([
        mockProduct,
        mockProduct2,
        { ...mockProduct, id: 'prod-3', name: 'Another Test' },
      ])

      const results = store.searchProducts('Test')
      expect(results).toHaveLength(2)
      expect(results.some((p) => p.name === 'Test Product')).toBe(true)
    })

    it('should be case-insensitive', () => {
      const store = useProductStore.getState()
      store.addProduct(mockProduct)

      const results = store.searchProducts('test PRODUCT')
      expect(results).toHaveLength(1)
    })
  })

  describe('Invalidation', () => {
    it('should mark product as stale', () => {
      const store = useProductStore.getState()
      store.addProduct(mockProduct)

      expect(store.isProductStale('prod-1')).toBe(false)
      store.invalidateProduct('prod-1')
      expect(store.isProductStale('prod-1')).toBe(true)
    })

    it('should mark products as stale after timeout', () => {
      const store = useProductStore.getState()
      store.setCacheInvalidationTime(100) // 100ms
      store.addProduct(mockProduct)

      expect(store.isProductStale('prod-1')).toBe(false)

      // Wait for cache to expire
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(store.isProductStale('prod-1')).toBe(true)
          resolve(undefined)
        }, 150)
      })
    })

    it('should invalidate all products', () => {
      const store = useProductStore.getState()
      store.addProducts([mockProduct, mockProduct2])

      store.invalidateCache()

      expect(store.isProductStale('prod-1')).toBe(true)
      expect(store.isProductStale('prod-2')).toBe(true)
    })
  })

  describe('clearCache', () => {
    it('should clear all products', () => {
      const store = useProductStore.getState()
      store.addProducts([mockProduct, mockProduct2])

      store.clearCache()

      expect(store.getAllProducts()).toHaveLength(0)
      expect(store.isPreloaded).toBe(false)
    })

    it('should clear invalidation tracking', () => {
      const store = useProductStore.getState()
      store.addProduct(mockProduct)
      store.invalidateProduct('prod-1')

      store.clearCache()

      expect(store.invalidatedProductIds.size).toBe(0)
    })
  })
})
