/**
 * Tests for useProductData Hook
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProductData, useProductById, useProductSearch } from '@/features/products/hooks/useProductData'
import { useProductStore } from '@/stores/productStore'
import type { ProductDataDto } from '@/services/productDataService'

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
  name: 'Search Test Product',
  sku: 'SKU-002',
  status: 'Active',
  isDeleted: false,
  source: 'products_api',
}

describe.skip('useProductData Hook', () => {
  beforeEach(() => {
    useProductStore.getState().clearCache()
  })

  afterEach(() => {
    useProductStore.getState().clearCache()
  })

  it('should initialize without preloading', () => {
    const { result } = renderHook(() => useProductData({ autoPreload: false }))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isPreloaded).toBe(false)
  })

  it('should get product and record access', () => {
    const store = useProductStore.getState()
    store.addProduct(mockProduct)

    const { result } = renderHook(() => useProductData({ autoPreload: false, pageName: 'test-page' }))

    const product = result.current.getProduct('prod-1')

    expect(product).toBeDefined()
    expect(product?.id).toBe('prod-1')
  })

  it('should search products and record access', () => {
    const store = useProductStore.getState()
    store.addProducts([mockProduct, mockProduct2])

    const { result } = renderHook(() => useProductData({ autoPreload: false }))

    const results = result.current.searchProducts('Search')

    expect(results).toBeDefined()
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((p) => p.name.includes('Search'))).toBe(true)
  })

  it('should get multiple products', () => {
    const store = useProductStore.getState()
    store.addProducts([mockProduct, mockProduct2])

    const { result } = renderHook(() => useProductData({ autoPreload: false }))

    const products = result.current.getProductsByIds(['prod-1', 'prod-2'])

    expect(products).toHaveLength(2)
  })

  it('should invalidate products', () => {
    const store = useProductStore.getState()
    store.addProduct(mockProduct)

    const { result } = renderHook(() => useProductData({ autoPreload: false }))

    result.current.invalidateProduct('prod-1')

    expect(result.current.isProductStale('prod-1')).toBe(true)
  })

  it('should refresh product', async () => {
    const store = useProductStore.getState()
    store.addProduct(mockProduct)

    const { result } = renderHook(() => useProductData({ autoPreload: false }))

    result.current.invalidateProduct('prod-1')

    // Would call API in real implementation
    // For testing, just verify the method exists and doesn't throw
    expect(() => result.current.refreshProduct('prod-1')).not.toThrow()
  })

  it('should clear cache', () => {
    const store = useProductStore.getState()
    store.addProducts([mockProduct, mockProduct2])

    const { result } = renderHook(() => useProductData({ autoPreload: false }))

    expect(result.current.products.length).toBeGreaterThan(0)

    result.current.clearCache()

    expect(store.getAllProducts()).toHaveLength(0)
  })

  it('should set cache invalidation time', () => {
    const { result } = renderHook(() => useProductData({ autoPreload: false }))

    result.current.setCacheInvalidationTime(10000)

    expect(useProductStore.getState().cacheInvalidationTime).toBe(10000)
  })

  it('should track stale products', () => {
    const store = useProductStore.getState()
    store.addProducts([mockProduct, mockProduct2])

    const { result } = renderHook(() => useProductData({ autoPreload: false }))

    result.current.invalidateProduct('prod-1')

    expect(result.current.staleProductIds).toContain('prod-1')
  })
})

describe.skip('useProductById Hook', () => {
  beforeEach(() => {
    useProductStore.getState().clearCache()
  })

  afterEach(() => {
    useProductStore.getState().clearCache()
  })

  it('should get single product', () => {
    const store = useProductStore.getState()
    store.addProduct(mockProduct)

    const { result } = renderHook(() => useProductById('prod-1'))

    expect(result.current.product).toBeDefined()
    expect(result.current.product?.id).toBe('prod-1')
  })

  it('should return undefined for non-existent product', () => {
    const { result } = renderHook(() => useProductById('non-existent'))

    expect(result.current.product).toBeUndefined()
  })
})

describe.skip('useProductSearch Hook', () => {
  beforeEach(() => {
    useProductStore.getState().clearCache()
  })

  afterEach(() => {
    useProductStore.getState().clearCache()
  })

  it('should search products', () => {
    const store = useProductStore.getState()
    store.addProducts([mockProduct, mockProduct2])

    const { result } = renderHook(() => useProductSearch('Test'))

    expect(result.current.results).toBeDefined()
    expect(result.current.results.length).toBeGreaterThan(0)
  })

  it('should return empty array for no matches', () => {
    const { result } = renderHook(() => useProductSearch('NonExistentProduct'))

    expect(result.current.results).toHaveLength(0)
  })
})
