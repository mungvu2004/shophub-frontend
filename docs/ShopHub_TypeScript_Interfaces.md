# ShopHub Frontend — TypeScript Interfaces
**Nguồn gốc:** Đối chiếu trực tiếp từ `ShopHub_Database_Schema.md`
**Vị trí trong project:** `src/types/`
**Phiên bản:** 1.1 — Đã kiểm tra và bổ sung đầy đủ so với DB Schema

---

## Mục lục

1. [api.types.ts — Wrappers chung](#1-apitypests--wrappers-chung)
2. [auth.types.ts — Xác thực](#2-authtypests--xác-thực)
3. [platform.types.ts — Kết nối sàn](#3-platformtypests--kết-nối-sàn)
4. [product.types.ts — Sản phẩm](#4-producttypests--sản-phẩm)
5. [order.types.ts — Đơn hàng](#5-ordertypests--đơn-hàng)
6. [inventory.types.ts — Kho hàng](#6-inventorytypests--kho-hàng)
7. [ai.types.ts — AI & Forecast](#7-aitypests--ai--forecast)

---

## Ghi chú đối chiếu

| Ký hiệu | Ý nghĩa |
|---------|---------|
| ✅ | Field có trong DB, đã map đúng |
| ⚠️ | Field bị thiếu trong phiên bản trước, đã bổ sung |
| 💡 | Field không có trong DB (từ ASP.NET Identity hoặc denormalized) — hợp lệ |
| ❌ | Không map vào frontend (backend-only: RowVersion, RawPayload, Encrypted...) |

---

## 1. `api.types.ts` — Wrappers chung

**Nguồn:** Quy ước API response của Backend .NET, không map trực tiếp DB table nào.

```
// src/types/api.types.ts

// Wrapper chuẩn cho mọi API response đơn lẻ
interface ApiResponse<T> {
  data: T              // ✅ payload chính
  success: boolean     // ✅ true/false
  message?: string     // ✅ message tuỳ chọn từ server
}

// Wrapper cho response danh sách có cursor-based pagination
// Backend trả nextCursor thay vì totalPages vì dùng cursor-based pagination
interface PaginatedResponse<T> {
  items: T[]           // ✅ danh sách items
  nextCursor?: string  // ✅ cursor cho trang tiếp (undefined = hết data)
  hasMore: boolean     // ✅ còn data để load không
  totalCount?: number  // ✅ tổng số items (optional — không phải endpoint nào cũng trả)
}

// Cấu trúc lỗi chuẩn hoá từ .NET ProblemDetails (RFC 7807)
interface ApiError {
  status: number                        // ✅ HTTP status code
  title: string                         // ✅ "Validation Error", "Not Found"...
  detail: string                        // ✅ mô tả lỗi cụ thể
  errors?: Record<string, string[]>     // ✅ field-level validation errors
  traceId?: string                      // ✅ CorrelationId từ backend để debug
}
```

---

## 2. `auth.types.ts` — Xác thực

**Nguồn DB:** Bảng `Sellers`

```
// src/types/auth.types.ts

// Body gửi lên POST /auth/login
interface LoginRequest {
  email: string      // ✅ Sellers.Email
  password: string   // ✅ plain text → backend hash so sánh với Sellers.PasswordHash
}

// Response nhận từ POST /auth/login
// Lưu ý: refreshToken KHÔNG có trong body — backend set vào httpOnly Cookie
interface TokenResponse {
  accessToken: string  // ✅ JWT token in-memory
  expiresIn: number    // ✅ giây — dùng để tính thời điểm hết hạn
  tokenType: string    // ✅ luôn là "Bearer"
}

// Thông tin user đang đăng nhập — từ GET /auth/me
interface User {
  id: string                                         // ✅ Sellers.Id — UNIQUEIDENTIFIER
  email: string                                      // ✅ Sellers.Email
  fullName?: string                                  // ✅ Sellers.FullName — nullable
  phone?: string                                     // ✅ Sellers.Phone — nullable
  subscriptionTier: 'Free' | 'Pro' | 'Enterprise'  // ✅ Sellers.SubscriptionTier
  roles: string[]                                    // 💡 từ ASP.NET Identity — không có cột trong DB
  isActive: boolean                                  // ✅ Sellers.IsActive
  createdAt: string                                  // ✅ Sellers.CreatedAt — ISO 8601
  lastLoginAt?: string                               // ✅ Sellers.LastLoginAt — nullable
}
```

---

## 3. `platform.types.ts` — Kết nối sàn

**Nguồn DB:** Bảng `Platforms`, `PlatformConnections`

```
// src/types/platform.types.ts

// Type union cho mã sàn — map với Platforms.Code VARCHAR(30)
type PlatformCode = 'lazada' | 'shopee' | 'tiktok_shop'

// Map với bảng Platforms (seed data — ít thay đổi)
interface Platform {
  id: number          // ✅ Platforms.Id — INT
  code: PlatformCode  // ✅ Platforms.Code
  name: string        // ✅ Platforms.Name — "Lazada Vietnam"
  region: string      // ✅ Platforms.Region — "VN", "SG", "TH"...
  isActive: boolean   // ✅ Platforms.IsActive
}

// Map với bảng PlatformConnections
interface PlatformConnection {
  id: string                                                          // ✅ PlatformConnections.Id — UNIQUEIDENTIFIER
  sellerId: string                                                    // ✅ PlatformConnections.SellerId
  platformId: number                                                  // ✅ PlatformConnections.PlatformId
  platform: Platform                                                  // 💡 object Platform join từ backend
  appKey: string                                                      // ✅ PlatformConnections.AppKey
  externalShopId: string                                              // ✅ PlatformConnections.ExternalShopId
  externalShopName?: string                                           // ✅ PlatformConnections.ExternalShopName — nullable
  externalSellerId?: string                                           // ⚠️ PlatformConnections.ExternalSellerId — nullable (thiếu ở phiên bản trước)
  country?: string                                                    // ⚠️ PlatformConnections.Country — "VN"/"SG" (thiếu ở phiên bản trước)
  status: 'Active' | 'TokenExpired' | 'RefreshFailed' | 'Disconnected'  // ✅ PlatformConnections.Status
  connectedAt: string                                                 // ✅ PlatformConnections.ConnectedAt — ISO 8601
  lastTokenRefreshedAt?: string                                       // ⚠️ PlatformConnections.LastTokenRefreshedAt — nullable (thiếu ở phiên bản trước)
  lastSyncAt?: string                                                 // ✅ PlatformConnections.LastSyncAt — nullable
  isActive: boolean                                                   // ✅ PlatformConnections.IsActive

  // ❌ Không map vào frontend:
  // AccessToken — Encrypted, backend-only
  // RefreshToken — Encrypted, backend-only
  // AccessTokenExpiresAt — backend tự quản lý
  // RawTokenPayload — backend-only
}
```

---

## 4. `product.types.ts` — Sản phẩm

**Nguồn DB:** Bảng `Products`, `ProductVariants`, `PlatformSkuMappings`

```
// src/types/product.types.ts

type PlatformCode = 'lazada' | 'shopee' | 'tiktok_shop'  // re-export từ platform.types nếu cần

type ProductStatus = 'Active' | 'Inactive' | 'Deleted'   // ✅ Products.Status

// Map với bảng PlatformSkuMappings
interface PlatformSkuMapping {
  id: number                         // ✅ PlatformSkuMappings.Id — BIGINT
  variantId: string                  // ✅ PlatformSkuMappings.VariantId
  connectionId: string               // ✅ PlatformSkuMappings.ConnectionId
  platform: PlatformCode             // ✅ PlatformSkuMappings.Platform — denormalized
  externalProductId: string          // ✅ PlatformSkuMappings.ExternalProductId
  externalSkuId: string              // ✅ PlatformSkuMappings.ExternalSkuId
  externalShopSku?: string           // ⚠️ PlatformSkuMappings.ExternalShopSku — key lookup Lazada (thiếu ở phiên bản trước)
  externalSellerSku?: string         // ⚠️ PlatformSkuMappings.ExternalSellerSku — SKU do seller tự đặt (thiếu ở phiên bản trước)
  listingStatus: 'active' | 'inactive' | 'deleted'  // ✅ PlatformSkuMappings.ListingStatus
  currentListedPrice?: number        // ✅ PlatformSkuMappings.CurrentListedPrice — nullable
  currentSpecialPrice?: number       // ⚠️ PlatformSkuMappings.CurrentSpecialPrice — giá sale trên sàn (thiếu ở phiên bản trước)
  lastPriceSyncAt?: string           // ⚠️ PlatformSkuMappings.LastPriceSyncAt — nullable (thiếu ở phiên bản trước)
  lastSyncedAt: string               // ✅ PlatformSkuMappings.LastSyncedAt — ISO 8601
}

// Map với bảng ProductVariants
interface ProductVariant {
  id: string                              // ✅ ProductVariants.Id — UNIQUEIDENTIFIER
  productId: string                       // ✅ ProductVariants.ProductId
  internalSku: string                     // ✅ ProductVariants.InternalSku
  name?: string                           // ✅ ProductVariants.Name — "Đỏ / XL"
  attributesJson?: Record<string, string> // ✅ ProductVariants.AttributesJson — {"color_family":"Red","size":"XL"}
  basePrice: number                       // ✅ ProductVariants.BasePrice — DECIMAL(18,4)
  salePrice?: number                      // ✅ ProductVariants.SalePrice — nullable
  weight?: number                         // ⚠️ ProductVariants.Weight — kg (thiếu ở phiên bản trước)
  length?: number                         // ⚠️ ProductVariants.Length — cm (thiếu ở phiên bản trước)
  width?: number                          // ⚠️ ProductVariants.Width — cm (thiếu ở phiên bản trước)
  height?: number                         // ⚠️ ProductVariants.Height — cm (thiếu ở phiên bản trước)
  packageContent?: string                 // ⚠️ ProductVariants.PackageContent (thiếu ở phiên bản trước)
  mainImageUrl?: string                   // ✅ ProductVariants.MainImageUrl
  imagesJson?: string[]                   // ✅ ProductVariants.ImagesJson — array URLs
  status: 'Active' | 'Inactive'           // ✅ ProductVariants.Status
  isDeleted: boolean                      // ✅ ProductVariants.IsDeleted
  createdAt: string                       // ✅ ProductVariants.CreatedAt — ISO 8601
  updatedAt: string                       // ✅ ProductVariants.UpdatedAt — ISO 8601
  listings: PlatformSkuMapping[]          // 💡 join từ backend — không phải cột riêng
}

// Map với bảng Products
interface Product {
  id: string                          // ✅ Products.Id — UNIQUEIDENTIFIER
  sellerId: string                    // ✅ Products.SellerId
  name: string                        // ✅ Products.Name
  description?: string                // ✅ Products.Description — HTML content, nullable
  shortDescription?: string           // ⚠️ Products.ShortDescription — nullable (thiếu ở phiên bản trước)
  brand?: string                      // ✅ Products.Brand — nullable
  model?: string                      // ⚠️ Products.Model — nullable (thiếu ở phiên bản trước)
  warrantyInfo?: string               // ⚠️ Products.WarrantyInfo — nullable (thiếu ở phiên bản trước)
  status: ProductStatus               // ✅ Products.Status
  source: 'manual' | 'platform_sync' // ✅ Products.Source
  isDeleted: boolean                  // ✅ Products.IsDeleted — soft delete
  createdAt: string                   // ✅ Products.CreatedAt — ISO 8601
  updatedAt: string                   // ✅ Products.UpdatedAt — ISO 8601
  variants: ProductVariant[]          // 💡 join từ backend — không phải cột riêng
}
```

---

## 5. `order.types.ts` — Đơn hàng

**Nguồn DB:** Bảng `Orders`, `OrderItems`, `OrderStatusHistory`

> **Lưu ý:** Interface này chưa có trong phiên bản trước của plan. Cần bổ sung ngay vì **Sprint 3 (Dashboard)** đã gọi `GET /orders` để tính doanh thu.

```
// src/types/order.types.ts

// Canonical Order Status — map với Orders.Status VARCHAR(30)
type OrderStatus =
  | 'Pending'         // Lazada: pending       / Shopee: UNPAID
  | 'PendingPayment'  // Lazada: pending_payment
  | 'Confirmed'       // Lazada: confirmed     / Shopee: PROCESSED
  | 'Packed'          // Lazada: packed        / Shopee: PROCESSED
  | 'ReadyToShip'     // Lazada: ready_to_ship / Shopee: READY_TO_SHIP
  | 'Shipped'         // Lazada: shipped       / Shopee: SHIPPED
  | 'Delivered'       // Lazada: delivered     / Shopee: COMPLETED
  | 'FailedDelivery'  // Lazada: failed_delivery
  | 'Cancelled'       // Lazada: canceled      / Shopee: CANCELLED
  | 'Returned'        // Lazada: returned
  | 'Refunded'        // Lazada: refunded
  | 'Lost'            // Lazada: lost

// Map màu cho StatusBadge component — dùng trong constants.ts
// Đặt ở đây để tham chiếu khi implement component
// const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = { ... }

// Map với bảng Orders
interface Order {
  id: string                                          // ✅ Orders.Id — UNIQUEIDENTIFIER
  sellerId: string                                    // ✅ Orders.SellerId
  connectionId: string                                // ✅ Orders.ConnectionId
  platform: PlatformCode                              // ✅ Orders.Platform — label denormalized
  externalOrderId: string                             // ✅ Orders.ExternalOrderId
  externalOrderNumber?: string                        // ✅ Orders.ExternalOrderNumber — nullable
  paymentMethod?: 'COD' | 'Online' | 'Wallet'        // ✅ Orders.PaymentMethod — nullable
  totalAmount: number                                 // ✅ Orders.TotalAmount — DECIMAL(18,4)
  currency: string                                    // ✅ Orders.Currency — "VND", "SGD"
  status: OrderStatus                                 // ✅ Orders.Status
  giftOption: boolean                                 // ✅ Orders.GiftOption
  giftMessage?: string                                // ✅ Orders.GiftMessage — nullable
  voucherCode?: string                                // ✅ Orders.VoucherCode — nullable
  buyerFirstName?: string                             // ✅ Orders.BuyerFirstName — nullable
  buyerLastName?: string                              // ✅ Orders.BuyerLastName — nullable
  buyerPhone?: string                                 // ✅ Orders.BuyerPhone — nullable
  buyerEmail?: string                                 // ✅ Orders.BuyerEmail — nullable
  shippingAddress?: string                            // ✅ Orders.ShippingAddress — đã nối sẵn
  shippingCity?: string                               // ✅ Orders.ShippingCity — nullable
  shippingPostCode?: string                           // ✅ Orders.ShippingPostCode — nullable
  shippingCountry?: string                            // ✅ Orders.ShippingCountry — nullable
  source: 'platform_sync' | 'platform_webhook' | 'manual'  // ✅ Orders.Source
  isDeleted: boolean                                  // ✅ Orders.IsDeleted
  createdAt_platform: string                          // ✅ Orders.CreatedAt_Platform — ISO 8601 — thời gian tạo trên sàn
  updatedAt_platform: string                          // ✅ Orders.UpdatedAt_Platform — ISO 8601 — dùng làm cursor sync
  createdAt: string                                   // ✅ Orders.CreatedAt — thời gian ShopHub nhận
  updatedAt: string                                   // ✅ Orders.UpdatedAt
  items?: OrderItem[]                                 // 💡 join từ backend khi gọi GET /orders/:id

  // ❌ Không map vào frontend:
  // RowVersion — backend optimistic concurrency
}

// Map với bảng OrderItems
interface OrderItem {
  id: string                          // ✅ OrderItems.Id — UNIQUEIDENTIFIER
  orderId: string                     // ✅ OrderItems.OrderId
  variantId?: string                  // ✅ OrderItems.VariantId — nullable nếu chưa map được SKU
  externalOrderItemId: string         // ✅ OrderItems.ExternalOrderItemId
  externalSkuRef?: string             // ✅ OrderItems.ExternalSkuRef — nullable
  productName: string                 // ✅ OrderItems.ProductName — snapshot tên lúc đặt hàng
  variantAttributes?: string          // ✅ OrderItems.VariantAttributes — snapshot "Đỏ / XL"
  qty: number                         // ✅ OrderItems.Qty — Lazada luôn = 1, Shopee có thể > 1
  itemPrice: number                   // ✅ OrderItems.ItemPrice
  paidPrice: number                   // ✅ OrderItems.PaidPrice
  voucherAmount?: number              // ✅ OrderItems.VoucherAmount — nullable
  shippingFeeOriginal?: number        // ✅ OrderItems.ShippingFeeOriginal — nullable
  currency?: string                   // ✅ OrderItems.Currency — nullable
  status: OrderStatus                 // ✅ OrderItems.Status
  trackingCode?: string               // ✅ OrderItems.TrackingCode — nullable
  shipmentProvider?: string           // ✅ OrderItems.ShipmentProvider — nullable
  promisedShippingTime?: string       // ✅ OrderItems.PromisedShippingTime — nullable ISO 8601
  isFulfilledByPlatform: boolean      // ✅ OrderItems.IsFulfilledByPlatform
  isDigital: boolean                  // ✅ OrderItems.IsDigital
  returnStatus?: string               // ✅ OrderItems.ReturnStatus — nullable
  cancelReason?: string               // ✅ OrderItems.CancelReason — nullable
}

// Map với bảng OrderStatusHistory (Immutable)
interface OrderStatusHistory {
  id: number                          // ✅ OrderStatusHistory.Id — BIGINT
  orderId: string                     // ✅ OrderStatusHistory.OrderId
  orderItemId?: string                // ✅ OrderStatusHistory.OrderItemId — nullable nếu status ở level Order
  oldStatus?: OrderStatus             // ✅ OrderStatusHistory.OldStatus — nullable = record đầu tiên
  newStatus: OrderStatus              // ✅ OrderStatusHistory.NewStatus
  platformStatus?: string             // ✅ OrderStatusHistory.PlatformStatus — giá trị gốc từ sàn
  source: 'platform_webhook' | 'platform_sync' | 'reconciliation' | 'manual'  // ✅ OrderStatusHistory.Source
  webhookInboxId?: number             // ✅ OrderStatusHistory.WebhookInboxId — nullable
  externalRequestId?: string          // ✅ OrderStatusHistory.ExternalRequestId — nullable
  note?: string                       // ✅ OrderStatusHistory.Note — nullable
  changedAt: string                   // ✅ OrderStatusHistory.ChangedAt — ISO 8601
}
```

---

## 6. `inventory.types.ts` — Kho hàng

**Nguồn DB:** Bảng `Warehouses`, `StockLevels`, `StockMovements`, `InventoryAlerts`

```
// src/types/inventory.types.ts

// Map với bảng Warehouses
interface Warehouse {
  id: string           // ✅ Warehouses.Id — UNIQUEIDENTIFIER
  sellerId: string     // ✅ Warehouses.SellerId
  name: string         // ✅ Warehouses.Name
  addressLine1?: string // ✅ Warehouses.AddressLine1 — nullable
  city?: string        // ✅ Warehouses.City — nullable
  country?: string     // ✅ Warehouses.Country — nullable
  isDefault: boolean   // ✅ Warehouses.IsDefault
  isActive: boolean    // ✅ Warehouses.IsActive
  createdAt: string    // ✅ Warehouses.CreatedAt — ISO 8601
}

// Map với bảng StockLevels (nguồn sự thật tồn kho vật lý)
interface StockLevel {
  id: string              // ✅ StockLevels.Id — UNIQUEIDENTIFIER
  variantId: string       // ✅ StockLevels.VariantId
  warehouseId: string     // ✅ StockLevels.WarehouseId
  warehouseName: string   // 💡 denormalized — backend join trả về kèm
  physicalQty: number     // ✅ StockLevels.PhysicalQty — tồn kho vật lý thực tế
  reservedQty: number     // ✅ StockLevels.ReservedQty — đang giữ chờ fulfilled
  availableQty: number    // ✅ StockLevels.AvailableQty — Computed: PhysicalQty - ReservedQty
  minThreshold: number    // ✅ StockLevels.MinThreshold — ngưỡng cảnh báo LOW_STOCK
  maxThreshold?: number   // ✅ StockLevels.MaxThreshold — nullable — ngưỡng OVERSTOCK
  updatedAt: string       // ✅ StockLevels.UpdatedAt — ISO 8601

  // ❌ Không map vào frontend:
  // RowVersion — backend optimistic concurrency
}

// Enum MovementType — map với StockMovements.MovementType VARCHAR(30)
type MovementType =
  | 'ORDER_RESERVE'      // Đơn hàng mới → giữ chỗ hàng
  | 'ORDER_RELEASE'      // Đơn bị hủy → giải phóng hàng
  | 'ORDER_FULFILL'      // Đơn giao thành công → xuất kho thật
  | 'RETURN_RECEIVED'    // Hàng trả về → nhập kho
  | 'MANUAL_ADJUSTMENT'  // Điều chỉnh thủ công sau kiểm kê
  | 'IMPORT'             // Nhập hàng mới từ nhà cung cấp
  | 'DAMAGE_LOSS'        // Hàng hỏng hoặc thất lạc
  | 'TRANSFER_OUT'       // Chuyển hàng sang kho khác
  | 'TRANSFER_IN'        // Nhận hàng từ kho khác

// Map với bảng StockMovements (Immutable audit log)
interface StockMovement {
  id: number                // ✅ StockMovements.Id — BIGINT
  variantId: string         // ✅ StockMovements.VariantId
  warehouseId: string       // ✅ StockMovements.WarehouseId
  movementType: MovementType // ✅ StockMovements.MovementType
  delta: number             // ✅ StockMovements.Delta — dương = nhập, âm = xuất
  qtyBefore: number         // ✅ StockMovements.QtyBefore — snapshot trước thay đổi
  qtyAfter: number          // ✅ StockMovements.QtyAfter — snapshot sau thay đổi
  refOrderItemId?: string   // ✅ StockMovements.RefOrderItemId — nullable
  reason?: string           // ✅ StockMovements.Reason — nullable
  note?: string             // ✅ StockMovements.Note — nullable
  createdAt: string         // ✅ StockMovements.CreatedAt — ISO 8601
  createdBy: string         // ✅ StockMovements.CreatedBy — UserId hoặc "system"
}

// Map với bảng InventoryAlerts
interface InventoryAlert {
  id: string                    // ✅ InventoryAlerts.Id — UNIQUEIDENTIFIER
  sellerId: string              // ✅ InventoryAlerts.SellerId
  variantId: string             // ✅ InventoryAlerts.VariantId
  warehouseId?: string          // ✅ InventoryAlerts.WarehouseId — nullable
  productName: string           // 💡 denormalized — backend join từ ProductVariants
  internalSku: string           // 💡 denormalized — backend join từ ProductVariants
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'SLOW_MOVING'  // ✅ InventoryAlerts.AlertType
  severity: 'Info' | 'Warning' | 'Critical'  // ✅ InventoryAlerts.Severity
  currentPhysicalQty?: number   // ⚠️ InventoryAlerts.CurrentPhysicalQty — snapshot lúc tạo alert (thiếu ở phiên bản trước)
  currentAvailableQty?: number  // ✅ InventoryAlerts.CurrentAvailableQty — nullable
  daysUntilStockout?: number    // ✅ InventoryAlerts.DaysUntilStockout — nullable
  suggestedRestockQty?: number  // ✅ InventoryAlerts.SuggestedRestockQty — nullable
  message: string               // ✅ InventoryAlerts.Message
  forecastResultId?: string     // ⚠️ InventoryAlerts.ForecastResultId — nullable, link sang ForecastResults (thiếu ở phiên bản trước)
  isResolved: boolean           // ✅ InventoryAlerts.IsResolved
  resolvedAt?: string           // ⚠️ InventoryAlerts.ResolvedAt — nullable ISO 8601 (thiếu ở phiên bản trước)
  notificationSentAt?: string   // ⚠️ InventoryAlerts.NotificationSentAt — nullable ISO 8601 (thiếu ở phiên bản trước)
  createdAt: string             // ✅ InventoryAlerts.CreatedAt — ISO 8601
}
```

---

## 7. `ai.types.ts` — AI & Forecast

**Nguồn DB:** Bảng `ForecastResults`, `ChatSessions`

> **Lưu ý:** Các interface AI chưa cần trong Sprint 0–4. Khai báo trước để hoàn chỉnh bộ types.

```
// src/types/ai.types.ts

// Tin nhắn trong phiên chat
interface ChatMessage {
  role: 'user' | 'assistant'  // 💡 convention API, không phải DB column
  content: string
  timestamp: string            // ISO 8601
}

// Body gửi lên POST /ai/chat/sessions/:id/messages
interface ChatRequest {
  sessionId: string
  history: ChatMessage[]
  currentMessage: string
  userId: string
  language?: 'vi' | 'en'
}

// Response từ POST /ai/chat/sessions/:id/messages
interface ChatResponse {
  replyMessage: string
  sessionId: string
  confidenceScore: number                                    // 0.0 – 1.0
  suggestedAction?: 'VIEW_ORDER' | 'CREATE_TICKET' | null
  followUpQuestions: string[]
}

// Map với bảng ChatSessions (metadata phiên — lịch sử lưu trong Redis)
interface ChatSession {
  id: string              // ✅ ChatSessions.Id — UNIQUEIDENTIFIER
  sessionKey: string      // ✅ ChatSessions.SessionKey — Redis key
  messageCount: number    // ✅ ChatSessions.MessageCount
  startedAt: string       // ✅ ChatSessions.StartedAt — ISO 8601
  lastActivityAt: string  // ✅ ChatSessions.LastActivityAt — ISO 8601
}

// Một điểm dự báo trong chuỗi thời gian
interface ForecastPoint {
  date: string              // ISO 8601
  predictedRevenue: number
  lowerBound: number        // confidence interval lower
  upperBound: number        // confidence interval upper
}

// Response từ POST /ai/forecast/sales — map với ForecastResults
interface SalesForecastResult {
  id: string                    // ✅ ForecastResults.Id — UNIQUEIDENTIFIER
  entityType: 'Product'         // ✅ ForecastResults.EntityType
  entityId: string              // ✅ ForecastResults.EntityId
  forecastType: 'SalesRegression'  // ✅ ForecastResults.ForecastType
  productId: string             // 💡 alias cho entityId khi entityType = Product
  forecast: ForecastPoint[]     // 💡 parse từ ForecastResults.ResultPayload JSON
  rSquared: number              // ✅ ForecastResults.RSquared — 0.0000–1.0000
  modelVersion?: string         // ✅ ForecastResults.ModelVersion — nullable
  insights: string[]            // 💡 parse từ ResultPayload
  forecastHorizonDays?: number  // ✅ ForecastResults.ForecastHorizonDays — nullable
  isStale: boolean              // ✅ ForecastResults.IsStale
  createdAt: string             // ✅ ForecastResults.CreatedAt — ISO 8601
  expiresAt?: string            // ✅ ForecastResults.ExpiresAt — nullable ISO 8601
}

// Response từ POST /ai/forecast/inventory
interface InventoryForecastResult {
  warehouseId: string
  alerts: Array<{
    alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK'
    sku: string
    daysUntilStockout?: number
  }>
  recommendedRestockDate?: string
  suggestedOrderQty: Record<string, number>  // { "SKU-001": 50, "SKU-002": 30 }
  confidence: number
}
```

---

## Tổng kết — Danh sách file cần tạo

| File | Interfaces / Types | Dùng từ Sprint |
|------|--------------------|----------------|
| `src/types/api.types.ts` | `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError` | Sprint 0 |
| `src/types/auth.types.ts` | `LoginRequest`, `TokenResponse`, `User` | Sprint 0 |
| `src/types/platform.types.ts` | `PlatformCode`, `Platform`, `PlatformConnection` | Sprint 0 |
| `src/types/product.types.ts` | `ProductStatus`, `Product`, `ProductVariant`, `PlatformSkuMapping` | Sprint 0 |
| `src/types/order.types.ts` | `OrderStatus`, `Order`, `OrderItem`, `OrderStatusHistory` | Sprint 0 (dùng từ Sprint 3) |
| `src/types/inventory.types.ts` | `Warehouse`, `StockLevel`, `MovementType`, `StockMovement`, `InventoryAlert` | Sprint 0 (dùng từ Sprint 3) |
| `src/types/ai.types.ts` | `ChatMessage`, `ChatRequest`, `ChatResponse`, `ChatSession`, `SalesForecastResult`, `InventoryForecastResult`, `ForecastPoint` | Sprint 0 (dùng từ Sprint 5) |

---

*Phiên bản 1.1 — Đã đối chiếu với `ShopHub_Database_Schema.md`*
*Bổ sung: 15 fields còn thiếu, 6 interfaces chưa có (Warehouse, Order, OrderItem, OrderStatusHistory, StockMovement, MovementType)*
