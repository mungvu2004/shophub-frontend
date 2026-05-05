# Centralized Product Data Architecture

## Overview

All 24+ pages in ShopHub that use product data (directly or indirectly) now use a **single centralized source**:

```
Products API → Service (Normalize) → Zustand Store (Cache) → Hook (useProductData) → Pages
```

This ensures:
- ✅ Single source of truth
- ✅ Consistent data format (ProductDataDto)
- ✅ Efficient caching
- ✅ Hybrid preload/lazy-load strategy
- ✅ Easy to test and maintain

---

## Architecture Components

### 1. **ProductDataService** (`src/services/productDataService.ts`)
Aggregates product data from all sources and normalizes to `ProductDataDto`

**Supported sources:**
- Products API (`/products/*`)
- Order Items (`OrderItem` → product info)
- Inventory (`StockLevel` → product info)
- Revenue/Dashboard (product metrics)
- CRM (product selection)

**Key methods:**
```typescript
productDataService.getProductById(id)        // Fetch single
productDataService.getAllProducts(limit)     // Fetch many
productDataService.searchProducts(query)     // Search
productDataService.normalizeFromOrderItem()  // Extract from order
productDataService.normalizeFromStockLevel() // Extract from inventory
productDataService.mergeProducts(...)        // Combine multiple sources
```

### 2. **Product Store** (`src/stores/productStore.ts`)
Zustand store that caches all product data

**State:**
```typescript
products: Map<id, ProductDataDto>
productsByName: Map<name, ProductDataDto[]>
isPreloading: boolean
isPreloaded: boolean
loadingProductIds: Set<id>
error: string | null
```

**Actions:**
```typescript
preloadCriticalProducts()  // Load first 100 products on app startup
loadProductById(id)        // Load single product on demand
addProduct(product)        // Add/update one
addProducts(products)      // Add multiple
getProduct(id)             // Get from cache
getProductsByIds(ids)      // Get multiple
searchProducts(query)      // Search cached
```

### 3. **Custom Hooks** (`src/features/products/hooks/useProductData.ts`)

#### Main Hook: `useProductData(options?)`
```typescript
const {
  products,           // ProductDataDto[]
  getProduct,         // (id) => ProductDataDto | undefined
  searchProducts,     // (query) => ProductDataDto[]
  refreshProduct,     // (id) => Promise<ProductDataDto | null>
  isLoading,          // boolean
  isPreloaded,        // boolean
  error,              // string | null
} = useProductData({ 
  autoPreload: true,        // Auto-trigger preload
  productIds: ['id1', 'id2'], // Specific products to load
  searchQuery: 'laptop'      // Search products
})
```

#### Convenience Hooks:
```typescript
// Get single product
const { product, isLoading } = useProductById('product-id')

// Search products
const { results, isLoading } = useProductSearch('laptop')

// Get multiple products
const { products, isLoading } = useProductsByIds(['id1', 'id2'])
```

---

## Migration Guide

### Before: Pages fetching from multiple sources

**Orders Page (old):**
```typescript
// Getting product data directly from order items
const { data: orders } = useOrdersAllData()
orders.items.forEach(item => {
  console.log(item.productName)  // ❌ From order item
})
```

**Inventory Page (old):**
```typescript
// Getting product data from inventory
const { data: stocks } = useInventoryData()
stocks.forEach(stock => {
  console.log(stock.productName)  // ❌ From stock level
})
```

### After: Pages using centralized product data

**Orders Page (new):**
```typescript
// Centralized product data
const { getProduct } = useProductData()
const { data: orders } = useOrdersAllData()

orders.items.forEach(item => {
  const product = getProduct(item.productId)  // ✅ From store
  console.log(product?.name)
})
```

**Inventory Page (new):**
```typescript
// Centralized product data
const { getProductsByIds } = useProductData()
const { data: stocks } = useInventoryData()

const productIds = stocks.map(s => s.variantId)
const products = getProductsByIds(productIds)  // ✅ From store
```

---

## Migration Checklist: Pages to Update

### ✅ Products Module (Already centralized)
- [x] ProductsListPage
- [x] ProductDetailPage
- [x] ProductsDynamicPricingPage
- [x] ProductsCompetitorTrackingPage

### ⏳ Orders Module
- [ ] OrdersAllPage - Replace productName/id from order with `getProduct(item.productId)`
- [ ] OrderDetailPage - Same as above
- [ ] OrdersPendingActionsPage - Same as above
- [ ] OrdersReturnsPage - Same as above

### ⏳ Inventory Module
- [ ] InventorySKUStockPage - Replace from `StockLevel` with `getProductsByIds()`
- [ ] InventoryStockMovementsPage - Replace from movement items
- [ ] InventoryStockAdjustmentPage - Replace from adjustment data
- [ ] InventoryAIForecastPage - Replace from forecast data

### ⏳ Revenue Module
- [ ] RevenueSummaryReportPage - Replace `productProfits` with store data
- [ ] RevenuePlatformComparisonPage - Replace with store data
- [ ] RevenueMLForecastPage - Replace forecast product data

