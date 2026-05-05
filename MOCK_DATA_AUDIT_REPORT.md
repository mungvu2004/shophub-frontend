# Báo cáo Kiểm toán Dữ liệu Mock (Mock Data Audit Report)

**Ngày kiểm toán:** 05/05/2026  
**Người kiểm toán:** Senior Backend Engineer & Data Architect  
**Phạm vi:** Toàn bộ thư mục `src/mocks/data/` (35 tệp — 34 tệp dữ liệu + 1 tệp debug utility)  
**Mục tiêu:** Đảm bảo tính toàn vẹn tham chiếu (Referential Integrity) và tính nhất quán dữ liệu

---

## Tổng quan (Executive Summary)

| Mức độ nghiêm trọng | Số lượng vấn đề |
|---|---|
| 🔴 CRITICAL (Vi phạm tham chiếu, crash/dữ liệu sai hoàn toàn) | 6 |
| 🟠 MAJOR (Dữ liệu không nhất quán giữa các module) | 9 |
| 🟡 MODERATE (Vấn đề chất lượng, phi tất định) | 11 |
| **Tổng** | **26** |

> **Lần verify:** Kiểm toán lần 2 bổ sung 5 vấn đề mới từ 8 tệp chưa đọc lần đầu: `footer.ts`, `debug-products.ts`, `revenueMLScenarios.ts`, `settingsAutomation.ts`, `settingsAutomationBuilder.ts`, `settingsAutomationLogs.ts`, `settingsProfile.ts`, `settingsStaffPermissionsInvite.ts`.

---

## 🔴 CRITICAL — Vi phạm Tham chiếu (Referential Integrity Violations)

### [C-01] Orphaned `connectionId: pc-004` — không tồn tại trong `mockPlatformConnections`

| Thuộc tính | Giá trị |
|---|---|
| **Tệp bị ảnh hưởng** | `products.ts`, `orders.ts` |
| **Tệp gốc (nguồn sự thật)** | `platforms.ts` |

**Mô tả:**  
`platforms.ts` chỉ định nghĩa 3 kết nối platform: `pc-001` (Shopee), `pc-002` (Lazada), `pc-003` (TikTok Shop).

Tuy nhiên, cả `products.ts` và `orders.ts` đều dùng công thức `pc-${(n % 4) + 1}` để tạo `connectionId`, sinh ra 4 giá trị: `pc-001`, `pc-002`, `pc-003`, **`pc-004`**.

```typescript
// products.ts & orders.ts — BUG
connectionId: `pc-${String((n % 4) + 1).padStart(3, "0")}`,
// → pc-001, pc-002, pc-003, pc-004  (pc-004 không tồn tại!)

// platforms.ts — chỉ có 3 connections
{ id: "pc-001", platform: "shopee", ... },
{ id: "pc-002", platform: "lazada", ... },
{ id: "pc-003", platform: "tiktok_shop", ... },
```

**Tác động:** Bất kỳ lookup nào qua `connectionId` cho ~25% sản phẩm và đơn hàng (n ≡ 3 mod 4) sẽ trả về `undefined`.

**Fix đề xuất:** Đổi `n % 4` thành `n % 3` trong cả hai tệp.

---

### [C-02] Sai định dạng `stockLevelId` trong `inventoryAdjustments.ts`

| Thuộc tính | Giá trị |
|---|---|
| **Tệp bị ảnh hưởng** | `inventoryAdjustments.ts` |
| **Tệp gốc (nguồn sự thật)** | `inventory.ts` |

**Mô tả:**  
`inventory.ts` tạo `StockLevel.id` với padding 4 chữ số:

```typescript
// inventory.ts — đúng
id: `sl-${String(variantIndex + 1).padStart(4, "0")}`,
// → sl-0001, sl-0002, sl-0003, ...
```

Nhưng `inventoryAdjustments.ts` tham chiếu bằng format không có padding:

```typescript
// inventoryAdjustments.ts — SAI
stockLevelId: `sl-${n}`,
// → sl-1, sl-2, sl-3, ...  (KHÔNG KHỚP với sl-0001, sl-0002)
```

**Tác động:** Không thể join/lookup `StockAdjustment` với `StockLevel`. 100% `stockLevelId` trong 20 adjustment records đều là orphaned references.

**Fix đề xuất:** Đổi thành `` `sl-${String(n).padStart(4, "0")}` `` trong `inventoryAdjustments.ts`.

---

### [C-03] SKU format 4 chữ số (products.ts) vs. 3 chữ số (toàn bộ hệ thống)

| Thuộc tính | Giá trị |
|---|---|
| **Tệp bị ảnh hưởng** | `products.ts` |
| **Tệp tham chiếu** | `inventoryAdjustments.ts`, `inventoryExtended.ts`, `stockMovements.mock.ts`, `productsCompetitorTracking.ts`, `revenue.ts`, `dashboardAlertsNotifications.ts` |

