# ShopHub Frontend — Tài liệu Tính năng Toàn diện

> Phiên bản: v1.x | Cập nhật: 2026-04-23  
> Tài liệu này được verify trực tiếp từ source code.  
> `[ĐỀ XUẤT]` = tính năng chưa có, đề xuất bổ sung.  
> `[STUB]` = route đã tồn tại nhưng chưa có UI (placeholder rỗng).

---

## Mục lục

0. [Xác thực (Auth)](#0-xác-thực-auth)
1. [Dashboard](#1-dashboard)
2. [Đơn hàng (Orders)](#2-đơn-hàng-orders)
3. [Kho hàng (Inventory)](#3-kho-hàng-inventory)
4. [Sản phẩm & Giá (Products & Pricing)](#4-sản-phẩm--giá-products--pricing)
5. [Doanh thu (Revenue)](#5-doanh-thu-revenue)
6. [CRM & Review](#6-crm--review)
7. [Cài đặt (Settings)](#7-cài-đặt-settings)
8. [Tích hợp nền tảng (Platforms)](#8-tích-hợp-nền-tảng-platforms)
9. [AI & Trợ lý thông minh](#9-ai--trợ-lý-thông-minh)
10. [Hệ thống & Shared](#10-hệ-thống--shared)
11. [Giao diện & Thành phần chung](#11-giao-diện--thành-phần-chung)

---

## 0. Xác thực (Auth)

**Route:** `/login`, `/forgot-password`  
**Mô tả:** Kiểm soát quyền truy cập hệ thống, xác thực danh tính người dùng.

---

### 0.1 Trang Đăng nhập (`/login`)

#### Tính năng hiện có
- **AuthSplitLayout:** Layout 2 cột — bên trái brand/visual, bên phải form
- **Tiêu đề:** "Đăng nhập" + subtitle "Chào mừng trở lại 👋"
- **Form đăng nhập:**
  - Trường Email: icon mail, placeholder `seller@shophub.vn`, validate định dạng email
  - Trường Mật khẩu: icon lock, nút toggle ẩn/hiện mật khẩu (Eye/EyeOff)
  - Checkbox "Ghi nhớ đăng nhập" — lưu email vào `localStorage` key `shophub.rememberedEmail`
  - Link "Quên mật khẩu?" dẫn đến `/forgot-password`
- **Nút Đăng nhập:** Disabled khi đang gọi API, hiển thị "Đang đăng nhập…"
- **Divider "hoặc"**
- **Nút Đăng nhập bằng Google** (UI hiện có, logic chưa kết nối)
- **Link hỗ trợ:** "Cần hỗ trợ? Liên hệ Admin"
- **ProtectedRoute guard:** Nếu đã đăng nhập → redirect về `/dashboard/kpi-overview` hoặc trang trước đó (`location.state.from`)
- **FullPageAuthLoading:** Màn hình loading toàn trang khi đang kiểm tra phiên
- **Toast error:** Hiển thị thông báo lỗi cụ thể khi đăng nhập thất bại (phân tích `detail`/`message`/`details` từ API)
- **Toast warning:** Khi form có trường không hợp lệ
- **Validation schema (Zod):** Email + password

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Đăng nhập bằng Google:** Kết nối thực tế OAuth Google
- `[ĐỀ XUẤT]` **Đăng nhập bằng Facebook / Apple**
- `[ĐỀ XUẤT]` **Rate limit UI:** Thông báo khi đăng nhập sai quá X lần (lockout countdown)
- `[ĐỀ XUẤT]` **Captcha:** reCAPTCHA sau N lần thất bại

---

### 0.2 Trang Quên mật khẩu (`/forgot-password`)

#### Tính năng hiện có
- **AuthSplitLayout:** Cùng layout 2 cột, tiêu đề "Quên mật khẩu", subtitle hướng dẫn
- **Mô tả:** "Nhập email tài khoản, ShopHub sẽ gửi hướng dẫn đặt lại mật khẩu."
- **Trường Email:** Icon mail, validate định dạng email (Zod)
- **Nút Gửi hướng dẫn:** Loading "Đang gửi…", disabled khi đang gọi API
- **Link "Quay lại đăng nhập":** Icon ArrowLeft, điều hướng về `/login`
- **Toast success:** "Đã gửi hướng dẫn đặt lại mật khẩu vào email của bạn."
- **Toast error:** "Không thể gửi yêu cầu lúc này. Vui lòng thử lại."
- **Toast warning:** Khi email không hợp lệ
- **ProtectedRoute guard:** Đã đăng nhập → redirect về dashboard
- Sau khi gửi thành công: reset form về trống

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Trang đặt lại mật khẩu (`/reset-password?token=...`):** Nhập mật khẩu mới sau khi click link email
- `[ĐỀ XUẤT]` **Countdown resend:** Cho phép gửi lại sau 60 giây
- `[ĐỀ XUẤT]` **Xác nhận email hợp lệ:** Kiểm tra email có tồn tại trong hệ thống trước khi gửi (với thông báo chung chung vì lý do bảo mật)

---

## 1. Dashboard

**Route:** `/dashboard/*`  
**Mô tả:** Trung tâm điều hành tổng quan — theo dõi KPI, doanh thu, sản phẩm bán chạy và cảnh báo vận hành.

---

### 1.1 KPI Overview (`/dashboard/kpi-overview`)

#### Tính năng hiện có
- **Platform Tabs:** Chuyển đổi Shopee / Lazada / TikTok để xem phân bổ doanh thu theo kênh
- **Monthly Goal Tracker:** Thanh tiến độ doanh thu thực tế so với mục tiêu tháng
- **Nút Refresh:** Làm mới dữ liệu thủ công, có trạng thái loading/spinner
- **KPI Cards (4 cột):** Các chỉ số chính — doanh thu, số đơn hàng, tỷ lệ chuyển đổi, giá trị trung bình đơn
- **Revenue Line Chart:** Biểu đồ đường doanh thu 7 ngày (multi-series theo platform)
- **Allocation Donut Chart:** Cơ cấu doanh thu theo kênh/danh mục
- **Bảng Top Products:** Sản phẩm bán chạy kèm breakdown theo từng platform (tách component `AllocationDonutChart`, `RevenueLineChart`)
- **AI Insights Column:** Cảnh báo tồn kho tự động, gợi ý hành động từ AI (`AIInsightsColumn`)
- **Empty State:** Màn hình hướng dẫn khi chưa có dữ liệu (`DashboardNoDataStateSection`)
- **Bottom Row:** Phần cuối trang tổng hợp các widgets

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Widget kéo-thả:** Cho phép sắp xếp lại thứ tự KPI card
- `[ĐỀ XUẤT]` **So sánh kỳ trước:** Hiển thị % thay đổi so với tuần/tháng trước ngay trên KPI card
- `[ĐỀ XUẤT]` **Export Dashboard:** Xuất toàn bộ màn hình thành PNG/PDF
- `[ĐỀ XUẤT]` **Thông báo đạt mục tiêu:** Toast khi đạt 50%, 80%, 100% mục tiêu tháng
- `[ĐỀ XUẤT]` **Tuỳ chọn số ngày trend:** Chọn 7/14/30 ngày cho line chart

---

### 1.2 Revenue Charts (`/dashboard/revenue-charts`)

#### Tính năng hiện có
- **RevenueChartsHeader:** Header với range selector và nút refresh
- **RevenuePlatformTabs:** Tab chọn platform để lọc toàn bộ trang
- **Range Selector:** 7 ngày / 30 ngày / 90 ngày / tuỳ chỉnh
- **KPI Stats Grid (4 cột):** Tổng doanh thu, số đơn, giá trị trung bình, tỷ lệ tăng trưởng
- **Revenue Goal Banner:** Banner tiến độ mục tiêu với thanh % hoàn thành (`RevenueGoalBanner`)
- **Daily Trend Line Chart:** Multi-series line chart doanh thu hàng ngày (`RevenueDailyTrendChart`)
- **Hourly Distribution Card:** Phân tích giờ cao điểm trong ngày (`RevenueHourlyDistributionCard`)
- **Category Breakdown Donut/Pie:** Cơ cấu doanh thu theo danh mục (`RevenueCategoryBreakdownCard`)
- **Weekly Comparison Table:** Bảng so sánh doanh thu theo tuần, cột theo platform (`RevenueWeeklyComparisonTable`)
- **No Data State:** Giao diện hướng dẫn lọc lại khi không có kết quả

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Annotation sự kiện:** Đánh dấu flash sale, lễ tết lên timeline chart
- `[ĐỀ XUẤT]` **Export từng chart:** Tải CSV/Excel trực tiếp từ mỗi biểu đồ
- `[ĐỀ XUẤT]` **Drill-down danh mục:** Click vào phần donut để xem sản phẩm trong danh mục đó
- `[ĐỀ XUẤT]` **Overlay voucher/promotion:** Hiển thị doanh thu từ voucher/khuyến mãi lên daily trend
- `[ĐỀ XUẤT]` **Heatmap ngày/giờ:** Grid 7 ngày × 24 giờ thể hiện mật độ đơn hàng

---

### 1.3 Top Products (`/dashboard/top-products`)

#### Tính năng hiện có
- **TopProductsControls:** Metric selector (doanh thu / số đơn / số lượng bán), range selector, platform selector
- **TopProductsPodiumSection:** Hiển thị Top 3 sản phẩm với thiết kế podium trực quan
- **TopProductsRankingTable:** Bảng xếp hạng đầy đủ, click vào sản phẩm để drill-down
- **Platform Quick Filters:** Lọc nhanh theo platform trên từng hàng sản phẩm
- **TopProductsInsightsSection:** Phần trăm đóng góp doanh thu của từng sản phẩm
- **TopProductsDecliningSection:** Danh sách sản phẩm đang giảm doanh thu kèm nguyên nhân

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Sparkline mini:** Line chart nhỏ trên mỗi hàng bảng thể hiện xu hướng 7 ngày
- `[ĐỀ XUẤT]` **So sánh rank kỳ trước:** Badge tăng ▲ / giảm ▼ thứ hạng
- `[ĐỀ XUẤT]` **Gắn nhãn sản phẩm:** Tag "Hero Product", "Long Tail", "Rising Star"
- `[ĐỀ XUẤT]` **Export top products:** Xuất danh sách ra Excel
- `[ĐỀ XUẤT]` **Nhắc việc cho declining:** Tự động tạo task cho nhân viên phụ trách sản phẩm đang giảm

---

### 1.4 Alerts & Notifications (`/dashboard/alerts-notifications`)

#### Tính năng hiện có
- **AlertsHeader:** Tiêu đề trang, thống kê tổng số cảnh báo
- **AlertsTabs:** Tab selector — Tất cả / Kho hàng / Đơn hàng / Hệ thống
- **AlertsSummaryStrip:** Dải tóm tắt đếm số cảnh báo theo từng danh mục
- **Severity Filter Chips:** Lọc đa chọn Critical / Warning / Info
- **AlertsSection:** Nhóm alert cards theo danh mục
- **AlertCard:** Card cảnh báo với nút hành động trực tiếp theo từng loại
- **Mark All as Read:** Đánh dấu đọc tất cả
- **Alerts Sidebar:** Trạng thái hiện tại, tổng số visible, số nhóm active, filter đang áp dụng, nhãn auto-refresh, thời điểm cập nhật cuối
- **Help Tips Section:** Gợi ý sử dụng trong sidebar
- **Action Handlers:** Dispatch action phù hợp với từng loại cảnh báo

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Browser Push Notification:** Thông báo trình duyệt khi xuất hiện Critical alert
- `[ĐỀ XUẤT]` **Thiết lập ngưỡng cảnh báo:** Tuỳ chỉnh ngưỡng tồn thấp, doanh thu thấp trực tiếp từ trang này
- `[ĐỀ XUẤT]` **Lịch sử cảnh báo:** Xem lại cảnh báo đã đóng trong 30 ngày qua
- `[ĐỀ XUẤT]` **Assign cảnh báo:** Giao việc xử lý cho thành viên cụ thể
- `[ĐỀ XUẤT]` **Biểu đồ tần suất cảnh báo:** Theo tuần để phát hiện vấn đề tái diễn

---

## 2. Đơn hàng (Orders)

**Route:** `/orders/*`  
**Mô tả:** Quản lý toàn bộ vòng đời đơn hàng — từ tiếp nhận, xử lý, giao hàng đến hoàn trả.

---

### 2.1 All Orders (`/orders/all`)

#### Tính năng hiện có
- **OrdersAllSummaryBar:** Dải tóm tắt tổng số đơn theo trạng thái
- **OrdersAllSummaryCards:** Cards thống kê nhanh (tổng đơn, chờ xử lý, đang giao, đã hoàn thành)
- **OrdersAllStatusTabs:** Tab lọc theo trạng thái — Tất cả / Chờ xác nhận / Đã xác nhận / Đang giao / Đã giao / Đã huỷ
- **Search Box:** Tìm kiếm live theo mã đơn, tên khách hàng, tên sản phẩm
- **Platform Filter:** Dropdown All / Shopee / Lazada / TikTok
- **Quick Date Filters:** Hôm nay / 7 ngày qua (toggle buttons)
- **Advanced Filters Panel:**
  - Date range picker (Từ ngày / Đến ngày)
  - Khoảng giá trị đơn hàng (Min / Max)
  - Badge badge số filter đang active
- **Orders Data Table:**
  - Checkbox chọn nhiều hàng
  - Mã đơn hàng
  - Tên khách hàng
  - Tên sản phẩm
  - Giá trị đơn
  - Badge trạng thái (màu theo trạng thái)
  - Badge nền tảng
- **Bulk Action Toolbar:** Xác nhận đơn / Export CSV / In vận đơn / Đẩy lên kho
- **Pagination:** Số hàng/trang tuỳ chọn (10 / 20 / 50)
- **Row Selection:** Toggle chọn/bỏ chọn tất cả trang hiện tại
- **Order Detail Modal/Drawer:** Xem chi tiết dạng overlay (modal presentation mode)
- **Loading Skeleton + Error State + Retry**

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Sort cột:** Click header để sort tăng/giảm
- `[ĐỀ XUẤT]` **Lưu preset filter:** Lưu bộ lọc thường dùng để tái sử dụng nhanh
- `[ĐỀ XUẤT]` **Ghi chú nội bộ:** Note nội bộ trên đơn (không hiện với khách)
- `[ĐỀ XUẤT]` **Timeline SLA countdown:** Đếm ngược thời hạn xử lý đơn theo yêu cầu từng platform
- `[ĐỀ XUẤT]` **Duplicate order detection:** Cảnh báo đơn trùng lặp (cùng khách, cùng sản phẩm, cùng thời điểm)

---

### 2.2 Pending Actions (`/orders/pending-actions`)

#### Tính năng hiện có
- **OrdersPendingActionsHeader:** Tiêu đề, mô tả, trạng thái refresh
- **OrdersPendingActionsSummaryCards:** 4 cards thống kê (tông phân theo urgency: rose/amber/indigo/slate)
- **OrdersPendingActionsFilters:**
  - Tìm kiếm text
  - Platform filter (All / Shopee / Lazada / TikTok)
  - **SLA filter:** Urgent / Warning / Normal (filter chuyên biệt theo deadline)
  - Quick date filters: Hôm nay / 7 ngày qua
  - Date range picker nâng cao
- **Bulk Action Floating Toolbar (Fixed Bottom):** Xuất hiện khi chọn ≥1 đơn:
  - "Duyệt hàng loạt" (xác nhận)
  - "In vận đơn"
  - "Hủy đơn"
  - Nút Đóng / bỏ chọn
  - Hiển thị "Đã chọn X đơn"
- **Sidebar Charts (Sticky Left 280px):**
  - `PendingActionsSlaChart`: Biểu đồ cột phân bổ SLA (Urgent / Warning / Normal) — tính theo danh sách đang hiển thị
  - `PendingActionsPlatformChart`: Donut chart tỷ trọng đơn theo từng sàn — để phân bổ nguồn lực
- **OrdersPendingActionsTable:** Bảng chính với đa chọn, phân trang, click mở detail
- **Export CSV:** Xuất dữ liệu đang hiển thị

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Auto-sort theo SLA:** Mặc định sắp xếp đơn urgent lên đầu
- `[ĐỀ XUẤT]` **Batch confirm kèm kiểm tra tồn kho:** Cảnh báo nếu SKU không đủ hàng trước khi xác nhận
- `[ĐỀ XUẤT]` **Reminder tự động:** Gửi nhắc nếu đơn chờ quá X giờ mà chưa xử lý
- `[ĐỀ XUẤT]` **Phân loại lý do pending:** Filter theo nguyên nhân (chờ xác nhận, chờ stock, chờ thanh toán)

---

### 2.3 Returns & Cancellations (`/orders/returns`)

#### Tính năng hiện có
- **OrdersReturnsHeader:**
  - Tiêu đề + subtitle
  - **Date Range Button** (lọc theo khoảng thời gian)
  - **Nút "Xuất báo cáo"**
  - Hiển thị "Đang cập nhật dữ liệu..." khi refresh
- **OrdersReturnsSummaryCards (3 cards):**
  - `returns` (RotateCcw icon, rose tone): Số lượng hoàn trả
  - `cancellations` (XCircle icon, slate tone): Số lượng huỷ đơn
  - `refund_amount` (WalletCards icon, indigo tone): Tổng tiền hoàn
- **OrdersReturnsFilters:**
  - Tìm kiếm theo mã đơn / tên khách
  - Platform filter (All / Shopee / Lazada / TikTok)
- **OrdersReturnsViewModeToggle:** Chuyển đổi Timeline View ↔ Table View
- **OrdersReturnsTimeline:** Hiển thị timeline theo nhóm ngày (`OrdersReturnsTimelineGroup`, `OrdersReturnsTimelineItem`)
- **OrdersReturnsTable:** Bảng dữ liệu với phân trang (tuỳ chọn page size), click mở detail
- **Pagination:** Kiểm soát trang và số dòng/trang

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Phân tích lý do hoàn trả:** Biểu đồ thống kê (sản phẩm lỗi / sai hàng / đổi ý / giao trễ)
- `[ĐỀ XUẤT]` **Phê duyệt / Từ chối:** Nút action trực tiếp từ bảng/timeline
- `[ĐỀ XUẤT]` **Upload bằng chứng:** Ảnh/video đính kèm yêu cầu hoàn trả
- `[ĐỀ XUẤT]` **Template phản hồi khách:** Thư viện mẫu theo từng loại hoàn trả
- `[ĐỀ XUẤT]` **Flag lạm dụng hoàn trả:** Gắn cờ khách hàng có tỷ lệ hoàn trả bất thường
- `[ĐỀ XUẤT]` **Tự động hoàn tiền:** Trigger khi đơn đủ điều kiện policy

---

### 2.4 Order Detail (`/orders/:id`)

#### Tính năng hiện có
- **Header:** Mã đơn hàng, badge platform, badge trạng thái
- **Quick Actions:**
  - Xem bằng chứng giao hàng (proof of delivery)
  - Tra cứu vận chuyển
  - Xem tin nhắn hỗ trợ
- **Tab: Chi tiết (Detail):**
  - `OrderDetailTimeline`: Timeline các sự kiện đơn hàng
  - `OrderDetailCustomerCard`: Thông tin khách hàng (tên, SĐT, địa chỉ giao hàng)
  - `OrderDetailItemsCard`: Danh sách sản phẩm (tên, số lượng, đơn giá), tổng phụ / phí ship / voucher / tổng cộng
- **Tab: Lịch sử (History):** `OrderDetailHistoryTab` — Timeline đầy đủ tất cả sự kiện
- **Tab: Đánh giá (Reviews):** `OrderDetailReviewsTab` — Đánh giá và xếp hạng của khách
- **Hai chế độ hiển thị:** Modal overlay và full-page
- **Loading States**

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Ghi chú nội bộ:** Thêm/sửa note nội bộ ngay trong trang chi tiết
- `[ĐỀ XUẤT]` **In hoá đơn / phiếu đóng gói:** Nút in trực tiếp từ trang chi tiết
- `[ĐỀ XUẤT]` **Link sang trang sản phẩm:** Click tên sản phẩm → `products/:id`
- `[ĐỀ XUẤT]` **Cảnh báo địa chỉ bất thường:** Khi địa chỉ giao hàng khác địa chỉ thanh toán
- `[ĐỀ XUẤT]` **Tab Trao đổi nội bộ:** Chat nội bộ giữa nhân viên về đơn cụ thể

---

## 3. Kho hàng (Inventory)

**Route:** `/inventory/*`  
**Mô tả:** Quản lý tồn kho đa kho, theo dõi biến động và dự báo nhu cầu nhập hàng bằng AI.

---

### 3.1 SKU Stock (`/inventory/sku-stock`)

#### Tính năng hiện có
- **Page Header:** Breadcrumb badges (Kho vận / SKU Stock), gradient background
- **Statistics Card:** Tổng số SKU đang theo dõi, số filter đang active
- **Summary Cards (4 cards):** Tổng SKU / SKU tồn thấp / Tổng giá trị tồn kho / Thời điểm cập nhật cuối
- **Quick Actions Bar:** Điều chỉnh tồn kho / Export dữ liệu / Import dữ liệu
- **InventoryAlertBanner:** Banner cảnh báo tồn thấp — có thể dismiss, link "Xem cảnh báo"
- **Search Input:** Tìm kiếm theo tên sản phẩm / mã SKU
- **View Mode Toggle:** Chuyển Table View ↔ Grid View
- **Filter Bar:**
  - Danh mục (Electronics, Clothing, Home, ...)
  - Nền tảng (Shopee, TikTok, Lazada)
  - Trạng thái tồn kho (Còn hàng / Tồn thấp / Hết hàng)
  - Badge số filter active
- **Table View:** Bảng dữ liệu SKU đầy đủ với phân trang
- **Grid View:** Hiển thị dạng card

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Bulk import Excel/CSV:** Upload file cập nhật tồn kho hàng loạt kèm validation
- `[ĐỀ XUẤT]` **Tồn kho theo kho vật lý:** Cột tách biệt cho từng kho (HN / HCM / ĐN)
- `[ĐỀ XUẤT]` **QR Code per SKU:** Tạo QR code quét khi nhập/xuất kho
- `[ĐỀ XUẤT]` **Quản lý lô hàng (Batch/Lot):** Theo dõi hạn sử dụng, thông tin lô
- `[ĐỀ XUẤT]` **Reorder point:** Cấu hình mức tồn tối thiểu → trigger đặt hàng tự động
- `[ĐỀ XUẤT]` **Lịch sử giá vốn:** Biến động giá vốn theo thời gian (FIFO / Weighted Average)

---

### 3.2 Stock Movements (`/inventory/stock-movements`)

#### Tính năng hiện có
- **InventoryStockMovementsHeader:** Tiêu đề, phụ đề, thời điểm cập nhật, gợi ý hành động tiếp theo
- **InventoryStockMovementsSummaryCards (3 cards):** Tổng nhập / Tổng xuất / Điều chỉnh
- **InventoryStockMovementsFilters:**
  - Tìm kiếm theo SKU / tên sản phẩm
  - Platform (All / Shopee / Lazada / TikTok)
  - Nhóm biến động (All / Nhập / Xuất / Điều chỉnh)
  - Chọn kho
- **Main Content (8 cột):**
  - `InventoryStockMovementsTimeline`: Nhãn nhóm biến động + số sự kiện + timeline visualization
  - `InventoryStockMovementCard`: Card từng sự kiện biến động
  - Pagination với tuỳ chọn page size (8 / 12 / 24)
  - Hiển thị "X-Y trong tổng số N"
- **InventoryStockMovementsSidebar (4 cột):**
  - Card chi tiết biến động đang được chọn
  - Thống kê breakdown theo platform
  - Thống kê theo kho
  - Ghi chú riêng cho Lazada

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Export nhật ký:** Xuất CSV/Excel với filter hiện tại
- `[ĐỀ XUẤT]` **Filter theo người thực hiện:** Audit trail — biết ai điều chỉnh
- `[ĐỀ XUẤT]` **Đính kèm chứng từ:** Upload phiếu nhập/xuất kho (ảnh/PDF)
- `[ĐỀ XUẤT]` **Line chart biến động theo ngày:** Nhập vs xuất trong kỳ đang lọc
- `[ĐỀ XUẤT]` **Phát hiện bất thường:** Highlight điều chỉnh lớn bất thường (giá trị cao, tần suất cao)

---

### 3.3 AI Forecast (`/inventory/ai-forecast`)

#### Tính năng hiện có
- **Header Section:**
  - Tiêu đề "✨ AI Dự báo tồn kho" (indigo, bold)
  - Mô tả model và nhãn độ chính xác (`modelAccuracyLabel`)
  - **Nút "Chạy lại dự báo"** (RefreshCcw icon)
  - **Nút "Xuất báo cáo"** (FileDown icon)
- **Model Status Bar:**
  - Trạng thái mô hình (circle xanh = active)
  - Dữ liệu đầu vào: nhãn input data
  - Lần chạy cuối: timestamp
- **Urgent Cards Section (border-l-4 đỏ):** Sản phẩm cần nhập kho khẩn cấp
  - Tên sản phẩm + badge độ tin cậy
  - SKU (monospace)
  - Tồn kho hiện tại (số lớn, đỏ)
  - Thời gian tồn kho còn lại
  - Số lượng nhập đề xuất (highlight indigo)
  - **Nút "Tạo đơn nhập kho"** (PackagePlus icon)
  - Phần "Lý do dự báo": 3 cards lý do (dạng grid)
  - Click card → mở detail
- **Watch Cards Section (border-l-4 vàng):** Sản phẩm cần theo dõi (amber)
  - Grid 3 cột trên desktop
  - Tên SP / SKU / tồn hiện tại / dự báo / gợi ý nhập / độ tin cậy
  - Click → mở detail
- **Forecast Table Section (tất cả dự báo):**
  - Filter tabs: All / Urgent / Warning / Healthy
  - Bảng đầy đủ: SKU / Tên SP / Tồn hiện tại / Bán TB ngày / Trạng thái dự báo / Nhập đề xuất / Độ tin cậy / Hành động (icon ShoppingCart)
  - Dòng cuối: tổng số hàng + timestamp cập nhật + nhãn "Mô hình LSTM phân tích theo múi giờ Việt Nam"
- **Footer Note:** Lưu ý kết hợp dữ liệu campaign cho quyết định cuối cùng

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Tuỳ chỉnh tham số dự báo:** Nhập biến sự kiện (flash sale, tết) để AI tính lại
- `[ĐỀ XUẤT]` **So sánh dự báo vs thực tế:** Bảng accuracy kỳ trước (MAPE, RMSE)
- `[ĐỀ XUẤT]` **Xuất kế hoạch nhập hàng:** Tạo danh sách nhập từ kết quả forecast
- `[ĐỀ XUẤT]` **Nhận diện mùa vụ:** AI tự điều chỉnh dự báo theo pattern mùa vụ lịch sử
- `[ĐỀ XUẤT]` **Gợi ý ngày đặt hàng:** Kết hợp forecast + lead time nhà cung cấp

---

### 3.4 Stock Adjustment (`/inventory/adjust`, `/inventory/adjust/:stockLevelId`)

#### Tính năng hiện có
- Form / Dialog điều chỉnh tồn kho
- Chọn SKU (hoặc tự động điền khi có `stockLevelId` trên URL)
- Nhập số lượng điều chỉnh (tăng / giảm)
- Lý do điều chỉnh và ghi chú tự do
- Submit với validation

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Cycle Count workflow:** Kiểm kê → nhập số thực tế → so sánh với hệ thống → xác nhận
- `[ĐỀ XUẤT]` **Phê duyệt 2 cấp:** Điều chỉnh lớn hơn ngưỡng X cần approval từ cấp trên
- `[ĐỀ XUẤT]` **Bulk import Excel:** Template + upload điều chỉnh nhiều SKU cùng lúc
- `[ĐỀ XUẤT]` **Preview trước/sau:** Hiển thị tồn kho trước và sau điều chỉnh trước khi lưu

---

## 4. Sản phẩm & Giá (Products & Pricing)

**Route:** `/products/*`  
**Mô tả:** Quản lý danh mục sản phẩm, định giá động bằng AI và theo dõi cạnh tranh thị trường.

---

### 4.1 Products List (`/products/list`)

#### Tính năng hiện có
- **ProductsListView:** Container chính với logic phân trang, filter
- **ProductsFilters:** Filter bar (search, category, platform, status, sort)
- **ProductsCardList:** Grid 4 cột desktop / 2 tablet / 1 mobile
- **Product Card:**
  - Ảnh sản phẩm (gradient fallback nếu thiếu)
  - Platform badges (Shopee / TikTok / Lazada)
  - Status badge màu (Đang bán / Tạm dừng / Hết hàng)
  - Tên sản phẩm (line-clamped 2 dòng)
  - SKU (mã nội bộ, nhỏ)
  - Giá bán (nổi bật, lớn)
  - Số tồn kho với màu chỉ thị mức độ
  - Số lượng đã bán
  - Metrics breakdown từng platform
  - Nút Sửa + Nút Xem
- **ProductsTableColumns:** Cột bảng khi chuyển sang table view
- **productsPageLogic:** Logic pagination, filter, navigation
- **Loading Skeleton**
- **Empty State**
- **Hover effects trên card**
- **Click card** → navigate `products/:id`

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Table/Grid toggle:** Chuyển đổi giữa card grid và bảng dữ liệu đầy đủ
- `[ĐỀ XUẤT]` **Bulk actions:** Kích hoạt/tạm dừng / Export / Xoá hàng loạt
- `[ĐỀ XUẤT]` **Quick edit inline:** Sửa giá bán ngay trên card
- `[ĐỀ XUẤT]` **Nút Thêm sản phẩm mới:** Form tạo mới với upload ảnh, chọn platform
- `[ĐỀ XUẤT]` **Sort options:** Giá / Tồn kho / Doanh thu / Tên / Ngày tạo

---

### 4.2 Dynamic Pricing (`/products/dynamic-pricing`)

#### Tính năng hiện có
- **DynamicPricingHeader:** Tiêu đề với AI indicator badge, nút "Xem lịch sử giá"
- **"Áp dụng tất cả giá AI":** Batch action áp giá toàn bộ đề xuất, có loading state
- **DynamicPricingRulesSection:** Danh sách rule cards với toggle bật/tắt, mô tả điều kiện
- **DynamicPricingRuleCard:** Card từng quy tắc định giá
- **DynamicPricingRecommendationsPanel (8 cột):**
  - Đếm tổng đề xuất + bộ đếm đang hiển thị
  - Bảng đề xuất: sản phẩm / giá hiện tại / giá đề xuất / confidence level
  - Nút Áp dụng tất cả
  - Link chi tiết sản phẩm
  - Loading state khi áp hàng loạt
- **DynamicPricingPriceHistoryPanel (4 cột):**
  - Line chart time-series lịch sử giá
  - Tóm tắt lịch sử: min / max / trung bình
  - Nhãn kỳ + tên sản phẩm đang được chọn
- **DynamicPricingInsightsRow:** Hàng insights với data actionable
- **DynamicPricingInsightCard:** Card insight từng mục
- **Error handling + Retry**

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Form tạo rule giá mới:** Trigger condition + action (% tăng/giảm, giá sàn/trần)
- `[ĐỀ XUẤT]` **A/B test giá:** Thử nghiệm 2 mức giá trên cùng sản phẩm
- `[ĐỀ XUẤT]` **Flash sale scheduler:** Giảm giá tự động theo khung giờ lên lịch
- `[ĐỀ XUẤT]` **Hard floor/ceiling price:** Ngưỡng tuyệt đối AI không bao giờ vượt qua
- `[ĐỀ XUẤT]` **Revenue impact simulator:** Ước tính doanh thu kỳ vọng trước khi áp giá mới

---

### 4.3 Competitor Tracking (`/products/competitor-tracking`)

#### Tính năng hiện có
- **ProductsCompetitorTrackingView:** Container tổng thể
- **CompetitorComparisonTable:** Bảng so sánh giá mình vs đối thủ
- **CompetitorHeatmapGrid:** Heatmap thể hiện vị trí cạnh tranh (matrix sản phẩm × đối thủ)
- **CompetitorSidebar:** Sidebar phân tích tổng thể
- **TopCompetitorCard:** Cards top đối thủ theo thứ hạng cạnh tranh
- Phân tích vị thế thị trường
- Chỉ số xu hướng giá

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Alert biến động giá đối thủ:** Thông báo khi đối thủ thay đổi giá sản phẩm đang theo dõi
- `[ĐỀ XUẤT]` **Thêm đối thủ mới:** Form nhập URL / shop ID đối thủ
- `[ĐỀ XUẤT]` **Lịch sử giá đối thủ:** Line chart so sánh lịch sử mình vs đối thủ
- `[ĐỀ XUẤT]` **AI phản ứng cạnh tranh:** Gợi ý điều chỉnh giá dựa trên biến động đối thủ
- `[ĐỀ XUẤT]` **Export báo cáo cạnh tranh:** PDF/Excel phân tích tuần/tháng

---

### 4.4 Product Detail (`/products/:id`)

#### Tính năng hiện có
- **Back navigation button**
- **Tên sản phẩm** (heading lớn)
- **Product ID + last update timestamp**
- **Badge trạng thái:** Active / Inactive (màu)
- **Badge số variants**
- **Badge số kênh bán**
- **Edit Mode (toggle):**
  - Tên sản phẩm (input)
  - Thương hiệu (input)
  - Mô tả ngắn (input)
  - Model (input)
  - Mô tả chi tiết (textarea)
  - Thông tin bảo hành (input)
  - URL ảnh chính + image preview
  - URLs gallery tối đa 9 ảnh (multi-line textarea)
  - Dropdown chọn trạng thái
  - Validation ảnh URL
  - Nút Lưu / Huỷ
- **Stats Grid:** Nhiều KPI cards (doanh thu, đơn hàng, ...)
- **Overview Card:** Thông tin tổng quan sản phẩm
- **Variants Panel:** Danh sách variant / giá / tóm tắt tồn kho
- **Applied Automation Triggers:** Cards hiển thị automation trigger đang áp dụng — tên, scope label, mô tả
- **Financial Summary:** Giá bán trung bình

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Tab SEO:** Tên hiển thị SEO, mô tả meta, từ khoá tối ưu theo platform
- `[ĐỀ XUẤT]` **Đồng bộ đa platform:** Đẩy thông tin/ảnh lên tất cả platform cùng lúc
- `[ĐỀ XUẤT]` **Audit log sản phẩm:** Xem lịch sử ai đã sửa gì, khi nào
- `[ĐỀ XUẤT]` **Clone sản phẩm:** Nhân bản để tạo sản phẩm tương tự
- `[ĐỀ XUẤT]` **Sản phẩm liên quan:** Gợi ý upsell/cross-sell từ trang chi tiết
- `[ĐỀ XUẤT]` **Tab Reviews tổng hợp:** Tổng hợp tất cả review từ mọi platform cho sản phẩm này

---

## 5. Doanh thu (Revenue)

**Route:** `/revenue/*`  
**Mô tả:** Phân tích doanh thu chi tiết, so sánh đa nền tảng, và dự báo ML theo kịch bản.

---

### 5.1 Summary Report (`/revenue/summary-report`)

#### Tính năng hiện có
- **RevenueSummaryHeader:**
  - Range selector: week / month / quarter / year
  - Platform filter: All / Shopee / Lazada / TikTok
  - **Nút "Xuất PDF"** → gọi `window.print()`
- **RevenueKpiSection:** Grid KPI cards — tổng doanh thu, đơn hàng, giá trị trung bình, tăng trưởng, so sánh kỳ trước
- **RevenueDailyChartSection:** Line chart doanh thu hàng ngày multi-series theo platform, nhãn kỳ, nhãn so sánh
- **RevenueTopProductsSection (Top 15):** Bar chart ngang dạng progress bar với rank / tên SP / doanh thu, nút "Chi tiết" scroll xuống bảng
- **RevenueCostBreakdownSection:** Donut chart phân tích chi phí — tách biệt theo nhóm chi phí vận hành
- **RevenueProfitFlowSection (Waterfall Chart):** BarChart dạng waterfall thể hiện: doanh thu gộp → trừ từng loại chi phí → lợi nhuận ròng. Legend tăng/tổng (xanh lá) và chi phí giảm trừ (đỏ)
- **RevenueProfitTableSection:** Bảng lợi nhuận theo sản phẩm — search, phân trang (page size 5/10/20), tổng số sản phẩm
- **Scroll to table:** Click "Chi tiết" trong TopProducts → smooth scroll đến bảng lợi nhuận

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Lợi nhuận ròng sau phí sàn:** Tính đủ phí hoa hồng + phí vận chuyển + giá vốn
- `[ĐỀ XUẤT]` **Gửi báo cáo qua email tự động:** Hàng tuần / tháng theo lịch
- `[ĐỀ XUẤT]` **So sánh YoY / MoM:** Toggle xem cùng kỳ năm trước / tháng trước
- `[ĐỀ XUẤT]` **Breakdown theo nhân viên phụ trách:** Nếu có phân công team sales
- `[ĐỀ XUẤT]` **Branded PDF report:** Báo cáo đẹp kèm logo, màu thương hiệu

---

### 5.2 Platform Comparison (`/revenue/platform-comparison`)

#### Tính năng hiện có
- **RevenueComparisonHeader:** Tiêu đề, subtitle, nhãn tháng đang xem
- **RevenueComparisonCards:** Cards so sánh từng platform — doanh thu, tăng trưởng, rank
- **RevenueComparisonKpiAndTrend:** Grid KPI + trend chart so sánh đa platform
- **RevenueComparisonInsights:** Danh sách insights — tiêu đề, subtitle, các mục insight

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Radar chart:** So sánh đa chiều (doanh thu, đơn hàng, conversion, rating, tăng trưởng)
- `[ĐỀ XUẤT]` **Chi phí quảng cáo theo platform:** Tính ROAS thực tế
- `[ĐỀ XUẤT]` **Gợi ý tái phân bổ ngân sách:** Dựa trên ROAS và tốc độ tăng trưởng
- `[ĐỀ XUẤT]` **Thị phần nội bộ theo thời gian:** Stacked area chart tỷ trọng từng platform

---

### 5.3 ML Forecast (`/revenue/ml-forecast`)

#### Tính năng hiện có
- **RevenueMlForecastHeaderSections:**
  - Range selector
  - Headline KPI cards: doanh thu dự kiến / tăng trưởng kỳ vọng / confidence metrics
- **RevenueMlForecastScenarioSections:** Tab chọn kịch bản:
  - Tên kịch bản
  - Doanh thu dự kiến
  - Badge "Được đề xuất"
  - Màu accent (neutral / positive / negative / warning)
- **RevenueMlForecastChartSection:**
  - Line chart: dữ liệu lịch sử + đường dự báo
  - Dải confidence interval
  - Annotations sự kiện quan trọng
  - Legend + nhãn kịch bản được chọn
- **RevenueMlForecastBusinessSections:**
  - Breakdown doanh thu theo kênh
  - Target vs hiện tại + khoảng cách đến mục tiêu
  - Key revenue drivers
  - Smart alerts: đề xuất hành động / risk indicators / opportunities
- **Dynamic update:** Chart và KPI tự cập nhật theo kịch bản được chọn
- **Scenario confidence indicators**

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Custom scenario builder:** Nhập giả định (tăng X% giá, thêm Y% budget) để tạo kịch bản riêng
- `[ĐỀ XUẤT]` **What-if simulator:** "Nếu giảm giá 10% thì doanh thu thay đổi thế nào?"
- `[ĐỀ XUẤT]` **Lưu và so sánh song song nhiều kịch bản**
- `[ĐỀ XUẤT]` **Forecast accuracy tracker:** MAPE, RMSE kỳ trước để đánh giá độ tin cậy model
- `[ĐỀ XUẤT]` **Export kịch bản:** Xuất Excel cho báo cáo nội bộ/investor

---

## 6. CRM & Review

**Route:** `/crm/*`  
**Mô tả:** Quản lý mối quan hệ khách hàng, phân tích cảm xúc đánh giá và phản hồi khách hàng.

---

### 6.1 Sentiment Analysis (`/crm/sentiment-analysis`)

#### Tính năng hiện có
- **SentimentAnalysisHeader:** Tiêu đề trang, tóm tắt tổng số đánh giá
- **SentimentAnalysisScoreCard:** Card điểm sentiment tổng hợp (positive/negative/neutral %)
- **SentimentAnalysisTimelineCard:** Timeline cảm xúc theo thời gian
- **SentimentAnalysisInsightsPanel:** Panel insights — xu hướng, từ khoá nổi bật
- **Filters:**
  - Week Selector dropdown (chọn tuần / Tất cả)
  - Platform Filter (All / Shopee / Lazada / TikTok)
- **SentimentAnalysisReviewList:** Danh sách reviews với:
  - Sao đánh giá (1–5)
  - Nội dung review
  - Tên khách hàng
  - Ngày đánh giá
  - Badge platform
- **SentimentAnalysisReviewCard:** Card từng review, highlight khi được chọn
- **Selected Review Detail Panel:**
  - Nội dung đầy đủ
  - Thông tin khách hàng
  - Ảnh đính kèm (nếu có)
  - Trạng thái đã phản hồi / chưa phản hồi
- **SentimentAnalysisReplyComposer:** Soạn phản hồi:
  - Ô nhập text
  - Chọn tone (trân trọng / trung lập / cảm ơn)
  - Toggle Bản nháp / Gửi luôn
  - Nút Submit với loading state
- **Sentiment Indicators:** Positive (xanh) / Neutral (xám) / Negative (đỏ)
- **Keyboard Navigation:** Mũi tên lên/xuống để chuyển review

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **AI auto-draft reply:** AI soạn sẵn phản hồi phù hợp với tone và nội dung đánh giá
- `[ĐỀ XUẤT]` **Sentiment trend chart:** Biểu đồ xu hướng positive/negative/neutral theo tuần
- `[ĐỀ XUẤT]` **Word cloud:** Từ khoá xuất hiện nhiều nhất trong reviews
- `[ĐỀ XUẤT]` **Alert review xấu:** Thông báo ngay khi có review 1–2 sao mới
- `[ĐỀ XUẤT]` **Assign review:** Giao cho nhân viên cụ thể xử lý review

---

### 6.2 Review Inbox (`/crm/review-inbox`)

#### Tính năng hiện có
- **CRMReviewInboxHeader:** Tiêu đề + summary metrics (tổng chưa phản hồi, đã phản hồi, tổng)
- **CRMReviewFilterBar:**
  - Status filter: `unreplied` / `replied` / `all` (default: unreplied)
  - Sort: Mới nhất / Cũ nhất
  - Summary counts cho từng status
- **CRMReviewList (7 cột):**
  - Danh sách review items (`CRMReviewCard`)
  - Loading skeleton
  - Mark as read từng review
  - Chọn review → highlight + hiển thị detail panel
- **CRMReplyComposerPanel (5 cột):**
  - Hiển thị review đang được chọn
  - **Template Replies:** Danh sách template có thể click để điền nhanh vào ô soạn
  - Ô soạn nội dung phản hồi
  - Tone selector (important / friendly)
  - Nút "Lưu bản nháp" + "Gửi ngay"
  - Loading state khi gửi
  - Draft persistence: mỗi review có draft riêng
- **CRMWeeklyInsightCard:** Card tóm tắt insight tuần — xu hướng đánh giá, thống kê nhanh

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **SLA deadline per platform:** Hiển thị thời hạn phản hồi theo yêu cầu từng sàn
- `[ĐỀ XUẤT]` **Scheduled reply:** Soạn xong → lên lịch gửi vào giờ cố định
- `[ĐỀ XUẤT]` **Filter nhanh theo sao:** 1⭐ / 2⭐ / 3⭐ / 4⭐ / 5⭐
- `[ĐỀ XUẤT]` **Tag phân loại vấn đề:** Gắn tag (vận chuyển / chất lượng / giá / dịch vụ) để phân tích sau
- `[ĐỀ XUẤT]` **AI auto-draft reply:** Tương tự Sentiment Analysis

---

### 6.3 Customer Profiles (`/crm/customer-profiles`)

#### Tính năng hiện có
- **CRMCustomerProfilesHeader:** Tiêu đề, search input, filter controls
- **CRMCustomerProfilesScreen:** Container chính
- **CRMCustomerProfilesSidebar:** Danh sách khách hàng để chuyển nhanh giữa các profile
- **Customer Data Table:**
  - Tên khách hàng
  - Tổng số đơn hàng
  - Lifetime Value (LTV)
  - Ngày tham gia
  - Ngày mua cuối cùng
- **CRMCustomerProfileOverviewCard:** Card thông tin cơ bản + platform badges
- **CRMCustomerProfileLifecycleCard:** Badge lifecycle stage (New / Active / At Risk / Churned / Champion)
- **CRMCustomerProfileMetricsGrid:** Grid chỉ số: tổng đơn / tổng chi tiêu / giá trị TB đơn / số reviews
- **CRMCustomerProfileOrderHistoryCard:** Lịch sử đơn hàng gần đây
- Chỉ số trạng thái khách hàng

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **RFM Segmentation:** Tự động phân loại Recency / Frequency / Monetary
- `[ĐỀ XUẤT]` **Merge profile trùng:** Gộp profile khách mua trên nhiều platform
- `[ĐỀ XUẤT]` **CRM Notes:** Ghi chú nội bộ về khách hàng
- `[ĐỀ XUẤT]` **Loyalty tier:** Hạng thành viên Bronze/Silver/Gold + điểm tích lũy
- `[ĐỀ XUẤT]` **Tạo segment marketing:** Lưu nhóm theo điều kiện để target voucher/campaign
- `[ĐỀ XUẤT]` **Export CSV:** Xuất danh sách cho email/SMS marketing
- `[ĐỀ XUẤT]` **Churn prediction:** AI dự báo khả năng không quay lại
- `[ĐỀ XUẤT]` **Purchase frequency timeline:** Biểu đồ thể hiện khoảng cách giữa các lần mua

---

## 7. Cài đặt (Settings)

**Route:** `/settings/*`  
**Mô tả:** Cấu hình tài khoản, kết nối nền tảng, phân quyền nhân viên và xây dựng automation.

---

### 7.1 Profile (`/settings/profile`)

#### Tính năng hiện có
- **ProfileSettingsHeader:** Tiêu đề, subtitle, timestamp cập nhật, refresh indicator
- **ProfileStatsGrid:** Grid thống kê tài khoản (số platform kết nối, đơn hàng xử lý, ...)
- **ProfileFormSection (8 cột trái):**
  - Họ tên đầy đủ (input)
  - Số điện thoại (input)
  - Chức danh (Job title — input)
  - Múi giờ (Timezone — input)
  - Email (readonly — không thể sửa trực tiếp)
  - Bio / mô tả ngắn (input)
- **ProfilePreferencesSection:** "Tùy chọn vận hành" — danh sách preferences có thể toggle bật/tắt (nhắc nhở, chế độ làm việc)
- **Nút Lưu thay đổi** (disable khi đang lưu)
- **ProfileIdentityCard (4 cột phải):** Avatar, tên, vai trò, platform badges
- **ProfileSecuritySection (sidebar phải):** Danh sách security checks:
  - Mỗi check: icon ShieldCheck/AlertTriangle, tên, mô tả, badge "An toàn" / "Cần xử lý"
  - Nút action theo từng check
  - Mô tả: "Kiểm tra định kỳ giúp giảm rủi ro khi vận hành đa nền tảng"

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Đổi mật khẩu:** Form đổi mật khẩu ngay trong section bảo mật
- `[ĐỀ XUẤT]` **Kích hoạt 2FA:** Bật xác thực 2 yếu tố (TOTP/SMS)
- `[ĐỀ XUẤT]` **Upload avatar:** Drag & drop hoặc click upload ảnh đại diện
- `[ĐỀ XUẤT]` **Lịch sử đăng nhập:** Thiết bị + IP + thời điểm đăng nhập gần đây
- `[ĐỀ XUẤT]` **Session management:** Đăng xuất khỏi tất cả thiết bị khác
- `[ĐỀ XUẤT]` **Tuỳ chỉnh kênh thông báo:** Email / Browser / App cho từng loại alert

---

### 7.2 Platform Connections (`/settings/platform-connections`)

#### Tính năng hiện có
- **PlatformConnectionsHeader:** Tiêu đề, subtitle
- **Summary Cards (3 cards):**
  - "Sàn hoạt động" (ShieldCheck xanh): Số platform đang kết nối ổn định
  - "Token cảnh báo" (Siren vàng): Số token sắp hết hạn / đã hết hạn (highlight amber khi > 0)
  - "Webhook healthy" (Unplug indigo): X/Y endpoint đang hoạt động
- **ConnectedPlatformsSection (8 cột):** Danh sách platform đã kết nối với:
  - `PlatformConnectionCard`: Logo, tên, trạng thái kết nối, thời điểm sync cuối, token expiry
  - Nút Kết nối lại / Ngắt kết nối
- **WebhookStatusSection (8 cột):** Danh sách webhook endpoints:
  - Tên endpoint, URL cấu hình, trạng thái (healthy / error)
  - Nhãn cấu hình endpoint
- **AddPlatformSection (4 cột phải):** Danh sách nền tảng có thể thêm mới với nút Setup

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Lịch đồng bộ tuỳ chỉnh:** Tần suất và thời điểm sync
- `[ĐỀ XUẤT]` **Sync log chi tiết:** Log từng lần sync: records xử lý, lỗi gặp phải
- `[ĐỀ XUẤT]` **Test connection ngay:** Kiểm tra API credential ngay lập tức
- `[ĐỀ XUẤT]` **Multi-shop support:** Nhiều shop trên cùng một platform
- `[ĐỀ XUẤT]` **Scopes review:** Hiển thị rõ quyền hạn đang được cấp cho từng kết nối

---

### 7.3 Staff & Permissions (`/settings/staff-permissions`)

#### Tính năng hiện có
- **StaffPermissionsBreadcrumb:** Breadcrumb điều hướng
- **StaffPermissionsHeader:** Tiêu đề, subtitle, nút "Mời nhân viên"
- **SupportedPlatformsStrip:** Dải hiển thị các platform được hỗ trợ
- **StaffSummaryCards:** Cards thống kê nhân viên (tổng số, active, pending invite,...)
- **StaffMembersTableSection:** Bảng nhân viên — tên, email, vai trò, trạng thái, last active
  - Actions per member: click opens `StaffMemberActionDialog`
  - Activity button: opens `StaffMemberActivityDrawer`
- **PermissionsMatrixSection:** Ma trận phân quyền dạng bảng:
  - Hàng: từng module / tính năng
  - Cột: từng vai trò
  - Cell: checkbox cho phép / không
- **SettingsStaffPermissionsInviteDrawer:** Drawer mời nhân viên mới:
  - Nhập email
  - Chọn vai trò
  - `InvitePermissionToggle`: Toggle từng quyền riêng lẻ
  - Nút gửi lời mời
- **StaffMemberActionDialog:** Dialog hành động với nhân viên (đổi role, deactivate, ...)
- **StaffMemberActivityDrawer:** Drawer xem lịch sử hoạt động của thành viên

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Custom roles:** Tạo vai trò tuỳ chỉnh ngoài 4 role mặc định
- `[ĐỀ XUẤT]` **Phân quyền theo platform:** Nhân viên A chỉ xem Shopee, nhân viên B chỉ Lazada
- `[ĐỀ XUẤT]` **IP whitelist:** Giới hạn đăng nhập từ dải IP cụ thể
- `[ĐỀ XUẤT]` **Bulk permission update:** Cập nhật quyền cho nhiều nhân viên cùng lúc

---

### 7.4 Automation (`/settings/automation`)

#### Tính năng hiện có
- **AutomationStatsBar:** Tổng quy tắc active / Tổng hành động tự động / Biểu đồ thời gian tiết kiệm
- **AutomationCategoryTabs:** Tab Đơn hàng / Kho hàng / Sản phẩm / Khách hàng
- **Rules Table:**
  - Tên quy tắc
  - Loại / danh mục
  - Tóm tắt điều kiện trigger
  - Toggle bật/tắt
  - Timestamp kích hoạt cuối cùng
  - Checkbox chọn hàng + bulk actions
  - Load more pagination
- **Nút "Tạo quy tắc mới"** → `/settings/automation/new-rule`
- **AutomationBuilderPreview:** Preview rule đang được chọn:
  - Điều kiện trigger đầy đủ
  - Hành động thực thi
  - Link đến execution log

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Import/Export rules:** Chia sẻ quy tắc giữa tài khoản / môi trường
- `[ĐỀ XUẤT]` **Run history log:** Nhật ký từng lần kích hoạt — thành công / thất bại
- `[ĐỀ XUẤT]` **Test rule với data mẫu:** Chạy thử trước khi bật thật
- `[ĐỀ XUẤT]` **Rate limiting:** Giới hạn số lần kích hoạt tối đa trong X phút
- `[ĐỀ XUẤT]` **Rule dependency:** Rule B chỉ chạy sau khi rule A hoàn thành

---

### 7.5 Automation Builder (`/settings/automation/new-rule`)

#### Tính năng hiện có
- **Multi-step form builder (5 bước):**
  - **Bước 1:** Chọn Trigger — grid cards theo loại trigger (icon + tên + mô tả)
  - **Bước 2:** Cấu hình tham số Trigger — form fields context theo trigger đã chọn
  - **Bước 3:** Chọn Điều kiện — grid cards điều kiện với logic operators
  - **Bước 4:** Chọn Hành động — grid cards action với mô tả
  - **Bước 5:** Cấu hình tham số Hành động — form fields theo action đã chọn
- **Progress Indicator:** Hiển thị bước hiện tại / tổng bước
- **Step Hints & Help Text:** Gợi ý ngữ cảnh theo từng bước
- **Trigger Insight Panel:** Hiển thị số records bị ảnh hưởng bởi trigger đang cấu hình
- **Input tên quy tắc**
- **Save / Cancel footer bar**
- **Validation từng bước** trước khi sang bước tiếp theo
- **Preview/Summary** trước khi lưu chính thức

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **AND/OR logic builder:** Nhóm điều kiện phức tạp hơn
- `[ĐỀ XUẤT]` **Multiple actions per rule:** Một rule có thể kích hoạt nhiều hành động tuần tự
- `[ĐỀ XUẤT]` **Time delay giữa actions:** Hành động 2 chạy sau hành động 1 X phút/giờ
- `[ĐỀ XUẤT]` **Duplicate rule:** Nhân bản rule hiện có
- `[ĐỀ XUẤT]` **Template library:** Thư viện rule mẫu phổ biến (tự xác nhận đơn, cảnh báo tồn thấp,...)

---

## 8. Tích hợp nền tảng (Platforms)

**Route:** `/platforms/*`

### 8.1 Platforms Overview (`/platforms`) `[STUB]`

> Route tồn tại nhưng component hiện chỉ là `return <div />` — chưa có UI.

#### Tính năng dự kiến (cần build)
- Danh sách nền tảng có thể kết nối: Shopee / Lazada / TikTok
- Card nền tảng: logo, tên, trạng thái, nút Setup / Kết nối lại
- Thông tin yêu cầu kết nối của từng platform

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Mở rộng platform:** Tiki, Facebook Shop, Instagram Shop
- `[ĐỀ XUẤT]` **Health check tự động:** Cảnh báo khi token sắp hết hạn
- `[ĐỀ XUẤT]` **Scopes permission review:** Hiển thị rõ quyền đang cấp cho từng kết nối

---

### 8.2 Platform OAuth Callback (`/platforms/callback/:platform`) `[STUB]`

> Route tồn tại nhưng component hiện chỉ là `return <div />` — chưa có UI.

#### Tính năng dự kiến (cần build)
- Xử lý OAuth callback từ platform
- Thông báo kết nối thành công / thất bại
- Redirect về Settings sau khi hoàn thành

---

## 9. AI & Trợ lý thông minh

**Route:** `/ai/*`

### 9.1 AI Chat (`/ai/chat`) `[STUB]`

> Route tồn tại nhưng component hiện chỉ là `return <div />` — chưa có UI.

#### Tính năng dự kiến (cần build)
- Giao diện chat hỏi đáp thông tin kinh doanh
- Ô nhập tin nhắn, lịch sử cuộc trò chuyện
- AI trả lời kèm data insights

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Suggested prompts:** Gợi ý câu hỏi thường dùng
- `[ĐỀ XUẤT]` **Inline chart/table trong chat:** AI trả lời kèm biểu đồ trực tiếp
- `[ĐỀ XUẤT]` **Lưu conversation history:** Theo ngày
- `[ĐỀ XUẤT]` **Agentic actions:** AI thực hiện hành động ("Xuất báo cáo tuần này")
- `[ĐỀ XUẤT]` **Voice input:** Nhập bằng giọng nói (Web Speech API)

---

### 9.2 AI Forecast (`/ai/forecast`) `[STUB]`

> Route tồn tại nhưng component hiện chỉ là `return <div />` — chưa có UI.

#### Tính năng dự kiến (cần build)
- Dự báo kinh doanh tổng hợp bằng AI
- Tạo nhiều kịch bản, recommendation engine

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Feedback loop:** Người dùng đánh giá độ chính xác để cải thiện model
- `[ĐỀ XUẤT]` **External data:** Tích hợp dữ liệu thị trường bên ngoài (Google Trends, sự kiện)

---

## 10. Hệ thống & Shared

### 10.1 Trang 404 Not Found (`*`)

#### Tính năng hiện có
- Heading "404" lớn + label "Lỗi điều hướng"
- Thông báo: "Không tìm thấy trang bạn đang truy cập."
- Hiển thị đường dẫn hiện tại `location.pathname`
- **Nút "Quay lại":** `navigate(-1)`
- **Nút "Về trang chủ":** Link về `/` (gradient indigo)
- Background gradient + decorative blur circles
- Glassmorphism card layout

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Gợi ý trang tương tự:** Suggest các trang gần giống URL bị nhập sai
- `[ĐỀ XUẤT]` **Log lỗi điều hướng:** Gửi event analytics khi user gặp 404

---

### 10.2 Section Placeholder (Coming Soon)

#### Tính năng hiện có
Shared component `SectionPagePlaceholder` được dùng cho các trang chưa hoàn thiện:
- Badge "Coming Soon" (hoặc text tuỳ chỉnh)
- Icon trong rounded box
- Tiêu đề card lớn
- Mô tả tính năng
- Helper text: "Trang này đang được hoàn thiện theo roadmap sản phẩm."
- Optional action button với gradient indigo
- Gradient background (white → slate-50 → indigo-50)

---

### 10.3 Footer (`AppFooter`)

#### Tính năng hiện có
- **AppFooterBrandBlock:** Logo/brand name, headline, mô tả, email hỗ trợ, số điện thoại
- **AppFooterLinkGroups:** Nhóm links điều hướng (nhiều nhóm, nhiều links mỗi nhóm)
- **AppFooterBottomBar:** Copyright label + last updated label (responsive flex)
- Styling: `border-t`, gradient from `slate-50` to `white`, padding `py-8`
- `isRefreshing` prop cho animation khi đang refresh

---

## 11. Giao diện & Thành phần chung

### 11.1 Navigation Sidebar

#### Tính năng hiện có
- Logo/brand link → `/dashboard/kpi-overview`
- Menu sections expandable với icon + label:
  - Dashboard (4 mục: KPI Overview / Revenue Charts / Top Products / Alerts)
  - Đơn hàng (3 mục: All / Pending / Returns)
  - Kho hàng (3 mục: SKU Stock / Stock Movements / AI Forecast)
  - Doanh thu (3 mục: Summary / Platform Comparison / ML Forecast)
  - Sản phẩm & Giá (3 mục: Products List / Dynamic Pricing / Competitor Tracking)
  - CRM & Review (3 mục: Sentiment / Review Inbox / Customer Profiles)
  - Cài đặt (3 mục: Profile / Platform Connections / Staff Permissions / Automation)
- Link Profile Settings ở cuối sidebar
- Active state highlight trang hiện tại
- Responsive collapse trên mobile

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Collapse to icon-only:** Thu gọn sidebar để mở rộng content area
- `[ĐỀ XUẤT]` **Pinned favorites:** Ghim trang thường dùng lên đầu
- `[ĐỀ XUẤT]` **Badge số cần xử lý:** Badge đếm đơn chờ trên menu "Đơn hàng"
- `[ĐỀ XUẤT]` **Keyboard shortcuts:** Phím tắt điều hướng nhanh (Ctrl+1, Ctrl+2,...)

---

### 11.2 Navbar (Top Bar)

#### Tính năng hiện có
- **NavbarTitleSection:** Tiêu đề trang theo route hiện tại (dynamic)
- **NavbarDatePicker:** Chọn nhanh khoảng thời gian toàn cục
- **NavbarNotificationsMenu:**
  - Badge đếm thông báo chưa đọc
  - Dropdown danh sách thông báo gần đây
  - Đánh dấu đã đọc
  - Link đến Settings
- **NavbarAccountMenu:**
  - Thông tin người dùng (tên, email, avatar)
  - Link Settings
  - Nút Đăng xuất

#### Đề xuất bổ sung
- `[ĐỀ XUẤT]` **Global search (Ctrl+K):** Tìm nhanh đơn hàng, sản phẩm, khách hàng
- `[ĐỀ XUẤT]` **Quick create button "+":** Tạo nhanh đơn / sản phẩm / rule
- `[ĐỀ XUẤT]` **Store selector:** Dropdown chọn cửa hàng khi quản lý nhiều shop
- `[ĐỀ XUẤT]` **Live sync indicator:** Hiển thị trạng thái đồng bộ realtime (đang sync / đã sync)

---

### 11.3 Thành phần UI tái sử dụng

| Thành phần | Tính năng hiện có |
|---|---|
| Data Table | Phân trang, multi-select checkbox, toggle select all, skeleton loading |
| Filter System | Chips lọc, badge count, dropdown, search input, date range picker, amount range |
| Status Badges | Màu sắc theo từng trạng thái domain |
| Loading Skeleton | Animated skeleton thay thế content khi loading |
| Empty State | Giao diện hướng dẫn khi không có dữ liệu |
| Error State | `DataLoadErrorState`: thông báo lỗi + nút retry |
| Toast Notifications | Success / Error / Info / Warning (Sonner) |
| Modals & Drawers | Overlay chi tiết — 2 chế độ: modal / full-page |
| Form Inputs | Validation real-time (React Hook Form + Zod) |
| Action Buttons | Loading state + disabled khi đang xử lý |
| Breadcrumbs | Điều hướng phân cấp trang |
| Refresh Button | Đồng bộ dữ liệu thủ công |
| SectionPagePlaceholder | "Coming Soon" card cho tính năng đang dev |

#### Đề xuất bổ sung toàn hệ thống
- `[ĐỀ XUẤT]` **Undo/Redo (5–10s):** Hoàn tác thao tác vừa thực hiện
- `[ĐỀ XUẤT]` **Keyboard navigation:** Điều hướng bảng dữ liệu bằng phím mũi tên
- `[ĐỀ XUẤT]` **Onboarding tour:** Hướng dẫn từng bước cho user mới lần đầu đăng nhập
- `[ĐỀ XUẤT]` **Context help (?):** Tooltip giải thích thuật ngữ/chỉ số khi hover `?`
- `[ĐỀ XUẤT]` **Global Audit Log:** Admin xem toàn bộ thay đổi dữ liệu của hệ thống
- `[ĐỀ XUẤT]` **Offline mode indicator:** Thông báo mất kết nối + tự retry khi có mạng
- `[ĐỀ XUẤT]` **Print stylesheets:** CSS tối ưu `@media print` cho mọi trang
- `[ĐỀ XUẤT]` **Accessibility (a11y):** ARIA labels, keyboard focus trap, screen reader support

---

## Tóm tắt số liệu

| Module | Số trang/route | Trạng thái | Tính năng hiện có | Đề xuất bổ sung |
|---|:---:|:---:|:---:|:---:|
| Auth | 2 | ✅ Đầy đủ | ~15 | ~4 |
| Dashboard | 4 | ✅ Đầy đủ | ~35 | ~18 |
| Đơn hàng | 4 | ✅ Đầy đủ | ~45 | ~18 |
| Kho hàng | 4 | ✅ Đầy đủ | ~40 | ~20 |
| Sản phẩm & Giá | 4 | ✅ Đầy đủ | ~40 | ~18 |
| Doanh thu | 3 | ✅ Đầy đủ | ~30 | ~14 |
| CRM & Review | 3 | ✅ Đầy đủ | ~35 | ~20 |
| Cài đặt | 5 | ✅ Đầy đủ | ~50 | ~18 |
| Platforms | 2 | 🚧 STUB | — | ~6 |
| AI | 2 | 🚧 STUB | — | ~7 |
| Hệ thống/Shared | 3 | ✅ Đầy đủ | ~10 | ~4 |
| **Tổng** | **40** | | **~300** | **~147** |

---

### Chú thích trạng thái

| Ký hiệu | Ý nghĩa |
|---|---|
| ✅ Đầy đủ | Trang đã có UI và logic hoàn chỉnh |
| 🚧 STUB | Route tồn tại nhưng component rỗng (`return <div />`) — cần build |
| `[ĐỀ XUẤT]` | Tính năng chưa có, đề xuất triển khai trong sprint tiếp theo |

---

*Tài liệu được tạo từ phân tích trực tiếp source code. Mọi tính năng "hiện có" đều được verify từ component files thực tế.*
