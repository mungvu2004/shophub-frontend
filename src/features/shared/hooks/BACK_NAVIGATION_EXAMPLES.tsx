/**
 * BACK NAVIGATION IMPLEMENTATION EXAMPLES
 * 
 * Real-world examples for different scenarios
 */

// ============================================================================
// EXAMPLE 1: Dashboard → Product Detail
// ============================================================================

// ❌ OLD WAY (no back tracking)
// src/features/dashboard/components/TopProductsTable.tsx
/*
const handleProductClick = (productId: string) => {
  navigate(`/products/${productId}`)  // ❌ back will go to Products List, not Dashboard
}
*/

// ✅ NEW WAY (with back tracking)
import { useNavigate } from 'react-router-dom'
import { appendFromParam } from '@/features/shared/hooks/useBackNavigation'

function TopProductsTableExample() {
  const navigate = useNavigate()

  const handleProductClick = (productId: string) => {
    // ✅ Append source URL as 'from' param
    const targetUrl = appendFromParam(`/products/${productId}`)
    navigate(targetUrl)
    // Result: /products/123?from=/dashboard/kpi-overview
  }

  return <button onClick={() => handleProductClick('123')}>View Product</button>
}

// ============================================================================
// EXAMPLE 2: Product Detail Page with Back Button
// ============================================================================

// ❌ OLD WAY (hardcoded back logic)
/*
export function ProductDetailPage() {
  const navigate = useNavigate()
  
  const handleBack = () => {
    navigate(-1)  // ❌ always uses browser history, might not work correctly
  }
  
  return (
    <button onClick={handleBack}>Back</button>
  )
}
*/

// ✅ NEW WAY (smart back button)
import { BackButton, BackIconButton } from '@/features/shared/components/BackButton'

export function ProductDetailPageExample() {
  // Option 1: Full button with label (recommended for pages)
  return (
    <div>
      <BackButton 
        fallbackUrl="/products" 
        label="Quay lại danh sách" 
      />
      {/* Product detail content */}
    </div>
  )

  // Option 2: Icon button only (for headers)
  // return (
  //   <header className="flex items-center gap-4">
  //     <BackIconButton fallbackUrl="/products" />
  //     <h1>Chi tiết sản phẩm</h1>
  //   </header>
  // )

  // Option 3: Using hook directly
  // const handleBack = useBackNavigation('/products')
  // return (
  //   <button onClick={handleBack}>
  //     <ArrowLeft /> Quay lại
  //   </button>
  // )
}

// ============================================================================
// EXAMPLE 3: Orders List → Order Detail → Back
// ============================================================================

// In OrdersListPage.tsx - when navigating to order detail
import { useNavigate } from 'react-router-dom'
import { appendFromParam } from '@/features/shared/hooks/useBackNavigation'

export function OrdersListPageExample() {
  const navigate = useNavigate()

  const handleOrderClick = (orderId: string) => {
    // ✅ Preserve current page with filters
    const targetUrl = appendFromParam(`/orders/${orderId}`)
    navigate(targetUrl)
    // Result: /orders/ORD-001?from=/orders?status=pending
  }

  return <div onClick={() => handleOrderClick('ORD-001')}>View Order</div>
}

// In OrderDetailPage.tsx
import { BackButton } from '@/features/shared/components/BackButton'

