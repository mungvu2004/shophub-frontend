# Product Data Centralization - Migration Progress & Summary

**Last Updated:** 2026-05-05

---

## ✅ Completed

### 1. **Foundational Architecture** (All Complete)

#### Service Layer ✅
- `src/services/productDataService.ts`
  - Aggregates product data from ALL sources
  - Normalizes to `ProductDataDto` interface
  - Methods: `getProductById()`, `getAllProducts()`, `searchProducts()`, `normalize*()`, `mergeProducts()`

#### Store ✅
- `src/stores/productStore.ts`
  - Zustand store with hybrid preload/lazy-load
  - Cache by ID + by Name for fast lookup
  - **NEW:** Product invalidation tracking
  - **NEW:** Cache TTL with staleness checking
  - Methods: `preloadCriticalProducts()`, `loadProductById()`, `invalidateProduct()`, `refreshProduct()`

#### Hooks ✅
- `src/features/products/hooks/useProductData.ts`
  - Main hook: `useProductData()`
  - Convenience hooks: `useProductById()`, `useProductSearch()`, `useProductsByIds()`
  - **NEW:** Analytics recording on product access
  - **NEW:** Invalidation methods exposed
  - Auto-detects page name for analytics

#### App Initialization ✅
- `src/app/providers.tsx`
  - `AppInitializer` component
  - Triggers preload on app startup
  - Products ready before pages mount

### 2. **Product Invalidation & TTL** ✅

Store now tracks:
- `invalidatedProductIds: Set<string>` - Explicitly marked stale
- `lastFetchTime: Map<string, number>` - Track when each product was fetched
- `cacheInvalidationTime: number` - Default 5 minutes
- **Methods:**
  - `invalidateProduct(id)` - Mark one as stale
  - `invalidateProducts(ids)` - Mark multiple
  - `invalidateCache()` - Mark all
  - `isProductStale(id)` - Check if needs refresh
  - `refreshProduct(id)` - Force reload from API
  - `setCacheInvalidationTime(ms)` - Configure TTL

### 3. **Product Analytics** ✅

New `src/services/productAnalytics.ts`:
- Records every product access with:
  - `productId`, `pageName`, `timestamp`
  - `method`: direct | search | batch | preload
  - `fromCache`: boolean
  - `fetchTimeMs`: number
  
- Metrics tracked:
  - Total accesses, unique products
  - Cache hit rate (%)
  - Average fetch time
  - Accesses by page (top pages)
  - Accesses by product (top products)
  - Session duration

- **Integration:** Automatically records access when:
  - `getProduct()` called
  - `getProductsByIds()` called
  - `searchProducts()` called
  - Auto-detects page from URL

- **Usage:**
```typescript
// Get current metrics
const metrics = productAnalytics.getMetrics()
console.log(`Cache hit rate: ${metrics.cacheHitRate}%`)

// Export for analysis
const report = productAnalytics.exportMetrics()

// Access specific data
const topProducts = productAnalytics.getTopProducts(10)
const pagesUsingProduct = productAnalytics.getPagesAccessingProduct('prod-1')
```

### 4. **Comprehensive Tests** ✅

#### `src/services/productDataService.test.ts`
- Normalize from Products API
- Normalize from OrderItem
- Normalize from StockLevel
- Merge multiple sources

#### `src/stores/productStore.test.ts`
- Add/update products
- Fetch time tracking
- Search functionality
- Product invalidation
- Cache TTL expiration
- Clear cache

#### `src/features/products/hooks/useProductData.test.ts`
- Hook initialization
- Get product with analytics
- Search with analytics
- Get multiple products
- Invalidation
- Cache management
- Convenience hooks tests

---

## 🚀 In Progress

### Pages Migration

#### Orders Module (1/4 Started)
- [x] **OrdersAll.tsx** - Added `useProductData` hook
- [ ] OrderDetail
- [ ] OrdersPendingActions
- [ ] OrdersReturns

#### Next: Inventory, Revenue, CRM, Dashboard modules

---

## 📋 Migration Pattern (All Pages)

### Before:
```typescript
const { data: orders } = useOrdersAllData()
orders.items.forEach(item => {
  console.log(item.productName)  // From order item ❌
})
```

### After:
```typescript
const { getProduct } = useProductData({ pageName: 'OrdersAllPage' })
const { data: orders } = useOrdersAllData()

orders.items.forEach(item => {
  const product = getProduct(item.productId)  // From store ✅
  console.log(product?.name || item.productName)
})
```

**Benefits:**
- Single source of truth
- Consistent data format
- Automatic analytics recording
- Cache invalidation support
- Better performance

---

