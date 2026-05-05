/**
 * Product Analytics Service
 * 
 * Tracks product data access across pages:
 * - Which pages access which products
 * - When products are accessed
 * - How often each product is accessed
 * - Cache hit/miss rates
 * - Performance metrics
 */

export interface ProductAccessEvent {
  productId: string
  pageName: string
  timestamp: number
  method: 'direct' | 'search' | 'batch' | 'preload'
  fromCache: boolean
  fetchTimeMs?: number
}

export interface ProductAnalyticsMetrics {
  totalAccesses: number
  uniqueProducts: number
  cacheHitRate: number // percentage 0-100
  averageFetchTimeMs: number
  accessesByPage: Map<string, number>
  accessesByProduct: Map<string, number>
  recentAccesses: ProductAccessEvent[]
  startTime: number
}

/**
 * Product Analytics Service
 * Collects metrics on product data usage across the app
 */
class ProductAnalyticsService {
  private events: ProductAccessEvent[] = []
  private readonly maxEvents = 1000 // Keep last 1000 events in memory
  private startTime = Date.now()

  /**
   * Record a product access event
   */
  recordAccess(event: Omit<ProductAccessEvent, 'timestamp'>): void {
    this.events.push({
      ...event,
      timestamp: Date.now(),
    })

    // Keep only last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Log in dev mode
    if (import.meta.env.DEV) {
      console.debug('[ProductAnalytics]', {
        productId: event.productId,
        page: event.pageName,
        method: event.method,
        cache: event.fromCache ? 'HIT' : 'MISS',
      })
    }
  }

  /**
   * Get current analytics metrics
   */
  getMetrics(): ProductAnalyticsMetrics {
    const uniqueProducts = new Set(this.events.map((e) => e.productId))
    const accessesByPage = new Map<string, number>()
    const accessesByProduct = new Map<string, number>()
    const cacheHits = this.events.filter((e) => e.fromCache).length
    const fetchTimes = this.events
      .filter((e) => e.fetchTimeMs !== undefined && !e.fromCache)
      .map((e) => e.fetchTimeMs!)

    this.events.forEach((event) => {
      accessesByPage.set(event.pageName, (accessesByPage.get(event.pageName) || 0) + 1)
      accessesByProduct.set(event.productId, (accessesByProduct.get(event.productId) || 0) + 1)
    })

    const cacheHitRate = this.events.length > 0 ? (cacheHits / this.events.length) * 100 : 0
    const averageFetchTimeMs =
      fetchTimes.length > 0 ? fetchTimes.reduce((a, b) => a + b, 0) / fetchTimes.length : 0

    return {
      totalAccesses: this.events.length,
      uniqueProducts: uniqueProducts.size,
      cacheHitRate,
      averageFetchTimeMs,
      accessesByPage,
      accessesByProduct,
      recentAccesses: this.events.slice(-20), // Last 20 events
      startTime: this.startTime,
    }
  }

  /**
   * Get access count for a specific page
   */
  getPageAccessCount(pageName: string): number {
    return this.events.filter((e) => e.pageName === pageName).length
  }

  /**
   * Get products accessed by a specific page
   */
  getProductsAccessedByPage(pageName: string): Set<string> {
    return new Set(this.events.filter((e) => e.pageName === pageName).map((e) => e.productId))
  }

  /**
   * Get pages that accessed a specific product
   */
  getPagesAccessingProduct(productId: string): Set<string> {
    return new Set(this.events.filter((e) => e.productId === productId).map((e) => e.pageName))
  }

  /**
   * Get products accessed most frequently
   */
  getTopProducts(limit: number = 10): Array<{ productId: string; accessCount: number }> {
    const metrics = this.getMetrics()
    return Array.from(metrics.accessesByProduct.entries())
      .map(([productId, count]) => ({ productId, accessCount: count }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit)
  }

  /**
   * Get pages with most product accesses
   */
  getTopPages(limit: number = 10): Array<{ pageName: string; accessCount: number }> {
    const metrics = this.getMetrics()
    return Array.from(metrics.accessesByPage.entries())
      .map(([pageName, count]) => ({ pageName, accessCount: count }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit)
  }

  /**
   * Export metrics as JSON (for debugging/analysis)
   */
  exportMetrics(): object {
    const metrics = this.getMetrics()
    return {
      summary: {
        totalAccesses: metrics.totalAccesses,
        uniqueProducts: metrics.uniqueProducts,
        cacheHitRate: `${metrics.cacheHitRate.toFixed(2)}%`,
        averageFetchTimeMs: `${metrics.averageFetchTimeMs.toFixed(2)}ms`,
        sessionDurationMs: Date.now() - this.startTime,
      },
      topProducts: this.getTopProducts(10),
      topPages: this.getTopPages(10),
      accessesByPage: Object.fromEntries(metrics.accessesByPage),
      accessesByProduct: Object.fromEntries(metrics.accessesByProduct),
      recentAccesses: metrics.recentAccesses,
    }
  }

  /**
   * Clear all analytics data
   */
  reset(): void {
    this.events = []
    this.startTime = Date.now()
  }
}

export const productAnalytics = new ProductAnalyticsService()

// Export convenience function for recording access
export function recordProductAccess(
  productId: string,
  pageName: string,
  options?: {
    method?: 'direct' | 'search' | 'batch' | 'preload'
    fromCache?: boolean
    fetchTimeMs?: number
  }
): void {
  productAnalytics.recordAccess({
    productId,
    pageName,
    method: options?.method || 'direct',
    fromCache: options?.fromCache || false,
    fetchTimeMs: options?.fetchTimeMs,
  })
}
