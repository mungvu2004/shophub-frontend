/**
 * Custom Hook: useProductData
 * 
 * Provides centralized access to product data for all pages
 * 
 * Usage:
 * const { products, getProduct, searchProducts, isLoading } = useProductData()
 * const product = getProduct('product-id')
 * const results = searchProducts('laptop')
 */

import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useProductStore } from '@/stores/productStore'
import { recordProductAccess } from '@/services/productAnalytics'
import type { ProductDataDto } from '@/services/productDataService'

export interface UseProductDataOptions {
  /**
   * Auto-trigger preload on mount
   * @default true
   */
  autoPreload?: boolean

  /**
   * Product IDs to load on demand
   */
  productIds?: string[]

  /**
   * Search query
   */
  searchQuery?: string

  /**
   * Page name for analytics tracking
   * Auto-detected from route if not provided
   */
  pageName?: string
}

export interface UseProductDataReturn {
  // Data
  products: ProductDataDto[]
  productMap: Map<string, ProductDataDto>

  // Methods - Get
  getProduct: (id: string) => ProductDataDto | undefined
  getProductsByIds: (ids: string[]) => ProductDataDto[]
  searchProducts: (query: string) => ProductDataDto[]
  addProduct: (product: ProductDataDto) => void
  addProducts: (products: ProductDataDto[]) => void
  refreshProduct: (id: string) => Promise<ProductDataDto | null>

  // Methods - Invalidation
  invalidateProduct: (id: string) => void
  invalidateProducts: (ids: string[]) => void
  invalidateCache: () => void
  isProductStale: (id: string) => boolean
  setCacheInvalidationTime: (ms: number) => void

  // Methods - Utility
  clearCache: () => void

  // State
  isLoading: boolean
  isPreloaded: boolean
  error: string | null
  isLoadingProductIds: string[]
  staleProductIds: string[]
}

/**
 * Main hook for accessing centralized product data
 */
export function useProductData(options: UseProductDataOptions = {}): UseProductDataReturn {
  const { autoPreload = true, productIds, searchQuery, pageName: providedPageName } = options

  // Auto-detect page name from location
  let pageName = providedPageName || 'unknown'
  try {
    if (typeof window !== 'undefined') {
      pageName = window.location.pathname.replace(/\//g, '_') || 'root'
    }
  } catch {
    // Fallback if location unavailable
  }

  // Subscribe to store
  const {
    products,
    invalidatedProductIds,
    isPreloading,
    isPreloaded,
    loadingProductIds,
    error,
    preloadCriticalProducts,
    loadProductById,
    getProduct,
    getProductsByIds,
    searchProducts: storeSearch,
    addProduct,
    addProducts,
    invalidateProduct,
    invalidateProducts,
    invalidateCache,
    isProductStale,
    refreshProduct,
    setCacheInvalidationTime,
    clearCache,
  } = useProductStore(
    useShallow((state) => ({
      products: state.products,
      productsByName: state.productsByName,
      invalidatedProductIds: state.invalidatedProductIds,
      isPreloading: state.isPreloading,
      isPreloaded: state.isPreloaded,
      loadingProductIds: state.loadingProductIds,
      error: state.error,
      preloadCriticalProducts: state.preloadCriticalProducts,
      loadProductById: state.loadProductById,
      getProduct: state.getProduct,
      getProductsByIds: state.getProductsByIds,
      searchProducts: state.searchProducts,
      addProduct: state.addProduct,
      addProducts: state.addProducts,
      invalidateProduct: state.invalidateProduct,
      invalidateProducts: state.invalidateProducts,
      invalidateCache: state.invalidateCache,
      isProductStale: state.isProductStale,
      refreshProduct: state.refreshProduct,
      setCacheInvalidationTime: state.setCacheInvalidationTime,
      clearCache: state.clearCache,
    }))
  )

  // Auto-preload on mount
  useEffect(() => {
    if (autoPreload && !isPreloaded && !isPreloading) {
      preloadCriticalProducts()
    }
  }, [autoPreload, isPreloading, isPreloaded, preloadCriticalProducts])

  // Load specific products on demand
  useEffect(() => {
    if (productIds && productIds.length > 0) {
      productIds.forEach((id) => {
        if (!products.has(id) && !loadingProductIds.has(id)) {
          loadProductById(id)
        }
      })
    }
  }, [productIds, products, loadingProductIds, loadProductById])

  // Search products
  const searchResults = searchQuery ? storeSearch(searchQuery) : Array.from(products.values())

  // Create analytics-aware wrapper methods
  const getProductWithAnalytics = (id: string) => {
    const product = getProduct(id)
    if (product) {
      recordProductAccess(id, pageName, {
        method: 'direct',
        fromCache: true,
      })
    }
    return product
  }

  const searchProductsWithAnalytics = (query: string) => {
    const results = storeSearch(query)
    results.forEach((product) => {
      recordProductAccess(product.id, pageName, {
        method: 'search',
        fromCache: true,
      })
    })
    return results
  }

  const getProductsByIdsWithAnalytics = (ids: string[]) => {
    const results = getProductsByIds(ids)
    results.forEach((product) => {
      recordProductAccess(product.id, pageName, {
        method: 'batch',
        fromCache: true,
      })
    })
    return results
  }

  return {
    // Data
    products: searchResults,
    productMap: products,

    // Methods - Get
    getProduct: getProductWithAnalytics,
    getProductsByIds: getProductsByIdsWithAnalytics,
    searchProducts: searchProductsWithAnalytics,
    addProduct,
    addProducts,
    refreshProduct,

    // Methods - Invalidation
    invalidateProduct,
    invalidateProducts,
    invalidateCache,
    isProductStale,
    setCacheInvalidationTime,

    // Methods - Utility
    clearCache,

    // State
    isLoading: isPreloading || loadingProductIds.size > 0,
    isPreloaded,
    error,
    isLoadingProductIds: Array.from(loadingProductIds),
    staleProductIds: Array.from(invalidatedProductIds),
  }
}

/**
 * Simplified hook for getting a single product
 */
export function useProductById(productId: string | undefined) {
  const { getProduct, refreshProduct, isLoading } = useProductData({
    autoPreload: false,
    productIds: productId ? [productId] : [],
  })

  return {
    product: productId ? getProduct(productId) : undefined,
    refreshProduct,
    isLoading,
  }
}

/**
 * Hook for searching products
 */
export function useProductSearch(query: string) {
  const { searchProducts, isLoading, error } = useProductData({
    autoPreload: true,
    searchQuery: query,
  })

  return {
    results: searchProducts(query),
    isLoading,
    error,
  }
}

/**
 * Hook for getting multiple products
 */
export function useProductsByIds(productIds: string[]) {
  const { getProductsByIds, isLoading } = useProductData({
    autoPreload: false,
    productIds,
  })

  return {
    products: getProductsByIds(productIds),
    isLoading,
  }
}