export function OrderDetailPageExample() {
  return (
    <div>
      <BackButton 
        fallbackUrl="/orders" 
        label="Quay lại danh sách đơn hàng" 
      />
      {/* Order detail content */}
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Nested Navigation - Products Comparison
// ============================================================================

// In ProductsListPage.tsx - navigate to comparison view
export function ProductsListPageExample() {
  const navigate = useNavigate()

  const handleCompare = (productIds: string[]) => {
    const url = appendFromParam(`/products/compare?ids=${productIds.join(',')}`)
    navigate(url)
    // Result: /products/compare?ids=1,2,3&from=/products?search=nike
  }

  return <button onClick={() => handleCompare(['1', '2', '3'])}>Compare</button>
}

// In ProductsComparisonPage.tsx
import { BackButton } from '@/features/shared/components/BackButton'
import { useBackNavigation } from '@/features/shared/hooks/useBackNavigation'

export function ProductsComparisonPageExample() {
  // Method 1: Using component
  return (
    <div>
      <BackButton fallbackUrl="/products" label="Quay lại sản phẩm" />
    </div>
  )

  // Method 2: Using hook
  // const handleBack = useBackNavigation('/products')
  // return <button onClick={handleBack}>Quay lại</button>
}

// ============================================================================
// EXAMPLE 5: Multiple Source Pages → Same Detail Page
// ============================================================================

// Scenario: User can reach /products/123 from:
// 1. Dashboard (should back to Dashboard)
// 2. Search Results (should back to Search)
// 3. Direct URL (fallback to Products List)

// In ProductDetailPage.tsx - single component handles all cases
export function ProductDetailPageMultiSourceExample() {
  return (
    <div>
      {/* Smart back button - no hardcoding needed! */}
      <BackButton 
        fallbackUrl="/products"  // fallback only if ?from doesn't exist
        label="Quay lại"
      />

      {/* ALL 3 cases handled automatically:
        1. /products/123?from=/dashboard → back to /dashboard ✅
        2. /products/123?from=/search?q=nike → back to /search?q=nike ✅
        3. /products/123 (no from param) → back to /products (fallback) ✅
      */}
    </div>
  )
}

// ============================================================================
// EXAMPLE 6: Dynamic Back Label
// ============================================================================

// If you need dynamic back label based on source:
import { useSearchParams } from 'react-router-dom'
import { useBackNavigation } from '@/features/shared/hooks/useBackNavigation'

export function ProductDetailPageDynamicLabelExample() {
  const [searchParams] = useSearchParams()
  const handleBack = useBackNavigation()

  // Get source to customize label
  const fromUrl = searchParams.get('from')
  let backLabel = 'Quay lại'

  if (fromUrl?.includes('dashboard')) backLabel = 'Quay lại Dashboard'
  else if (fromUrl?.includes('search')) backLabel = 'Quay lại tìm kiếm'
  else if (fromUrl?.includes('orders')) backLabel = 'Quay lại đơn hàng'

  return (
    <button onClick={handleBack}>
      {backLabel}
    </button>
  )
}

// ============================================================================
// MIGRATION CHECKLIST
// ============================================================================

/*
✅ CHECKLIST for implementing smart back navigation:

1. Source Pages (where you navigate FROM):
   - [ ] Import appendFromParam
   - [ ] Wrap navigate calls: navigate(appendFromParam(targetUrl))
   
2. Detail Pages (where you navigate TO):
   - [ ] Option A (recommended): Use <BackButton /> component
   - [ ] Option B: Use useBackNavigation() hook
   - [ ] Option C: Use <BackIconButton /> for icon-only
   
3. Testing:
   - [ ] Test navigation from Dashboard → view detail → back → Dashboard
   - [ ] Test direct URL access → detail → back → fallback
   - [ ] Test multiple entry points → detail → back → correct source
   - [ ] Test query params preserved → detail → back → params intact

4. Common Pages to Update:
   - [ ] DashboardKPIOverviewPage → TopProductsTable
   - [ ] ProductsListPage → ProductDetailPage
   - [ ] OrdersAllPage → OrderDetailPage
   - [ ] CRMReviewInboxPage → ReviewDetailPage
   - [ ] And any other detail pages...
*/

// ============================================================================
// TROUBLESHOOTING
// ============================================================================

/*
❌ Problem: Back button doesn't work
✅ Solution: 
  - Check if ?from param is in URL: /products/123?from=/dashboard
  - If missing, make sure you used appendFromParam() when navigating
  - Verify fallbackUrl is correct

❌ Problem: Back goes to wrong page
✅ Solution:
  - Check the ?from param value
  - Make sure query params are preserved correctly
  - Example: /products?search=nike → from=/products?search=nike

❌ Problem: Back button is slow
✅ Solution:
  - This is normal, it's parsing URL params
  - useBackNavigation is memoized, shouldn't cause rerenders
  - Use <BackIconButton /> if you want minimal component

❌ Problem: Multiple back buttons on same page
✅ Solution:
  - All can use same hook, they'll share the same 'from' param
  - Each one depends on its own event handler
  - This is intentional - all should go to same source

*/
