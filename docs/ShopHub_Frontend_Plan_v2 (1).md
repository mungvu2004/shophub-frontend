# ShopHub Frontend — Kế Hoạch Phát Triển React

**Dự án:** ShopHub — Hệ thống quản lý bán hàng đa sàn  
**Tech Stack:** React 18 · Vite · TypeScript · Tailwind CSS · Shadcn/UI  
**State Management:** Zustand · TanStack Query (React Query v5)  
**HTTP Client:** Axios  
**Routing:** React Router DOM v6  
**Charts:** Recharts  
**Backend:** .NET 8 RESTful API + SignalR  
**Phiên bản tài liệu:** 1.0  

---

## Mục lục

**Phần I — Kiến trúc & Setup**
1. [Cấu trúc thư mục dự án](#1-cấu-trúc-thư-mục-dự-án)
2. [Luồng dữ liệu tổng thể](#2-luồng-dữ-liệu-tổng-thể)
3. [API Client — Axios + JWT Interceptor](#3-api-client--axios--jwt-interceptor)
4. [TypeScript Interfaces — chuẩn hóa kiểu dữ liệu](#4-typescript-interfaces--chuẩn-hóa-kiểu-dữ-liệu)
5. [Zustand Global State Store](#5-zustand-global-state-store)
6. [TanStack Query — chiến lược caching & fetching](#6-tanstack-query--chiến-lược-caching--fetching)

**Phần II — Lộ trình phát triển**
7. [Roadmap 6 Sprints](#7-roadmap-6-sprints)

**Phần III — Chi tiết Task từng Sprint**
8. [Sprint 1 — Project Setup & Authentication](#8-sprint-1--project-setup--authentication)
9. [Sprint 2 — Layout, Routing & Platform Connection](#9-sprint-2--layout-routing--platform-connection)
10. [Sprint 3 — Module Sản phẩm & Kho hàng](#10-sprint-3--module-sản-phẩm--kho-hàng)
11. [Sprint 4 — Module Đơn hàng](#11-sprint-4--module-đơn-hàng)
12. [Sprint 5 — Module AI & Analytics Dashboard](#12-sprint-5--module-ai--analytics-dashboard)
13. [Sprint 6 — Tối ưu, Testing & Đóng gói](#13-sprint-6--tối-ưu-testing--đóng-gói)

**Phần IV — Đặc tả màn hình**
14. [Dashboard Tổng quan](#14-dashboard-tổng-quan)
15. [Trang Quản lý Sản phẩm](#15-trang-quản-lý-sản-phẩm)
16. [Trang Quản lý Đơn hàng](#16-trang-quản-lý-đơn-hàng)
17. [Trang Quản lý Kho hàng](#17-trang-quản-lý-kho-hàng)
18. [Trang Kết nối Sàn (OAuth2 Flow)](#18-trang-kết-nối-sàn-oauth2-flow)
19. [Trang AI Chat & Dự báo](#19-trang-ai-chat--dự-báo)

**Phần V — Vận hành**
20. [Phân chia vai trò & trách nhiệm](#20-phân-chia-vai-trò--trách-nhiệm)
21. [Rủi ro & biện pháp giảm thiểu](#21-rủi-ro--biện-pháp-giảm-thiểu)

---

# PHẦN I — KIẾN TRÚC & SETUP

---

## 1. Cấu trúc thư mục dự án

Áp dụng **Feature-based architecture** — mỗi tính năng là một thư mục độc lập, chứa component, hook, service và type riêng của nó. Tránh cấu trúc theo loại file (components/, pages/) vì khó scale khi dự án lớn.

```
shophub-frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── app/                          # Khởi tạo app, providers toàn cục
│   │   ├── App.tsx                   # Root component, setup providers
│   │   ├── router.tsx                # React Router config, route definitions
│   │   └── providers.tsx             # QueryClientProvider, ThemeProvider, v.v.
│   │
│   ├── features/                     # Tính năng theo domain
│   │   ├── auth/
│   │   │   ├── components/           # LoginForm, ProtectedRoute, v.v.
│   │   │   ├── hooks/                # useLogin, useLogout, useCurrentUser
│   │   │   ├── services/             # authService.ts — gọi /auth/* API
│   │   │   ├── stores/               # authStore.ts — Zustand slice
│   │   │   └── types/                # AuthTypes.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/           # RevenueChart, KpiCard, PlatformSummary
│   │   │   ├── hooks/                # useDashboardStats
│   │   │   └── services/             # dashboardService.ts
│   │   │
│   │   ├── products/
│   │   │   ├── components/           # ProductTable, ProductForm, ProductFilters
│   │   │   ├── hooks/                # useProducts, useProductMutation
│   │   │   ├── services/             # productService.ts — gọi /products/* API
│   │   │   └── types/                # ProductTypes.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── components/           # OrderTable, OrderDetail, StatusBadge
│   │   │   ├── hooks/                # useOrders, useOrderDetail, useOrderRealtime
│   │   │   ├── services/             # orderService.ts
│   │   │   └── types/                # OrderTypes.ts
│   │   │
│   │   ├── inventory/
│   │   │   ├── components/           # StockTable, StockMovementLog, AlertBanner
│   │   │   ├── hooks/                # useInventory, useStockMovements
│   │   │   ├── services/             # inventoryService.ts
│   │   │   └── types/                # InventoryTypes.ts
│   │   │
│   │   ├── platforms/
│   │   │   ├── components/           # PlatformCard, ConnectButton, OAuthCallback
│   │   │   ├── hooks/                # usePlatformConnections
│   │   │   ├── services/             # platformService.ts
│   │   │   └── types/                # PlatformTypes.ts
│   │   │
│   │   └── ai/
│   │       ├── components/           # ChatWindow, MessageBubble, ForecastChart
│   │       ├── hooks/                # useChatSession, useSalesForecast
│   │       ├── services/             # aiService.ts — gọi /ai/* API
│   │       └── types/                # AiTypes.ts
│   │
│   ├── components/                   # Shared UI components (dùng lại nhiều nơi)
│   │   ├── layout/
│   │   │   ├── AppShell.tsx          # Wrapper: Sidebar + Navbar + Outlet
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   └── Navbar.tsx            # Top navbar: avatar, notifications, breadcrumb
│   │   ├── ui/                       # Re-export Shadcn/UI components + custom
│   │   │   ├── DataTable.tsx         # Generic table với sort, filter, pagination
│   │   │   ├── PlatformBadge.tsx     # Badge hiển thị tên sàn (Lazada/Shopee)
│   │   │   ├── StatusBadge.tsx       # Badge trạng thái đơn hàng
│   │   │   ├── PageHeader.tsx        # Tiêu đề trang + breadcrumb + action buttons
│   │   │   ├── ErrorBoundary.tsx     # React Error Boundary
│   │   │   └── LoadingSkeleton.tsx   # Skeleton loading placeholder
│   │   └── feedback/
│   │       ├── EmptyState.tsx        # Trạng thái rỗng không có dữ liệu
│   │       └── ApiErrorFallback.tsx  # Hiển thị lỗi API
│   │
│   ├── hooks/                        # Custom hooks dùng chung
│   │   ├── useDebounce.ts            # Debounce search input
│   │   ├── usePagination.ts          # Cursor-based pagination logic
│   │   ├── useSignalR.ts             # Kết nối SignalR hub, lắng nghe order events
│   │   └── useToast.ts               # Wrapper Shadcn toast
│   │
│   ├── services/                     # Core services
│   │   ├── apiClient.ts              # Axios instance + JWT interceptor (xem Mục 3)
│   │   └── signalRClient.ts          # SignalR connection setup
│   │
│   ├── stores/                       # Zustand stores dùng chung
│   │   ├── authStore.ts              # Token, user info, isAuthenticated
│   │   └── uiStore.ts                # Sidebar open/close, theme, notifications
│   │
│   ├── types/                        # TypeScript interfaces dùng chung
│   │   ├── api.types.ts              # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   │   ├── auth.types.ts             # LoginRequest, TokenResponse, User
│   │   ├── product.types.ts          # Product, ProductVariant, PlatformSkuMapping
│   │   ├── order.types.ts            # Order, OrderItem, OrderStatus, OrderStatusHistory
│   │   ├── inventory.types.ts        # StockLevel, StockMovement, InventoryAlert
│   │   ├── platform.types.ts         # PlatformConnection, Platform
│   │   └── ai.types.ts               # ChatMessage, ForecastResult, InventoryAlert
│   │
│   ├── lib/                          # Utilities & helpers
│   │   ├── utils.ts                  # cn() tailwind merge, formatCurrency, formatDate
│   │   ├── constants.ts              # ORDER_STATUS_MAP, PLATFORM_COLORS, ROUTES
│   │   └── validators.ts             # Zod schemas cho form validation
│   │
│   └── main.tsx                      # Entry point
│
├── .env.local                        # VITE_API_BASE_URL, VITE_SIGNALR_URL
├── .env.production
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── Dockerfile
└── package.json
```

### Nguyên tắc tổ chức

| Nguyên tắc | Mô tả |
|-----------|-------|
| Feature-first | Mọi thứ liên quan đến `orders` nằm trong `features/orders/` — component, hook, service, type đều ở cùng chỗ |
| Shared có giới hạn | `components/`, `hooks/`, `stores/` ở root chỉ chứa thứ được dùng từ ≥ 2 feature khác nhau |
| Không import ngược | Feature không được import từ feature khác. Nếu cần chia sẻ → đưa lên `components/` hoặc `types/` |
| Index exports | Mỗi thư mục có `index.ts` re-export để import path gọn hơn |

---

## 2. Luồng dữ liệu tổng thể

```
[User Action trên UI]
         ↓
[React Component]
   ↓ gọi custom hook (useOrders, useProducts...)
[TanStack Query / Mutation]
   ↓ nếu cache miss → gọi service function
[Feature Service (orderService.ts)]
   ↓ gọi apiClient.get/post/put/delete
[Axios apiClient (services/apiClient.ts)]
   ↓ Interceptor tự gắn Authorization: Bearer {token}
   ↓ HTTPS request
[.NET 8 Backend API]
   ↓ JSON response
[Axios Response Interceptor]
   ↓ Nếu 401 → tự động refresh token → retry request
   ↓ Nếu lỗi khác → throw ApiError chuẩn hóa
[TanStack Query]
   ↓ Cache kết quả (staleTime, gcTime)
   ↓ Cập nhật React state
[Component re-render]
         ↓
[UI cập nhật]

--- Riêng cho Real-time ---
[.NET SignalR Hub]
   ↓ push event (order status changed, low stock alert)
[useSignalR hook]
   ↓ TanStack Query invalidateQueries({ queryKey: ['orders'] })  // v5 syntax
[Component re-render]
```

---

## 3. API Client — Axios + JWT Interceptor

### Cấu hình `apiClient.ts`

File `src/services/apiClient.ts` là trung tâm của mọi HTTP call. Không component hay hook nào được gọi `axios` trực tiếp — tất cả phải đi qua `apiClient`.

**Các chức năng:**

| Chức năng | Mô tả |
|-----------|-------|
| Base URL | Đọc từ `import.meta.env.VITE_API_BASE_URL` |
| Request interceptor | Tự động gắn `Authorization: Bearer {accessToken}` vào mỗi request |
| Response interceptor — 401 | Khi nhận 401, gọi `POST /auth/refresh` để lấy token mới, lưu vào Zustand store, retry request gốc |
| Response interceptor — lỗi khác | Parse error response từ .NET `ProblemDetails` (RFC 7807), throw `ApiError` chuẩn hóa |
| Request queue | Nếu có nhiều request đồng thời gặp 401, chỉ thực hiện 1 lần refresh, các request khác chờ và retry sau |
| Timeout | Default 30 giây. AI endpoints timeout 60 giây (cấu hình riêng) |

**Cấu trúc `ApiError`:**

```typescript
interface ApiError {
  status: number;           // HTTP status code
  title: string;            // "Validation Error", "Not Found", v.v.
  detail: string;           // Mô tả lỗi cụ thể
  errors?: Record<string, string[]>; // Field-level validation errors
  traceId?: string;         // CorrelationId từ backend để debug
}
```

**Lưu ý quan trọng về token storage:** Không lưu `accessToken` vào `localStorage` (dễ bị XSS). Lưu vào Zustand in-memory store. Refresh token có thể lưu trong `httpOnly cookie` (backend set) hoặc `sessionStorage` tùy chính sách bảo mật của team.

---

## 4. TypeScript Interfaces — chuẩn hóa kiểu dữ liệu

Interfaces được định nghĩa dựa trực tiếp trên tài liệu Backend API. Quy ước: tên field là `camelCase` (Frontend) map với `PascalCase` (Backend .NET) — Axios tự xử lý qua transform nếu cần.

### 4.1 API Response Wrappers

```typescript
// src/types/api.types.ts

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;      // Cursor-based pagination
  hasMore: boolean;
  totalCount?: number;
}

interface ApiError {
  status: number;
  title: string;
  detail: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}
```

### 4.2 Auth Types

```typescript
// src/types/auth.types.ts

interface LoginRequest {
  email: string;
  password: string;
}

interface TokenResponse {
  accessToken: string;
  expiresIn: number;        // Seconds — dùng để tính AccessTokenExpiresAt
  tokenType: string;        // "Bearer"
  // Lưu ý: refreshToken KHÔNG trả về trong body JSON.
  // Backend set refreshToken trong httpOnly Cookie để chống XSS.
  // Frontend không trực tiếp đọc refreshToken — chỉ gọi POST /auth/refresh
  // và trình duyệt tự gửi cookie kèm theo.
}

interface User {
  id: string;               // UNIQUEIDENTIFIER — từ Sellers.Id
  email: string;
  fullName?: string;        // Sellers.FullName — nullable
  phone?: string;           // Sellers.Phone — nullable
  subscriptionTier: 'Free' | 'Pro' | 'Enterprise';  // Sellers.SubscriptionTier
  roles: string[];          // ASP.NET Identity roles: "Seller" | "Admin" | "StaffUser"
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;     // nullable
}
```

### 4.3 Platform & Connection Types

```typescript
// src/types/platform.types.ts

type PlatformCode = 'lazada' | 'shopee' | 'tiktok_shop';

interface Platform {
  id: number;
  code: PlatformCode;
  name: string;
  region: string;           // "VN", "SG"
  isActive: boolean;
}

interface PlatformConnection {
  id: string;               // PlatformConnections.Id — UNIQUEIDENTIFIER
  sellerId: string;
  platformId: number;
  platform: Platform;
  appKey: string;           // PlatformConnections.AppKey
  externalShopId: string;   // PlatformConnections.ExternalShopId
  externalShopName?: string;
  externalSellerId?: string;// PlatformConnections.ExternalSellerId — per country
  country?: string;         // "VN", "SG"
  status: 'Active' | 'TokenExpired' | 'RefreshFailed' | 'Disconnected';
  connectedAt: string;      // ISO 8601
  lastTokenRefreshedAt?: string;
  lastSyncAt?: string;
  isActive: boolean;
}
```

### 4.4 Product Types

```typescript
// src/types/product.types.ts

type ProductStatus = 'Active' | 'Inactive' | 'Deleted';

interface Product {
  id: string;               // Products.Id — UNIQUEIDENTIFIER
  sellerId: string;
  name: string;
  description?: string;     // HTML content
  shortDescription?: string;// Products.ShortDescription
  brand?: string;
  model?: string;
  warrantyInfo?: string;    // Products.WarrantyInfo
  status: ProductStatus;
  source: 'manual' | 'platform_sync';
  isDeleted: boolean;       // soft delete flag
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

interface ProductVariant {
  id: string;               // ProductVariants.Id — UNIQUEIDENTIFIER
  productId: string;
  internalSku: string;      // SKU nội bộ ShopHub
  name?: string;            // VD: "Đỏ / XL"
  attributesJson?: Record<string, string>;  // {"color_family":"Red","size":"XL"}
  basePrice: number;
  salePrice?: number;
  weight?: number;          // kg
  length?: number;          // cm
  width?: number;           // cm
  height?: number;          // cm
  packageContent?: string;  // ProductVariants.PackageContent
  mainImageUrl?: string;
  imagesJson?: string[];    // ProductVariants.ImagesJson — array URLs
  status: 'Active' | 'Inactive';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  listings: PlatformSkuMapping[];
}

interface PlatformSkuMapping {
  id: number;
  variantId: string;
  connectionId: string;
  platform: PlatformCode;
  externalProductId: string;
  externalSkuId: string;
  externalShopSku?: string;
  listingStatus: 'active' | 'inactive' | 'deleted';
  currentListedPrice?: number;
  currentSpecialPrice?: number;
  lastSyncedAt: string;
}
```

### 4.5 Order Types

```typescript
// src/types/order.types.ts

type OrderStatus =
  | 'Pending' | 'PendingPayment' | 'Confirmed' | 'Packed'
  | 'ReadyToShip' | 'Shipped' | 'Delivered' | 'FailedDelivery'
  | 'Cancelled' | 'Returned' | 'Refunded' | 'Lost';

interface Order {
  id: string;               // Orders.Id — UNIQUEIDENTIFIER
  sellerId: string;
  connectionId: string;
  platform: PlatformCode;   // Orders.Platform — label, not FK
  externalOrderId: string;  // Lazada: order_id / Shopee: ordersn
  externalOrderNumber?: string;
  paymentMethod?: 'COD' | 'Online' | 'Wallet';
  totalAmount: number;
  currency: string;         // "VND", "SGD", "THB"
  status: OrderStatus;
  giftOption: boolean;
  giftMessage?: string;
  voucherCode?: string;
  buyerFirstName?: string;
  buyerLastName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  shippingAddress?: string; // Đã nối: address + ward + region + city
  shippingCity?: string;
  shippingPostCode?: string;
  shippingCountry?: string;
  source: 'platform_sync' | 'platform_webhook' | 'manual';
  isDeleted: boolean;
  createdAt_platform: string;   // Orders.CreatedAt_Platform — thời gian tạo trên sàn
  updatedAt_platform: string;   // Orders.UpdatedAt_Platform — cursor incremental sync
  createdAt: string;            // Thời gian ShopHub nhận
  updatedAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;               // OrderItems.Id — UNIQUEIDENTIFIER
  orderId: string;
  variantId?: string;       // NULL nếu chưa map được ExternalSkuRef
  externalOrderItemId: string; // Lazada: order_item_id / Shopee: order_item_id
  externalSkuRef?: string;  // Lazada: shop_sku / Shopee: model_id
  purchaseOrderId?: string; // OrderItems.PurchaseOrderId — Lazada: purchase_order_id
  purchaseOrderNumber?: string; // Lazada: purchase_order_number
  packageId?: string;       // OrderItems.PackageId
  productName: string;      // Snapshot tên tại thời điểm đặt
  variantAttributes?: string; // Snapshot: "Đỏ / XL"
  qty: number;              // Lazada: luôn = 1 / Shopee: có thể > 1
  itemPrice: number;        // Giá niêm yết
  paidPrice: number;        // Giá thực tế buyer trả
  voucherAmount?: number;
  platformDiscount?: number; // Lazada: wallet_credits / Shopee: platform_discount
  shippingFeeOriginal?: number;
  shippingFeeDiscount?: number; // Tổng giảm phí ship (platform + seller)
  taxAmount?: number;       // OrderItems.TaxAmount
  currency?: string;
  status: OrderStatus;
  trackingCode?: string;
  shipmentProvider?: string;
  promisedShippingTime?: string; // ISO 8601
  isFulfilledByPlatform: boolean; // Lazada: is_fbl / Shopee: is_fulfilled_by_shopee
  isDigital: boolean;       // Default false
  returnStatus?: string;    // OrderItems.ReturnStatus
  cancelReason?: string;    // OrderItems.CancelReason
  extraAttributesJson?: Record<string, unknown>; // Field platform-specific không có cột riêng
}

interface OrderStatusHistory {
  id: number;               // OrderStatusHistory.Id — BIGINT, immutable
  orderId: string;
  orderItemId?: string;     // NULL nếu status ở level Order
  oldStatus?: OrderStatus;  // NULL = record đầu tiên
  newStatus: OrderStatus;
  platformStatus?: string;  // Giá trị gốc từ sàn trước khi chuẩn hóa (VD: "ready_to_ship")
  source: 'platform_webhook' | 'platform_sync' | 'reconciliation' | 'manual';
  webhookInboxId?: number;  // OrderStatusHistory.WebhookInboxId — FK nếu từ webhook
  externalRequestId?: string; // LazopResponse.RequestId — để trace với Lazada Support
  note?: string;
  changedAt: string;        // ISO 8601
}

// Status color mapping dùng trong StatusBadge component
const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  Pending:        { label: 'Chờ xử lý',    color: 'yellow'  },
  PendingPayment: { label: 'Chờ thanh toán', color: 'orange' },
  Confirmed:      { label: 'Đã xác nhận',  color: 'blue'    },
  Packed:         { label: 'Đã đóng gói',  color: 'blue'    },
  ReadyToShip:    { label: 'Sẵn giao',     color: 'indigo'  },
  Shipped:        { label: 'Đang giao',    color: 'purple'  },
  Delivered:      { label: 'Đã giao',      color: 'green'   },
  FailedDelivery: { label: 'Giao thất bại', color: 'red'    },
  Cancelled:      { label: 'Đã hủy',       color: 'gray'    },
  Returned:       { label: 'Hoàn trả',     color: 'orange'  },
  Refunded:       { label: 'Hoàn tiền',    color: 'teal'    },
  Lost:           { label: 'Thất lạc',     color: 'red'     },
};
```

### 4.6 Inventory Types

```typescript
// src/types/inventory.types.ts

interface StockLevel {
  id: string;
  variantId: string;
  warehouseId: string;
  warehouseName: string;
  physicalQty: number;
  reservedQty: number;
  availableQty: number;       // Computed: physicalQty - reservedQty
  minThreshold: number;
  maxThreshold?: number;
  updatedAt: string;
}

type MovementType =
  | 'ORDER_RESERVE' | 'ORDER_RELEASE' | 'ORDER_FULFILL'
  | 'RETURN_RECEIVED' | 'MANUAL_ADJUSTMENT'
  | 'IMPORT' | 'DAMAGE_LOSS' | 'TRANSFER_OUT' | 'TRANSFER_IN';

interface StockMovement {
  id: number;
  variantId: string;
  warehouseId: string;
  movementType: MovementType;
  delta: number;
  qtyBefore: number;
  qtyAfter: number;
  reason?: string;
  note?: string;
  createdAt: string;
  createdBy: string;
}

interface InventoryAlert {
  id: string;               // InventoryAlerts.Id — UNIQUEIDENTIFIER
  sellerId: string;
  variantId: string;
  warehouseId?: string;     // InventoryAlerts.WarehouseId — nullable
  productName: string;      // Denormalized từ ProductVariants — trả về kèm theo API
  internalSku: string;      // Denormalized từ ProductVariants
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'SLOW_MOVING';
  severity: 'Info' | 'Warning' | 'Critical';
  currentPhysicalQty?: number;  // InventoryAlerts.CurrentPhysicalQty — snapshot
  currentAvailableQty?: number; // InventoryAlerts.CurrentAvailableQty
  daysUntilStockout?: number;
  suggestedRestockQty?: number;
  message: string;
  forecastResultId?: string;    // InventoryAlerts.ForecastResultId — FK nếu do AI tạo
  isResolved: boolean;
  resolvedAt?: string;          // InventoryAlerts.ResolvedAt
  notificationSentAt?: string;  // InventoryAlerts.NotificationSentAt
  createdAt: string;
}
```

### 4.7 AI Types

```typescript
// src/types/ai.types.ts

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatRequest {
  sessionId: string;
  history: ChatMessage[];
  currentMessage: string;
  userId: string;
  language?: 'vi' | 'en';
}

interface ChatResponse {
  replyMessage: string;
  sessionId: string;
  confidenceScore: number;
  suggestedAction?: 'VIEW_ORDER' | 'CREATE_TICKET' | null;
  followUpQuestions: string[];
}

interface ForecastPoint {
  date: string;
  predictedRevenue: number;
  lowerBound: number;
  upperBound: number;
}

// Response từ POST /ai/forecast/sales — map với ForecastResults DB table
interface SalesForecastResult {
  id: string;                   // ForecastResults.Id — UNIQUEIDENTIFIER
  entityType: 'Product';        // ForecastResults.EntityType
  entityId: string;             // ForecastResults.EntityId — productId
  forecastType: 'SalesRegression'; // ForecastResults.ForecastType
  productId: string;            // Shorthand alias cho entityId khi entityType = Product
  forecast: ForecastPoint[];    // Parse từ ForecastResults.ResultPayload
  rSquared: number;             // ForecastResults.RSquared — 0.0 – 1.0
  modelVersion?: string;        // ForecastResults.ModelVersion
  insights: string[];           // Parse từ ResultPayload
  forecastHorizonDays?: number; // ForecastResults.ForecastHorizonDays
  isStale: boolean;             // ForecastResults.IsStale
  createdAt: string;
  expiresAt?: string;           // ForecastResults.ExpiresAt
}

// Response từ POST /ai/forecast/inventory
interface InventoryForecastResult {
  warehouseId: string;
  alerts: Array<{
    alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK';
    sku: string;
    daysUntilStockout?: number;
  }>;
  recommendedRestockDate?: string;
  suggestedOrderQty: Record<string, number>; // { "SKU-001": 50, "SKU-002": 30 }
  confidence: number;
}

// Metadata phiên chat — map với ChatSessions DB table
interface ChatSession {
  id: string;               // ChatSessions.Id — UNIQUEIDENTIFIER
  sessionKey: string;       // ChatSessions.SessionKey — dùng làm Redis key
  messageCount: number;
  startedAt: string;
  lastActivityAt: string;
}
```

---

## 5. Zustand Global State Store

Chỉ lưu vào Zustand những gì **thực sự cần global** và **không phải server state**. Server state (data từ API) thuộc về TanStack Query.

### `authStore.ts` — Authentication State

| State | Kiểu | Mô tả |
|-------|------|-------|
| `accessToken` | `string \| null` | JWT token in-memory |
| `user` | `User \| null` | Thông tin user đang đăng nhập |
| `isAuthenticated` | `boolean` | Derived từ `accessToken !== null` |
| `isLoading` | `boolean` | Đang kiểm tra auth khi app khởi động |

| Action | Mô tả |
|--------|-------|
| `setToken(token)` | Lưu token mới sau login hoặc refresh |
| `setUser(user)` | Lưu user info |
| `logout()` | Xóa token, user, redirect về /login |

### `uiStore.ts` — UI State

| State | Kiểu | Mô tả |
|-------|------|-------|
| `sidebarOpen` | `boolean` | Sidebar collapsed hay không |
| `theme` | `'light' \| 'dark'` | Theme hiện tại |
| `notifications` | `Notification[]` | Toast notifications queue |
| `selectedPlatform` | `PlatformCode \| 'all'` | Filter sàn đang chọn — dùng cross feature |

---

## 6. TanStack Query — chiến lược caching & fetching

### Query Keys Convention

```
['auth', 'me']                           — Thông tin user hiện tại
['products', { cursor, filters }]        — Danh sách sản phẩm (cursor-based)
['products', productId]                  — Chi tiết một sản phẩm
['orders', { cursor, status, platform }] — Danh sách đơn hàng
['orders', orderId]                      — Chi tiết đơn hàng
['orders', orderId, 'history']           — OrderStatusHistory của một đơn
['inventory', { warehouseId }]           — Tồn kho theo kho
['inventory', 'alerts']                  — Danh sách InventoryAlert
['inventory', 'movements', variantId]    — StockMovements của một variant
['ai', 'chat', sessionId]                — Metadata phiên chat (không phải history — history ở Redis)
['ai', 'forecast', 'sales', productId]  — Forecast doanh thu
['ai', 'forecast', 'inventory', warehouseId] — Forecast tồn kho
['platforms', 'connections']             — Danh sách PlatformConnections
['dashboard', 'overview']               — Số liệu tổng quan (⚠️ endpoint TBD)
```

### Cấu hình staleTime theo loại data

> **Lưu ý TanStack Query v5:** Cú pháp `useQuery` thay đổi — options phải là object trực tiếp, không dùng overload với 3 tham số riêng. `keepPreviousData: true` đã bị xóa — thay bằng `placeholderData: keepPreviousData` (import từ `@tanstack/react-query`). `onSuccess`/`onError` callback trên `useQuery` bị xóa — dùng `useEffect` hoặc `useMutation` thay thế.

| Query | staleTime | gcTime | Lý do |
|-------|-----------|--------|-------|
| Dashboard overview | 5 phút | 10 phút | Gần đúng, không cần real-time |
| Danh sách đơn hàng | 1 phút | 5 phút | Có thể thay đổi thường xuyên |
| Chi tiết đơn hàng | 30 giây | 5 phút | SignalR invalidate khi có Webhook |
| OrderStatusHistory | 30 giây | 5 phút | Immutable nhưng có thể thêm mới |
| Danh sách sản phẩm | 10 phút | 30 phút | Ít thay đổi |
| Tồn kho (StockLevels) | 2 phút | 10 phút | Quan trọng nhưng không millisecond |
| InventoryAlerts | 2 phút | 10 phút | SignalR invalidate khi alert mới |
| Forecast AI | 6 tiếng | 12 tiếng | Backend cache cùng TTL với `ForecastResults.ExpiresAt` |
| Platform connections | 15 phút | 30 phút | Rất ít thay đổi |

### Invalidation sau Mutation

| Mutation | Endpoint | Invalidate keys |
|----------|---------|----------------|
| Tạo / sửa / xóa product | `POST/PUT/DELETE /products` | `['products']` |
| Điều chỉnh tồn kho | `POST /inventory/adjust` | `['inventory']`, `['inventory', 'alerts']`, `['inventory', 'movements', variantId]` |
| Hủy đơn hàng | `POST /orders/{id}/cancel` | `['orders']`, `['orders', orderId]` |
| Kết nối sàn (OAuth success) | `GET /platforms/{p}/callback` | `['platforms', 'connections']` |
| Ngắt kết nối sàn | `DELETE /platforms/connections/{id}` | `['platforms', 'connections']` |
| Trigger sync sàn | `POST /platforms/{id}/sync` | `['products']`, `['orders']` |

### Real-time với SignalR

> **Lưu ý v5:** Dùng `queryClient.invalidateQueries({ queryKey: ['orders', orderId] })` — cú pháp object, không phải mảng trực tiếp.

Khi backend SignalR push event `orderStatusChanged`:
1. `useSignalR` hook nhận event `{ orderId, newStatus }`
2. Gọi `queryClient.invalidateQueries({ queryKey: ['orders', orderId] })`
3. Gọi `queryClient.invalidateQueries({ queryKey: ['orders'] })` để cập nhật cả list
4. TanStack Query tự động refetch → UI cập nhật

Khi backend push event `lowStockAlert`:
1. `useSignalR` nhận event `{ variantId, alertType }`
2. Gọi `queryClient.invalidateQueries({ queryKey: ['inventory', 'alerts'] })`
3. Toast notification hiển thị với `alertType` và tên sản phẩm

---

# PHẦN II — LỘ TRÌNH PHÁT TRIỂN

---

## 7. Roadmap 6 Sprints

| Sprint | Tuần | Mục tiêu | Deliverable |
|--------|------|---------|-------------|
| **Sprint 1** | 1–2 | Project Setup & Authentication | Vite + TS + Tailwind + Shadcn cài xong. Login/Logout hoạt động với .NET Identity. JWT interceptor hoạt động |
| **Sprint 2** | 3–4 | Layout & Platform Connection | AppShell (Sidebar + Navbar) hoàn chỉnh. Routing setup. Trang kết nối sàn OAuth2 Lazada end-to-end |
| **Sprint 3** | 5–6 | Module Sản phẩm & Kho hàng | Bảng sản phẩm có filter theo sàn, phân trang. CRUD sản phẩm. Trang kho với alert tồn kho |
| **Sprint 4** | 7–8 | Module Đơn hàng | Bảng đơn hàng filter theo status/sàn/ngày. Chi tiết đơn. Real-time cập nhật status qua SignalR |
| **Sprint 5** | 9–10 | AI & Analytics Dashboard | Dashboard với Recharts. Giao diện Chatbot AI. Trang dự báo doanh thu và tồn kho |
| **Sprint 6** | 11–12 | Tối ưu, Testing & Docker | Error Boundary. Unit test với Vitest + Testing Library. Lighthouse ≥ 90. Dockerfile + CI/CD |

---

# PHẦN III — CHI TIẾT TASK TỪNG SPRINT

---

## 8. Sprint 1 — Project Setup & Authentication

**Mục tiêu:** Dựng nền tảng kỹ thuật vững chắc. Developer mới clone repo, chạy `npm install && npm run dev` là có môi trường hoạt động.

---

### F1-01 — Khởi tạo dự án Vite + TypeScript

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 1 ngày |

**Logic cần xử lý:** Tạo project với `npm create vite@latest shophub-frontend -- --template react-ts`. Cài đặt và cấu hình Tailwind CSS v3, Shadcn/UI (init + add các component cần thiết). Setup `tsconfig.json` với path aliases (`@/` → `src/`). Cấu hình `vite.config.ts` với proxy cho API backend (tránh CORS trong dev).

**Definition of Done:** `npm run dev` khởi động thành công. `npm run build` không có TypeScript error. Path alias `@/components` hoạt động.

---

### F1-02 — Cài đặt và cấu hình các thư viện core

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 1 ngày |

**Logic cần xử lý:** Cài đặt: `axios`, `@tanstack/react-query`, `zustand`, `react-router-dom`, `recharts`, `date-fns`, `zod`, `react-hook-form`, `@hookform/resolvers`. Cấu hình `QueryClient` với default options (staleTime, retry, errorBoundary). Setup `Providers.tsx` bọc toàn bộ `QueryClientProvider`, `BrowserRouter`, `ThemeProvider`.

**Definition of Done:** Import từ tất cả thư viện không có TypeScript error. DevTools của TanStack Query hiển thị trong development.

---

### F1-03 — `apiClient.ts` — Axios instance với JWT Interceptor

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 2 ngày |

**Logic cần xử lý:**
- Tạo `axios.create()` với `baseURL = import.meta.env.VITE_API_BASE_URL` và `withCredentials: true` — bắt buộc để trình duyệt tự động gửi kèm httpOnly cookie chứa refreshToken trong mọi request
- Request interceptor: đọc `accessToken` từ Zustand `authStore`, gắn vào header `Authorization: Bearer {token}`
- Response interceptor — xử lý 401: kiểm tra `isRefreshing` flag (tránh gọi refresh nhiều lần), gọi `POST /auth/refresh` (không cần gửi body vì refreshToken đã ở cookie, trình duyệt tự gửi kèm nhờ `withCredentials`), lưu `accessToken` mới từ response vào Zustand store, retry request gốc. Nếu refresh thất bại (refresh token expired / revoked) → gọi `authStore.logout()` → redirect `/login`
- Response interceptor — xử lý lỗi khác: parse `ProblemDetails` response từ .NET (RFC 7807), tạo `ApiError` object chuẩn, throw để TanStack Query catch
- Backend cần cấu hình CORS `AllowCredentials()` và `AllowOrigin` cho `VITE_API_BASE_URL` — không được dùng wildcard `*` khi có `withCredentials`

**Definition of Done:** Unit test cho interceptor: gọi API → 401 → tự refresh → retry thành công. Gọi API → 401 → refresh thất bại → redirect login. Không bao giờ gọi refresh đồng thời 2 lần.

---

### F1-04 — Zustand Auth Store

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 1 ngày |

**Logic cần xử lý:** Tạo `authStore` với state: `accessToken`, `user`, `isLoading`. Actions: `setToken()`, `setUser()`, `logout()` (clear state + remove cookie nếu dùng). Implement `persist` middleware của Zustand để lưu user info vào `sessionStorage` (không lưu token — chỉ lưu in-memory). Khi app khởi động: gọi `GET /auth/me` để verify token còn hợp lệ không → cập nhật state.

**Definition of Done:** Refresh trang → user vẫn được nhận biết nếu token còn hợp lệ. Logout → clear state, redirect /login.

---

### F1-05 — Trang Login

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 2 ngày |

**Logic cần xử lý:**
- Form với `react-hook-form` + `zod` validation: email (format chuẩn), password (tối thiểu 8 ký tự)
- Submit → gọi `authService.login(data)` → `POST /auth/login`
- Nhận `TokenResponse`: lưu `accessToken` vào Zustand, gọi `GET /auth/me` để lấy `User` info
- Success → redirect về `/dashboard`
- Error → hiển thị message lỗi từ `ApiError.detail` (ví dụ: "Email hoặc mật khẩu không đúng")
- Loading state: disable button + hiển thị spinner trong khi đang gọi API
- UX: Enter key submit form, focus vào email input khi trang load

**Definition of Done:** Login với credentials đúng → vào dashboard. Login sai → hiển thị lỗi rõ ràng. Không thể truy cập `/dashboard` khi chưa login.

---

### F1-06 — ProtectedRoute và Auth Guard

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 1 ngày |

**Logic cần xử lý:**

Backend có 3 roles: `Seller`, `Admin`, `StaffUser`. Cần 3 loại Route Guard tương ứng:

- `ProtectedRoute` — bọc `<Outlet />`, kiểm tra `authStore.isAuthenticated`. Nếu `false` → `<Navigate to="/login" replace state={{ from: location }} />`. Lưu `state.from` để sau khi login redirect về đúng trang đang cố truy cập. Tất cả 3 role đều pass qua được.
- `AdminRoute` — extends ProtectedRoute, kiểm tra thêm `user.roles.includes('Admin')`. Nếu là `Seller` hay `StaffUser` → redirect `/dashboard` với toast "Bạn không có quyền truy cập trang này". Dùng cho `/admin/*` routes.
- `StaffUserRoute` — kiểm tra `user.roles.includes('Admin') || user.roles.includes('StaffUser')`. Dùng cho các trang mà Staff được phép xem nhưng `Seller` thường không (ví dụ: trang quản lý toàn bộ seller, SyncJobs log). **⚠️ Danh sách cụ thể các route dành cho StaffUser cần confirm với Product Owner — hiện tại để trống, sẽ bổ sung khi có yêu cầu.**

Tạo helper `useRequireRole(roles: string[])` hook để reuse logic check role.

**Definition of Done:** Truy cập URL protected khi chưa login → redirect `/login` và sau login quay về đúng trang. `AdminRoute` từ chối `Seller`/`StaffUser` với redirect + toast. Cả 3 Role Guard có unit test riêng.

---

## 9. Sprint 2 — Layout, Routing & Platform Connection

---

### F2-01 — AppShell Layout (Sidebar + Navbar)

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 3 ngày |

**Logic cần xử lý:**
- `AppShell.tsx`: layout chính với `flex`. Sidebar bên trái cố định, nội dung bên phải scroll
- `Sidebar.tsx`: navigation items (Dashboard, Products, Orders, Inventory, AI, Platforms, Settings). Active state theo `useLocation()`. Collapsible trên mobile (`sidebarOpen` từ Zustand `uiStore`). Platform filter: dropdown chọn `All / Lazada / Shopee` → lưu vào `uiStore.selectedPlatform` → ảnh hưởng filter mặc định của các trang list
- `Navbar.tsx`: Breadcrumb tự động theo route. Nút notification bell với số alert chưa đọc (từ `['inventory', 'alerts']` query). Avatar dropdown: tên user, subscription tier, logout
- Responsive: trên mobile Sidebar ẩn, có hamburger menu mở Sidebar dạng drawer

**Definition of Done:** Layout hoạt động đúng trên desktop (1440px) và mobile (375px). Sidebar collapse/expand không gây layout shift. Breadcrumb tự cập nhật khi navigate.

---

### F2-02 — React Router DOM — Định nghĩa toàn bộ Routes

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 1 ngày |

**Cấu trúc Route:**

```
/login                          — LoginPage (public)
/
└── AppShell (ProtectedRoute)
    ├── /dashboard              — DashboardPage
    ├── /products               — ProductListPage
    │   └── /:id                — ProductDetailPage
    ├── /orders                 — OrderListPage
    │   └── /:id                — OrderDetailPage
    ├── /inventory              — InventoryPage
    │   └── /:warehouseId       — WarehouseDetailPage
    ├── /platforms              — PlatformListPage
    │   └── /callback/:platform — OAuthCallbackPage
    ├── /ai
    │   ├── /chat               — AIChatPage
    │   └── /forecast           — ForecastPage
    └── /admin (AdminRoute)
        └── /overview           — AdminOverviewPage
```

**Logic cần xử lý:** Lazy loading tất cả page components (`React.lazy + Suspense`) để giảm bundle size. `<Suspense fallback={<PageSkeleton />}>` bọc `<Outlet />` trong AppShell.

**Definition of Done:** `npm run build` → bundle split thành nhiều chunk nhỏ. Navigation không chớp màn hình.

---

### F2-03 — Trang Kết nối Sàn (Platform List)

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 2 ngày |

**Logic cần xử lý:**
- Query `GET /platforms/connections` → hiển thị danh sách sàn đã kết nối với status badge (Active / TokenExpired / Disconnected)
- Mỗi sàn chưa kết nối: nút "Kết nối" → gọi `GET /platforms/{platform}/authorize` → nhận redirect URL từ backend → `window.location.href = url` (chuyển sang Lazada login)
- Mỗi sàn đã kết nối: nút "Ngắt kết nối" (confirmation dialog), nút "Sync ngay", hiển thị `lastSyncAt`
- Hiển thị status token: nếu `status === 'TokenExpired'` → banner cảnh báo + nút "Kết nối lại"
- Multi-shop: một platform có thể có nhiều connection (VD: Lazada VN và Lazada SG) → hiển thị từng connection riêng

**Definition of Done:** Click "Kết nối Lazada" → chuyển sang trang Lazada đúng. Disconnect có confirmation. Status badge đúng theo data.

---

### F2-04 — OAuth2 Callback Handler

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 2 ngày |

**Logic cần xử lý:**
- Route `/platforms/callback/:platform` nhận `?code=xxx&state=yyy` từ Lazada redirect về
- Lấy `code` và `state` từ `useSearchParams()`
- Validate `state` (phòng CSRF): so sánh với giá trị đã lưu trong `sessionStorage` trước khi redirect. Không khớp → hiển thị lỗi "Yêu cầu không hợp lệ", không tiếp tục
- Gọi `GET /platforms/{platform}/callback?code={code}&state={state}` — **phải là GET không phải POST**, vì đây là redirect callback URL backend đã đăng ký với Lazada (S3-01). Ví dụ cụ thể: `GET /platforms/lazada/callback?code=xxx&state=yyy`
- Loading state trong khi chờ backend exchange token: hiển thị "Đang kết nối với Lazada..."
- Success → redirect `/platforms` với toast "Kết nối Lazada thành công!" + invalidate `['platforms', 'connections']`
- Error → hiển thị lỗi theo `error` param Lazada trả về: `access_denied`, `server_error`, hoặc ApiError từ backend + nút "Thử lại"

**Definition of Done:** Full OAuth2 flow end-to-end hoạt động với Lazada sandbox. State mismatch → hiển thị lỗi bảo mật, không gọi callback API. Code sử dụng một lần — không gọi callback 2 lần nếu user F5.

---

## 10. Sprint 3 — Module Sản phẩm & Kho hàng

---

### F3-01 — Component DataTable dùng chung

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 3 ngày |

**Logic cần xử lý:** Xây dựng `DataTable<T>` component generic dùng Shadcn/UI Table. Tính năng: column definitions với `ColumnDef<T>[]`, sortable columns (click header), row selection (checkbox), sticky header khi scroll. **Pagination: backend dùng cursor-based** (trả về `nextCursor` + `hasMore` trong `PaginatedResponse<T>`), KHÔNG dùng page-number offset. UI hiển thị nút "Tải thêm" (Load More) hoặc nút "Trước / Tiếp" — không hiển thị "Trang 1/10" vì không biết tổng số trang. Select số item per load (10/20/50). Filter bar: search input với debounce 300ms, platform filter dropdown, status filter. Loading state: skeleton rows thay vì spinner. Empty state: hiển thị illustration + message khi không có data.

**Definition of Done:** DataTable hoạt động với bất kỳ kiểu dữ liệu nào. Cursor-based pagination load thêm đúng. Accessible (keyboard navigation, ARIA labels). Test với 1000+ rows không lag.

---

### F3-02 — Trang Danh sách Sản phẩm

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 3 ngày |

**Logic cần xử lý:**
- Query `GET /products` với params: `cursor`, `limit`, `platform` (từ `uiStore.selectedPlatform`), `status`, `search` (debounced)
- Dùng TanStack Query v5 với `placeholderData: keepPreviousData` (import `keepPreviousData` từ `@tanstack/react-query`) để không bị blank khi load trang mới — **lưu ý v5 đổi tên từ `keepPreviousData: true` sang `placeholderData: keepPreviousData`**
- Columns: ảnh thumbnail, tên sản phẩm, SKU, số variant, platform badges (hiển thị tất cả sàn đang list), giá, tồn kho tổng, trạng thái
- PlatformBadge: icon + màu riêng cho từng sàn (Lazada = cam, Shopee = đỏ, TikTok = đen)
- Action per row: nút xem chi tiết, nút sync lên sàn, dropdown more actions (sửa, xóa)
- Bulk actions: chọn nhiều → sync selected, delete selected
- Filter: tìm theo tên/SKU, lọc theo platform, lọc theo status

**Definition of Done:** Filter + search hoạt động. Pagination cursor-based không mất scroll position. Có thể sort theo tên, giá, ngày tạo.

---

### F3-03 — Trang Chi tiết Sản phẩm

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P1 |
| **Estimate** | 3 ngày |

**Logic cần xử lý:**
- Query `GET /products/:id` → hiển thị đầy đủ thông tin
- Tab layout: "Thông tin chung", "Biến thể", "Tồn kho", "Listing trên sàn"
- Tab Biến thể: bảng các variant với ảnh, SKU, giá, tồn kho, trạng thái. Có thể sửa inline (click để edit)
- Tab Listing trên sàn: với mỗi variant, hiển thị listing status trên từng platform connection. Giá listing, tồn kho trên sàn, last sync. Nút "Sync giá", "Sync tồn kho" per listing
- Tab Tồn kho: bảng tồn kho theo kho, `availableQty` được highlight khi < `minThreshold`

**Definition of Done:** Navigate đến chi tiết → tất cả tab load đúng data. Sync tồn kho → toast success/error.

---

### F3-04 — Trang Quản lý Kho hàng

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P1 |
| **Estimate** | 3 ngày |

**Logic cần xử lý:**
- Query `GET /inventory` với params `warehouseId` (optional) → danh sách tất cả variant + tồn kho
- Query `GET /inventory/alerts?isResolved=false` → danh sách alert đang active
- Alert banner ở đầu trang: hiển thị số lượng LOW_STOCK và OUT_OF_STOCK alerts đang active
- Bảng tồn kho: tên sản phẩm, SKU, `physicalQty`, `reservedQty`, `availableQty`, `minThreshold`, trạng thái (Normal / Low / Out)
- Highlight row: vàng khi `availableQty <= minThreshold`, đỏ khi `availableQty === 0`
- Action: "Điều chỉnh tồn kho" → dialog modal → gọi `POST /inventory/adjust` với body `{ variantId, warehouseId, delta, movementType, reason, note }`. MovementType chọn từ enum: `IMPORT`, `MANUAL_ADJUSTMENT`, `DAMAGE_LOSS`, `TRANSFER_OUT`, `TRANSFER_IN`
- Xem lịch sử biến động: click row → gọi `GET /inventory/movements?variantId={id}&warehouseId={id}` → slideout panel timeline
- Tab "Cảnh báo": danh sách `InventoryAlerts` với severity badge. Nút "Đã xử lý" → gọi `POST /inventory/alerts/{id}/resolve` (**⚠️ TBD — endpoint chưa được định nghĩa chính thức trong Backend doc, cần confirm với Backend team trước khi implement**)

**Definition of Done:** `POST /inventory/adjust` thành công → invalidate `['inventory']` → số liệu cập nhật ngay. Alert resolve → biến mất khỏi danh sách. Timeline biến động hiển thị đúng thứ tự chronological.

---

## 11. Sprint 4 — Module Đơn hàng

---

### F4-01 — Trang Danh sách Đơn hàng

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 3 ngày |

**Logic cần xử lý:**
- Query `GET /orders` với params: `cursor`, `limit`, `platform`, `status` (multi-select), `dateFrom`, `dateTo`, `search` (tên buyer / order ID)
- Columns: Order ID (link sang chi tiết), platform badge, tên buyer, tổng tiền, số lượng item, status badge (màu theo `ORDER_STATUS_CONFIG`), thời gian đặt hàng, tracking code (nếu có)
- Status filter: tab bar phía trên bảng với tất cả `OrderStatus` + count badge. Ví dụ: "Tất cả (120) | Chờ xử lý (5) | Đang giao (42)..."
- Bulk actions: chọn nhiều đơn cùng status → "Đánh dấu Shipped", "In vận đơn" (batch)
- Real-time: khi `useSignalR` nhận `orderStatusChanged` event → invalidate query → bảng tự cập nhật, có toast notification nhỏ ở góc màn hình

**Definition of Done:** Filter status hoạt động. Real-time cập nhật khi backend push SignalR event. Tìm kiếm theo order ID hoặc tên buyer.

---

### F4-02 — Trang Chi tiết Đơn hàng

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 3 ngày |

**Logic cần xử lý:**
- Query `GET /orders/:id` → layout 2 cột: trái thông tin đơn, phải timeline trạng thái
- Query `GET /orders/:id/status-history` → danh sách `OrderStatusHistory` (hoặc trả về kèm trong `GET /orders/:id`)
- Thông tin đơn: platform badge, order ID, buyer info, địa chỉ giao hàng, payment method, voucher
- Bảng sản phẩm trong đơn: ảnh, tên, variant attributes, qty, item price, paid price, tracking code, status badge per item. Chú ý: Lazada mỗi unit là một `OrderItem` riêng, `qty` luôn = 1
- Timeline trạng thái (OrderStatusHistory): danh sách thay đổi trạng thái với icon, thời gian, nguồn (`source`), `platformStatus` gốc. Sắp xếp `changedAt` descending (mới nhất trên cùng)
- Tracking: nếu `OrderItem` có `trackingCode` và `shipmentProvider` → nút "Theo dõi vận đơn"
- Hủy đơn: nút hiển thị khi `order.status` là `Pending` hoặc `Confirmed`. Click → confirmation dialog → gọi `POST /orders/{id}/cancel` (**⚠️ TBD — endpoint chưa được định nghĩa trong Backend doc, cần confirm với Backend team**). Sau cancel → invalidate `['orders', orderId]` và `['orders']`

**Definition of Done:** Layout rõ ràng. Timeline đúng thứ tự chronological. Hủy đơn → confirm → status cập nhật ngay trong UI.

---

### F4-03 — Real-time Order Updates với SignalR

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P1 |
| **Estimate** | 2 ngày |

**Logic cần xử lý:**
- `signalRClient.ts`: tạo `HubConnection` đến `VITE_SIGNALR_URL + /hubs/orders`. Tự động reconnect với exponential backoff (1s, 2s, 4s, tối đa 30s)
- `useSignalR` hook: kết nối khi component mount, disconnect khi unmount. Lắng nghe events:
  - `orderStatusChanged`: `{ orderId, newStatus }` → `queryClient.invalidateQueries({ queryKey: ['orders', orderId] })` và `queryClient.invalidateQueries({ queryKey: ['orders'] })`
  - `lowStockAlert`: `{ variantId, alertType }` → `queryClient.invalidateQueries({ queryKey: ['inventory', 'alerts'] })`, hiển thị toast warning
- Connection status indicator: icon nhỏ ở Navbar cho biết SignalR connected / reconnecting / disconnected
- Chỉ kết nối SignalR khi user đã authenticated (`authStore.isAuthenticated === true`)

**Definition of Done:** Backend push event → UI cập nhật trong < 2 giây. Mất kết nối → tự reconnect. Không memory leak khi navigate giữa các trang.

---

## 12. Sprint 5 — Module AI & Analytics Dashboard

---

### F5-01 — Dashboard Tổng quan

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 4 ngày |

**Logic cần xử lý:**
- **⚠️ Lưu ý:** Hầu hết endpoint `/dashboard/*` chưa được định nghĩa trong Backend doc. Xem chi tiết tại Mục 14 — Dashboard Tổng quan. Frontend cần dùng chiến lược ghép query song song từ các endpoint có sẵn cho đến khi Backend tạo aggregate endpoint.
- KPI Cards — ghép từ các endpoint hiện có:
  - Doanh thu hôm nay: `GET /orders?dateFrom={today}&status=Delivered` → tổng `totalAmount`
  - Đơn hàng mới: `GET /orders?dateFrom={today}&cursor&limit=1` → lấy `totalCount` nếu backend trả về
  - Sản phẩm active: `GET /products?status=Active&limit=1` → `totalCount`
  - Cảnh báo tồn kho: `GET /inventory/alerts?isResolved=false&limit=1` → `totalCount`
- Biểu đồ doanh thu (Recharts `AreaChart`): dùng `GET /orders?dateFrom=...&dateTo=...` → group theo ngày và platform ở Frontend. Filter: 7/30/90 ngày. Tooltip hover hiển thị doanh thu per sàn. **Khi Backend tạo `GET /dashboard/revenue` thì migrate sang endpoint đó**
- Biểu đồ phân bổ đơn hàng (`PieChart`): tương tự, group từ `GET /orders` data. **TBD `GET /dashboard/order-distribution`**
- Alert panel: `GET /inventory/alerts?isResolved=false&limit=5` — endpoint này ✅ có sẵn
- Platform status: `GET /platforms/connections` — endpoint này ✅ có sẵn
- Real-time: KPI Cards `refetchInterval: 5 * 60 * 1000` (5 phút) trong TanStack Query
- Platform filter: khi `uiStore.selectedPlatform` thay đổi → re-query với `platform` param

**Definition of Done:** Charts hiển thị data đúng với endpoint hiện có. Filter platform hoạt động. Dễ dàng migrate sang aggregate endpoint khi Backend sẵn sàng mà không cần refactor lớn.

---

### F5-02 — Giao diện AI Chatbot

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 4 ngày |

**Logic cần xử lý:**
- `ChatWindow.tsx`: layout chat standard (messages ở trên, input ở dưới)
- `ChatMessage.tsx`: bubble trái (AI assistant - màu xám), bubble phải (user - màu primary). Timestamp, avatar
- Session lifecycle (theo Backend S5-02):
  - Khi user mở trang chat lần đầu → gọi `POST /ai/chat/sessions` để tạo session mới → nhận `{ id, sessionKey, startedAt }` → lưu `sessionId` vào component state
  - Nếu user đã có session trước (lưu trong `sessionStorage`) → skip bước tạo mới
  - Lịch sử tin nhắn được lưu trong Redis phía backend (TTL 24h) — không phải trong component state giữa các lần tải trang. Khi load lại trang: gọi `GET /ai/chat/sessions/{id}/history` để khôi phục
- Gửi tin nhắn: nhấn Enter hoặc nút Send → gọi `POST /ai/chat/sessions/{sessionId}/messages` với body `{ history: ChatMessage[], currentMessage, userId, language? }`. Trong khi chờ response: hiển thị "typing indicator" (3 chấm animation). Request timeout 30 giây (cấu hình riêng theo Backend AI HttpClient)
- Nhận `ChatResponse`: thêm `replyMessage` vào messages. Nếu có `followUpQuestions[]` → hiển thị quick reply chips bên dưới response (click để gửi ngay). Nếu `confidenceScore < 0.5` → hiển thị disclaimer nhỏ "Câu trả lời có thể không chính xác"
- Nếu `suggestedAction === 'VIEW_ORDER'` → hiển thị nút "Xem đơn hàng" trong bubble → navigate `/orders`
- Error state: backend trả 503 (AI Service unavailable, circuit breaker open) → hiển thị message "Trợ lý AI tạm thời bận, vui lòng thử lại sau" — không throw unhandled error
- UX: auto-scroll xuống cuối khi có message mới, textarea tự resize, paste xử lý được

**Definition of Done:** Tạo session → gửi/nhận tin nhắn hoạt động end-to-end. Typing indicator khi chờ. Follow-up chips clickable. 503 → message thân thiện, không crash. Reload trang → history được restore từ `GET .../history`.

---

### F5-03 — Trang Dự báo Doanh thu (Sales Forecast)

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P1 |
| **Estimate** | 3 ngày |

**Logic cần xử lý:**
- Select sản phẩm muốn forecast: combobox search sản phẩm (autocomplete từ `GET /products`)
- Select platform + forecast days (7/14/30 ngày)
- Nút "Chạy dự báo" → `POST /ai/forecast/sales` → loading state (dự báo mất 5-10s)
- Hiển thị kết quả: Recharts `ComposedChart` với `Area` (confidence band: lowerBound → upperBound màu mờ), `Line` (predictedRevenue màu chính)
- R² badge: hiển thị "Độ tin cậy: 87%" với màu xanh/vàng/đỏ tương ứng
- Insights: danh sách bullet `insights[]` từ AI response
- Warning khi `isStale: true`: banner nhỏ "Kết quả từ 3 giờ trước, ấn 'Làm mới' để cập nhật"

**Definition of Done:** Forecast chạy và hiển thị biểu đồ đúng. R² warning khi < 0.5. Stale result rõ ràng.

---

### F5-04 — Trang Dự báo Tồn kho (Inventory Forecast)

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P1 |
| **Estimate** | 2 ngày |

**Logic cần xử lý:**
- Query `GET /inventory/alerts?isResolved=false` → danh sách `InventoryAlerts` active. Hiển thị card với severity icon, tên sản phẩm, SKU, `currentAvailableQty`, `daysUntilStockout`, `suggestedRestockQty`, `message`
- Nút "Yêu cầu dự báo mới" → `POST /ai/forecast/inventory` với body `{ warehouseId, forecastHorizonDays }`. Backend xử lý async — dùng polling `GET /ai/forecast/inventory/{warehouseId}/latest` hoặc chờ SignalR event nếu backend hỗ trợ
- Response `InventoryForecastResult` trả về: `alerts[]`, `recommendedRestockDate`, `suggestedOrderQty: Record<sku, qty>`, `confidence`
- Nút "Đã xử lý" per alert → gọi `POST /inventory/alerts/{id}/resolve` (**⚠️ TBD — endpoint chưa được định nghĩa trong Backend doc Sprint 5. Cần confirm với Backend team trước khi implement. Tạm thời disable button này cho đến khi có xác nhận**)
- Sau khi resolve thành công → invalidate `['inventory', 'alerts']`

**Definition of Done:** Alert cards hiển thị đúng severity và `currentAvailableQty`. Forecast mới trigger được. Resolve alert endpoint hoạt động (sau khi Backend confirm). Không throw lỗi khi endpoint chưa có.

---

## 13. Sprint 6 — Tối ưu, Testing & Đóng gói

---

### F6-01 — Error Boundary và Xử lý lỗi toàn cục

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 2 ngày |

**Logic cần xử lý:**
- `ErrorBoundary.tsx` bọc từng route page: khi component throw uncaught error → hiển thị fallback UI thay vì crash toàn app
- `ApiErrorFallback.tsx`: hiển thị khi TanStack Query error với message thân thiện (không lộ technical detail), nút "Thử lại" gọi `refetch()`
- Global error toast: với mọi mutation error → tự động hiển thị toast lỗi từ `ApiError.detail`
- Network offline detection: `navigator.onLine` event → banner "Mất kết nối internet"
- 404 page: route không tồn tại → custom 404 với nút "Về Dashboard"
- Logging: forward JavaScript errors lên backend `POST /logs/frontend` (optional, low priority)

**Definition of Done:** Throw error trong component → không crash cả app. API lỗi → toast rõ ràng. Offline → banner.

---

### F6-02 — Unit Tests với Vitest + React Testing Library

| | |
|--|--|
| **Role** | Junior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 4 ngày |

**Logic cần xử lý:**
- Setup: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `msw` (Mock Service Worker — mock API calls)
- Test các component quan trọng:
  - `LoginForm`: render → điền sai email → error message. Điền đúng → submit → gọi API
  - `DataTable`: render với data → hiển thị đúng số row. Click sort → thứ tự thay đổi
  - `StatusBadge`: với từng `OrderStatus` → hiển thị đúng label và màu
  - `ProtectedRoute`: khi chưa auth → redirect /login
  - `apiClient` interceptor: 401 → refresh → retry (unit test không cần MSW)
- Test hooks:
  - `useDebounce`: value thay đổi → debounced value chỉ cập nhật sau delay
  - `usePagination`: next page → cursor cập nhật

**Definition of Done:** `npm run test` pass 100%. Coverage ≥ 70% cho business logic. CI pipeline chạy test.

---

### F6-03 — Tối ưu Performance

| | |
|--|--|
| **Role** | Senior Frontend Dev |
| **Priority** | P1 |
| **Estimate** | 2 ngày |

**Logic cần xử lý:**
- `React.memo` cho các component nặng: `DataTable` rows, `ChatMessage`, `KpiCard`
- `useMemo` / `useCallback` cho các computed values và event handlers trong list items
- Code splitting: verify `npm run build` tạo chunks riêng cho mỗi route page
- Image optimization: lazy loading ảnh sản phẩm với `loading="lazy"`, placeholder blur
- Bundle analysis: `npx vite-bundle-visualizer` → identify chunk nào quá lớn
- Target: Lighthouse Performance Score ≥ 90 trên môi trường production build

**Definition of Done:** Lighthouse score ≥ 90. Bundle size main chunk < 300KB (gzipped). Không có unnecessary re-render (React DevTools Profiler).

---

### F6-04 — Dockerfile và Build Production

| | |
|--|--|
| **Role** | DevOps / Senior Frontend Dev |
| **Priority** | P0 |
| **Estimate** | 1 ngày |

**Logic cần xử lý:**
- Multi-stage Dockerfile: Stage 1 `build` dùng `node:20-alpine` chạy `npm run build`. Stage 2 `serve` dùng `nginx:alpine` serve static files từ `/dist`
- `nginx.conf`: cấu hình SPA routing (`try_files $uri $uri/ /index.html`), gzip compression, cache headers cho assets
- Environment variables: `VITE_API_BASE_URL` và `VITE_SIGNALR_URL` inject lúc build (Vite đọc từ `.env`)
- Thêm vào `docker-compose.yml` của Backend: service `shophub-frontend` build từ Dockerfile, expose port 80

**Definition of Done:** `docker build` thành công. Container chạy, navigate SPA không bị 404. Nginx gzip hoạt động (check response header `Content-Encoding: gzip`).

---

### F6-05 — CI/CD Pipeline cho Frontend

| | |
|--|--|
| **Role** | DevOps |
| **Priority** | P0 |
| **Estimate** | 1 ngày |

**Logic cần xử lý:** GitHub Actions workflow: on PR → `npm ci` → `npm run type-check` → `npm run lint` → `npm test` → `npm run build`. On merge main → build Docker image → push registry → deploy staging. Lighthouse CI trong pipeline để track performance regression.

**Definition of Done:** PR tạo → CI chạy trong < 5 phút. Fail nếu có TypeScript error, lint error, hoặc test fail.

---

# PHẦN IV — ĐẶC TẢ MÀN HÌNH

---

## 14. Dashboard Tổng quan

**Route:** `/dashboard`  
**Component:** `features/dashboard/`

| Vùng | Nội dung | Data source | Trạng thái |
|------|---------|------------|-----------|
| Header | Chào "Xin chào, {fullName}!" + ngày hôm nay | `authStore.user` | ✅ Có sẵn |
| KPI Row | 4 card: Doanh thu hôm nay, Đơn hàng mới, Sản phẩm active, Cảnh báo tồn kho | `GET /dashboard/overview` | ⚠️ **TBD — endpoint chưa có trong Backend doc. Cần Backend team tạo mới. Tạm thời ghép từ: `GET /orders?dateFrom=today`, `GET /products?status=Active`, `GET /inventory/alerts?isResolved=false`** |
| Biểu đồ doanh thu | AreaChart đa sàn theo ngày, filter 7/30/90 ngày | `GET /dashboard/revenue?days=30` | ⚠️ **TBD — endpoint chưa có. Cần Backend tạo aggregate endpoint. Tạm thời: `GET /orders?dateFrom=...&dateTo=...&groupBy=platform`** |
| Biểu đồ đơn hàng | DonutChart phân bổ theo sàn + status | `GET /dashboard/order-distribution` | ⚠️ **TBD — endpoint chưa có. Cần Backend tạo.** |
| Bảng sản phẩm top | Top 5 sản phẩm bán chạy tuần này | `GET /dashboard/top-products` | ⚠️ **TBD — endpoint chưa có. Cần Backend tạo.** |
| Alert panel | Danh sách 5 alert LOW_STOCK gần nhất | `GET /inventory/alerts?isResolved=false&limit=5` | ✅ Dùng được endpoint inventory alerts |
| Platform status | Card per connection: status, lastSyncAt | `GET /platforms/connections` | ✅ Có sẵn |

> **Ghi chú quan trọng:** Tất cả endpoint `GET /dashboard/*` chưa được định nghĩa trong `ShopHub_Technical_Document_v4.md`. Frontend cần làm việc với Backend team để xác nhận endpoint trước Sprint 5. Trong thời gian chờ, Frontend có thể implement Dashboard với **dữ liệu ghép từ các endpoint có sẵn** (`/orders`, `/products`, `/inventory/alerts`, `/platforms/connections`) nhưng sẽ tạo ra nhiều request song song thay vì 1 request tổng hợp.

---

## 15. Trang Quản lý Sản phẩm

**Route:** `/products`  
**Component:** `features/products/`

**Filters:**
- Search: tên sản phẩm hoặc SKU (debounce 300ms)
- Platform: All / Lazada / Shopee / TikTok Shop
- Status: All / Active / Inactive / Deleted
- Sort: Tên A-Z, Ngày tạo mới nhất, Giá thấp→cao

**Table Columns:**
- Thumbnail (40×40px, lazy load)
- Tên + SKU (2 dòng)
- Platform badges (icon + tên sàn)
- Số variant
- Giá gốc
- Tồn kho khả dụng (màu đỏ nếu < threshold)
- Trạng thái
- Cập nhật lần cuối
- Actions: [Xem] [Sync] [...]

**Chi tiết sản phẩm `/products/:id`:**
- Tabs: Thông tin | Biến thể | Tồn kho | Listing sàn
- Tab Listing sàn: grouped by platform connection → từng SKU với giá listing, tồn kho sàn, trạng thái

---

## 16. Trang Quản lý Đơn hàng

**Route:** `/orders`  
**Component:** `features/orders/`

**Filter bar:**
- Status tabs: Tất cả | Chờ xử lý | Đang giao | Đã giao | Đã hủy (với count badge)
- Platform filter: dropdown
- Date range picker: từ ngày - đến ngày
- Search: order ID hoặc tên buyer

**Table Columns:**
- Order ID (link)
- Platform badge
- Buyer name + phone
- Số lượng sản phẩm
- Tổng tiền
- Status badge (màu theo `ORDER_STATUS_CONFIG`)
- Phương thức thanh toán
- Ngày đặt hàng
- Actions: [Xem chi tiết]

**Chi tiết đơn hàng `/orders/:id`:**
- Layout 2 cột (desktop): thông tin bên trái, timeline bên phải
- Cột trái: buyer info, shipping address, payment, voucher, danh sách sản phẩm
- Cột phải: OrderStatusHistory timeline (newest first), tracking info

---

## 17. Trang Quản lý Kho hàng

**Route:** `/inventory`  
**Component:** `features/inventory/`

**Sections:**
- Alert banner: "5 sản phẩm sắp hết hàng · 2 đã hết hàng" (clickable → filter)
- Warehouse selector tabs (nếu có nhiều kho)
- Bảng tồn kho với row highlight (vàng = low, đỏ = out)
- Tab "Cảnh báo": danh sách InventoryAlerts với resolve action

**Bảng columns:**
- Tên sản phẩm + SKU
- Kho
- Tồn kho vật lý (PhysicalQty)
- Đang giữ (ReservedQty)
- Khả dụng (AvailableQty) — **highlight**
- Ngưỡng tối thiểu
- Trạng thái chip (Normal / Low / Out)
- Actions: [Điều chỉnh] [Lịch sử]

---

## 18. Trang Kết nối Sàn (OAuth2 Flow)

**Route:** `/platforms`  
**Component:** `features/platforms/`

**Layout: dạng card grid**

```
Mỗi Platform Card:
┌─────────────────────────────────┐
│  [Logo sàn]  Lazada Vietnam     │
│  Trạng thái: ● Active           │
│  Shop: My Shop VN               │
│  Sync lần cuối: 5 phút trước   │
│  Đơn hàng hôm nay: 12          │
│─────────────────────────────────│
│  [Sync ngay]  [Cài đặt]  [Ngắt]│
└─────────────────────────────────┘
```

**Sections:**
- Đã kết nối: danh sách connections active
- Chưa kết nối / Thêm mới: danh sách platforms available → nút "Kết nối"
- Token expired: banner warning đỏ với nút "Kết nối lại"

**OAuth2 Flow (F2-04):**
1. Click "Kết nối Lazada"
2. Backend trả redirect URL
3. Browser chuyển sang Lazada
4. User đăng nhập Lazada, authorize
5. Lazada redirect về `/platforms/callback/lazada?code=xxx&state=yyy`
6. Frontend gọi backend exchange token
7. Success → về `/platforms` với toast thành công

---

## 19. Trang AI Chat & Dự báo

**Route:** `/ai/chat` và `/ai/forecast`

### Chat Page

```
┌─────────────────────────────────────┐
│  Trợ lý AI ShopHub                  │
│─────────────────────────────────────│
│                                      │
│  [AI]: Xin chào! Tôi có thể giúp   │
│  gì cho bạn hôm nay?               │
│                              ─────  │
│                        [User: ...]  │
│                                      │
│  [AI]: Đơn hàng #123 hiện đang...  │
│  ┌────────────────┐                 │
│  │  Xem đơn hàng  │ ← suggested    │
│  └────────────────┘                 │
│  Bạn có muốn: [Hủy đơn?] [Theo dõi?]│
│─────────────────────────────────────│
│  [    Nhập tin nhắn...          ] ▶ │
└─────────────────────────────────────┘
```

### Forecast Page

```
┌────────────────────────────────────────┐
│  Dự báo doanh thu                      │
│                                        │
│  Sản phẩm: [Áo thun nam... ▼]         │
│  Sàn: [Tất cả ▼]  Khoảng: [30 ngày ▼]│
│  [  Chạy dự báo  ]                    │
│                                        │
│  Độ tin cậy: ████████░░ 82%           │
│                                        │
│  [  Area Chart dự báo doanh thu  ]    │
│                                        │
│  Nhận xét AI:                         │
│  • Xu hướng tăng 15% so với tháng trước│
│  • Doanh thu cao nhất vào cuối tuần   │
└────────────────────────────────────────┘
```

---

# PHẦN V — VẬN HÀNH

---

## 20. Phân chia vai trò & trách nhiệm

| Vai trò | Số người | Phụ trách |
|---------|----------|-----------|
| Senior Frontend Dev | 1 | Architecture, core infrastructure (apiClient, routing, real-time), performance, code review |
| Junior Frontend Dev | 1–2 | Feature pages (products, orders, inventory), component implementation, unit tests |
| UI/UX Designer | 0.5 (part-time) | Design system, Figma mockups cho các trang phức tạp |
| DevOps | 0.5 (shared với Backend) | Dockerfile, CI/CD pipeline |

**Phân chia task:**

Senior FE: F1-01, F1-02, F1-03, F1-04, F1-06, F2-01, F2-02, F2-03, F2-04, F3-01, F4-03, F5-01, F5-02, F6-01, F6-03, F6-04

Junior FE: F1-05, F3-02, F3-03, F3-04, F4-01, F4-02, F5-03, F5-04, F6-02

---

## 21. Rủi ro & biện pháp giảm thiểu

| Rủi ro | Mức độ | Biện pháp |
|--------|--------|-----------|
| Backend API thay đổi response format | Cao | Định nghĩa TypeScript interfaces từ sớm, kiểm tra thường xuyên. Dùng Zod để validate API response runtime và phát hiện breaking change sớm |
| OAuth2 Lazada callback URL phức tạp | Trung bình | Test với Lazada Sandbox từ Sprint 2. Chuẩn bị fallback UI rõ ràng cho mọi error case (denied, timeout, state mismatch) |
| SignalR không hoạt động qua proxy/load balancer | Trung bình | Cấu hình sticky session trên nginx. Fallback về long polling nếu WebSocket bị block |
| AI endpoint chậm (5-10 giây) | Trung bình | Loading skeleton trong suốt thời gian chờ. Typing indicator trực quan. Timeout 60s riêng cho AI calls |
| Bundle size quá lớn | Thấp | Lazy loading routes từ đầu. Monitor với `vite-bundle-visualizer` mỗi sprint. Tree-shake Recharts (import từng component thay vì toàn bộ) |
| TanStack Query cache stale data | Thấp | Thiết lập `staleTime` phù hợp từng endpoint. SignalR invalidation cho real-time data. Nút "Làm mới" cho user |
| CORS issue trong development | Thấp | Vite proxy config trong `vite.config.ts`. Không cần CORS header trong dev. Production dùng cùng domain hoặc cấu hình CORS đúng ở backend |

---

*Phiên bản 1.0 — Tài liệu kế hoạch Frontend ShopHub*  
*Dựa trên `ShopHub_Technical_Document_v4.md` (Backend) và `ShopHub_Database_Schema.md`*