**Mô tả:**  
`products.ts` tạo SKU với **4** chữ số:

```typescript
// products.ts
internalSku: `SKU-${String(n).padStart(4, "0")}`,
// → SKU-0001, SKU-0002, ..., SKU-0062
```

Toàn bộ các tệp khác trong hệ thống dùng SKU **3** chữ số:

```typescript
// inventoryExtended.ts — SAI
'SKU-001': [...],  'SKU-003': [...],  'SKU-005': [...]

// inventoryAdjustments.ts — SAI
sku: `SKU-${String(n % 20 + 1).padStart(3, '0')}`,  // → SKU-001

// stockMovements.mock.ts — SAI
skuList: ['SKU-001', 'SKU-003', 'SKU-005', ...]

// productsCompetitorTracking.ts — SAI
productIds: ['SKU-001', 'SKU-003', ...]

// revenue.ts productProfits — SAI
sku: 'SKU-001',  sku: 'SKU-003',  sku: 'SKU-004'
```

**Tác động:** `SKU-001` ≠ `SKU-0001`. Không thể tra cứu SKU từ bất kỳ module nào ngoài `products.ts`. Đây là lỗi hệ thống lan rộng nhất trong toàn bộ mock data.

**Fix đề xuất:** Chuẩn hóa về 3 chữ số (thay đổi `products.ts`: `padStart(3, "0")`).

---

### [C-04] Dữ liệu nhân viên hoàn toàn không khớp với `auth.ts`

| Thuộc tính | Giá trị |
|---|---|
| **Tệp bị ảnh hưởng** | `settingsStaffPermissions.ts`, `settingsStaffPermissionsActivities.ts` |
| **Tệp gốc (nguồn sự thật)** | `auth.ts` (MOCK_USERS) |

**Mô tả:**  
`auth.ts` định nghĩa 5 user với thông tin cụ thể. Cả `settingsStaffPermissions.ts` và `settingsStaffPermissionsActivities.ts` dùng cùng một tập tên/email khác hoàn toàn:

| ID | `auth.ts` (MOCK_USERS) | `settingsStaffPermissions.ts` |
|---|---|---|
| seller-001 | Nguyễn Hoàng Minh · Owner/Admin | **Nguyễn Thị Hương** · Chủ shop |
| seller-002 | Trần Thị Linh · Operations | **Trần Văn Huy** · Quản lý vận hành |
| seller-003 | Phạm Văn Khoa · Warehouse | **Phạm Minh Tuấn** · Nhân viên kho |
| seller-004 | Nguyễn Thị Hương · Marketing | **Lê Thị Hương** · Marketing Analyst |
| seller-005 | Vũ Quý Nam · Viewer (**inactive**) | **Hoàng Đức Linh** · Viewer (**active**) |

**Thêm vào đó:** Email format không khớp:
- `auth.ts` → `minh.nguyen@shophub.vn`
- `settingsStaffPermissions.ts` → `seller-001@shophub.vn`

**Tác động:** Toàn bộ màn hình "Nhân viên & Phân quyền" hiển thị dữ liệu không liên quan đến người dùng đang đăng nhập. Trạng thái `isActive: false` của seller-005 bị bỏ qua.

---

### [C-05] Warehouse ID format hoàn toàn khác nhau giữa các module

| Thuộc tính | Giá trị |
|---|---|
| **Tệp gốc (nguồn sự thật)** | `inventory.ts` (mockWarehouses) |
| **Tệp bị ảnh hưởng** | `inventoryExtended.ts`, `stockMovements.mock.ts` |

**Mô tả:**  
`inventory.ts` (mockWarehouses) định nghĩa chỉ 2 kho với format `wh-XXX`:

```typescript
// inventory.ts — nguồn sự thật
{ id: "wh-001", name: "Main Warehouse HCM" },
{ id: "wh-002", name: "Secondary Warehouse Ha Noi" },
```

Các tệp khác tự chế ra các ID kho hoàn toàn khác:

```typescript
// inventoryExtended.ts (mockSKUBatches) — SAI
warehouseId: 'WH_HN_01'    // kho Hà Nội không tồn tại trong mockWarehouses
warehouseId: 'WH_HCM_01'   // id format khác: WH_XXX vs wh-XXX
warehouseId: 'WH_BT_01'    // "Bình Thạnh" không tồn tại
warehouseId: 'WH_TB_01'    // "Tân Bình" không tồn tại

// stockMovements.mock.ts — SAI
warehouseId: `WH_${String(n % 5).padStart(2, '0')}_01`
// → WH_00_01, WH_01_01, WH_02_01, WH_03_01, WH_04_01 — không cái nào khớp
```

