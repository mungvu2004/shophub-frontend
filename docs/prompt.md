# ShopHub — Stitch Prompt Library v1.3

**Phiên bản:** 1.3 — Tháng 3/2026 | **Screens:** 22 chính + 30+ state screens

---

## CÁCH DÙNG

**Bước 1:** Copy **SHELL BLOCK** ở mục ngay dưới (copy 1 lần duy nhất cho mỗi screen).
**Bước 2:** Copy **nội dung prompt** của trang cần thiết kế.
**Bước 3:** Ghép: `[SHELL BLOCK] + [nội dung prompt]` → paste vào Stitch → Generate.
**Bước 4:** Sau khi có kết quả → paste **Pass 2** như Editing Prompt để fix chi tiết.

> **Shell Block là bắt buộc cho mọi prompt (trừ Login).** Sidebar và topbar đã được định nghĩa hoàn toàn trong Shell Block — các prompt nội dung **không được mô tả lại** sidebar hay topbar.
>
> Mỗi prompt chỉ cần 1 dòng khai báo shell: `NAV: [tên item] | TOPBAR: "[tiêu đề]" / "[phụ đề]"`

---

## SHELL BLOCK — Copy vào ĐẦU mọi prompt, trừ Login

```
ShopHub SaaS — web desktop 1280px.

IMPORTANT: Sidebar and topbar must be rendered EXACTLY as specified below. Do not modify any part of them.
The content prompt will specify: NAV = which sidebar item is active, TOPBAR = what title and date to show in the topbar left area. Everything else in the shell stays exactly as specified.

SIDEBAR: 240px wide, full height, bg-slate-950 (#0B1120 very dark navy), shadow-2xl. Two sections: top nav + bottom profile.

  TOP — Logo: text "ShopHub" only — 24px bold white, padding-left 24px, padding-top 32px, padding-bottom 32px. NO icon, NO subtitle, NO "Management" text under logo.

  TOP — Nav list (space-y-1, tiny gap between items):
  7 items. Each item = icon (Material Symbols Outlined, 24px) + label text (14px), flex row, gap-12px, padding px-16px py-12px, margin mx-12px, rounded-lg corners.
  ACTIVE item "Dashboard" (or the specified screen's nav item): bg indigo-600/10 (very faint indigo wash — NOT solid blue), text indigo-400, font-semibold.
  INACTIVE items: text-slate-400.
  Icons (Material Symbols Outlined): Dashboard=dashboard · Đơn hàng=shopping_cart · Kho hàng=inventory_2 · Doanh thu=payments · Sản phẩm=inventory · CRM & Review=group · Cài đặt=settings.

  BOTTOM — separated by thin border-t (slate-800 at 50% opacity): one row = account_circle icon + "Profile Settings" text, same layout as inactive nav item (text-slate-400, mx-12px px-16px py-12px). NO avatar photo here.

TOPBAR: 64px tall, starts at x=240px, bg white/80 backdrop-blur, thin bottom border, padding px-32px.
  LEFT (flex row, gap-16px, vertically centered): "Dashboard" text (20px bold dark #111C2D) → thin 1px vertical divider line (16px tall, very light gray) → "Hôm nay, 24 Oct" (14px, slate-500).
  RIGHT (flex row, gap-24px): three icon buttons (calendar_today · refresh · notifications — 24px slate-600, rounded hover) where notifications has a small 8px red dot badge at top-right → then border-left separator → user block (text column: "Admin" 14px semibold + "Workspace 01" 12px gray · avatar circle 40px with thin ring).

CONTENT AREA: starts at x=240px y=64px, bg #F9F9FF.

The sidebar and topbar defined above are fixed and must not be modified. Render them exactly as described before drawing any page content.
```

> **Quy tắc:**
> - Shell Block xuất hiện 1 lần ở đầu prompt, không lặp lại.
> - Mỗi prompt chỉ cần ghi `NAV: Đơn hàng | TOPBAR: "Tiêu đề" / "Phụ đề"` — không mô tả lại sidebar hay topbar.
> - Editing Prompts và State Screens không cần Shell Block.

---

## Mục lục