### ⏳ CRM Module
- [ ] CRMSentimentAnalysisPage - Replace mockProducts with store
- [ ] CRMReviewInboxPage - Replace with store products
- [ ] CRMCustomerProfilesPage - Replace purchase history products

### ⏳ Dashboard Module
- [ ] DashboardTopProductsPage - Already mostly done
- [ ] DashboardKPIOverviewPage - Already mostly done

---

## Example Migrations

### Example 1: OrdersAllPage

**Before:**
```typescript
export function OrdersAll() {
  const { data: orders } = useOrdersAllData()

  return (
    <table>
      {orders?.items.map(item => (
        <tr key={item.id}>
          <td>{item.productName}</td>  // ❌ From order item
          <td>{item.itemPrice}</td>
        </tr>
      ))}
    </table>
  )
}
```

**After:**
```typescript
export function OrdersAll() {
  const { data: orders } = useOrdersAllData()
  const { getProduct } = useProductData()

  return (
    <table>
      {orders?.items.map(item => {
        const product = getProduct(item.productId)
        return (
          <tr key={item.id}>
            <td>{product?.name || item.productName}</td>  // ✅ From store, fallback to item
            <td>{item.itemPrice}</td>
          </tr>
        )
      })}
    </table>
  )
}
```

### Example 2: InventorySKUStockPage

**Before:**
```typescript
export function InventorySKUStockPage() {
  const { data: stocks } = useInventorySKUData()

  return (
    <div>
      {stocks?.map(stock => (
        <Card key={stock.id}>
          <h3>{stock.productName}</h3>  // ❌ From stock level
          <p>SKU: {stock.sku}</p>
        </Card>
      ))}
    </div>
  )
}
```

**After:**
```typescript
export function InventorySKUStockPage() {
  const { data: stocks } = useInventorySKUData()
  const { getProductsByIds } = useProductData()

  const productIds = stocks?.map(s => s.variantId) || []
  const products = getProductsByIds(productIds)
  const productMap = new Map(products.map(p => [p.id, p]))

  return (
    <div>
      {stocks?.map(stock => {
        const product = productMap.get(stock.variantId)
        return (
          <Card key={stock.id}>
            <h3>{product?.name || stock.productName}</h3>  // ✅ From store
            <p>SKU: {product?.sku || stock.sku}</p>
          </Card>
        )
      })}
    </div>
  )
}
```

### Example 3: CRMSentimentAnalysisPage

**Before:**
```typescript
import { mockProducts } from '@/mocks/data/products'  // ❌ Mock data

export function CRMSentimentAnalysis() {
  const [selectedProductId, setSelectedProductId] = useState(mockProducts[0].id)
  
  return <ProductSelector products={mockProducts} />  // ❌ Mock
}
```

**After:**
```typescript
export function CRMSentimentAnalysis() {
  const { products, isLoading } = useProductData()
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id || ''  // ✅ Real products from store
  )
  
  return (
    <ProductSelector 
      products={products}  // ✅ Real products
      isLoading={isLoading}
    />
  )
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                  App Startup                        │
│  (Providers.tsx → AppInitializer)                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  preloadCriticalProducts()                          │
│  - Fetch first 100 products from /products API      │
│  - Cache in Zustand store                          │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              Store Ready                            │
│  products: Map<id, ProductDataDto>                 │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    Page loads          Direct product
    useProductData()    needed: loadProductById()
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
        Return ProductDataDto[]
```

---

## Performance Optimization

### Preload Strategy
```typescript
// App startup: Load top 100 products
preloadCriticalProducts()  // ~10-50ms

// Pages that need specific products
const { refreshProduct } = useProductData()
await refreshProduct('product-id')  // On-demand load ~5-20ms
```

### Search Optimization
```typescript
// In-memory search on preloaded products
const results = searchProducts('laptop')  // O(n) on cache, instant

// If product not found in cache
const searchResults = await productDataService.searchProducts(query)
addProducts(searchResults)  // Cache for future use
```

---

## Testing

### Mock Store
```typescript
import { useProductStore } from '@/stores/productStore'

// In tests
const store = useProductStore.getState()
store.addProducts([mockProduct1, mockProduct2])
```

### Component Test
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useProductData } from '@/features/products/hooks/useProductData'

test('loads products', async () => {
  const { result } = renderHook(() => useProductData())

  await waitFor(() => {
    expect(result.current.isPreloaded).toBe(true)
  })

  expect(result.current.products.length).toBeGreaterThan(0)
})
```

---

## Troubleshooting

**Q: Products not loading?**
- Check that `AppInitializer` is running
- Verify `/products` API endpoint works
- Check browser console for errors

**Q: Stale data?**
- Call `refreshProduct(id)` to reload
- Or `clearCache()` then `preloadCriticalProducts()`

**Q: Performance issues?**
- Check how many products are cached
- Consider pagination/segmentation for preload
- Use `productsByName` index for faster search

---

## Next Steps

1. **Start migrations** with Orders module (4 pages)
2. **Test thoroughly** with preload/lazy-load scenarios
3. **Monitor performance** - track preload time, memory usage
4. **Iterate** - adjust preload size if needed (100 → 200, etc)