**Tác động:** `StockBatch.warehouseId` và các extended stock movement không thể join với `Warehouse`. 4 warehouse ID ghost xuất hiện trong dữ liệu.

---

### [C-06] `settingsProfile.ts` — Thông tin người dùng đăng nhập hoàn toàn sai

| Thuộc tính | Giá trị |
|---|---|
| **Tệp bị ảnh hưởng** | `settingsProfile.ts` |
| **Tệp gốc (nguồn sự thật)** | `auth.ts` (MOCK_CURRENT_USER) |

**Mô tả:**  
`auth.ts` định nghĩa user đang đăng nhập (`MOCK_CURRENT_USER`) là `seller-001`. Nhưng `settingsProfile.ts` hiển thị một người hoàn toàn khác:

| Trường | `auth.ts` MOCK_CURRENT_USER | `settingsProfile.ts` identity |
|---|---|---|
| `fullName` | `Nguyễn Hoàng Minh` | **`Nguyễn Thị Hương`** |
| `email` | `minh.nguyen@shophub.vn` | **`seller-001@shophub.vn`** |
| `phone` | `+84 909 123 456` | **`+84 901 234 567`** |

**Lưu ý thêm:** Email format `seller-001@shophub.vn` không nhất quán với format thực tế trong `auth.ts` (`minh.nguyen@shophub.vn`).

**Tác động:** Trang Profile Settings hiển thị đúng `seller-001` ID nhưng thuộc về một người khác hoàn toàn. Bất kỳ tính năng chỉnh sửa profile nào cũng sẽ cập nhật dữ liệu sai người.

---

## 🟠 MAJOR — Dữ liệu Không nhất quán giữa Modules

### [M-01] `tiktok` vs `tiktok_shop` — Platform code không nhất quán

**Tệp bị ảnh hưởng:** `crm.ts`, `crmCustomerProfiles.ts`, `crmSentimentAnalysis.ts`, `dashboard.ts`

**Mô tả:**  
`PlatformCode` type chuẩn là `"shopee" | "lazada" | "tiktok_shop"`. Tuy nhiên nhiều tệp dùng `"tiktok"`:

```typescript
// crm.ts — SAI
platform: (['shopee', 'tiktok', 'lazada'] as const)[n % 3]
//                      ↑ thiếu _shop

// crmCustomerProfiles.ts — SAI
platformLabels: [{ id: 'tiktok', label: 'TikTok Shop', tone: 'tiktok' }]

// crmSentimentAnalysis.ts — SAI
{ id: 'tiktok', label: 'TikTok', value: 45 }

// dashboard.ts — SAI (định nghĩa type riêng)
type DashboardPlatformCode = "lazada" | "shopee" | "tiktok"  // thiếu _shop
```

**Tác động:** Filter/group theo platform sẽ bị vỡ. Dữ liệu CRM review với `platform: 'tiktok'` sẽ không match với `orders.platform: 'tiktok_shop'`.

---

### [M-02] CRM Customer Profile tham chiếu Order ID sai format

**Tệp bị ảnh hưởng:** `crmCustomerProfiles.ts`  
**Tệp gốc (nguồn sự thật):** `orders.ts`

**Mô tả:**

```typescript
// orders.ts — đúng
id: `ord-${String(n).padStart(3, "0")}`,
// → ord-001, ord-002, ...

// crmCustomerProfiles.ts — SAI
orders: [
  { id: 'order-001', orderCode: 'SPE-001001', ... },  // order-001 ≠ ord-001
  { id: 'order-002', orderCode: 'LAZ-001002', ... },
  { id: 'order-101', orderCode: 'TIK-001003', ... },  // format orderCode không khớp
]
```

`externalOrderNumber` trong `orders.ts` có format `SHOPEE-1001`, `LAZADA-1002`... không phải `SPE-001001`.

**Tác động:** Không thể link Customer Profile với Order thực tế. Đường timeline hành trình khách hàng bị đứt.

---

### [M-03] Revenue Profit Flow sai về mặt kế toán

**Tệp bị ảnh hưởng:** `revenue.ts` (`revenueSummaryReportMock`)

**Mô tả:**  
`profitFlow` trình bày sai logic kế toán cơ bản:

```typescript
// revenue.ts — profitFlow
{ id: 'pf-revenue',      label: 'Doanh thu gộp',   amount: 8_700_000, kind: 'increase' },
{ id: 'pf-platform-fee', label: 'Phí sàn',          amount: 500_000,   kind: 'decrease' },
{ id: 'pf-shipping',     label: 'Phí vận chuyển',   amount: 450_000,   kind: 'decrease' },
{ id: 'pf-ads',          label: 'Phí quảng cáo',    amount: 250_000,   kind: 'decrease' },
{ id: 'pf-packaging',    label: 'Đóng gói',         amount: 100_000,   kind: 'decrease' },
{ id: 'pf-net-profit',   label: 'Lợi nhuận ròng',  amount: 7_400_000, kind: 'total' },
// 8.7M - 1.3M = 7.4M ← đây là lợi nhuận sau chi phí vận hành, KHÔNG phải lợi nhuận ròng

// Nhưng KPI lại có:
{ id: 'gross-profit', value: 2_610_000 }  // = 30% × 8.7M (lợi nhuận gộp sau COGS)
```