| # | Trang | Module |
|---|---|---|
| 00 | [Login Page](#00--login-page) | Auth |
| 01 | [Dashboard — Tổng quan](#01--dashboard--tổng-quan) | Dashboard |
| 02 | [Đơn hàng — Danh sách tất cả](#02--đơn-hàng--danh-sách-tất-cả) | Orders |
| 03 | [Đơn hàng — Cần xử lý ngay](#03--đơn-hàng--cần-xử-lý-ngay) | Orders |
| 04 | [Đơn hàng — Hoàn / Huỷ](#04--đơn-hàng--hoàn--huỷ) | Orders |
| 05 | [Kho hàng — Tồn kho SKU](#05--kho-hàng--tồn-kho-sku) | Inventory |
| 06 | [Kho hàng — Nhập / Xuất kho](#06--kho-hàng--nhập--xuất-kho) | Inventory |
| 07 | [Kho hàng — Dự báo AI](#07--kho-hàng--dự-báo-ai) | Inventory |
| 08 | [Doanh thu — Báo cáo tổng hợp](#08--doanh-thu--báo-cáo-tổng-hợp) | Revenue |
| 09 | [Doanh thu — So sánh sàn](#09--doanh-thu--so-sánh-sàn) | Revenue |
| 10 | [Doanh thu — Dự báo ML](#10--doanh-thu--dự-báo-ml) | Revenue |
| 11 | [Sản phẩm — Danh sách sản phẩm](#11--sản-phẩm--danh-sách-sản-phẩm) | Products |
| 12 | [Sản phẩm — Định giá động](#12--sản-phẩm--định-giá-động) | Products |
| 13 | [Sản phẩm — Theo dõi đối thủ](#13--sản-phẩm--theo-dõi-đối-thủ) | Products |
| 14 | [CRM — Phân tích Sentiment](#14--crm--phân-tích-sentiment) | CRM |
| 15 | [CRM — Hộp thư Review](#15--crm--hộp-thư-review) | CRM |
| 16 | [CRM — Hồ sơ khách hàng](#16--crm--hồ-sơ-khách-hàng) | CRM |
| 17 | [Cài đặt — Kết nối sàn](#17--cài-đặt--kết-nối-sàn) | Settings |
| 18 | [Cài đặt — Phân quyền nhân viên](#18--cài-đặt--phân-quyền-nhân-viên) | Settings |
| 19 | [Cài đặt — Tự động hóa](#19--cài-đặt--tự-động-hóa) | Settings |
| 20 | [Order Detail — Slide-over Panel](#20--order-detail--slide-over-panel) | Orders |
| 21 | [Notification Center](#21--notification-center) | Global |

---

## 00 — Login Page

**Role:** Tất cả người dùng | **Breakpoint:** Desktop (centered layout)

```
Web desktop — Login page for ShopHub e-commerce management platform.

LAYOUT: Centered two-column split (50/50):
- Left panel (50%): dark slate background #0F172A, brand area.
  Center-aligned vertically: ShopHub logo (white, 32px bold), tagline "Quản lý toàn bộ Shopee & TikTok Shop từ một nơi" (16px white/70%), decorative illustration of dashboard mockup (abstract, minimal, use indigo shape clusters).
  Bottom: copyright "© 2026 ShopHub" 12px gray.
- Right panel (50%): white background, login form area.
  Center-aligned: "Đăng nhập" heading 28px bold #1E293B, subtitle "Chào mừng trở lại 👋" 14px #64748B.

LOGIN FORM (max-width 360px, centered in right panel):
- Email field: label "Email", placeholder "admin@shophub.vn", search icon inside left
- Password field: label "Mật khẩu", placeholder "••••••••", eye toggle icon right
- "Ghi nhớ đăng nhập" checkbox row + "Quên mật khẩu?" link right-aligned, 13px indigo
- "Đăng nhập" button: full width, indigo bg #4F46E5, white text, 44px height, 8px radius, 15px font semibold
- Divider: "— hoặc —" gray text
- "Đăng nhập bằng Google" button: white bg, border #E2E8F0, Google icon left, 44px height
- Bottom: "Cần hỗ trợ? Liên hệ Admin" 12px gray centered

FOCUS RING: All inputs when focused: 2px ring indigo #6366F1 opacity 20%, 2px offset.
STYLE: Clean, professional, trustworthy. No decorative patterns. Be Vietnam Pro font. Subtle entrance shadow on right panel.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a top loading bar (indigo, 3px height, full width) at the very top of the page above both panels"
"Change the 'Đăng nhập' button to have a right-side arrow icon → inside it"
"Add 'Be Vietnam Pro' font label under the tagline on the left panel — 12px gray, lowercase"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 00-B — Login Error State:*
```
SAME LAYOUT as Screen 00 (Login Default). ONE DIFFERENCE ONLY:
Email field has error state: red border #EF4444, red focus ring rgba(239,68,68,0.20).
Below email field: error message row — ⚠ icon red 14px + "Email không đúng định dạng" red #B91C1C 13px.
All other elements identical to default login screen.
```

*Screen 00-C — Session Expired State:*
```
SAME LAYOUT as Screen 00 (Login Default). ONE DIFFERENCE ONLY:
Add warning banner at the very top of the right white panel, ABOVE the "Đăng nhập" heading:
- Full width of right panel
- Yellow background #FEF3C7, border-bottom 1px #FDE68A
- Left: ⚠ icon amber | Text "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại." 13px #B45309
- Right: X close icon gray 16px
- Padding: 12px 16px
All other elements identical to default login screen.
```

*Screen 00-D — Login Loading State:*
```
SAME LAYOUT as Screen 00 (Login Default). ONE DIFFERENCE ONLY:
- "Đăng nhập" button: disabled state, indigo bg 60% opacity, text "Đang đăng nhập..." with spinner icon left (white, 16px, animated)
- Thin indigo progress bar 3px height at top of right panel, animated left-to-right
All other elements identical to default login screen.
```

---

## 01 — Dashboard — Tổng quan

**Role:** Admin, Nhân viên kinh doanh | **Breakpoint:** Desktop xl:1280px

> **Cách dùng:** Copy SHELL BLOCK + Pass 1 → Generate. Xong → paste Pass 2 như Editing Prompt.

**PASS 1** *(paste sau SHELL BLOCK)*
```
NAV: Dashboard | TOPBAR: "Tổng quan" / "Thứ Sáu, 20/03/2026"

ROW 1 — Platform tabs: [Tất cả (247) active #4F46E5] [● Shopee (163)] [● TikTok Shop (84)]

ROW 2 — 4 KPI cards flex row gap-16px. Each: white radius-12px shadow p-20px. Layout = icon-square 40px + label 11px gray → value 32px bold Mono (ALONE its own line) → trend 13px (own line below) → breakdown 12px gray.
Card 1 "DOANH THU HÔM NAY": icon-bg #EEF2FF dollar-sign indigo. "2.847.500 ₫". "↑ +12.3%" #22C55E. "Shopee 1.900.000 · TikTok 947.500 ₫".
Card 2 "TỔNG ĐƠN HÀNG": icon-bg #EFF6FF bag blue. "247". "↑ +8 đơn" #22C55E. "Shopee 163 · TikTok 84".
Card 3 "CẦN XỬ LÝ NGAY": left-border 3px #F97316 bg #FFFBEB. alert-circle orange. "12" red. "3 đơn sắp trễ SLA" orange.
Card 4 "TỶ LỆ HOÀN/HUỶ": icon-bg gray rotate-ccw. "3.2%". "↓ -0.5%" #22C55E. "Hoàn 2.1% · Huỷ 1.1%".

ROW 3 — Charts flex row: Left flex-3 = line chart "Doanh thu 7 ngày" Shopee #EE4D2D solid + TikTok #010101 dashed, legend top-right. Right flex-2 = donut "Phân bổ đơn hàng" center "247", segments 45%/#4F46E5 · 26%/#3B82F6 · 24%/#22C55E · 5%/#EF4444, legend below.

ROW 4 — Bottom flex row: Left flex-2 = "Top 10 sản phẩm bán chạy" table (rank · img 32px · name · platform · sold mono · revenue mono right) 5 rows. Right flex-1 = AI INSIGHT: header gradient #4F46E5→#7C3AED "✨ AI Cảnh báo Tồn kho" white. Body: 3 SKU rows (name + units red + days orange). Footer indigo link.
```

**PASS 2 — Editing Prompt** *(paste sau khi Pass 1 generate xong)*
```
Fix 3 things in the current design:
1. Each KPI card value (2.847.500 ₫, 247, 12, 3.2%) must be on its OWN full line. Trend text must be on a SEPARATE line below the value — never beside it.
2. AI Insight Block right card header must be gradient indigo #4F46E5 → violet #7C3AED. If currently flat, change to gradient.
3. Each sidebar nav item must show a Lucide icon (20px) LEFT of the label. Missing icons: grid=Dashboard, shopping-cart=Đơn hàng, package=Kho hàng, bar-chart-2=Doanh thu, tag=Sản phẩm, message-circle=CRM, settings=Cài đặt.
```

**Editing prompts** *(sau Pass 2 xong, các tuỳ chọn thêm)*:
```
"Add a thin animated green dot next to the 'Hôm nay' date picker label to indicate live data"
"Add a small sparkline mini-chart (7-day trend line, 60px wide) inside each KPI card below the breakdown row"
"Add a 'Mục tiêu tháng' progress bar below the platform tabs: target 60M d, current 38.2M d (64%), green fill, full width"
```

**State Screens** *(tạo screen mới — "Add screen" — không cần Shell Block)*:

*Screen 01-B — Tab Shopee active:*
```
SAME LAYOUT as Screen 01. ONLY THESE CHANGES:
Platform tab "Shopee (163)" is now active (indigo pill). "Tất cả" becomes inactive.
All 4 KPI cards show Shopee-only numbers: Doanh thu "1.900.000 ₫" | Đơn "163" | Cần xử lý "9" | Hoàn/huỷ "2.8%". Remove breakdown row from cards (single platform). Add 2px top-border #EE4D2D to all 4 cards.
Line chart shows single Shopee line only (solid #EE4D2D, no TikTok). Donut center "163 đơn".
Top products table shows Shopee badge only.
```

*Screen 01-C — Tab TikTok Shop active:*
```
SAME LAYOUT as Screen 01. ONLY THESE CHANGES:
Platform tab "TikTok Shop (84)" is now active (indigo pill). "Tất cả" becomes inactive.
KPI cards TikTok-only: Doanh thu "947.500 ₫" | Đơn "84" | Cần xử lý "3" | Hoàn/huỷ "1.2%" + note "Thấp nhất 2 sàn" green small. Add 2px top-border #010101 to all 4 cards.
Line chart shows single TikTok line (solid #010101, no Shopee). Donut center "84 đơn".
AI Insight Block becomes "TikTok Insights": row 1 "Váy hoa nhí M — Viral · Còn 12 units" red | row 2 "Tăng trưởng +18.2% — Cao nhất 30 ngày" green | row 3 "Gợi ý tăng tồn kho 3 SKU hot" indigo.
```

*Screen 01-D — Sync Error State:*
```
SAME LAYOUT as Screen 01. ONE ADDITION ONLY:
Alert banner at top of main content (above platform tabs): bg #FEE2E2 border-bottom #FECACA px-24px py-12px. Left: red dot + "Mất kết nối Shopee — Dữ liệu có thể chưa cập nhật" 13px #B91C1C. Right: [Thử lại] indigo text button | X close gray.
```


*Screen 01-E — Dashboard Empty State (ngày đầu dùng):*
```
SAME SHELL as Dashboard (sidebar + topbar). Main content area shows empty state:
Large center-aligned area: illustration of empty chart (abstract, indigo line with question mark). 
"Chưa có dữ liệu hôm nay" 18px semibold #1E293B.
"Kết nối Shopee hoặc TikTok Shop để bắt đầu đồng bộ đơn hàng" 14px gray.
[Kết nối sàn ngay] indigo button 44px | [Xem hướng dẫn] outline button.
KPI cards still visible but all values show "—" with gray placeholder styling.
```



---

## 02 — Đơn hàng — Danh sách tất cả

**Role:** Admin, Nhân viên kho | **Breakpoint:** Desktop

> **Cách dùng:** Copy SHELL BLOCK + Pass 1 → Generate. Xong → paste Pass 2.

---

## 03 — Đơn hàng — Cần xử lý ngay

**Role:** Admin, Nhân viên kho | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Đơn hàng | TOPBAR: "Cần Xử Lý Ngay" / "12 đơn cần hành động"

Left: "Cần Xử Lý Ngay" 22px bold, subtitle "12 đơn cần hành động — cập nhật lúc 14:32" 13px gray + animated green dot.
Right: "Xác nhận tất cả (12)" button indigo filled + "In tất cả vận đơn" outline button.

URGENCY SUMMARY BAR (3 stat pills, gap-4, mb-4):
Pill 1 "🔴 Sắp trễ SLA: 3 đơn" — danger bg #FFE4E6 text #B91C1C, pill shape, 13px semibold.
Pill 2 "🟠 Chờ xác nhận >30 phút: 7 đơn" — warning bg #FEF3C7 text #B45309.
Pill 3 "⚡ Đơn Shopee Express: 2 đơn" — info bg #DBEAFE text #1D4ED8.

URGENT ORDERS LIST (vertical cards, gap-3):
Each order card (white, 12px radius, shadow-sm, left border 4px):

Card 1 (border red — SLA breach imminent):
Top row: [☐] SPE-001247 monospace gray | Shopee badge | "Còn 18 phút" countdown red bold | ⚠ icon
Product row: "Áo thun basic trắng L × 2" semibold | "289.000 ₫" monospace right bold
Customer: "Nguyễn Văn A — TP.HCM" 13px gray | phone icon + number
Status: "Chờ xác nhận" badge blue | "Đặt lúc 14:14, cần xác nhận trước 14:30" 12px red
Actions (bottom row): [Xác nhận đơn] indigo filled | [Gọi khách hàng] outline | [Ghi chú] ghost | [Chi tiết ›]

Card 2 (border orange — pending >30min):
SPE-001244 | "Đã chờ 47 phút" orange bold | Shopee | 1.250.000 ₫
"Giày sneaker trắng 39 × 1" | "Phạm Thị D — Hà Nội"
Status: "Chờ xác nhận" + "Shopee sẽ tự huỷ sau 13 phút nữa" 12px red
Actions: [Xác nhận ngay!] accent filled orange | [Chi tiết ›]

Card 3 (border orange): TTK-000891 | TikTok | 45 phút chờ | "Quần jean slim 28" | Lê Hoàng C
Card 4–7: Similar pattern with varying urgency levels, orange borders

STYLE: High urgency design. Red/orange dominant for urgent states. Countdown timers prominent. Each card self-contained with full context. Be Vietnam Pro.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a 'Compact view' toggle button (top-right, next to existing buttons) — show as already active, collapsing cards to single-line rows: order ID | countdown | platform badge | [Xác nhận] button"
"Add a floating action button fixed at bottom-right: indigo circle 56px, checkmark icon, label 'Xác nhận tất cả' on hover tooltip"
"Change countdown timer in Card 1 from static text to a digital clock style: monospace red, bordered box '18:00' format"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 03-B — All Resolved Empty State:*
```
SAME SHELL as Screen 03. SAME PAGE HEADER (title + buttons). SAME URGENCY SUMMARY BAR but all 3 pills show "0 đơn" green.
Main content: large center-aligned empty state replacing order cards:
- Large green checkmark circle icon 64px
- "🎉 Tất cả đơn đã được xử lý!" 20px semibold #16A34A
- "Không còn đơn nào cần xử lý. Tuyệt vời!" 14px gray
- [Xem danh sách đơn hàng] outline indigo button
```

---

## 04 — Đơn hàng — Hoàn / Huỷ

**Role:** Admin, Nhân viên CSKH | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Đơn hàng | TOPBAR: "Hoàn / Huỷ Đơn hàng" / "Tháng 3/2026: 28 hoàn · 14 huỷ"

"Hoàn / Huỷ Đơn hàng" 22px bold. Subtitle "Tháng 3/2026: 28 đơn hoàn · 14 đơn huỷ".
Right: Date range picker "01/03 – 20/03/2026 ▾" | "Xuất báo cáo" outline button.

SUMMARY CARDS ROW (3 cards, gap-4, mb-6):
Card "Tổng hoàn hàng": value "28" 32px bold #1E293B, trend "↑ +4 vs tháng trước" red (increase = bad), sub "Tỷ lệ: 2.1% tổng đơn" gray.
Card "Tổng đơn huỷ": value "14" 32px bold, trend "↓ -2 vs tháng trước" green (decrease = good), sub "Tỷ lệ: 1.1% tổng đơn" gray.
Card "Doanh thu bị ảnh hưởng": value "18.450.000 ₫" 24px bold red monospace, sub "Cần hoàn tiền khách hàng".

REASON BREAKDOWN (white card, mb-4):
Title "Phân tích nguyên nhân hoàn/huỷ" 15px semibold. Subtitle "AI phân loại tự động từ ghi chú đơn hàng — ✨ AI".
Horizontal bar chart (5 rows):
- "Kích thước không đúng mô tả" 35% red bar | 10 đơn
- "Chất lượng sản phẩm kém" 21% red bar | 6 đơn
- "Giao hàng quá chậm" 18% orange bar | 5 đơn
- "Khách đổi ý" 14% gray bar | 4 đơn
- "Lỗi vận chuyển" 11% orange bar | 3 đơn
Footer: "💡 AI gợi ý: Xem xét cập nhật bảng size cho sản phẩm Áo thun" 13px indigo bg light.

RETURNS TABLE (white card):
Tabs: [Tất cả (42)] [Đang xử lý (12)] [Chờ nhận hàng (8)] [Đã hoàn tiền (22)]
Columns: MÃ ĐƠN | LOẠI | SẢN PHẨM | KHÁCH HÀNG | GIÁ TRỊ | NGUYÊN NHÂN | TRẠNG THÁI | NGÀY TẠO | HÀNH ĐỘNG
Show 6 rows: mix of returns (badge "Hoàn hàng" amber) and cancellations (badge "Đã huỷ" gray) with Vietnamese data.
Action buttons per row: [Xử lý] or [Hoàn tiền] or [Chi tiết].

STYLE: Data-focused. AI reason analysis highlighted with indigo accent. Red/amber for loss indicators. Tables dense but readable.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add ✨ AI icon prefix to the NGUYÊN NHÂN column values in all rows — indicating AI-detected classification"
"Add a 'Tạo yêu cầu hoàn tiền hàng loạt' button to the tab bar row, right-aligned, for the 'Chờ nhận hàng' tab context"
"Change the reason breakdown chart from horizontal bars to a vertical grouped bar chart comparing this month vs last month side by side"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 04-B — Timeline View State:*
```
SAME SHELL + PAGE HEADER + SUMMARY CARDS as Screen 04. DIFFERENT main content:
Replace REASON BREAKDOWN + TABLE with a vertical timeline view grouped by date:
Each date group header: "20/03/2026" bold gray, divider line.
Under each date: list of return/cancellation events as timeline items — left dot (red=hoàn, gray=huỷ) + order ID + product + customer + value + status badge + [Chi tiết] link.
Show 3 date groups with 2-3 items each.
Toggle button top-right of content area: [≡ Bảng] [📅 Timeline] with Timeline active (indigo).
```

---

## 05 — Kho hàng — Tồn kho SKU

**Role:** Admin, Nhân viên kho | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Kho hàng | TOPBAR: "Quản lý Tồn kho" / "847 SKU · Cập nhật 14:35"

PAGE TITLE BAR (white card below topbar): "Quản lý Tồn kho" 22px bold. Right: "Nhập kho" indigo | "Xuất kho" outline | "Điều chỉnh" ghost.

ALERT BANNER: bg #FEF3C7 full-width. "⚠ 23 SKU tồn kho thấp" + "[Lọc xem ngay →]" indigo + X close.

FILTER: search input | "Tất cả danh mục ▾" | Platform [Tất cả][Shopee][TikTok] | Status [Tất cả][Bình thường][Thấp][Hết hàng][Ngừng bán].

TABLE (white card dense): columns ☐ | SKU | TÊN SẢN PHẨM | PHÂN LOẠI | SHOPEE | TIKTOK | TỒN THỰC TẾ | ĐÃ ĐẶT | KHẢ DỤNG | TRẠNG THÁI | HÀNH ĐỘNG. 10 rows:
R1 normal: AT-WHT-L | Áo thun basic trắng L | Áo | 45|23|68|12|56 | "Bình thường" green badge | [Sửa][⋮]
R2 low-stock (amber tint row): AT-WHT-XL | Áo thun basic trắng XL | 8|4|12|6|6 | "Thấp ⚠" amber | [Nhập ngay]
R3 out-of-stock (red tint): VS-HOA-M | Váy hoa nhí M | 0|0|0|3|-3 | "Hết hàng" red | [Nhập kho]
R4: QJ-SLM-28 | Quần jean slim 28 | 34|18|52|8|44 | "Bình thường" green
R5-R10: mix of statuses (2 thấp, 1 hết, 3 bình thường).
TỒN THỰC TẾ colors: green ≥20, amber 5-19, red <5. KHẢ DỤNG negative = red parentheses.
Pagination: "Hiển thị 10 trong 847 SKU".
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a mini stock level progress bar inside the TỒN THỰC TẾ cell for each row — thin 4px bar below the number, green/amber/red based on percentage of capacity"
"Add a 'Dự báo AI' column after TRẠNG THÁI showing days-until-stockout: green '>14 ngày', amber '7-14 ngày', red '<7 ngày'"
"Add a 32×32px product photo thumbnail before the SKU column in each row"
"Add a view toggle [≡ Bảng] [⊞ Lưới] at the top-right of the table card header"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 05-B — Grid View State:*
```
SAME SHELL + PAGE HEADER + ALERT BANNER + FILTER BAR as Screen 05. DIFFERENT main content:
Replace table with a 4-column product card grid:
Each card (white, 12px radius, shadow-sm, 200px wide): 
- Product image placeholder 160×100 top
- SKU gray mono 11px | Product name 13px semibold (2 lines max)
- Stock row: "Tồn: 68 units" color-coded | Status badge
- Platform stock: "Shopee: 45 · TikTok: 23" 12px gray
- [Nhập kho] or [Sửa] button full width outline
View toggle top-right shows [≡ Bảng] [⊞ Lưới] with Lưới active.
```

*Screen 05-C — All Out of Stock Filter State:*
```
SAME LAYOUT as Screen 05. ONE DIFFERENCE ONLY:
Status filter has "Hết hàng" tab active (indigo). Table shows only 3 rows, all with red danger styling and "Hết hàng" badge. Alert banner text updates to "3 SKU hết hàng — cần nhập kho ngay".
```

---

## 06 — Kho hàng — Nhập / Xuất kho

**Role:** Admin, Nhân viên kho | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Kho hàng | TOPBAR: "Nhập / Xuất Kho" / "Lịch sử giao dịch tồn kho"

"Nhập / Xuất Kho" 22px bold. Subtitle "Lịch sử giao dịch tồn kho".
Right: "Tạo phiếu nhập kho" button indigo filled + icon Plus | "Tạo phiếu xuất kho" outline.

QUICK STATS (3 inline stat boxes, border-bottom, px-6 py-4):
"Nhập kho tháng này: +2.450 units" green arrow up | "Xuất kho tháng này: -1.890 units" red arrow down | "Chênh lệch: +560 units" blue.

TABS: [Tất cả giao dịch] [Phiếu nhập kho (34)] [Phiếu xuất kho (28)] [Điều chỉnh (6)]

TRANSACTION TABLE (white card):
Headers: PHIẾU # | LOẠI | NGÀY TẠO | SẢN PHẨM (số SKU) | SỐ LƯỢNG | NHÂN VIÊN | GHI CHÚ | TRẠNG THÁI | HÀNH ĐỘNG

Show 8 transactions:
Row 1: PN-2024-0034 | Badge "Nhập kho" green | 20/03 14:00 | 15 SKU | "+450 units" green bold mono | Trần Kho A | "Nhập hàng nhà cung cấp ABC" | Badge "Hoàn thành" green | [Xem] [In]
Row 2: PX-2024-0028 | Badge "Xuất kho" red | 20/03 10:30 | 8 SKU | "-120 units" red bold mono | Trần Kho A | "Giao hàng đơn SPE batch" | Badge "Hoàn thành" green | [Xem]
Row 3: DC-2024-0006 | Badge "Điều chỉnh" blue | 19/03 16:00 | 3 SKU | "±0" gray | Admin | "Kiểm kê định kỳ — chênh lệch" | Badge "Hoàn thành" green | [Xem]
(5 more rows)

CREATE STOCK-IN FORM PANEL (right sidebar slide-in preview, 400px):
Title "Tạo Phiếu Nhập Kho" 16px semibold. Fields: Nhà cung cấp (dropdown), Ngày nhập (date), Ghi chú. SKU list table (add rows): SKU selector + Số lượng + Giá nhập. Total calculated. [Lưu nháp] [Xác nhận nhập kho] buttons.

STYLE: Clean transaction log. Color-coded amounts (green for in, red for out). Monospace for quantities. Clear action buttons.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a barcode scanner input field at the top of the Create Stock-In form panel: full-width input 'Quét mã vạch hoặc nhập SKU' with barcode icon left, bg #F8FAFC"
"Add a mini stock movement chart in the QUICK STATS row: small bar chart (last 30 days, nhập green bars + xuất red bars, 120px wide) as a 4th stat"
"Add hover tooltip on 'Điều chỉnh' row badge: show 'Trước: X units → Sau: Y units | Lý do: ...' on hover"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 06-B — Create Form Open State:*
```
SAME LAYOUT as Screen 06 but Create Stock-In form panel is fully open and prominent (not preview):
Main content shifts left (calc 100% - 400px). Right panel 400px fixed: white bg, shadow-xl left, full height.
Form fully interactive state: supplier field filled "Nhà cung cấp ABC", date "20/03/2026", 3 SKU rows already added in the table with quantities. Running total "Tổng: 4.500.000 ₫" visible at bottom. Both action buttons fully visible.
```

---

## 07 — Kho hàng — Dự báo AI

**Role:** Admin, Nhân viên kho | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Kho hàng | TOPBAR: "Dự báo Tồn kho AI" / "LSTM v2.1 · Độ chính xác 89.3%"

"✨ Dự báo Tồn kho AI" 22px bold indigo. Subtitle "Model: LSTM v2.1 · Cập nhật: 14:20 · Độ chính xác 30 ngày qua: 89.3%".
Right: "Chạy lại dự báo" outline button with refresh icon + "Xuất báo cáo" ghost.

AI MODEL STATUS BAR (white card, compact, mb-4):
Left: green dot + "Model đang hoạt động bình thường" 13px. Center: "Dữ liệu đầu vào: 847 SKU · 90 ngày lịch sử" gray. Right: "Lần chạy cuối: 20/03/2026 14:20" gray. All in one row.

CRITICAL ALERTS SECTION (title "⚠ Cần nhập hàng gấp" red, mb-4):
3 alert cards horizontal (gap-3):
Each card (white, red left border 4px, 12px radius):
  - Product "Áo thun basic trắng XL" semibold | SKU AT-WHT-XL gray mono
  - "Tồn kho: 6 units" red bold | progress bar 12% filled red
  - "Dự báo hết hàng: 3 ngày nữa (23/03)" red 13px | clock icon
  - "Gợi ý nhập: 150 units" | confidence "85% ✓" green badge
  - [Tạo đơn nhập kho] button indigo full width

WARNING SECTION (title "⏳ Sắp cần nhập — 7-14 ngày"):
Similar cards but orange left border, amber confidence ranges 70-84%.

FORECAST TABLE (white card, full width):
Title "Tất cả dự báo" 15px semibold. Filter: [Tất cả] [Cần nhập gấp] [Sắp cần] [Đủ hàng].
Columns: SKU | TÊN SP | TỒN HIỆN TẠI | BÁN TB/NGÀY | DỰ BÁO HẾT | NHẬP ĐỀ XUẤT | ĐỘ TIN CẬY | HÀNH ĐỘNG
Show 8 rows, colored "DỰ BÁO HẾT" column: red (<7d), amber (7-14d), green (>14d).
"ĐỘ TIN CẬY" shows percent with colored badge.

AI EXPLAINABILITY NOTE (indigo light card, bottom):
"💡 Mô hình LSTM phân tích dựa trên: Lịch sử bán 90 ngày · Xu hướng theo mùa · Ngày lễ Việt Nam · Tốc độ bán theo sàn. Kết quả chỉ mang tính tham khảo — hãy kết hợp với kiến thức kinh doanh thực tế."

STYLE: AI-themed with indigo accents. Confidence scores prominent. Risk levels color-coded. Model metadata always visible for transparency.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Change critical alert cards layout from 3-column horizontal to vertical list — each card full width, more detail visible per card"
"Add a 'Lý do dự báo' expandable row below each critical alert card (shown expanded for Card 1): top 3 contributing factors as bullet list — '↑ Bán nhanh hơn 40% so với tuần trước', '📅 Lễ Giỗ Tổ sắp tới', '📦 Tồn kho đối thủ thấp'"
"Add an accuracy history mini-chart to the AI MODEL STATUS BAR: small 6-column bar chart showing MAPE last 6 months, green bars"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 07-B — SKU Forecast Detail State:*
```
SAME SHELL + PAGE HEADER as Screen 07. DIFFERENT main content:
A selected SKU detail panel replaces the critical alerts section. Panel has breadcrumb "← Quay lại tất cả dự báo".
SKU detail: "AT-WHT-XL — Áo thun basic trắng XL" 18px semibold. Stats row: current stock | avg daily sales | forecast end date | suggested reorder.
FORECAST CHART (white card, full width): mixed chart — solid black line (90 days actual history) + dashed indigo line (30 days forecast) + shaded indigo-50 confidence band. X-axis dates. Y-axis units. Today marked with dashed gray vertical line.
CONTRIBUTING FACTORS (white card): top 3 factors as progress bars with labels and impact %.
```

*Screen 07-C — Model Retraining State:*
```
SAME LAYOUT as Screen 07. ONE DIFFERENCE ONLY:
AI MODEL STATUS BAR changes to: orange dot (instead of green) + "Model đang được cập nhật — 67% hoàn thành" + animated indigo progress bar full width below the status bar. Right: "Hoàn thành trong ~4 phút" gray.
All forecast data shows with a subtle gray overlay and "Đang cập nhật..." watermark badge.
```

---

## 08 — Doanh thu — Báo cáo tổng hợp

**Role:** Admin, Nhân viên kinh doanh | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Doanh thu | TOPBAR: "Báo cáo Doanh thu" / "Tháng 3/2026"

"Báo cáo Doanh thu" 22px bold. Right: Date range picker "Tháng 3/2026 ▾" (month picker) | [Tuần] [Tháng] [Quý] [Năm] tab toggle | "Xuất PDF" button.

KPI ROW (5 cards — wider layout):
Card 1 "DOANH THU THUẦN": "48.750.000 ₫" 28px bold mono | "↑ +18.4% vs T2" green | "Sau khi trừ hoàn/huỷ"
Card 2 "LỢI NHUẬN GỘP": "14.625.000 ₫" 28px bold mono | "↑ +12.1%" green | "Biên lợi nhuận: 30.0%"
Card 3 "TỔNG ĐƠN THÀNH CÔNG": "1,247" 28px bold mono | "↑ +8.2%" green | "Shopee: 823 · TikTok: 424"
Card 4 "GIÁ TRỊ ĐƠN TB": "39.095 ₫" 28px bold mono | "↑ +9.4%" green | "Avg order value"
Card 5 "CHI PHÍ VẬN HÀNH": "8.120.000 ₫" 28px bold mono | "↑ +3.2%" red (cost increase = negative) | "Phí sàn + vận chuyển"

REVENUE TREND CHART (white card, full width, mb-4):
Title "Doanh thu theo ngày — Tháng 3/2026". Area chart (filled under line, 20% opacity fill). Shopee line orange-red, TikTok line black. Hover tooltip shows daily breakdown. X-axis all days 1-20 with today marked. Legend top-right.

BOTTOM ROW (2/3 + 1/3):
Left (2/3): White card "Doanh thu theo sản phẩm — Top 15". Bar chart horizontal, bars indigo, sorted by revenue descending. Product names left-aligned, values right. "Xem tất cả sản phẩm ›" link bottom.
Right (1/3): White card "Phân tích chi phí". Stacked donut chart: Phí sàn Shopee 18%, Phí sàn TikTok 9%, Vận chuyển 12%, Nhân sự 8%, Khác 3%. Center: "Chi phí: 47.0%" label. Legend below with amounts.

PROFIT BREAKDOWN TABLE (white card, full width):
Title "Lợi nhuận theo sản phẩm" with AI tag "✨ AI phân tích biên lợi nhuận".
Columns: SẢN PHẨM | DOANH THU | GIÁ VỐN | LỢI NHUẬN | BIÊN (%) | XU HƯỚNG | ĐỀ XUẤT AI
"BIÊN (%)" column color coded: green >30%, amber 15-30%, red <15%.
"ĐỀ XUẤT AI" column shows short 1-line tip or empty.

STYLE: Business intelligence focus. Data-rich but scannable. Monospace for all currency. Profit margins color-coded.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a 'Mục tiêu tháng' progress bar below the KPI row: full width, label 'Mục tiêu: 60.000.000 ₫', filled 81% green, current value '48.750.000 ₫ / 60.000.000 ₫' right-aligned"
"Change the cost donut chart to a waterfall chart: bars showing Revenue → Gross Margin → Net Margin with positive indigo and negative red segments"
"Add period comparison labels to the trend chart: ghost line (previous month, gray dashed) overlaid on the current month lines, with legend updated"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 08-B — PDF Export Preview State:*
```
SAME SHELL as Screen 08. Main content shows export preview modal (centered overlay):
Modal (white, 24px radius, shadow-xl, 600px wide): 
Title "Xuất Báo cáo PDF" 18px semibold. Preview thumbnail of report (gray placeholder 400×280). 
Options: checkboxes for sections to include (KPI, Biểu đồ doanh thu, Bảng lợi nhuận, AI Insights).
Date range confirmed: "Tháng 3/2026". 
Footer: [Huỷ] ghost | [Tải xuống PDF] indigo filled.
Background overlay: #0F172A 40% opacity.
```

---

## 09 — Doanh thu — So sánh sàn

**Role:** Admin, Nhân viên kinh doanh | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Doanh thu | TOPBAR: "So sánh Hiệu suất theo Sàn" / "Shopee vs TikTok Shop"

"So sánh Hiệu suất theo Sàn" 22px bold. Subtitle "Shopee vs TikTok Shop — Tháng 3/2026".
Right: Period picker "T3/2026 ▾" | "Xuất báo cáo" outline.

HEAD-TO-HEAD COMPARISON (2 columns side-by-side, white cards, gap-4, mb-6):
Left column (Shopee — orange-red theme):
  Header: Shopee logo badge + "Shopee" 18px bold + "#EE4D2D" accent left border 4px.
  Metrics: Doanh thu "32.500.000 ₫" | Đơn hàng "823" | Tỷ lệ hoàn "2.8%" | AOV "39.490 ₫" | Phí sàn "18%" | Rating TB "4.7 ★"
  Each metric: label gray 11px uppercase + value 20px bold monospace + trend arrow.

Right column (TikTok Shop — black theme):
  Header: TikTok logo badge + "TikTok Shop" 18px bold + "#010101" accent left border 4px.
  Metrics: Doanh thu "16.250.000 ₫" | Đơn hàng "424" | Tỷ lệ hoàn "1.2%" | AOV "38.325 ₫" | Phí sàn "9%" | Rating TB "4.9 ★"

RADAR/COMPARISON CHART (white card, full width, mb-4):
Side-by-side grouped bar chart "So sánh KPI theo sàn". Bars: Shopee orange, TikTok dark. Metrics on X-axis: Doanh thu, Số đơn, Tỷ lệ chuyển đổi, AOV, Rating. Values normalized to % of best performer.

TREND COMPARISON CHART (white card, full width, mb-4):
Title "Tăng trưởng doanh thu — 6 tháng gần nhất". Two lines: Shopee orange-red, TikTok black. Month labels. Legend. Each point clickable for monthly detail.

AI INSIGHTS PANEL (indigo light card, full width):
"✨ AI Phân tích So sánh Sàn"
3 insight rows with icons:
  📈 "TikTok Shop có tỷ lệ hoàn thấp hơn 57% so với Shopee — có thể do mô tả sản phẩm chính xác hơn qua video"
  💰 "Phí sàn TikTok (9%) thấp hơn Shopee (18%) → lợi nhuận gộp trên TikTok cao hơn 8-12%"
  🎯 "Gợi ý: Tăng ngân sách quảng cáo TikTok 20% để tận dụng phí thấp hơn"
Each insight has confidence badge.

STYLE: Platform identity colors consistent throughout (Shopee orange-red, TikTok black). Comparison-focused layout. AI insights actionable.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a 'Hiệu quả quảng cáo' section between the trend chart and AI insights: 2-column side by side card showing ROAS for Shopee (3.2×) vs TikTok (4.1×) with arrow indicators"
"Add a TikTok growth highlight banner below the page header: if TikTok revenue grew >20% vs last month, show a green banner '🚀 TikTok Shop tăng trưởng 34% tháng này — vượt mục tiêu'"
"Add product-level breakdown table below AI insights: 'Top 5 sản phẩm bán tốt hơn trên Shopee' and 'Top 5 trên TikTok' in 2 side-by-side mini tables"
```

---

## 10 — Doanh thu — Dự báo ML

**Role:** Admin, Nhân viên kinh doanh | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Doanh thu | TOPBAR: "Dự báo Doanh thu ML" / "Prophet + XGBoost · 91.2%"

"✨ Dự báo Doanh thu ML" 22px bold indigo. Subtitle "Model: Prophet + XGBoost Ensemble · Độ chính xác 30 ngày: 91.2% · Cập nhật hàng ngày lúc 06:00".
Right: [7 ngày] [30 ngày] [90 ngày] tab toggle | "Xem báo cáo đầy đủ" ghost.

FORECAST HEADLINE CARDS (3 cards):
Card "DỰ BÁO THÁNG TỚI": "58.200.000 ₫" 32px bold indigo mono | range "54M – 62M ₫" gray 13px | "↑ +19.5% vs T3" green | confidence "87% ✓" green badge.
Card "ĐỈNH ĐIỂM DỰ KIẾN": "21-25/04/2026" 20px bold | "Sau kỳ lương + cuối tháng" 13px gray | indigo icon Calendar.
Card "RỦI RO NHẬN BIẾT": "2 yếu tố rủi ro" 20px bold amber | "Lễ Giỗ Tổ 18/04 · Đối thủ sale" 13px | "Xem chi tiết →" link.

FORECAST CHART (white card, full width, mb-4):
Title "Dự báo doanh thu 30 ngày tới". Mixed chart:
  Left portion (actual): solid line black, labeled "Thực tế"
  Right portion (forecast): dashed line indigo, labeled "Dự báo"
  Confidence band: shaded indigo-50 area around forecast line (±1σ)
  Vertical divider "Hôm nay" dashed gray line
  Notable events as vertical annotations: "Giỗ Tổ Hùng Vương" amber dot, "Cuối tháng lương" green dot
  X-axis: dates. Y-axis: ₫ formatted. Hover tooltip.

SCENARIO ANALYSIS (white card, mb-4):
Title "Phân tích kịch bản". 3 scenario cards side by side:
  "Kịch bản xấu": "48.500.000 ₫" red | conditions "Đối thủ flash sale + nhu cầu thấp"
  "Kịch bản cơ sở ★": "58.200.000 ₫" indigo bold | "Điều kiện thị trường bình thường" | "Được khuyến nghị"
  "Kịch bản tốt": "67.800.000 ₫" green | "Chiến dịch thành công + nhu cầu cao"

AI RECOMMENDATIONS (indigo-light card):
"💡 Hành động gợi ý để đạt kịch bản tốt":
  1. "Tăng giá quảng cáo 15% trong tuần cuối tháng (20-30/04)"
  2. "Chuẩn bị tồn kho thêm 200 units Top-5 sản phẩm bán chạy"
  3. "Lên chiến dịch flash sale ngày 26/04 (cuối tháng + ngày lương)"

STYLE: Forecast-focused, confidence intervals visible. Scenario planning prominent. AI recommendations actionable with numbered steps.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add an 'Explain this forecast' expandable section between the forecast chart and scenario analysis: when expanded shows top 5 contributing features as horizontal bars — 'Lịch sử bán T3 (năm ngoái)', 'Tốc độ bán tuần 2 T3', 'Ngày lễ tháng 4', 'Tăng trưởng TikTok', 'Tồn kho hiện tại'"
"Add an accuracy history chart below AI RECOMMENDATIONS: 6 bars (T10-T3), each bar shows MAPE%, green if <10%, amber if 10-15%"
"Add an interactive slider to 'Kịch bản cơ sở' card: 'Điều chỉnh ngân sách QC' 0–200%, with projected revenue updating as a number below the slider"
```

---

## 11 — Sản phẩm — Danh sách sản phẩm

**Role:** Admin, Nhân viên kinh doanh | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Sản phẩm | TOPBAR: "Quản lý Sản phẩm" / "1.247 sản phẩm"

"Quản lý Sản phẩm" 22px bold. Subtitle "1.247 sản phẩm · Shopee: 1,108 · TikTok: 892 · (đồng bộ 2 phút trước 🟢)".
Right: "Thêm sản phẩm" indigo filled + "Đồng bộ từ sàn" outline + "Nhập Excel" ghost.

FILTER BAR:
Search "🔍 Tìm tên, SKU, mã sản phẩm..." | Category "Tất cả ▾" | Platform [Shopee][TikTok][Cả hai] | Status [Đang bán][Tạm dừng][Hết hàng] | Sort "Bán chạy nhất ▾".

VIEW TOGGLE: [≡ Bảng] [⊞ Lưới] — default Bảng.

PRODUCT TABLE (white card):
Headers: ☐ | ẢNH | TÊN SẢN PHẨM & SKU | DANH MỤC | GIÁ BÁN | TỒN KHO | ĐÃ BÁN (30N) | DOANH THU (30N) | TRẠNG THÁI | HÀNH ĐỘNG

Show 8 rows:
Row 1: [✓] | 40×40 img placeholder | "Áo thun basic trắng\nAT-WHT" 14px bold + gray mono | Áo | "189.000 ₫" mono | 68 units green | 234 | 44.226.000 ₫ | Badge "Đang bán" green | [Sửa] [Xem trên sàn ↗] [...]
Row 2: | | "Váy hoa nhí\nVS-HOA" | Váy | "459.000 ₫" | 12 units amber | 89 | 40.851.000 ₫ | Badge "Đang bán" | [Sửa][...]
Row 3 (out of stock): | | "Giày sneaker trắng\nGS-SNK" | Giày | "1.250.000 ₫" | 0 units red | 45 | 56.250.000 ₫ | Badge "Hết hàng" red | [Nhập kho ngay] [Sửa]
(5 more rows)

PRODUCT CARD GRID VIEW (shown when grid toggle active, 4 columns):
Each card (white, 12px radius, shadow-sm): Product image 160×120 top. Badges: platform, status. Name 14px semibold. Price 16px bold mono. "Tồn: X units" + "Đã bán: Y" 12px gray. [Sửa] [Xem] buttons.

BULK ACTIONS: "Cập nhật giá hàng loạt" | "Đồng bộ lên sàn" | "Tạm dừng" | "Xoá".

STYLE: Product-focused with image thumbnails. Status clearly visible. Grid and table views both clean. Dense data but scannable.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a 7-day sales sparkline (tiny line chart, 60px wide) inside each row in a new column 'XU HƯỚNG' after DOANH THU"
"Add sync status indicator per row after TRẠNG THÁI: green dot = synced, orange dot = pending sync, red dot = sync error + [Thử lại] link"
"Add variant collapse indicator for rows with variants: show '▶ 4 phân loại' text link, clicking expands sub-rows showing each size/color variant below the parent row"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 11-B — Grid View State:*
```
SAME SHELL + PAGE HEADER + FILTER BAR as Screen 11. View toggle shows [≡ Bảng] [⊞ Lưới] with Lưới active.
Main content: 4-column card grid replacing the table. Each card as described in PRODUCT CARD GRID VIEW spec above. Show 8 cards total.
```

*Screen 11-C — Syncing State:*
```
SAME LAYOUT as Screen 11. ONE DIFFERENCE ONLY:
Page header subtitle changes to: "1.247 sản phẩm · 🔄 Đang đồng bộ từ Shopee... 67%"
"Đồng bộ từ sàn" button changes to disabled state: spinner icon + "Đang đồng bộ..." gray text, 60% opacity.
Top of page header (full width below the header card): thin indigo animated progress bar 3px.
```

---

## 12 — Sản phẩm — Định giá động

**Role:** Admin, Nhân viên kinh doanh | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Sản phẩm | TOPBAR: "Định giá Động" / "AI gợi ý giá tối ưu"

"Định giá Động" 22px bold. Subtitle "✨ AI gợi ý giá tối ưu dựa trên đối thủ + nhu cầu thị trường".
Right: "Áp dụng giá AI hàng loạt" accent orange button | "Lịch sử thay đổi giá" ghost.

PRICING RULES PANEL (white card, mb-4):
Title "Quy tắc định giá đang áp dụng" 15px semibold.
3 rule cards (inline, gap-3):
  Rule 1 "Thấp hơn đối thủ 5%": toggle ON green | "Áp dụng: 234 sản phẩm" | scope "Shopee + TikTok"
  Rule 2 "Tối thiểu lợi nhuận 20%": toggle ON | "234 SP" | "Bảo vệ biên lợi nhuận"
  Rule 3 "Khuyến mãi cuối tuần -10%": toggle OFF gray | "T7, CN" | inactive
"+ Thêm quy tắc mới" text link indigo.

AI PRICE RECOMMENDATIONS TABLE (white card):
Title "Gợi ý giá AI — Chờ xác nhận" badge "47 gợi ý" indigo.
Columns: SẢN PHẨM | SÀN | GIÁ HIỆN TẠI | GIÁ AI GỢI Ý | CHÊNH LỆCH | LÝ DO | ĐỘ TIN CẬY | HÀNH ĐỘNG

Show 6 rows:
Row 1: "Áo thun basic L" | Shopee | 189.000 ₫ | 175.000 ₫ | "-7.4% ↓" red | "3 đối thủ bán 165-172k" | 82% green | [Áp dụng] [Bỏ qua]
Row 2: "Váy hoa nhí M" | TikTok | 459.000 ₫ | 489.000 ₫ | "+6.5% ↑" green | "Nhu cầu cao, đối thủ bán 499k" | 76% amber | [Áp dụng] [Bỏ qua]
Row 3: "Giày sneaker 39" | Shopee | 1.250.000 ₫ | 1.199.000 ₫ | "-4.1% ↓" red | "Tồn kho cao, cần kích cầu" | 79% green | [Áp dụng] [Bỏ qua]
(3 more rows)
Footer: "Áp dụng tất cả 47 gợi ý" indigo button | "Xem lại từng gợi ý" ghost.

PRICE HISTORY CHART (white card):
Title "Lịch sử giá — Áo thun basic trắng L" (selector dropdown for product).
Line chart showing price changes over last 30 days for Shopee (orange) and TikTok (black). Event markers on price change dates. Competitor avg price as dashed gray line.

STYLE: Action-oriented. AI recommendations must-confirm before applying. Price changes clearly directional (red/green arrows).
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a 'TÁC ĐỘNG DỰ KIẾN' column in the recommendations table between ĐỘ TIN CẬY and HÀNH ĐỘNG: show projected revenue change if price applied, e.g. '+450.000 ₫/tuần' green or '-120.000 ₫' red"
"Add a profit margin calculator panel at the bottom of the page: two inputs (Giá bán, Giá vốn) with instant output showing Lợi nhuận ₫ and Biên % as large numbers"
"Add a competitor live feed sidebar (right 280px, white card): 'Đối thủ vừa thay đổi giá' — 3 recent alerts with product + competitor name + old→new price + time"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 12-B — Bulk Apply Confirmation State:*
```
SAME SHELL + main content as Screen 12. ONE DIFFERENCE ONLY:
A confirmation modal overlay (centered, white, 24px radius, shadow-xl, 480px wide):
Title "Áp dụng 47 gợi ý giá?" 18px semibold.
Summary: "47 sản phẩm sẽ được cập nhật giá | Tăng trung bình: +3.2% | Doanh thu dự kiến: +4.200.000 ₫/tháng"
Warning text gray: "Giá sẽ được cập nhật trên Shopee và TikTok Shop trong vòng 5 phút."
Footer: [Huỷ] ghost | [Xác nhận áp dụng] orange filled.
Overlay: #0F172A 40%.
```

---

## 13 — Sản phẩm — Theo dõi đối thủ

**Role:** Admin, Nhân viên kinh doanh | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Sản phẩm | TOPBAR: "Theo dõi Đối thủ" / "47 đối thủ · Cập nhật mỗi 2 giờ"

"Theo dõi Đối thủ" 22px bold. Subtitle "Giám sát giá 47 đối thủ · Cập nhật mỗi 2 giờ · Lần cuối: 13:00".
Right: "Thêm đối thủ theo dõi" indigo | "Cài đặt cảnh báo" ghost.

ALERTS BANNER (always visible — showing current alert):
"⚠ 3 đối thủ vừa giảm giá dưới mức của bạn — Xem và điều chỉnh ngay" | warning bg #FEF3C7 | [Xem ngay] indigo button right | X close.

MY PRODUCTS VS COMPETITORS TABLE (white card):
Title "So sánh giá hiện tại". Filter: product search + category + platform.
Columns: SẢN PHẨM | GIÁ CỦA BẠN | GIÁ TB ĐỐI THỦ | THẤP NHẤT TT | CAO NHẤT TT | VỊ TRÍ | THAY ĐỔI 24H | HÀNH ĐỘNG

Show 6 rows with position indicators:
Row 1: "Áo thun basic L" | 189.000 ₫ | 177.000 ₫ | 155.000 ₫ | 209.000 ₫ | "Vị trí #4/12" amber (mid-range) | "↓ -5k" red | [Điều chỉnh giá]
Row 2: "Váy hoa nhí M" | 459.000 ₫ | 481.000 ₫ | 420.000 ₫ | 520.000 ₫ | "Vị trí #2/8 ✓" green (competitive) | "— Không đổi" | [Giữ nguyên]
Row 3: "Giày sneaker 39" | 1.250.000 ₫ | 1.198.000 ₫ | 1.090.000 ₫ | 1.399.000 ₫ | "Vị trí #6/9" red (expensive) | "↑ +30k" green | [Điều chỉnh giá]

COMPETITOR DETAIL PANEL (right 1/3):
Title "Top đối thủ đang theo dõi". 5 competitor cards:
Each: store name + platform badge + rating + "X sản phẩm theo dõi" + last price change timestamp.
[Xem sản phẩm] link.

PRICE POSITION CHART (white card, 2/3 width):
Scatter plot showing ShopHub products (indigo dots) vs competitors (gray dots) on Price vs Sales Volume axes. Highlight ShopHub's position. Quadrant labels: "Giá cao-Bán tốt", "Giá tốt-Bán tốt", etc.

STYLE: Competitive intelligence focus. Position rankings prominent. Price deltas directional colored.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add price alert threshold UI below the competitor detail panel: inputs 'Cảnh báo khi đối thủ thấp hơn tôi [__]%' with [Lưu cài đặt] indigo button"
"Change the scatter plot to a heat map: X-axis = price buckets, Y-axis = products, color intensity = number of competitors at that price point"
"Add a 'THAY ĐỔI 24H' sparkline column: tiny up/down area chart (40px wide) showing price movement per product over last 24h"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 13-B — Competitor Profile Modal State:*
```
SAME SHELL + main content as Screen 13. ONE DIFFERENCE ONLY:
A competitor profile modal overlay (right-aligned slide-over, 520px wide, full height, white, shadow-xl left):
Header: "Shop XYZ Fashion" 18px bold | Shopee badge | [× Đóng] top-right.
Stats row: Rating 4.6★ | 156 sản phẩm | Theo dõi từ: 01/02/2026.
Product comparison table: their top 10 products vs ShopHub equivalent — name | their price | my price | difference | trend.
Price history chart: last 30 days price changes for this competitor (line chart).
[Nhập giá tất cả vào theo dõi] indigo button bottom.
Background overlay: none (slide-over pattern).
```

---

## 14 — CRM — Phân tích Sentiment

**Role:** Admin, Nhân viên CSKH | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: CRM & Review | TOPBAR: "Phân tích Cảm xúc Review" / "PhoBERT v2 · 1.247 đánh giá"

"✨ Phân tích Cảm xúc Review" 22px bold indigo. Subtitle "Model: PhoBERT v2 · 1.247 đánh giá trong 30 ngày · Độ chính xác 88.4%".
Right: Period "Tháng 3/2026 ▾" | Platform [Tất cả][Shopee][TikTok] | "Xuất báo cáo" ghost.

SENTIMENT OVERVIEW (3 stat cards):
Card "TÍCH CỰC 😊": "847" 32px bold green mono | "68.0%" big green | trend "↑ +4% vs T2"
Card "TRUNG LẬP 😐": "274" 32px bold gray mono | "22.0%" gray | trend "↓ -1%"  
Card "TIÊU CỰC 😞": "126" 32px bold red mono | "10.0%" red | trend "↓ -3% ✓" green (decrease = good)

SENTIMENT TREND CHART (white card, 3/5 width, inline with topic chart):
Title "Xu hướng Sentiment — 4 tuần gần nhất". Stacked bar chart 4 bars (W1-W4). Each bar: green (positive) + gray (neutral) + red (negative) stacked. Y-axis: review count. Legend.

TOP TOPICS CHART (white card, 2/5 width, inline):
Title "Chủ đề được nhắc nhiều nhất". Horizontal bar chart:
Positive topics (green bars): "Giao hàng nhanh" 52 lần | "Chất lượng tốt" 47 | "Đóng gói kỹ" 41
Negative topics (red bars): "Kích thước không đúng" 23 | "Màu sắc khác ảnh" 18 | "Hàng chậm" 12

AI KEYWORD CLOUD (white card, full width, mb-4):
Title "Từ khóa nổi bật — AI trích xuất". Visual word cloud style (flat, no 3D): positive words in green shades, negative in red shades, neutral gray. Larger = more frequent. Key words: "đẹp", "nhanh", "chất lượng" large green; "không vừa", "sai màu" medium red.

PRODUCT SENTIMENT TABLE (white card):
Title "Sentiment theo sản phẩm". Columns: SẢN PHẨM | TỔNG REVIEW | TÍCH CỰC % | TRUNG LẬP % | TIÊU CỰC % | ĐIỂM TB | XU HƯỚNG | HÀNH ĐỘNG
Color-code TIÊU CỰC %: green <10%, amber 10-20%, red >20%.
[Xem review] link per row.

STYLE: Sentiment-dominant design. Emoji enhance readability. AI model metadata visible for trust. Color = sentiment consistently (green/gray/red).
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add an AI auto-response panel below the keyword cloud: 3 negative topic cards each with a pre-drafted response template — topic label + draft text in light box + [Sử dụng mẫu này] button"
"Add language detection badges in the product sentiment table: country flag icon (🇻🇳 🇨🇳 🇺🇸) next to TỔNG REVIEW count showing review language breakdown"
"Add a sentiment score mini-bar below the keyword cloud title: full-width horizontal bar split green 68% + gray 22% + red 10%, matching the overview cards"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 14-B — Single Product Sentiment Timeline State:*
```
SAME SHELL + PAGE HEADER as Screen 14. DIFFERENT main content:
Breadcrumb "← Tất cả sản phẩm" | product selector dropdown "Áo thun basic trắng".
SENTIMENT TIMELINE CHART (white card, full width): 8 bars (W1-W8, last 2 months), stacked green/gray/red. Annotation marker on W4: "Cập nhật bảng size" — showing before/after improvement.
REVIEW SAMPLES BELOW: 3 most recent reviews for this product with sentiment badges.
[Quay lại tổng quan] link top-left of content.
```

---

## 15 — CRM — Hộp thư Review

**Role:** Admin, Nhân viên CSKH | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: CRM & Review (badge "14") | TOPBAR: "Hộp thư Review" / "14 chưa phản hồi"

PAGE HEADER: "Hộp thư Review" 22px bold + subtitle. Right: filter tabs [Tất cả][Chưa trả lời (14)][Tiêu cực (8)][Đã trả lời] + Sort "Mới nhất ▾".
STATS: "Tỷ lệ phản hồi: 71% | 4.2 giờ TB | Trust 4.7/5 ⭐" 13px gray dots.

SPLIT LAYOUT: left 55% review list · right 45% reply panel (sticky).

LEFT — review cards vertical gap-12px:
Card 1 NEGATIVE (left-border 4px red): ★☆☆☆☆ Shopee "2 giờ" badge "Ưu tiên" red. Product "Áo thun basic L" indigo. Customer "Nguyễn Văn A ●●●". Text "Vải quá mỏng... size L mặc như M. Thất vọng." #1E293B. "✨ AI: Tiêu cực 94% · Kích thước, Chất liệu" badge. Actions: [Trả lời ngay] orange | [Đánh dấu đọc] ghost.
Card 2 POSITIVE (left-border 2px green): ★★★★★ TikTok "1 ngày". "Váy hoa nhí M". "Váy đẹp, giao nhanh, đóng gói kỹ. 5 sao!" green 2-line. "✨ AI: Tích cực 97%". [Cảm ơn & Trả lời] ghost.
Card 3 NEUTRAL (no border): ★★★☆☆ "Màu hơi khác ảnh một chút..." "✨ AI: Trung lập 71%".

RIGHT — reply panel:
Title "Trả lời đánh giá" 15px. Selected review preview (condensed). "✨ AI gợi ý:" 2 radio options (formal / friendly), each shows draft in gray box + [Chọn & Chỉnh sửa]. Textarea 120px "Phản hồi..." char count 0/500. Checkbox "Tự động dịch". [Gửi phản hồi] indigo | [Lưu nháp] outline.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add keyboard shortcut hint labels on review card action buttons: [Trả lời ngay] shows 'R' badge, [Đánh dấu đọc] shows 'M' badge, [Báo cáo] shows 'D' badge — small gray pill in button corner"
"Add a sentiment score mini-bar below each review text: full-width 4px bar, green portion = positive%, red portion = negative% — matches AI analysis"
"Add a 'Phản hồi hàng loạt' button in the page header right area: outline indigo, only visible when filter is '5 sao' or 'Tích cực'"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 15-B — Reply Sent Success State:*
```
SAME LAYOUT as Screen 15. ONE DIFFERENCE ONLY:
The negative review card at top (previously selected) changes to:
- Green left border 2px (replied)
- New row below review text: "✅ Đã phản hồi — 14:47 bởi Lê CSKH B" green 12px + "Xem phản hồi" text link
- Action buttons change to: [Sửa phản hồi] ghost | [Đánh dấu đọc] ghost
Reply panel right side shows success state: green checkmark 32px + "Phản hồi đã được gửi thành công!" 15px green + time sent.
```

*Screen 15-C — Inbox Empty State:*
```
SAME SHELL + PAGE HEADER as Screen 15. Stats bar shows "Tỷ lệ phản hồi: 100%" green.
Main content replacing review list + reply panel: large centered empty state:
- Green checkmark circle 64px
- "Tất cả review đã được phản hồi! 🎉" 18px semibold
- "Inbox sạch — phản hồi 100% trong 24h" 14px gray
- [Xem review đã trả lời] outline indigo button
```

---

## 16 — CRM — Hồ sơ khách hàng

**Role:** Admin, Nhân viên CSKH | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: CRM & Review | TOPBAR: "Hồ sơ Khách hàng" / "Quản lý & phân tích khách hàng"

"Hồ sơ Khách hàng" 22px bold. Right: search "🔍 Tìm theo tên, SĐT, mã KH..." max-w-sm | "Xuất danh sách" ghost.

CUSTOMER TABLE (white card, full width, top section):
Headers: ☐ | KHÁCH HÀNG | SÀN | TỔNG ĐƠN | TỔNG CHI TIÊU | ĐƠN GẦN NHẤT | PHÂN KHÚC | HÀNH ĐỘNG
Show 5 rows then "Xem chi tiết khách hàng" expands to:

CUSTOMER DETAIL VIEW (main content, 2/3 + 1/3 layout):
LEFT COLUMN (2/3):

CUSTOMER HEADER CARD (white, gradient top bar indigo):
  Avatar circle (40px) + name "Nguyễn Thị Lan" 20px bold + phone (masked) + email (masked)
  Segment badge "Khách VIP" gold | Join date "Khách hàng từ: 01/06/2023" | Shopee + TikTok platform badges

KPI CARDS ROW (3 compact cards):
"Tổng đơn hàng: 47" | "Tổng chi tiêu: 18.750.000 ₫" | "Đơn gần nhất: 3 ngày trước"

ORDER HISTORY TABLE (white card):
Title "Lịch sử đơn hàng" + filter [Tất cả][Shopee][TikTok][Hoàn/Huỷ].
Compact table: MÃ ĐƠN | NGÀY | SẢN PHẨM | GIÁ TRỊ | TRẠNG THÁI
Show 5 most recent orders.

RIGHT COLUMN (1/3):

AI CUSTOMER INSIGHTS (indigo gradient card):
"✨ AI Phân tích KH" header.
  "Phân khúc: Khách VIP — Chi tiêu cao, tần suất mua hàng 2.3 lần/tháng"
  "Sản phẩm ưa thích: Áo (65%), Váy (25%)"
  "Kênh chính: TikTok Shop (72% đơn)"
  "Risk: Low — churn probability 8%"
  Confidence badge 84%.

NOTES SECTION (white card):
Title "Ghi chú nội bộ". Textarea for team notes. [Lưu ghi chú] button. Previous notes listed with timestamp + staff name.

REVIEW HISTORY (white card):
Title "Đánh giá đã để lại". 3 reviews compact: star rating + product + 1-line text. Sentiment badges.

STYLE: CRM-focused. Customer data prominent but privacy-conscious (masked contact). AI insights actionable. Clean split layout.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add an RFM score visualization in the right column below AI insights: 3 horizontal progress bars — Recency (8/10), Frequency (9/10), Monetary (7/10) with label + score"
"Add a customer lifecycle timeline in the LEFT COLUMN above order history: horizontal milestone line — '01/06/2023 Đơn đầu tiên → T8/2023 Khách thân thiết → T1/2024 Khách VIP → Hôm nay' with indigo dots"
"Add a 'Gửi voucher' quick action button to the CUSTOMER HEADER CARD right side: outline indigo 36px 'Gửi voucher cá nhân hóa'"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 16-B — Send Voucher Modal State:*
```
SAME SHELL + main content as Screen 16. ONE DIFFERENCE ONLY:
A modal overlay (centered, white, 24px radius, shadow-xl, 440px wide):
Title "Gửi Voucher cho Nguyễn Thị Lan" 16px semibold.
Fields: Loại voucher (dropdown: Giảm %, Giảm cố định, Miễn phí ship) | Giá trị "20%" | Thời hạn (date) | Điều kiện tối thiểu "500.000 ₫" | Tin nhắn cá nhân hóa (textarea, pre-filled).
Preview: voucher card design (indigo bg, white text) 280×160.
Footer: [Huỷ] ghost | [Gửi voucher] indigo filled.
Overlay: #0F172A 40%.
```

---

## 17 — Cài đặt — Kết nối sàn

**Role:** Admin only | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Cài đặt | TOPBAR: "Kết nối Sàn Thương mại" / "Shopee & TikTok Shop API"

"Kết nối Sàn Thương mại" 22px bold. Subtitle "Quản lý kết nối API với Shopee và TikTok Shop".

CONNECTED PLATFORMS SECTION:
Title "Sàn đang kết nối" 15px semibold, mb-4.

SHOPEE CONNECTION CARD (white card, green left border 4px — connected):
Header row: Shopee logo + "Shopee" 16px bold + "Đã kết nối ●" green badge.
Info grid 2×2: Shop ID "shopee-shop-12345" mono | Shop Name "ShopHub Official" | Kết nối từ "01/01/2024" | Hết hạn Token "20/06/2026".
API Status row: Sync indicator green dot + "Đồng bộ tự động mỗi 5 phút" | "Lần đồng bộ cuối: 2 phút trước ✓".
Permissions: "✓ Đọc đơn hàng · ✓ Cập nhật tồn kho · ✓ Đọc sản phẩm · ✓ Webhook realtime" — tags 12px green.
Actions: [Đồng bộ ngay] outline | [Làm mới Token] ghost | [Huỷ kết nối] danger ghost.

TIKTOK SHOP CONNECTION CARD (white card, green left border):
Similar layout with TikTok branding. Different token expiry, shop details.
Actions: [Đồng bộ ngay] | [Làm mới Token] | [Huỷ kết nối].

ADD NEW PLATFORM SECTION:
Title "Thêm sàn mới" 15px semibold.
2 platform add cards (white, dashed border #E2E8F0, hover indigo border):
  "🟠 Kết nối thêm Shopee Store" — add another shop account
  "🔵 Lazada" — coming soon, grayed out badge "Sắp ra mắt"

WEBHOOK STATUS (white card, full width):
Title "Trạng thái Webhook Realtime" 15px semibold.
Table: SỰ KIỆN | ENDPOINT | TRẠNG THÁI | LƯỢT GỌI (24H) | LỖI (24H)
Rows: order.created | order.status_update | inventory.low_stock — each with green "Hoạt động" badge and stats.

STYLE: Trust-focused settings UI. Connection status immediately visible. Technical details available but not overwhelming. Danger actions destructive-styled.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add an API rate limit indicator row inside each platform connection card: '📊 API calls hôm nay: 450/500 · 90% đã dùng' — amber if >80%, green if <80%"
"Add a 'Test kết nối' button next to [Đồng bộ ngay] in each platform card: outline gray, shows ping icon"
"Add a sync log summary row at bottom of each platform card: '50 sự kiện đồng bộ hôm nay · 0 lỗi · [Xem log chi tiết →]' gray 12px"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 17-B — Token Expiring Soon State:*
```
SAME LAYOUT as Screen 17. ONE DIFFERENCE ONLY:
Shopee connection card token expiry changes to: "Hết hạn Token: 25/03/2026" amber bold.
Add warning row inside Shopee card, below API Status: "⚠ Token sẽ hết hạn sau 5 ngày — cần làm mới để tránh gián đoạn" amber bg #FEF3C7 px-3 py-2 rounded.
[Làm mới Token] button changes from ghost to orange filled outlined.
```

*Screen 17-C — Sync Log Modal State:*
```
SAME SHELL + main content as Screen 17. ONE DIFFERENCE ONLY:
A modal overlay (right-aligned slide-over, 560px wide, full height, white, shadow-xl):
Title "Sync Log — Shopee" 16px semibold | [× Đóng] top-right.
Filter: [Tất cả] [Thành công] [Lỗi] tab bar. Date range picker.
Log table: THỜI GIAN | LOẠI SỰ KIỆN | STATUS | CHI TIẾT
Show 10 rows: green "✓ Thành công" and red "✗ Lỗi" mixed, with mono timestamps and event type labels.
Pagination at bottom.
```

*Screen 17-D — Disconnected Platform State:*
```
SAME LAYOUT as Screen 17. ONE DIFFERENCE ONLY:
TikTok Shop connection card changes to: red left border 4px. Header badge changes to "Mất kết nối ●" red. API Status shows: red dot + "Không thể kết nối — Lỗi 401 Unauthorized" red 13px.
Add reconnect prompt below: "Token đã hết hạn. Cần xác thực lại để tiếp tục đồng bộ." red 13px.
Actions row changes: [Kết nối lại] indigo filled | [Xem log lỗi] outline | [Huỷ kết nối] danger ghost.
```

---

## 18 — Cài đặt — Phân quyền nhân viên

**Role:** Admin only | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Cài đặt | TOPBAR: "Phân quyền Nhân viên" / "4 nhân viên đang hoạt động"

"Quản lý Nhân viên & Phân quyền" 22px bold. Subtitle "4 nhân viên đang hoạt động".
Right: "Mời nhân viên mới" indigo filled button + Plus icon.

ROLE SUMMARY ROW (4 role cards compact, mb-6):
"👑 Chủ shop: 1" indigo | "📦 Nhân viên kho: 2" blue | "💬 Nhân viên CSKH: 1" green | "📊 Nhân viên KD: 1" purple — small cards with count badges.

STAFF TABLE (white card):
Headers: NHÂN VIÊN | VAI TRÒ | EMAIL | TRẠNG THÁI | ĐĂNG NHẬP CUỐI | QUYỀN HẠN | HÀNH ĐỘNG

Rows (5 staff):
Row 1: Avatar + "Nguyễn Admin" + "admin@company.vn" | Badge "Chủ shop" indigo | "Đang hoạt động" green | "Vừa xong" | "Toàn quyền" | [Sửa] — no delete for owner
Row 2: Avatar + "Trần Kho A" | Badge "Nhân viên kho" blue | "Đang hoạt động" | "2 giờ trước" | "Kho hàng, Đơn hàng" | [Sửa quyền] [Tạm dừng] [Xoá]
Row 3: Avatar + "Lê CSKH B" | Badge "CSKH" green | "Đang hoạt động" | "Hôm nay 09:30" | "CRM, Review" | [Sửa quyền] [...]
Row 4: Avatar + "Phạm KD C" | Badge "Kinh doanh" purple | "Không hoạt động" gray | "3 ngày trước" | "Doanh thu, Sản phẩm" | [Sửa quyền] [...]
Row 5: Avatar gray (deactivated) + "Võ Kho D" | "Tạm dừng" badge gray | "Tạm dừng" | "1 tuần trước" | "—" | [Kích hoạt lại]

PERMISSION MATRIX (white card, expandable):
Title "Ma trận phân quyền" — click to expand.
Table: Modules as columns (Dashboard, Đơn hàng, Kho hàng, Doanh thu, Sản phẩm, CRM, Cài đặt).
Rows: 4 roles.
Cells: ✓ Full access | 👁 View only | ✗ No access — color coded (green/blue/red).

INVITE MODAL PREVIEW (shown docked right, semi-transparent):
"Mời nhân viên mới" 16px semibold. Email input + Role dropdown (Nhân viên kho, CSKH, Kinh doanh) + custom permission toggles + [Gửi lời mời] indigo.

STYLE: Clean admin panel. Permission matrix clear at a glance. Role badges color-coded consistently. Destructive actions require confirmation.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a '2FA' column to the staff table between ĐĂNG NHẬP CUỐI and QUYỀN HẠN: green shield icon '✓ Bật' or gray shield '✗ Tắt' + [Yêu cầu bật] link for those without 2FA"
"Expand the PERMISSION MATRIX to show it already open (not collapsed) with full table visible"
"Add a custom role row at the bottom of the permission matrix: 'Nhân viên tổng hợp ✏' — editable, all cells show toggle switches instead of icons"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 18-B — Invite Sent State:*
```
SAME LAYOUT as Screen 18. ONE DIFFERENCE ONLY:
Invite panel on right changes to success state: green checkmark 32px centered + "Lời mời đã được gửi!" 15px green + email address shown + "Lời mời hết hạn sau 48 giờ" gray 12px + [Gửi lời mời khác] indigo link.
```

*Screen 18-C — Delete Confirmation Modal:*
```
SAME SHELL + main content as Screen 18. ONE DIFFERENCE ONLY:
Row 2 (Trần Kho A) has [Xoá] button highlighted. Confirmation modal (centered, 400px wide, white, 24px radius, shadow-xl):
Warning icon 32px red. Title "Xoá nhân viên Trần Kho A?" 16px semibold.
Body: "Hành động này không thể hoàn tác. Tất cả phiên đăng nhập của nhân viên này sẽ bị chấm dứt ngay lập tức."
Footer: [Giữ lại] ghost | [Xoá vĩnh viễn] red filled.
Overlay #0F172A 40%.
```

*Screen 18-D — Activity Log Modal:*
```
SAME SHELL + main content as Screen 18. ONE DIFFERENCE ONLY:
Right slide-over panel (480px, white, shadow-xl): "Hoạt động — Trần Kho A" 16px semibold | [× Đóng]. 
Activity log list (20 items): each row = timestamp mono + action icon + action description. Examples: "14:32 📦 Tạo phiếu nhập kho PN-0034" | "12:15 ✓ Xác nhận đơn SPE-001244" | "10:30 📤 Xuất CSV danh sách đơn". Newest first. Pagination "1-20 trong 247 hoạt động".
```

---

## 19 — Cài đặt — Tự động hóa

**Role:** Admin only | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: Cài đặt | TOPBAR: "Tự động hóa Vận hành" / "17 tính năng · 9 đang bật"

PAGE HEADER: "Tự động hóa Vận hành" 22px bold + "~3.5 giờ/ngày tiết kiệm". Right: "Tạo quy tắc mới" indigo.
STATS BAR (white card): "⚡ 247 hành động hôm nay | ⏱ 3.5 giờ tiết kiệm | ✅ 98.4% thành công" 13px gray dots.
TABS: [Tất cả (17)] [Đơn hàng (6)] [Kho hàng (4)] [Khách hàng (4)] [Báo cáo (3)]

RULES LIST (white card, each row = toggle + title + description + stats + actions):
R1 ON: "Xác nhận đơn hàng tự động" | "Đơn Shopee/TikTok → xác nhận nếu tồn kho đủ" | "89 lần hôm nay" blue | [Sửa][Logs][Tắt]
R2 ON: "Cảnh báo tồn kho thấp" | "SKU <10 units → thông báo + đề xuất nhập" | "3 lần" | [Sửa][Logs]
R3 ON: "Phân loại hoàn huỷ ✨ AI" | "Đơn hoàn → AI gán nhãn nguyên nhân" | "12 lần" | [Sửa][Logs]
R4 OFF (gray): "Báo cáo cuối ngày" | "23:00 → KPI email admin" | "Tắt" | [Bật][Sửa]
R5 ON: "Định giá tự động ✨ AI" | "Đối thủ đổi giá → gợi ý (cần xác nhận)" | "3 gợi ý chờ" orange | [Xem gợi ý][Sửa]
R6 OFF: "Trả lời review 5 sao ✨ AI" | "≥4 sao → AI soạn cảm ơn tự động" | "Tắt" | [Bật][Sửa]
"Xem thêm 11 quy tắc →" link.

BUILDER PANEL (right side preview): Trigger dropdown → Condition if/else → Action → Notification.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add a 'Thời gian tiết kiệm' mini bar chart in the AUTOMATION STATS row as a 4th stat: '📊 Tiết kiệm theo ngày' with a 7-bar sparkline (Mon-Sun, green bars)"
"Expand the AUTOMATION BUILDER PANEL to show it open and filled: Trigger 'Đơn hàng mới' selected → Condition 'Nếu tồn kho > 0' → Action 'Tự động xác nhận' → Notification 'Gửi Slack cho Admin'. Show as a 4-step flow with connecting arrows."
"Add a 'Runs today' badge to each row right side showing count: blue pill for active rules, gray for inactive"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 19-B — Automation Log Modal State:*
```
SAME SHELL + main content as Screen 19. ONE DIFFERENCE ONLY:
Right slide-over (520px, white, shadow-xl): "Run Log — Xác nhận đơn hàng tự động" 15px semibold | [× Đóng].
Filter: [Tất cả] [Thành công] [Lỗi] tabs.
Log table: THỜI GIAN | ĐƠN HÀNG | KẾT QUẢ | CHI TIẾT
10 rows: "14:32 | SPE-001247 | ✓ Đã xác nhận | Tồn kho: 68 units" etc. Mix of success (green) and occasional error (red).
Footer: pagination + "Tổng: 89 lần chạy hôm nay".
```

*Screen 19-C — New Rule Wizard State:*
```
SAME SHELL as Screen 19. Main content shows a centered wizard (instead of list):
Breadcrumb "← Quay lại danh sách". Title "Tạo quy tắc tự động mới" 20px semibold.
3-step progress indicator top: [1 Chọn trigger] → [2 Điều kiện] → [3 Hành động] — Step 1 active indigo.
STEP 1 CONTENT: Grid of trigger cards (3 columns): "Đơn hàng mới" | "Tồn kho thấp" | "Review tiêu cực" | "Giá đối thủ thay đổi" | "Định kỳ theo giờ" | "Webhook event" — each card 120×80 with icon + label. Click to select (indigo border + checkmark).
Footer: [Huỷ] ghost | [Tiếp theo →] indigo filled (disabled until selection made).
```

---

## 20 — Order Detail — Slide-over Panel

**Role:** Admin, Nhân viên kho, CSKH | **Breakpoint:** Desktop

> Paste **[SHELL BLOCK]** trước, rồi paste **PASS 1**. Sau đó paste **PASS 2** như Editing Prompt.
> Pass 1 mô tả cả **màn hình nền Orders list** lẫn **slide-over panel** — Stitch cần thấy cả hai.

**PASS 1** *(paste sau SHELL BLOCK → Generate)*
```
NAV: Đơn hàng | TOPBAR: "Quản lý Đơn hàng" / "Chi tiết đơn hàng"

━━━ BACKGROUND — Orders list (blurred/dimmed behind panel) ━━━

Page title area (below topbar): "Quản lý Đơn hàng" 22px bold. Subtitle "247 đơn hôm nay — 12 cần xử lý ngay" orange.
Right: "Xác nhận loạt" outline | "Xuất CSV" outline | "In vận đơn" indigo.

Filter bar: search input + [Tất cả][● Shopee][● TikTok] pills + "Hôm nay ▾" + "Bộ lọc nâng cao".
Status tabs: [Tất cả đơn (247)] [Chờ xác nhận (12)] [Đang giao (84)] [Đã giao (145)] [Hoàn/Huỷ (6)].

Table (white card, truncated — right portion hidden under panel):
Header: ☐ | MÃ ĐƠN | KHÁCH HÀNG | SÀN | SẢN PHẨM | TỔNG TIỀN | TRẠNG THÁI | CẬP NHẬT | HÀNH ĐỘNG
Rows visible (left ~60% of screen):
  R1 URGENT (orange left-border, bg #FFFBEB): SPE-001247 | Nguyễn Văn A | ● Shopee | Áo thun basic trắng L × 2 | ... (cut off)
  R2: TTK-004812 | Trần Thị B | ● TikTok | Váy hoa nhí size M | ...
  R3: SPE-001249 | Lê Minh C | ● Shopee | Quần jean slim 28 | ...
  R4: SPE-001250 | Phạm Hoàng D | ● Shopee | ... (cut off)

OVERLAY: Semi-transparent dark overlay (#0F172A at 40% opacity) covers the entire background left of the panel.

━━━ FOREGROUND — Slide-over panel (480px, fixed right) ━━━

PANEL: 480px wide, full height, bg white, shadow-xl on left edge. No border-radius on left edge.

PANEL HEADER (sticky, height 56px, border-bottom #E2E8F0, px-16px):
Left: arrow-left icon 18px + "Đóng" 14px gray ghost — flex row gap-8px.
Center: "Chi tiết đơn hàng" 16px semibold #1E293B.
Right: "SPE-001247" JetBrains Mono 13px bold #1E293B + Shopee badge (bg #EE4D2D text white "SHOPEE" 10px radius-4px px-8px) + copy icon 14px gray.

URGENT BANNER (full width, bg #FEF2F2, border-bottom 1px #FECACA, px-16px py-10px):
Left: 🔴 icon + "Cần xử lý ngay — Còn 18 phút" 13px #B91C1C semibold.

TAB BAR (border-bottom #E2E8F0, px-16px, flex row gap-0):
3 tabs: [Chi tiết] [Lịch sử] [Review KH].
"Chi tiết" active: border-bottom 2px #4F46E5 text #4F46E5 font-semibold.
Others: text #64748B no border.

PANEL BODY (scrollable, px-16px py-16px, flex col gap-12px):

— STATUS TIMELINE (white card, border-left 3px #4F46E5, radius-8px, p-16px):
Vertical stepper, 4 steps, gap 16px:
Step 1 ✓ DONE: green filled circle (checkmark icon white) + "Đặt hàng" 14px semibold #1E293B + "20/03 14:14" 12px #64748B right.
Step 2 → CURRENT: indigo filled circle (dot animated pulse) + "Xác nhận" 14px semibold #4F46E5 + below it: [Bấm để xác nhận ✓] indigo filled button radius-8px px-12px py-6px 13px.
Step 3 ○ PENDING: gray empty circle + "Lấy hàng" 14px #94A3B8 + "Chờ" 12px #94A3B8 right.
Step 4 ○ PENDING: gray empty circle + "Giao hàng" 14px #94A3B8 + "Chờ" 12px #94A3B8 right.
Connecting vertical line between steps: 2px, green for done→done, indigo for done→current, gray for current→pending.

— CUSTOMER INFO (white card, radius-8px, p-16px):
Header row: person icon 16px #94A3B8 + "THÔNG TIN KHÁCH HÀNG" 11px uppercase #94A3B8 font-700 + "Xem hồ sơ KH ›" 12px #4F46E5 right.
Name: "Nguyễn Văn A" 15px semibold #1E293B.
Phone row: "0901●●●●89" 13px #1E293B + copy icon 14px gray.
Address: "123 Đường ABC, Q.1, TP.HCM" 13px #64748B.

— ORDER ITEMS (white card, radius-8px, p-16px):
Header: shopping-bag icon 16px #94A3B8 + "SẢN PHẨM ĐẶT MUA" 11px uppercase #94A3B8.
Item row: 40×40 img placeholder radius-8px + flex col ("Áo thun basic trắng — Size L" 13px semibold #1E293B · "Số lượng: × 2" 12px #64748B) + "189.000 ₫ × 2" JetBrains Mono 13px right.
Divider 1px #F1F5F9.
Price breakdown (each row flex justify-between):
  "Tạm tính" 13px #64748B — "378.000 ₫" mono 13px #1E293B
  "Phí ship" 13px #64748B — "32.000 ₫" mono 13px #1E293B
  "Voucher" 13px #4F46E5 — "-20.000 ₫" mono 13px #22C55E
  "Tổng cộng" 14px semibold #1E293B — "390.000 ₫" mono 15px bold #1E293B

— SHIPPING INFO (white card, radius-8px, p-16px):
Header: truck icon 16px #94A3B8 + "THÔNG TIN GIAO HÀNG" 11px uppercase #94A3B8.
Carrier: "Shopee Express" 13px #1E293B.
Tracking: "SPXVN●●●●●●" mono 13px #64748B + copy icon + "[Theo dõi vận đơn ›]" 12px #4F46E5.
Expected: "21-22/03/2026" 13px #64748B.

— INTERNAL NOTES (white card, radius-8px, p-16px):
Header: edit icon + "GHI CHÚ NỘI BỘ" 11px uppercase #94A3B8.
Textarea 3 lines, bg #F8FAFC border #E2E8F0 radius-8px placeholder "Thêm ghi chú...".
[Lưu ghi chú] outline gray button 32px radius-8px full-width.

PANEL FOOTER (sticky, border-top #E2E8F0, px-16px py-12px, flex col gap-8px):
Row 1: [Xác nhận đơn] indigo filled full-width 44px radius-8px — check-circle icon left.
Row 2: [In vận đơn] outline indigo 36px radius-8px flex-1 + [Huỷ đơn] outline red 36px radius-8px flex-1 — side by side.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Add copy-to-clipboard icon button next to order ID in panel header and next to phone number in customer info section"
"Add a small product image with 'Xem ảnh đầy đủ' link under the product name in ORDER ITEMS section"
"Change footer layout: merge [In vận đơn] and [Huỷ đơn] into a single '⋮ Thêm hành động' dropdown button alongside [Xác nhận đơn]"
```

**State Screens** *(tạo screen mới — "Add screen")*:

*Screen 20-B — Đã xác nhận:*
```
SAME LAYOUT as Screen 20. ONLY THESE CHANGES in the panel:
1. URGENT BANNER changes to green: bg #F0FDF4 border #BBF7D0 text #15803D — "✅ Đã xác nhận — 14:47 bởi Nguyễn Admin".
2. Timeline step 2 "Xác nhận": circle changes from indigo pulse to green checkmark ✓. Add "14:47" timestamp. Remove [Bấm để xác nhận] button.
3. Timeline step 3 "Lấy hàng": becomes CURRENT — indigo animated dot, text color #4F46E5.
4. Footer: [Xác nhận đơn] button → disabled gray "Đã xác nhận". [In vận đơn] → becomes primary indigo full-width.
```

*Screen 20-C — Xác nhận huỷ:*
```
SAME LAYOUT as Screen 20. ONE ADDITION ONLY:
Between PANEL BODY and PANEL FOOTER, insert inline confirmation bar:
bg #FEF2F2, border-top 1px #FECACA, px-16px py-12px, flex row justify-between items-center.
Left: "Huỷ đơn SPE-001247? Không thể hoàn tác." 13px #B91C1C.
Right: [Giữ lại] ghost gray 32px + [Xác nhận huỷ] bg #EF4444 text white 32px — side by side gap-8px.
```

---

## 21 — Notification Center

**Role:** Tất cả | **Breakpoint:** Desktop (Dropdown 400px từ topbar bell)

> Paste **[SHELL BLOCK]** trước, rồi paste nội dung prompt này.

```
NAV: (current page) | TOPBAR: (current page title)

NOTE: This dropdown overlays any page. Use Shell Block of the underlying page.
DROPDOWN DESIGN: 400px wide, max-height 560px overflow-y-auto. White bg, 12px radius, shadow-xl. Positioned below bell icon in topbar, right-aligned.

HEADER (sticky, border-bottom):
Left: "Thông báo" 15px semibold | badge "5 chưa đọc" indigo pill.
Right: "Đánh dấu tất cả đã đọc" 12px indigo text button | "Cài đặt" gear icon 16px gray.

TABS: [Tất cả (12)] [Chưa đọc (5)] [Đơn hàng] [Kho hàng] [Hệ thống] — compact tabs 12px.

NOTIFICATION LIST (scrollable):

UNREAD GROUP "Chưa đọc":
Blue left border 3px on each unread item.

Notif 1 (unread — URGENT): 🔴 icon | "Đơn SPE-001247 sắp trễ SLA!" bold | "Còn 18 phút để xác nhận — Shopee sẽ tự huỷ" 13px | "2 phút trước" gray | [Xử lý ngay] indigo small button | bg very subtle blue tint.

Notif 2 (unread): ⚠️ | "Tồn kho AT-WHT-XL sắp hết" bold | "Còn 6 units — dự báo hết trong 3 ngày" 13px | "8 phút trước" | [Nhập kho].

Notif 3 (unread): 💬 | "Review tiêu cực mới từ Shopee" bold | "★☆☆☆☆ — Áo thun basic L: 'Vải quá mỏng...'" 13px truncate | "14 phút trước" | [Trả lời].

Notif 4 (unread): 🔄 | "Đồng bộ Shopee hoàn tất" bold | "247 đơn được cập nhật, 3 đơn mới" 13px | "20 phút trước".

Notif 5 (unread): ✨ | "AI Dự báo mới sẵn sàng" bold | "30 SKU được dự báo tồn kho — 8 cần nhập gấp" | "1 giờ trước" | [Xem dự báo].

DIVIDER "Đã đọc" gray label.

READ GROUP (4 more notifications, no blue border, lighter text):
✅ "Xác nhận đơn TTK-000891 thành công" | "2 giờ trước"
📊 "Báo cáo tuần đã tạo xong" | "Hôm qua 23:00" | [Xem báo cáo]
💰 "Doanh thu hôm qua đạt mục tiêu 🎉" | "Hôm qua 23:59"
⚙️ "Token API Shopee sẽ hết hạn sau 90 ngày" | "2 ngày trước" | [Gia hạn ngay]

FOOTER (sticky, border-top, center):
"Xem tất cả thông báo ›" indigo link 13px.

STYLE: Compact notification list. Urgency communicated through icons + colors. Action buttons inline for quick response. Unread visually distinct.
```

**Editing prompts** *(chỉ sửa element luôn hiển thị trên canvas)*:
```
"Group notifications by time sections: 'Hôm nay', 'Hôm qua', 'Tuần này' — add gray section label headers between groups"
"Add a notification preference shortcut in the dropdown header: below the gear icon, add a small 'Tùy chỉnh loại thông báo' text link 11px gray"
"Add dismiss (×) icon to the right edge of each notification item — visible on row hover, gray 14px"
```

**State Screens** *(tạo screen mới trong Stitch — "Add screen")*:

*Screen 21-B — All Read Empty State:*
```
SAME DROPDOWN DESIGN as Screen 21. Header badge changes to "0 chưa đọc" gray.
Tabs: [Chưa đọc (0)] tab active. 
Main area: empty state centered — bell icon 40px gray + "Tất cả đã đọc" 14px semibold gray + "Không có thông báo mới" 12px gray.
Footer unchanged.
```

*Screen 21-C — Notification Preferences Inline State:*
```
SAME DROPDOWN DESIGN as Screen 21. ONE DIFFERENCE ONLY:
Below the TABS row, a preferences panel expands (white bg, border-bottom, px-4 py-3):
Title "Tùy chỉnh thông báo" 13px semibold. 
Toggle list (compact, 4 rows): "Đơn hàng SLA" toggle ON | "Tồn kho thấp" toggle ON | "Review tiêu cực" toggle ON | "Đồng bộ hoàn tất" toggle OFF.
[Đóng] text link right-aligned 12px indigo.
Notification list below is still visible but scrolled slightly.
```

---

## Phụ lục — DARK MODE SUFFIX

Thêm đoạn sau vào **cuối bất kỳ Main Prompt nào** để thiết kế trang trong Dark Mode:

```
DARK MODE — Apply these exact tokens to all surfaces:
App background: #0F172A | Card surface: #1E293B | Elevated (dropdowns, modals): #334155
All borders: #334155 | Subtle dividers: #1E293B
Text primary: #F1F5F9 | Text secondary: #94A3B8 | Text muted: #475569
Semantic lighter variants: Success #4ADE80 | Warning #FCD34D | Danger #F87171 | Info #60A5FA
Primary accent: #818CF8 (brighter for dark bg) | Sidebar: unchanged #0F172A | Focus ring: rgba(129,140,248,0.30)
```

> **Lưu ý:** Dark Mode Suffix chỉ áp dụng cho Main Prompt, không dùng trong State Screen prompts (vì State Screen thừa kế style từ main screen).

---

## Phụ lục — SHELL BLOCK (nguồn duy nhất, copy vào ĐẦU mọi prompt)

> Shell Block này là bản sao của block ở đầu tài liệu. Dùng cái này để copy nhanh khi cần.

```
ShopHub SaaS — web desktop 1280px.

IMPORTANT: Sidebar and topbar must be rendered EXACTLY as specified below. Do not modify any part of them.
The content prompt will specify: NAV = which sidebar item is active, TOPBAR = what title and date to show in the topbar left area. Everything else in the shell stays exactly as specified.

SIDEBAR: 240px wide, full height, bg-slate-950 (#0B1120 very dark navy), shadow-2xl. Two sections: top nav + bottom profile.

  TOP — Logo: text "ShopHub" only — 24px bold white, padding-left 24px, padding-top 32px, padding-bottom 32px. NO icon, NO subtitle, NO "Management" text under logo.

  TOP — Nav list (space-y-1, tiny gap between items):
  7 items. Each item = icon (Material Symbols Outlined, 24px) + label text (14px), flex row, gap-12px, padding px-16px py-12px, margin mx-12px, rounded-lg corners.
  ACTIVE item "Dashboard" (or the specified screen's nav item): bg indigo-600/10 (very faint indigo wash — NOT solid blue), text indigo-400, font-semibold.
  INACTIVE items: text-slate-400.
  Icons (Material Symbols Outlined): Dashboard=dashboard · Đơn hàng=shopping_cart · Kho hàng=inventory_2 · Doanh thu=payments · Sản phẩm=inventory · CRM & Review=group · Cài đặt=settings.

  BOTTOM — separated by thin border-t (slate-800 at 50% opacity): one row = account_circle icon + "Profile Settings" text, same layout as inactive nav item (text-slate-400, mx-12px px-16px py-12px). NO avatar photo here.

TOPBAR: 64px tall, starts at x=240px, bg white/80 backdrop-blur, thin bottom border, padding px-32px.
  LEFT (flex row, gap-16px, vertically centered): "Dashboard" text (20px bold dark #111C2D) → thin 1px vertical divider line (16px tall, very light gray) → "Hôm nay, 24 Oct" (14px, slate-500).
  RIGHT (flex row, gap-24px): three icon buttons (calendar_today · refresh · notifications — 24px slate-600, rounded hover) where notifications has a small 8px red dot badge at top-right → then border-left separator → user block (text column: "Admin" 14px semibold + "Workspace 01" 12px gray · avatar circle 40px with thin ring).

CONTENT AREA: starts at x=240px y=64px, bg #F9F9FF.

The sidebar and topbar defined above are fixed and must not be modified. Render them exactly as described before drawing any page content.
```

---

## Phụ lục — QUYẾT ĐỊNH EDITING vs STATE SCREEN

Bảng tham chiếu nhanh khi viết prompt mới:

| Loại thay đổi | Dùng Editing Prompt | Dùng State Screen mới |
|---|---|---|
| Thêm column vào table | ✅ | |
| Thêm button/icon luôn hiển thị | ✅ | |
| Thêm chart, section mới | ✅ | |
| Thay đổi layout/spacing | ✅ | |
| Error message khi có lỗi | | ✅ |
| Warning banner khi session hết hạn | | ✅ |
| Empty state khi không có dữ liệu | | ✅ |
| Success state sau khi hoàn thành action | | ✅ |
| Loading/processing state | | ✅ |
| Modal confirmation | | ✅ |
| Trang sau khi click một action | | ✅ |

---

*ShopHub Stitch Prompt Library v1.3 — Tháng 3/2026*
*22 screens chính · 30+ state screens · 7 modules · Shell Block system v1.3*