## 📊 Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    Product Data Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Products API / Orders / Inventory / Revenue / Dashboard     │
│           │                                                   │
│           ▼                                                   │
│  ProductDataService (normalize to ProductDataDto)            │
│           │                                                   │
│           ▼                                                   │
│  ProductStore (Zustand cache)                               │
│    - Map<id, ProductDataDto>                                │
│    - invalidation tracking                                  │
│    - TTL/staleness checking                                 │
│           │                                                   │
│           ▼                                                   │
│  useProductData Hook                                        │
│    - getProduct() → records analytics                       │
│    - searchProducts() → records analytics                   │
│    - invalidateProduct() → marks stale                      │
│    - refreshProduct() → reloads from API                   │
│           │                                                   │
│           ▼                                                   │
│  All 24 Pages (Orders, Inventory, Revenue, CRM, Dashboard) │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Invalidation Flow

```
Product Updated on Backend
         │
         ▼
Page calls: invalidateProduct('prod-id')
         │
         ▼
Product marked as stale in store
         │
         ▼
isProductStale('prod-id') returns true
         │
         ▼
Page calls: refreshProduct('prod-id')
         │
         ▼
API fetch + store update
         │
         ▼
isProductStale() returns false again
```

---

## 📈 Analytics Usage

```typescript
// Monitor product usage
const { recordProductAccess, productAnalytics } = require('@/services/productAnalytics')

// Get metrics
const metrics = productAnalytics.getMetrics()
console.log(`
  Total accesses: ${metrics.totalAccesses}
  Unique products: ${metrics.uniqueProducts}
  Cache hit rate: ${metrics.cacheHitRate.toFixed(2)}%
  Avg fetch time: ${metrics.averageFetchTimeMs.toFixed(2)}ms
`)

// Find top products
const topProducts = productAnalytics.getTopProducts(10)
// [{ productId: 'prod-1', accessCount: 145 }, ...]

// Find most active pages
const topPages = productAnalytics.getTopPages(10)
// [{ pageName: '/products', accessCount: 523 }, ...]

// Which pages use a product?
const pages = productAnalytics.getPagesAccessingProduct('prod-1')
// Set { '/orders', '/inventory', '/dashboard/top-products' }

// Export for external analysis
const report = productAnalytics.exportMetrics()
// JSON-serializable metrics object
```

---

## ✅ Checklist: Remaining Migrations

### Orders (3 more)
- [ ] OrderDetail.tsx - Add `useProductData`
- [ ] OrdersPendingActions.tsx - Add `useProductData`
- [ ] OrdersReturns.tsx - Add `useProductData` + analytics

### Inventory (5)
- [ ] InventorySKUStockPage.tsx
- [ ] InventoryStockMovements.tsx
- [ ] InventoryStockAdjustment.tsx
- [ ] InventoryAIForecast.tsx
- [ ] InventoryPage.tsx

### Revenue (3)
- [ ] RevenueSummaryReport.tsx
- [ ] RevenuePlatformComparison.tsx
- [ ] RevenueMLForecast.tsx

### CRM (3)
- [ ] CRMSentimentAnalysis.tsx - Replace mockProducts
- [ ] CRMReviewInbox.tsx
- [ ] CRMCustomerProfiles.tsx

### Dashboard (4)
- [ ] DashboardTopProducts.tsx
- [ ] DashboardKPIOverview.tsx
- [ ] DashboardRevenueCharts.tsx
- [ ] DashboardAlerts.tsx

### Settings (1)
- [ ] SettingsAutomation.tsx - If product-based rules

---

## 🔍 Key Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Service Layer | ✅ | Normalize from all sources |
| Store with Cache | ✅ | Map by ID + Name |
| Invalidation | ✅ | Explicit + TTL |
| Analytics | ✅ | Page-level tracking |
| Tests | ✅ | Service, Store, Hook |
| Hooks | ✅ | Main + convenience |
| App Init | ✅ | Auto-preload |
| Orders Pages | 🟡 | 1/4 done |
| Other Modules | ⏳ | Queue |

---

## 📝 Notes

1. **Performance**: First 100 products preload on app startup (~10-50ms)
2. **Analytics**: Built-in, automatic, no extra code needed
3. **Invalidation**: Products stay valid for 5 mins by default (configurable)
4. **Migration**: Straightforward - add hook import + call `getProduct()`
5. **Testing**: Run `npm run test` to validate all layers

---

## 🚀 Next Actions

1. Continue Orders module migrations (3 more pages)
2. Inventory module (5 pages)
3. Revenue module (3 pages)
4. CRM module (3 pages)
5. Dashboard fine-tuning (4 pages)
6. Monitor analytics after go-live
7. Adjust preload size if needed based on metrics