**Vấn đề:** Nếu `gross-profit` = 2,610,000 (sau trừ giá vốn COGS), thì `net-profit` sau chi phí vận hành phải là ≤ 2,610,000 − 1,300,000 = 1,310,000. Nhưng `profitFlow` ghi `net-profit` = 7,400,000 (chưa trừ COGS). Hai con số mâu thuẫn nghiêm trọng.

---

### [M-04] Revenue Top Products dùng ID giả, không tham chiếu `mockProducts`

**Tệp bị ảnh hưởng:** `revenue.ts` (`revenueSummaryReportMock.topProducts`)

```typescript
// revenue.ts — SAI (id giả)
topProducts: [
  { id: 'tp-1', name: 'Áo thun basic trắng - SKU-001', revenue: 1_200_000 },
  { id: 'tp-2', name: 'Quần jean slim fit xanh - SKU-003', revenue: 950_000 },
  ...
]

// Phải là (từ products.ts)
{ id: 'prod-001', name: 'Áo thun basic trắng - SKU001', ... }
```

Ngoài ra, `productProfits` (pp-4 đến pp-7) chứa sản phẩm **hoàn toàn không tồn tại** trong catalog (clothing store):

```typescript
{ id: 'pp-4', name: 'Giày Sneakers Urban 2.0',  sku: 'SKU-SHOE-URB-20' },  // Không có trong products.ts
{ id: 'pp-5', name: 'Thắt Lưng Da Bò Ý',        sku: 'SKU-BELT-IT-02'  },  // Không có trong products.ts
{ id: 'pp-6', name: 'Áo Sơ Mi Linen White',      sku: 'SKU-SHI-LN-WH'  },  // SKU format không hợp lệ
{ id: 'pp-7', name: 'Đồng Hồ Chrono X',          sku: 'SKU-WAT-CHX-9'  },  // Không có trong products.ts
```

---

### [M-05] Platform Connections dữ liệu mâu thuẫn giữa hai tệp

| Thuộc tính | `platforms.ts` | `settingsPlatformConnections.ts` |
|---|---|---|
| Shopee shop ID | `sp-shop-vn-01` | `shopee-shop-12345` |
| Shopee shop name | `Shopee VN Main` | `TechGear Official Store` |
| Lazada shop ID | `lz-shop-vn-01` | `lazada-shop-34567` |
| Lazada shop name | `Lazada VN Store` | `TechGear Store` |
| TikTok shop ID | `tt-shop-vn-01` | `tiktok-shop-56789` |
| TikTok shop name | `TikTok Shop VN` | `GearVN Official` |

Ngoài ra: Shop name "TechGear" / "GearVN" là tên cửa hàng công nghệ trong khi toàn bộ sản phẩm là **thời trang (quần áo)**. Brand identity mâu thuẫn.

---

### [M-06] `dailyRevenueBreakdown` sử dụng `new Date()` runtime — kết quả luôn trống

**Tệp bị ảnh hưởng:** `dashboardRevenueOrders.ts`

**Mô tả:**  
`dailyRevenueBreakdown` xây dựng window 30 ngày từ `new Date()` (ngày hiện tại lúc runtime):

```typescript
// dashboardRevenueOrders.ts — BUG
const today = new Date()  // ← runtime date (không cố định)
```

Trong khi toàn bộ `mockOrders` có ngày cố định xung quanh `2026-05-05`:

```typescript
// orders.ts
const baseDate = new Date("2026-05-05T00:00:00Z")  // ← fixed date
```

**Tác động:** Khi app chạy sau ngày 2026-06-04, toàn bộ order dates sẽ nằm ngoài window 30 ngày. `dailyRevenueBreakdown` trả về toàn bộ slots = 0. Dashboard biểu đồ doanh thu theo ngày sẽ **trống hoàn toàn** trong môi trường dev/test.

---

### [M-07] Tổng số đơn hàng mâu thuẫn: Dashboard (50) vs Revenue (47)

**Tệp bị ảnh hưởng:** `dashboard.ts`, `revenue.ts`

```typescript
// dashboard.ts
dashboardRevenueByPlatform: [
  { platform: "lazada",  orders: 15 },
  { platform: "shopee",  orders: 20 },
  { platform: "tiktok",  orders: 15 },  // tổng = 50
]

// revenue.ts — KPI note
{ id: 'success-orders', value: 47,
  note: 'Shopee: 20 · Lazada: 15 · TikTok: 12' }  // tổng = 47, TikTok = 12 ≠ 15
```

