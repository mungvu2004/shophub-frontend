/**
 * Product Data Store
 * 
 * Zustand store for caching and managing all product data
 * Supports:
 * - Caching products
 * - Preloading critical products
 * - Lazy loading on demand
 * - Searching/filtering
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { ProductDataDto } from '@/services/productDataService'
import { productDataService } from '@/services/productDataService'

interface ProductStoreState {
  // Data
  products: Map<string, ProductDataDto> // id -> ProductDataDto
  productsByName: Map<string, ProductDataDto[]> // normalized name -> [ProductDataDto]
  invalidatedProductIds: Set<string> // Products marked as stale
  lastFetchTime: Map<string, number> // Track when each product was fetched
  cacheInvalidationTime: number // Time in ms to consider cache stale (default 5 min)
  
  // State
  isPreloading: boolean
  isPreloaded: boolean
  loadingProductIds: Set<string>
  error: string | null

  // Actions - Preload & Load
  preloadCriticalProducts: () => Promise<void>
  loadProductById: (id: string) => Promise<ProductDataDto | null>
  
  // Actions - Add/Get
  addProduct: (product: ProductDataDto) => void
  addProducts: (products: ProductDataDto[]) => void
  getProduct: (id: string) => ProductDataDto | undefined
  getProductsByIds: (ids: string[]) => ProductDataDto[]
  searchProducts: (query: string) => ProductDataDto[]
  getAllProducts: () => ProductDataDto[]
  
  // Actions - Invalidation
  invalidateProduct: (id: string) => void
  invalidateProducts: (ids: string[]) => void
  invalidateCache: () => void
  isProductStale: (id: string) => boolean
  refreshProduct: (id: string) => Promise<ProductDataDto | null>
  setCacheInvalidationTime: (ms: number) => void
  
  // Actions - Utility
  clearCache: () => void
  setError: (error: string | null) => void
}

const createProductStore = () =>
  create<ProductStoreState>()(
    subscribeWithSelector((set, get) => ({
      // Initial state
      products: new Map(),
      productsByName: new Map(),
      invalidatedProductIds: new Set(),
      lastFetchTime: new Map(),
      cacheInvalidationTime: 5 * 60 * 1000, // 5 minutes default
      isPreloading: false,
      isPreloaded: false,
      loadingProductIds: new Set(),
      error: null,

      // Preload critical products (called on app startup)
      preloadCriticalProducts: async () => {
        const { isPreloaded, isPreloading } = get()
        
        if (isPreloaded || isPreloading) return

        set({ isPreloading: true, error: null })
        try {
          // Load first 100 products or paginate strategically
          const products = await productDataService.getAllProducts(100)
          set((state) => {
            const newProducts = new Map(state.products)
            const newByName = new Map(state.productsByName)

            products.forEach((product) => {
              newProducts.set(product.id, product)
              
              // Index by normalized name
              const nameKey = product.name.toLowerCase()
              const existing = newByName.get(nameKey) || []
              newByName.set(nameKey, [...existing, product])
            })

            return {
              products: newProducts,
              productsByName: newByName,
              isPreloaded: true,
            }
          })
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Failed to preload products',
            isPreloaded: false,
          })
        } finally {
          set({ isPreloading: false })
        }
      },

      // Load single product on demand
      loadProductById: async (id: string) => {
        const existing = get().getProduct(id)
        if (existing) return existing

        set((state) => {
          const newSet = new Set(state.loadingProductIds)
          newSet.add(id)
          return { loadingProductIds: newSet }
        })

        try {
          const product = await productDataService.getProductById(id)
          if (product) {
            get().addProduct(product)
          }
          return product
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : `Failed to load product ${id}`,
          })
          return null
        } finally {
          set((state) => {
            const newSet = new Set(state.loadingProductIds)
            newSet.delete(id)
            return { loadingProductIds: newSet }
          })
        }
      },

      // Add single product to cache
      addProduct: (product: ProductDataDto) => {
        set((state) => {
          const newProducts = new Map(state.products)
          const newByName = new Map(state.productsByName)
          const newFetchTime = new Map(state.lastFetchTime)

          // Add/update product
          newProducts.set(product.id, product)
          newFetchTime.set(product.id, Date.now())

          // Index by name
          const nameKey = product.name.toLowerCase()
          const existing = newByName.get(nameKey) || []
          const filtered = existing.filter((p) => p.id !== product.id)
          newByName.set(nameKey, [...filtered, product])

          return {
            products: newProducts,
            productsByName: newByName,
            lastFetchTime: newFetchTime,
          }
        })
      },

      // Add multiple products
      addProducts: (products: ProductDataDto[]) => {
        set((state) => {
          const newProducts = new Map(state.products)
          const newByName = new Map(state.productsByName)
          const newFetchTime = new Map(state.lastFetchTime)
          const now = Date.now()

          products.forEach((product) => {
            newProducts.set(product.id, product)
            newFetchTime.set(product.id, now)

            const nameKey = product.name.toLowerCase()
            const existing = newByName.get(nameKey) || []
            const filtered = existing.filter((p) => p.id !== product.id)
            newByName.set(nameKey, [...filtered, product])
          })

          return {
            products: newProducts,
            productsByName: newByName,
            lastFetchTime: newFetchTime,
          }
        })
      },

      // Get product by ID
      getProduct: (id: string) => {
        return get().products.get(id)
      },

      // Get multiple products by IDs
      getProductsByIds: (ids: string[]) => {
        const { products } = get()
        return ids
          .map((id) => products.get(id))
          .filter((p): p is ProductDataDto => p !== undefined)
      },

      // Search products by name
      searchProducts: (query: string) => {
        const normalized = query.toLowerCase()
        const { productsByName } = get()

        const results: ProductDataDto[] = []
        productsByName.forEach((products, nameKey) => {
          if (nameKey.includes(normalized)) {
            results.push(...products)
          }
        })

        return results
      },

      // Get all cached products
      getAllProducts: () => {
        return Array.from(get().products.values())
      },

      // Clear entire cache
      clearCache: () => {
        set({
          products: new Map(),
          productsByName: new Map(),
          invalidatedProductIds: new Set(),
          lastFetchTime: new Map(),
          isPreloaded: false,
          error: null,
        })
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error })
      },

      // Mark single product as invalidated (stale)
      invalidateProduct: (id: string) => {
        set((state) => {
          const newInvalidated = new Set(state.invalidatedProductIds)
          newInvalidated.add(id)
          return { invalidatedProductIds: newInvalidated }
        })
      },

      // Mark multiple products as invalidated
      invalidateProducts: (ids: string[]) => {
        set((state) => {
          const newInvalidated = new Set(state.invalidatedProductIds)
          ids.forEach((id) => newInvalidated.add(id))
          return { invalidatedProductIds: newInvalidated }
        })
      },

      // Mark entire cache as invalidated
      invalidateCache: () => {
        set((state) => {
          const newInvalidated = new Set(state.invalidatedProductIds)
          state.products.forEach((_, id) => newInvalidated.add(id))
          return { invalidatedProductIds: newInvalidated }
        })
      },

      // Check if product is stale based on fetch time
      isProductStale: (id: string) => {
        const { lastFetchTime, invalidatedProductIds, cacheInvalidationTime } = get()
        
        // Explicitly invalidated
        if (invalidatedProductIds.has(id)) return true
        
        // Check if fetch time is beyond invalidation time
        const fetchTime = lastFetchTime.get(id)
        if (!fetchTime) return true // Never fetched
        
        const ageMs = Date.now() - fetchTime
        return ageMs > cacheInvalidationTime
      },

      // Refresh product from API (force reload)
      refreshProduct: async (id: string) => {
        set((state) => {
          const newSet = new Set(state.loadingProductIds)
          newSet.add(id)
          const newInvalidated = new Set(state.invalidatedProductIds)
          newInvalidated.delete(id)
          return { loadingProductIds: newSet, invalidatedProductIds: newInvalidated }
        })

        try {
          const product = await productDataService.getProductById(id)
          if (product) {
            get().addProduct(product)
            set((state) => {
              const newFetchTime = new Map(state.lastFetchTime)
              newFetchTime.set(id, Date.now())
              return { lastFetchTime: newFetchTime }
            })
          }
          return product
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : `Failed to refresh product ${id}`,
          })
          return null
        } finally {
          set((state) => {
            const newSet = new Set(state.loadingProductIds)
            newSet.delete(id)
            return { loadingProductIds: newSet }
          })
        }
      },

      // Set cache invalidation time (in ms)
      setCacheInvalidationTime: (ms: number) => {
        set({ cacheInvalidationTime: ms })
      },
    }))
  )

export const useProductStore = createProductStore()