TikTok orders: 15 (dashboard) ≠ 12 (revenue). Tổng: 50 ≠ 47.

---

### [M-08] `refOrderItemId` format sai trong `mockStockMovements`

**Tệp bị ảnh hưởng:** `inventory.ts` (mockStockMovements)

```typescript
// inventory.ts — SAI (thiếu zero-padding ở phần item index)
refOrderItemId: `item-${String((n % 50) + 1).padStart(3, "0")}-1`,
// → item-001-1, item-002-1, ...

// orders.ts — đúng (có zero-padding 2 chữ số)
id: `item-${String(n).padStart(3, "0")}-${String(itemIdx + 1).padStart(2, "0")}`,
// → item-001-01, item-001-02, ...
```

`item-001-1` ≠ `item-001-01`. Không thể liên kết StockMovement → OrderItem.

---

### [M-09] Review có ngày trong tương lai

**Tệp bị ảnh hưởng:** `crmSentimentAnalysis.ts`

```typescript
// crmSentimentAnalysis.ts
{
  id: 'sentiment-1002',
  createdAt: '2026-05-28T09:15:00.000Z',  // ← TƯƠNG LAI (current: 2026-05-05)
}
```

Ngày review `2026-05-28` nằm sau ngày hiện tại `2026-05-05`. Review từ tương lai không hợp lệ về mặt nghiệp vụ.

---

## 🟡 MODERATE — Vấn đề Chất lượng Dữ liệu (11 vấn đề)

### [Q-01] Sử dụng `Math.random()` và `new Date()` — Phi tất định

**Tệp bị ảnh hưởng:** `stockMovements.mock.ts`, `inventory.ts` (mockInventoryAIForecast)

```typescript
// stockMovements.mock.ts — KHÔNG TỐT (phi tất định)
const daysAgo = Math.floor(Math.random() * 30)  // ← ngẫu nhiên mỗi lần render
const today = new Date()                         // ← runtime

// inventory.ts — KHÔNG TỐT
stockoutDate: new Date(Date.now() + ...).toISOString()  // ← runtime
```

Mỗi lần khởi động app, dữ liệu chart biến động khác nhau → gây khó khăn debug và screenshot testing.

---

### [Q-02] Alert và Notification tham chiếu Order Code không tồn tại

**Tệp bị ảnh hưởng:** `dashboardAlertsNotifications.ts`, `notifications.ts`

```typescript
// dashboardAlertsNotifications.ts
title: 'Đơn SPE-001012 sắp trễ SLA'  // ← SPE-001012 không tồn tại

// notifications.ts
{ id: 'n1', title: 'Đơn SPE-001247 sắp trễ SLA!', actionUrl: '/orders/SPE-001247' }
{ id: 'n6', title: 'Đơn LZ-500342 chuyển sang "Packed"' }
{ id: 'n7', title: 'Hoàn tiền tự động: ORD-001042' }

// orders.ts thực tế sinh ra
externalOrderNumber: `SHOPEE-1001` đến `SHOPEE-1050`
// → SPE-001247 và LZ-500342 không có trong mockOrders
```

**Tác động:** Click "Xử lý ngay" hoặc "Xem chi tiết" sẽ dẫn đến route 404.

---

### [Q-03] `productsCompetitorTracking.ts` dùng SKU làm `productId`

**Tệp bị ảnh hưởng:** `productsCompetitorTracking.ts`

```typescript
// productsCompetitorTracking.ts — SAI về ngữ nghĩa
const productIds = ['SKU-001', 'SKU-003', 'SKU-005', ...]
// Dùng làm: productId: productIds[n % productIds.length]

// Đúng phải là
const productIds = ['prod-001', 'prod-003', 'prod-005', ...]
```

`productId` phải là ID sản phẩm (`prod-XXX`), không phải SKU (`SKU-XXX`). Đây là sai lầm về ngữ nghĩa dữ liệu.

---

### [Q-04] `settingsStaffPermissions.ts` — Member-005 không đồng bộ trạng thái

**Tệp bị ảnh hưởng:** `settingsStaffPermissions.ts`

```typescript
// auth.ts
{ id: "seller-005", isActive: false }  // ← INACTIVE

// settingsStaffPermissions.ts
{ id: 'member-seller-005', status: 'active' }  // ← ACTIVE — mâu thuẫn
```

User `seller-005` bị vô hiệu hóa trong auth nhưng vẫn hiển thị "active" trong bảng nhân viên.

---

### [Q-05] `settingsPlatformConnections.ts` — Shopee token đã hết hạn từ 2024

**Tệp bị ảnh hưởng:** `settingsPlatformConnections.ts`

```typescript
// settingsPlatformConnections.ts
{
  platformCode: 'shopee',
  tokenExpiredAt: '2024-05-15T00:00:00.000Z',  // ← đã hết hạn từ 1 năm trước
  tokenExpired: true,
}
```

Ngày expiry `2024-05-15` là 1 năm trước ngày base `2026-05-05`. Tuy `tokenExpired: true` là đúng về logic, nhưng ngày này gây nhầm lẫn khi hiển thị UI ("Token hết hạn từ 15/05/2024" — quá xa trong quá khứ).

---

### [Q-06] `dashboard.ts` — `newCustomers30d: 8` comment sai

**Tệp bị ảnh hưởng:** `dashboard.ts`

```typescript
dashboardKPIOverview: {
  newCustomers30d: 8,  // comment: "8 unique buyer profiles"
  refundRate: 2.8,     // comment: "3% return rate from ordersReturns"
}
```

- `ordersReturns.ts` chỉ sinh ra **2 returns** từ 50 đơn → tỉ lệ thực = 4%, không phải 2.8%
- Comment "3% return rate" không khớp với giá trị 2.8% cũng không khớp với dữ liệu thực (4%)

---

### [Q-08] `settingsAutomationLogs.ts` — `orderCode` field chứa SKU thay vì Order Code

**Tệp bị ảnh hưởng:** `settingsAutomationLogs.ts`

```typescript
// settingsAutomationLogs.ts — SAI về ngữ nghĩa
{ id: 'inv-1', orderCode: 'SKU-001', platform: 'shopee', status: 'success', ... },
{ id: 'inv-2', orderCode: 'SKU-045', platform: 'lazada', status: 'success', ... },
// Field là orderCode nhưng lại chứa SKU
```

Ngoài ra, toàn bộ order codes trong automation logs (`SPE-001247`, `TKT-998231`, `LZD-334921`...) đều không tồn tại trong `mockOrders` (format thực: `SHOPEE-1001` đến `SHOPEE-1050`).

**Tác động:** Logs không thể link được với bất kỳ đơn hàng thực nào. Click "Xem chi tiết" sẽ dẫn đến 404.

---

### [Q-09] `revenueMLScenarios.ts` — Doanh thu baseline mâu thuẫn với `revenue.ts`

**Tệp bị ảnh hưởng:** `revenueMLScenarios.ts`

```typescript
// revenueMLScenarios.ts
{ id: 'baseline', projectedRevenue: 9_200_000,
  note: 'Dựa trên dữ liệu lịch sử và xu hướng hiện tại (tháng này: 9M)' }

// revenue.ts — KPI hiện tại
{ id: 'net-revenue', value: 8_700_000 }  // ← thực tế tháng này

// revenue.ts — monthly goal
monthlyGoal: { current: 8_700_000, target: 12_000_000 }
```

Baseline scenario nói "tháng này 9M" nhưng revenue module ghi nhận 8.7M. Chênh lệch 500K (~5.7%) không có giải thích.

---

### [Q-10] `debug-products.ts` — Debug utility tự động chạy trong browser

**Tệp bị ảnh hưởng:** `debug-products.ts`

```typescript
// debug-products.ts — KHÔNG AN TOÀN cho production
if (typeof window !== "undefined") {
  setTimeout(() => debugProductDuplicates(), 0);  // ← auto-execute khi module load
}
```

Tệp này được import trong `dashboardTopProducts.ts` và tự động thực thi `console.log` mỗi khi module load trong browser. Gây noise trong DevTools console và có thể gây performance hit không cần thiết.

**Tác động:** Mọi người dùng truy cập dashboard đều bị chạy debug code ngầm. Có thể gây lộ thông tin cấu trúc dữ liệu nội bộ qua console.

---

### [Q-11] `settingsAutomation.ts` — Số lượng rule khai báo không khớp

**Tệp bị ảnh hưởng:** `settingsAutomation.ts`

```typescript
// settingsAutomation.ts — categories
{ id: 'all', label: 'Tất cả', count: 17 }  // ← 17 rules

// settingsStaffPermissionsActivities.ts — seller-001 activity
{ title: 'Cấp quyền cho 5 nhân viên' }  // seller-001 detail: '17 quy tắc đã bật/tắt'
```

Số lượng `17` nhất quán, nhưng tổng `overviewStats.actions = 247` trong `settingsAutomation.ts` không thể kiểm chứng từ bất kỳ tệp nào khác. Con số này hoàn toàn hardcode không có nguồn gốc từ dữ liệu thực.

---

### [Q-07] `inventoryAdjustments.ts` — Ngày code điều chỉnh logic sai

**Tệp bị ảnh hưởng:** `inventoryAdjustments.ts`

```typescript
code: `ADJ-2026${String(5).padStart(2, '0')}${String(5 - (n % 4)).padStart(2, '0')}-${String(n).padStart(3, '0')}`
// String(5) = tháng 5, nhưng String(5 - (n % 4)) = 5, 4, 3, 2 — ngày 02/05/2026 đến 05/05/2026
// Khi n % 4 = 0: 5 - 0 = 5 → ngày 05
// Khi n % 4 = 3: 5 - 3 = 2 → ngày 02
// Khi n % 4 = 4 (impossible): 5 - 4 = 1
```

Logic tạo mã ngày trong `code` field không nhất quán và chỉ có 4 giá trị ngày khác nhau (02-05) cho 20 điều chỉnh, không phản ánh thực tế phân phối theo thời gian.

---

## Ma trận Tác động (Impact Matrix)

| ID | Vấn đề | Tệp nguồn | Tệp bị ảnh hưởng | Runtime Error | UI Sai | Data Sai |
|---|---|---|---|---|---|---|
| C-01 | pc-004 orphan | products.ts, orders.ts | platforms.ts | ✅ | ✅ | ✅ |
| C-02 | stockLevelId format | inventoryAdjustments.ts | inventory.ts | — | — | ✅ |
| C-03 | SKU 4 vs 3 chữ số | products.ts | 6+ tệp | — | ✅ | ✅ |
| C-04 | Staff user data sai | settingsStaffPermissions.ts | auth.ts | — | ✅ | ✅ |
| C-05 | Warehouse ID format | inventoryExtended.ts | inventory.ts | — | — | ✅ |
| C-06 | Profile identity sai (Hương ≠ Minh) | settingsProfile.ts | auth.ts | — | ✅ | ✅ |
| M-01 | tiktok vs tiktok_shop | crm.ts, dashboard.ts | — | — | — | ✅ |
| M-02 | CRM order ID format | crmCustomerProfiles.ts | orders.ts | — | ✅ | ✅ |
| M-03 | Profit flow sai kế toán | revenue.ts | — | — | ✅ | ✅ |
| M-04 | Revenue product IDs giả | revenue.ts | products.ts | — | — | ✅ |
| M-05 | Platform connections mâu thuẫn | settingsPlatformConnections.ts | platforms.ts | — | ✅ | ✅ |
| M-06 | dailyRevenue runtime date | dashboardRevenueOrders.ts | orders.ts | — | ✅ | ✅ |
| M-07 | Order count 50 vs 47 | dashboard.ts | revenue.ts | — | ✅ | ✅ |
| M-08 | refOrderItemId format | inventory.ts | orders.ts | — | — | ✅ |
| M-09 | Review date tương lai | crmSentimentAnalysis.ts | — | — | ✅ | — |
| Q-01 | Math.random / new Date() | stockMovements.mock.ts | — | — | — | ✅ |
| Q-02 | Alert order code giả | dashboardAlertsNotifications.ts | — | — | ✅ | — |
| Q-03 | productId là SKU | productsCompetitorTracking.ts | — | — | — | ✅ |
| Q-04 | Member-005 active/inactive | settingsStaffPermissions.ts | auth.ts | — | ✅ | — |
| Q-05 | Shopee token 2024 | settingsPlatformConnections.ts | — | — | — | — |
| Q-06 | refundRate comment sai | dashboard.ts | ordersReturns.ts | — | — | ✅ |
| Q-07 | Adjustment code logic | inventoryAdjustments.ts | — | — | — | — |
| Q-08 | orderCode chứa SKU trong AutomationLogs | settingsAutomationLogs.ts | orders.ts | — | ✅ | ✅ |
| Q-09 | ML baseline 9.2M vs revenue.ts 8.7M | revenueMLScenarios.ts | revenue.ts | — | ✅ | ✅ |
| Q-10 | Debug code auto-execute trong browser | debug-products.ts | — | — | — | ✅ |
| Q-11 | overviewStats.actions hardcode không nguồn gốc | settingsAutomation.ts | — | — | — | ✅ |

---

## Thứ tự Ưu tiên Sửa chữa (Fix Priority)

### Ưu tiên 1 — Sửa ngay (breaks functionality)
1. **[C-01]** `pc-004` orphan: đổi `n % 4` → `n % 3` trong `products.ts` và `orders.ts`
2. **[C-03]** SKU format: chuẩn hóa `products.ts` về 3 chữ số `padStart(3, "0")`
3. **[M-06]** `dailyRevenueBreakdown`: thay `new Date()` → `new Date("2026-05-05T00:00:00Z")`
4. **[Q-10]** Xóa `debug-products.ts` auto-execute block hoặc wrap trong `import.meta.env.DEV`

### Ưu tiên 2 — Sửa trong sprint này (data integrity)
5. **[C-02]** `stockLevelId` format: thêm `padStart(4, "0")` vào `inventoryAdjustments.ts`
6. **[C-04]** Staff user data: đồng bộ tên/email từ `auth.ts` vào `settingsStaffPermissions.ts`
7. **[C-05]** Warehouse ID: chuẩn hóa `inventoryExtended.ts` và `stockMovements.mock.ts` về `wh-001`/`wh-002`
8. **[C-06]** Profile identity: đồng bộ `fullName`/`email`/`phone` từ `auth.ts` vào `settingsProfile.ts`
9. **[M-01]** Platform code: thay `'tiktok'` → `'tiktok_shop'` trong `crm.ts` và `crmCustomerProfiles.ts`
10. **[M-08]** `refOrderItemId`: thêm `padStart(2, "0")` ở phần item index trong `inventory.ts`

### Ưu tiên 3 — Cải thiện trong backlog
11. **[M-02]** CRM order IDs: đồng bộ format `ord-XXX` và `SHOPEE-XXXX`
12. **[M-03]** Profit flow: tách biệt gross profit flow và net profit flow
13. **[M-04]** Revenue product IDs: thay `tp-1` → `prod-001` và xóa phantom products
14. **[M-05]** Platform connections: đồng nhất shop ID/name giữa hai tệp
15. **[Q-01]** Thay `Math.random()` bằng deterministic seed
16. **[Q-02]** Cập nhật alert/notification order codes thực
17. **[Q-03]** `productsCompetitorTracking.ts`: dùng `prod-XXX` thay vì `SKU-XXX` làm `productId`
18. **[Q-08]** `settingsAutomationLogs.ts`: sửa `orderCode` chứa SKU; align order code format
19. **[Q-09]** `revenueMLScenarios.ts`: align baseline từ 9.2M → 8.7M hoặc thêm note giải thích delta

---

## Phụ lục: Sơ đồ Phụ thuộc Dữ liệu

```
auth.ts (MOCK_USERS: seller-001..005, MOCK_CURRENT_USER: seller-001)
    └──→ settingsStaffPermissions.ts [C-04: name/email MIS-MATCH]
    └──→ settingsStaffPermissionsActivities.ts [C-04: name MIS-MATCH]
    └──→ settingsProfile.ts [C-06: fullName/email/phone MIS-MATCH]
    └──→ dashboardAlertsNotifications.ts (mockAssignees ✓)

platforms.ts (mockPlatformConnections: pc-001..003)
    └──→ products.ts [C-01: pc-004 orphan]
    └──→ orders.ts [C-01: pc-004 orphan]
    └──→ settingsPlatformConnections.ts [M-05: shop ID/name mismatch]

products.ts (mockProducts: prod-001..062, SKU-0001..0062)
    └──→ orders.ts (productId: prod-XXX ✓)
    └──→ inventory.ts (StockLevel, variants ✓)
    └──→ crm.ts (productId ✓)
    └──→ inventoryAdjustments.ts [C-03: SKU format mismatch]
    └──→ inventoryExtended.ts [C-03: SKU format mismatch]
    └──→ stockMovements.mock.ts [C-03: SKU format mismatch]
    └──→ productsCompetitorTracking.ts [C-03: SKU mismatch, Q-03]
    └──→ revenue.ts [C-03: SKU mismatch, M-04: phantom products]

orders.ts (mockOrders: ord-001..050, externalOrderNumber: SHOPEE-1001..SHOPEE-1050)
    └──→ dashboardTopProducts.ts (derived ✓)
    └──→ dashboardRevenueOrders.ts [M-06: runtime date]
    └──→ ordersPendingActions.ts (derived ✓)
    └──→ ordersReturns.ts (derived ✓)
    └──→ inventory.ts (refOrderItemId) [M-08: format mismatch]
    └──→ crmCustomerProfiles.ts [M-02: order ID format mismatch]
    └──→ settingsAutomationLogs.ts [Q-08: fake order codes SPE-001247, TKT-998231...]
    └──→ dashboardAlertsNotifications.ts [Q-02: fake order codes SPE-001012...]
    └──→ notifications.ts [Q-02: fake order codes SPE-001247, LZ-500342...]

revenue.ts (net-revenue: 8,700,000)
    └──→ revenueMLScenarios.ts [Q-09: baseline 9,200,000 mâu thuẫn]

inventory.ts (mockWarehouses: wh-001..002, mockStockLevels: sl-0001..)
    └──→ inventoryAdjustments.ts [C-02: sl-X vs sl-000X, C-05: warehouse ID]
    └──→ inventoryExtended.ts [C-05: warehouse ID format]
    └──→ inventoryStockMovements.ts (mockStockMovements ✓)
    └──→ stockMovements.mock.ts [C-05: warehouse ID format]

dashboard.ts (totalOrders: 50)
    └──→ revenue.ts [M-07: 50 vs 47 orders]
```

---

*Báo cáo được tạo tự động bởi công cụ kiểm toán dữ liệu mock. Mọi vấn đề được phát hiện bằng phân tích tĩnh cross-file.*
