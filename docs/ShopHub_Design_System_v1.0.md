# ShopHub — Design System & UI Architecture
## Single Source of Truth v1.0

> **Tài liệu này là "nguồn sự thật duy nhất" (Single Source of Truth)** cho toàn bộ giao diện ShopHub. Mọi quyết định về màu sắc, typography, spacing, component, và prompt Google Stitch đều phải được tra cứu và tuân theo tài liệu này.

**Dự án:** ShopHub — Nền tảng Quản lý Kinh doanh Thương mại Điện tử Đa Sàn  
**Phiên bản:** 1.0  
**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS v3  
**Công cụ thiết kế:** Google Stitch (Standard Mode → Figma Export + Tailwind CSS)  
**Nền tảng hỗ trợ:** Shopee · TikTok Shop  
**Ngày:** Tháng 3/2026

---

## Mục lục

- [Chương 1: UX Principles — Nguyên tắc Thiết kế & Trải nghiệm Người dùng](#chương-1-ux-principles)
- [Chương 2: Visual Identity — Colors, Typography, Spacing, Iconography](#chương-2-visual-identity)
- [Chương 3: UI Component Library — Atoms, Molecules, Organisms](#chương-3-ui-component-library)
- [Chương 4: UI Architecture & Tailwind Configuration](#chương-4-ui-architecture--tailwind-configuration)
- [Chương 5: Google Stitch Prompting Integration](#chương-5-google-stitch-prompting-integration)

---

# Chương 1: UX Principles

## 1.1 Tầm nhìn thiết kế

ShopHub phục vụ 4 nhóm người dùng với nhu cầu khác nhau, hoạt động trong môi trường áp lực cao (xử lý 100–500 đơn/ngày). Triết lý thiết kế xoay quanh ba trục:

**Clarity First** — Dữ liệu phức tạp phải được hiển thị rõ ràng, không mơ hồ. Mỗi con số, trạng thái, cảnh báo đều phải truyền đạt đúng ý nghĩa ngay lần nhìn đầu tiên.

**Action-Oriented** — Mỗi màn hình đều hướng người dùng đến hành động cụ thể. Dashboard không chỉ "hiển thị" mà phải "gợi ý bước tiếp theo".

**Trustworthy & Calm** — Nền tảng quản lý tiền bạc và vận hành kinh doanh cần tạo cảm giác tin cậy, chuyên nghiệp. Tránh màu sắc quá rực rỡ hoặc layout hỗn loạn.

## 1.2 Nguyên tắc UX theo từng vai trò

| Vai trò | Nhu cầu chính | Nguyên tắc UI ưu tiên |
|---|---|---|
| **Chủ shop (Admin)** | Tổng quan nhanh, ra quyết định | Overview-first, KPI nổi bật, drill-down dễ |
| **Nhân viên kho** | Xử lý nhanh, ít nhầm lẫn | Task-focused, trạng thái rõ ràng, cảnh báo ngay mắt |
| **Nhân viên CSKH** | Phản hồi nhanh, context đầy đủ | Inbox-style, sentiment badges, one-click reply |
| **Nhân viên kinh doanh** | Phân tích xu hướng, cơ hội | Data-rich, charts, comparisons |

## 1.3 Sáu Nguyên tắc Thiết kế Cốt lõi

### P1 — Progressive Disclosure
Chỉ hiển thị thông tin cần thiết cho bước hiện tại. Chi tiết ẩn sau hover, expand, hoặc modal. Áp dụng cho: Data Tables (ẩn cột ít dùng), KPI Cards (chi tiết hiện khi hover), AI Insight Blocks (summary → detail).

### P2 — Consistent Density
Dashboard tổng quan: low density (KPI cards lớn, breathing room). Data tables: high density (nhiều rows, cột compact). Trang chi tiết: medium density. Không để density thay đổi ngẫu nhiên trong cùng một màn hình.

### P3 — Status Clarity
Mọi trạng thái (đơn hàng, tồn kho, đồng bộ API) đều phải có indicator riêng: màu sắc + icon + text label. Không chỉ dùng màu đơn thuần (accessibility). Quy tắc: `[color] + [icon] + [label]` = bộ ba bắt buộc.

### P4 — AI Transparency
Mọi kết quả từ AI/ML (dự báo tồn kho, phân tích sentiment, gợi ý giá) đều phải có: confidence score, thời điểm cập nhật, và nút "Xem chi tiết". Người dùng phải biết đây là AI, không phải dữ liệu thực.

### P5 — Error Prevention over Error Recovery
Form validation inline (không đợi submit). Confirm dialog cho hành động nguy hiểm (xóa, hủy đơn). Bulk action với preview trước khi thực hiện.

### P6 — Mobile-Aware, Desktop-First
ShopHub là desktop-first (dashboard phức tạp, nhiều cột dữ liệu). Nhưng một số tác vụ kho phải responsive cho tablet. Breakpoint chính theo Tailwind mặc định:

| Prefix | Breakpoint | Mục đích |
|---|---|---|
| `md:` | 768px | Tablet (nhân viên kho dùng iPad) |
| `lg:` | 1024px | Laptop nhỏ |
| `xl:` | 1280px | Desktop chuẩn — breakpoint chính của ShopHub |
| `2xl:` | 1536px | Màn hình rộng, admin workstation |

> ⚠️ **Lưu ý:** Tài liệu này dùng `xl:1280px` (không phải `lg:`) làm ngưỡng "desktop layout đầy đủ". Khi viết class Tailwind, luôn dùng prefix `xl:` cho các thay đổi layout chỉ áp dụng trên desktop.

## 1.4 Information Architecture — Cấu trúc Navigation

```
ShopHub
├── 🏠 Dashboard (Tổng quan)
│   ├── KPI Overview
│   ├── Revenue Charts
│   ├── Top Products
│   └── Alerts & Notifications
├── 📦 Đơn hàng
│   ├── Danh sách đơn (All Orders)
│   ├── Cần xử lý (Pending Actions)
│   └── Hoàn/Huỷ (Returns)
├── 🏪 Kho hàng
│   ├── Tồn kho SKU
│   ├── Nhập/Xuất kho
│   └── Dự báo AI (Inventory Forecast)
├── 📊 Doanh thu
│   ├── Báo cáo tổng hợp
│   ├── So sánh sàn
│   └── Dự báo ML
├── 🛍️ Sản phẩm & Giá
│   ├── Danh sách sản phẩm
│   ├── Định giá động
│   └── Theo dõi đối thủ
├── 💬 CRM & Review
│   ├── Phân tích sentiment
│   ├── Hộp thư review
│   └── Hồ sơ khách hàng
└── ⚙️ Cài đặt
    ├── Kết nối sàn
    ├── Phân quyền nhân viên
    └── Tự động hóa
```

---

# Chương 2: Visual Identity

## 2.1 Color System — Bảng màu

### 2.1.1 Brand Colors (Primary Palette)

ShopHub sử dụng màu **Indigo Blue** làm màu chủ đạo — thể hiện sự chuyên nghiệp, tin cậy, phù hợp với SaaS B2B. Kết hợp với **Coral Orange** làm accent cho các CTA quan trọng.

```
PRIMARY — Indigo Blue
--color-primary-50:  #EEF2FF   /* Background nhẹ, hover states */
--color-primary-100: #E0E7FF   /* Subtle backgrounds */
--color-primary-200: #C7D2FE   /* Borders, dividers */
--color-primary-500: #6366F1   /* Main brand color */
--color-primary-600: #4F46E5   /* Hover states, active */
--color-primary-700: #4338CA   /* Pressed states */
--color-primary-900: #312E81   /* Dark variant, headings */

SECONDARY — Slate (Neutral Base)
--color-secondary-50:  #F8FAFC   /* Page background */
--color-secondary-100: #F1F5F9   /* Card backgrounds */
--color-secondary-200: #E2E8F0   /* Borders */
--color-secondary-400: #94A3B8   /* Placeholder text */
--color-secondary-600: #475569   /* Body text */
--color-secondary-800: #1E293B   /* Headings, strong text */
--color-secondary-900: #0F172A   /* Maximum contrast */

ACCENT — Coral Orange (CTA, Highlights)
--color-accent-400: #FB923C   /* Hover accent */
--color-accent-500: #F97316   /* Primary CTA buttons */
--color-accent-600: #EA580C   /* Active/pressed CTA */
```

> ⚠️ **Phân biệt Accent vs Warning:** Hai màu này cùng tông cam-vàng nhưng **khác nhau về ngữ nghĩa và không được dùng lẫn nhau:**
>
> | | Accent (`#F97316`) | Warning (`#F59E0B`) |
> |---|---|---|
> | **Tông màu** | Cam rực (orange) | Vàng cam (amber) |
> | **Dùng cho** | CTA tích cực: "Đặt hàng", "Xác nhận", "Lưu" | Trạng thái cảnh báo: tồn kho thấp, đơn sắp trễ |
> | **Cảm xúc** | Hành động, năng lượng | Thận trọng, chú ý |
> | **Kết hợp với** | Sidebar dark, header | Badge, alert banner, row highlight |
> | **Không dùng cho** | Badge trạng thái hệ thống | Button primary/CTA |

### 2.1.2 Semantic Colors (Trạng thái hệ thống)

Đây là bảng màu quan trọng nhất cho E-commerce — thể hiện trạng thái đơn hàng, tồn kho, cảnh báo.

```
SUCCESS — Xanh lá (Đơn thành công, tồn kho đủ, tăng trưởng dương)
--color-success-50:  #F0FDF4
--color-success-100: #DCFCE7
--color-success-500: #22C55E   /* Default success */
--color-success-600: #16A34A   /* Text on light bg */
--color-success-700: #15803D   /* Dark variant */

WARNING — Vàng cam (Cảnh báo tồn kho thấp, đơn sắp trễ)
--color-warning-50:  #FFFBEB
--color-warning-100: #FEF3C7
--color-warning-500: #F59E0B   /* Default warning */
--color-warning-600: #D97706   /* Text variant */
--color-warning-700: #B45309   /* Dark variant */

DANGER — Đỏ (Đơn huỷ, tồn kho hết, lỗi hệ thống, tỷ lệ hoàn cao)
--color-danger-50:  #FFF1F2
--color-danger-100: #FFE4E6
--color-danger-500: #EF4444   /* Default danger */
--color-danger-600: #DC2626   /* Text variant */
--color-danger-700: #B91C1C   /* Dark variant */

INFO — Xanh dương nhạt (Thông tin AI, đang xử lý, trạng thái đồng bộ)
--color-info-50:  #EFF6FF
--color-info-100: #DBEAFE
--color-info-500: #3B82F6   /* Default info */
--color-info-600: #2563EB   /* Text variant */

NEUTRAL — Xám (Đơn đã hủy lâu, dữ liệu lịch sử, disabled)
--color-neutral-300: #D1D5DB
--color-neutral-400: #9CA3AF
--color-neutral-500: #6B7280
```

### 2.1.3 Platform Brand Colors (Shopee & TikTok Shop)

```
SHOPEE
--color-shopee-primary: #EE4D2D   /* Cam đỏ đặc trưng Shopee */
--color-shopee-light:   #FFF0ED   /* Background nhẹ */

TIKTOK SHOP
--color-tiktok-primary: #010101   /* Đen TikTok */
--color-tiktok-accent:  #FE2C55   /* Đỏ hồng TikTok */
--color-tiktok-light:   #FFF0F3   /* Background nhẹ */
```

### 2.1.4 Background & Surface Colors

**Light Mode (mặc định — tất cả màn hình):**
```
--color-bg-app:      #F8FAFC   /* Màu nền toàn app */
--color-bg-sidebar:  #0F172A   /* Sidebar dark (dùng cho cả light và dark mode) */
--color-bg-card:     #FFFFFF   /* Card backgrounds */
--color-bg-overlay:  rgba(15, 23, 42, 0.5)   /* Modal overlay */

--color-border:      #E2E8F0   /* Default borders */
--color-border-focus:#6366F1   /* Focus ring */
```

**Dark Mode Surface Tokens:**

> ShopHub ưu tiên Light Mode để tạo sự chuyên nghiệp, tin cậy. Tuy nhiên **nhân viên kho và CSKH thường làm việc ca đêm** — vì vậy Dark Mode là tính năng quan trọng cho hai nhóm này.

```
--color-bg-dark:           #0F172A   /* Dark app background (slate-900) */
--color-bg-dark-surface:   #1E293B   /* Dark card/panel surface (slate-800) */
--color-bg-dark-elevated:  #334155   /* Elevated surface trong dark (slate-700) */
--color-bg-dark-border:    #334155   /* Border trong dark mode */
--color-bg-dark-border-subtle: #1E293B /* Subtle dividers */

/* Text trong dark mode */
--color-text-dark-primary:   #F1F5F9   /* Chữ chính (slate-100) */
--color-text-dark-secondary: #94A3B8   /* Chữ phụ (slate-400) */
--color-text-dark-muted:     #475569   /* Placeholder, hint (slate-600) */
```

**Dark Mode Semantic — màu semantic điều chỉnh cho nền tối:**
```
/* Giữ nguyên HEX của semantic colors (success/warning/danger/info)
   nhưng dùng variant -400 thay vì -500 để contrast tốt hơn trên nền tối */
--color-dark-success: #4ADE80   /* success-400 */
--color-dark-warning: #FCD34D   /* warning-300 */
--color-dark-danger:  #F87171   /* danger-400 */
--color-dark-info:    #60A5FA   /* info-400 */
```

**CSS Implementation (globals.css):**
```css
:root {
  --bg-app:     #F8FAFC;
  --bg-card:    #FFFFFF;
  --text-main:  #1E293B;
  --text-muted: #64748B;
  --border:     #E2E8F0;
}

.dark {
  --bg-app:     #0F172A;
  --bg-card:    #1E293B;
  --text-main:  #F1F5F9;
  --text-muted: #94A3B8;
  --border:     #334155;
}
```

**Tailwind Dark Mode Config:**
```typescript
// tailwind.config.ts — thêm vào đây
darkMode: 'class',   // Toggle bằng class 'dark' trên <html>
```


### 2.1.5 Interaction States & Focus Ring

Mọi element tương tác đều phải có **trạng thái focus rõ ràng** để đạt chuẩn WCAG 2.1 AA.

**Quy tắc focus ring bắt buộc:**
> Mọi `<input>`, `<button>`, `<select>`, `<textarea>`, `<a>`, và element có `tabIndex` khi focus **phải có ring 2px màu Indigo-500 với độ mờ 20%**, khoảng cách 2px từ viền element.

```
FOCUS RING SPECIFICATION:
--focus-ring-color:   #6366F1     /* Indigo-500 */
--focus-ring-opacity: 0.20        /* 20% opacity */
--focus-ring-width:   2px
--focus-ring-offset:  2px

CSS output: box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.20);
            outline: 2px solid #6366F1;
            outline-offset: 2px;
```

**Tailwind pattern cho từng element (yêu cầu Tailwind CSS v3.0+):**
```tsx
// Input / Select / Textarea
focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500

// Button
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-2

// Link / nav item
focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2

// Dark mode — ring đậm hơn để contrast với dark background
dark:focus:ring-primary-400/30 dark:focus-visible:ring-primary-400/30
```

> ⚠️ **Version requirement:** Opacity modifier `/20` trong Tailwind (ví dụ `ring-primary-500/20`) yêu cầu **Tailwind CSS v3.0 trở lên**. Nếu dùng v2, thay thế bằng `ring-primary-500 ring-opacity-20`. Kiểm tra phiên bản: `npx tailwindcss --version`.

**5 Interaction States đầy đủ cho mọi interactive element:**
```
default:  border-secondary-300,  bg-white,              text-secondary-800
hover:    border-secondary-400,  bg-secondary-50,        text-secondary-900
focus:    border-primary-500,    ring-2 ring-primary-500/20
active:   border-primary-600,    bg-primary-50,          text-primary-800
disabled: border-secondary-200,  bg-secondary-50 opacity-50, cursor-not-allowed
```

## 2.2 Typography System

### 2.2.1 Font Selection

**Primary Font: `Be Vietnam Pro`** — Font tiếng Việt chuyên nghiệp, hỗ trợ đầy đủ dấu tiếng Việt, có nhiều weight (100–900), đọc rõ trên màn hình nhỏ.

**Numeric Font: `JetBrains Mono`** — Font monospace cho số liệu tài chính, mã đơn hàng, SKU. Các chữ số có width bằng nhau, dễ so sánh dọc theo cột.

**Fallback Stack:**
```css
--font-sans: 'Be Vietnam Pro', 'Noto Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Import Google Fonts (Next.js):**
```typescript
// app/layout.tsx
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})
```

### 2.2.2 Type Scale

> ⚠️ **Lưu ý Tailwind size mapping:** Tailwind `text-3xl` = **30px**, không phải 28px. Với các token cần kích thước chính xác, dùng **arbitrary value** `text-[28px]`. Tương tự `text-2xl` = 24px (token heading-2 = 22px → dùng `text-[22px]`). Extend `fontSize` trong `tailwind.config.ts` nếu muốn dùng utility class ngắn gọn.

| Token | Size | Line Height | Weight | Tailwind Class | Dùng cho |
|---|---|---|---|---|---|
| `text-display` | 36px / 2.25rem | 1.2 | 700 | `text-4xl font-bold` | Page titles lớn |
| `text-heading-1` | 28px / 1.75rem | 1.3 | 700 | `text-[28px] font-bold` | H1, Module headers |
| `text-heading-2` | 22px / 1.375rem | 1.4 | 600 | `text-[22px] font-semibold` | H2, Card titles |
| `text-heading-3` | 18px / 1.125rem | 1.4 | 600 | `text-lg font-semibold` | H3, Section titles |
| `text-body-lg` | 16px / 1rem | 1.6 | 400 | `text-base` | Body text chính |
| `text-body` | 14px / 0.875rem | 1.6 | 400 | `text-sm` | Body text phụ, labels |
| `text-caption` | 12px / 0.75rem | 1.5 | 400 | `text-xs` | Caption, meta info |
| `text-overline` | 11px / 0.6875rem | 1.4 | 600 | `text-[11px] font-semibold uppercase tracking-wider` | Category labels |
| `text-numeric-lg` | 32px / 2rem | 1.2 | 700 | `text-[32px] font-bold font-mono` | KPI numbers |
| `text-numeric` | 20px / 1.25rem | 1.3 | 600 | `text-xl font-semibold font-mono` | Table numbers |
| `text-numeric-sm` | 14px / 0.875rem | 1.4 | 500 | `text-sm font-medium font-mono` | Inline numbers |
| `text-code` | 13px / 0.8125rem | 1.5 | 400 | `text-[13px] font-mono` | Order IDs, SKUs |

**Extend vào tailwind.config.ts để dùng class ngắn gọn (khuyến nghị):**
```typescript
theme: {
  extend: {
    fontSize: {
      'heading-1':   ['1.75rem',  { lineHeight: '1.3', fontWeight: '700' }],
      'heading-2':   ['1.375rem', { lineHeight: '1.4', fontWeight: '600' }],
      'numeric-lg':  ['2rem',     { lineHeight: '1.2', fontWeight: '700' }],
      'overline':    ['0.6875rem',{ lineHeight: '1.4', fontWeight: '600' }],
    }
  }
}
// Sau đó dùng: className="text-heading-1 font-sans"
```

### 2.2.3 Typography Rules

- **Số tiền VND** luôn dùng `font-mono` để các chữ số thẳng hàng
- **Tên sản phẩm** truncate tại 1–2 dòng với `line-clamp-1` hoặc `line-clamp-2`
- **Tiếng Việt** không dùng `font-style: italic` — font hỗ trợ kém
- **Table headers** luôn dùng `text-overline` (uppercase + tracking)
- **KPI số chính** luôn dùng `text-numeric-lg` với `tabular-nums`

## 2.3 Spacing System

ShopHub dùng **8px base grid** — mọi spacing đều là bội số của 4px hoặc 8px.

```
--space-1:  4px    (0.25rem)  /* Micro spacing, icon gaps */
--space-2:  8px    (0.5rem)   /* Tight spacing, compact items */
--space-3:  12px   (0.75rem)  /* Small gaps */
--space-4:  16px   (1rem)     /* Default padding */
--space-5:  20px   (1.25rem)  /* Medium gaps */
--space-6:  24px   (1.5rem)   /* Card padding */
--space-8:  32px   (2rem)     /* Section spacing */
--space-10: 40px   (2.5rem)   /* Large spacing */
--space-12: 48px   (3rem)     /* Extra large */
--space-16: 64px   (4rem)     /* Page sections */
```

**Spacing Convention theo Context:**

| Context | Padding | Gap |
|---|---|---|
| Card (default) | `p-6` (24px) | — |
| Card (compact) | `p-4` (16px) | — |
| Table cell | `px-4 py-3` | — |
| Table cell (compact) | `px-3 py-2` | — |
| Form field group | `space-y-4` | — |
| KPI card grid | — | `gap-4` |
| Sidebar nav items | `px-3 py-2` | `space-y-1` |
| Button (default) | `px-4 py-2` | — |
| Button (large) | `px-6 py-3` | — |

## 2.4 Border Radius

```
--radius-sm:   4px    /* Badges, tags */
--radius-md:   8px    /* Buttons, inputs, table cells */
--radius-lg:   12px   /* Cards, dropdowns */
--radius-xl:   16px   /* Modals, panels */
--radius-2xl:  24px   /* Large cards, AI insight blocks */
--radius-full: 9999px /* Pills, avatars, toggle */
```

## 2.5 Elevation & Shadow

```
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05)                           /* Subtle */
--shadow-md:  0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)  /* Cards */
--shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04) /* Dropdowns */
--shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.05) /* Modals */
--shadow-focus: 0 0 0 3px rgba(99, 102, 241, 0.3)                  /* Focus ring */
```

## 2.6 Iconography

**Icon Library: `Lucide React`** — Lightweight, consistent stroke width (1.5px), hỗ trợ tốt với Tailwind.

```typescript
// Cài đặt
npm install lucide-react

// Sử dụng
import { ShoppingCart, Package, TrendingUp, AlertTriangle } from 'lucide-react'
```

**Icon Size Convention:**
```
icon-xs: 14px  (w-3.5 h-3.5) — Inline với text caption
icon-sm: 16px  (w-4 h-4)     — Default inline icons, table cells
icon-md: 20px  (w-5 h-5)     — Sidebar nav, button icons
icon-lg: 24px  (w-6 h-6)     — Section headers, standalone
icon-xl: 32px  (w-8 h-8)     — Feature icons, empty states
icon-2xl: 48px (w-12 h-12)   — Hero empty states
```

**Icon Mapping — ShopHub Context:**
```
đơn hàng:          ShoppingBag
kho/tồn kho:       Package, Boxes
doanh thu:         TrendingUp, DollarSign
review/CSKH:       MessageSquare, Star
cảnh báo:          AlertTriangle, AlertCircle
AI/dự báo:         Sparkles, BrainCircuit
Shopee:            [custom SVG]
TikTok:            [custom SVG]
đồng bộ:           RefreshCw
xuất báo cáo:      Download, FileDown
bộ lọc:            Filter, SlidersHorizontal
tìm kiếm:          Search
cài đặt:           Settings, Cog
người dùng:        User, Users
thời gian:         Clock, Calendar
```

---

# Chương 3: UI Component Library

Áp dụng **Atomic Design** — Atoms → Molecules → Organisms → Templates.

## 3.1 Atoms (Nguyên tử — thành phần cơ bản nhất)

### A01 — Badge (Trạng thái)

Badge được dùng xuyên suốt hệ thống để hiển thị trạng thái đơn hàng, tồn kho, AI confidence.

**Anatomy:** `[dot/icon?] [label text]`

**Variants:**
```tsx
// Tailwind classes pattern
const badgeVariants = {
  success:  'bg-success-100 text-success-700 border border-success-200',
  warning:  'bg-warning-100 text-warning-700 border border-warning-200',
  danger:   'bg-danger-100 text-danger-700 border border-danger-200',
  info:     'bg-info-100 text-info-700 border border-info-200',
  neutral:  'bg-secondary-100 text-secondary-600 border border-secondary-200',
  primary:  'bg-primary-100 text-primary-700 border border-primary-200',
  shopee:   'bg-[#FFF0ED] text-[#EE4D2D] border border-[#FECEC4]',
  tiktok:   'bg-[#FFF0F3] text-[#FE2C55] border border-[#FFCCD6]',
}

// Base class
const badgeBase = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium'
```

**Trạng thái đơn hàng mapping:**
```
"Chờ xác nhận"  → badge info     + icon Clock
"Đang giao"     → badge primary  + icon Truck
"Đã giao"       → badge success  + icon CheckCircle
"Đã huỷ"        → badge neutral  + icon XCircle
"Hoàn hàng"     → badge warning  + icon RotateCcw
"Cần xử lý"     → badge danger   + icon AlertTriangle
```

### A02 — Button

```tsx
// Size variants
const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-md',   // Default
  lg: 'px-6 py-3 text-base rounded-lg',
}

// Style variants
const buttonVariants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
  outline:   'border border-secondary-300 text-secondary-700 hover:bg-secondary-50',
  danger:    'bg-danger-600 text-white hover:bg-danger-700',
  ghost:     'text-secondary-600 hover:bg-secondary-100',
  cta:       'bg-accent-500 text-white hover:bg-accent-600',  // Cho CTA chính
}

// States
const buttonStates = {
  loading:  'opacity-70 cursor-not-allowed',
  disabled: 'opacity-40 cursor-not-allowed pointer-events-none',
}
```

### A03 — Input & Form Controls

```tsx
// Text Input
const inputBase = `
  w-full px-3 py-2 text-sm rounded-md
  border border-secondary-300 bg-white
  text-secondary-800 placeholder:text-secondary-400
  focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
  disabled:bg-secondary-50 disabled:text-secondary-400
  transition-colors duration-150
`

// Select
const selectBase = `${inputBase} pr-8 appearance-none cursor-pointer`

// Checkbox / Radio — không override mặc định, dùng accent-color
const checkboxBase = `w-4 h-4 rounded accent-primary-600 cursor-pointer`

// Form Label
const labelBase = `block text-sm font-medium text-secondary-700 mb-1.5`

// Helper text / Error
const helperBase = `text-xs text-secondary-500 mt-1`
const errorBase  = `text-xs text-danger-600 mt-1`
```

### A04 — Avatar

```tsx
const avatarSizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',   // Default
  lg: 'w-12 h-12 text-base',
}
const avatarBase = 'rounded-full flex items-center justify-center font-semibold bg-primary-100 text-primary-700'
```

### A05 — Spinner / Loading

```tsx
const spinnerBase = 'animate-spin rounded-full border-2 border-secondary-200 border-t-primary-600'
const spinnerSizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
```

### A06 — Tooltip

```tsx
// Dùng thư viện @radix-ui/react-tooltip hoặc Floating UI
// Convention: tooltip luôn xuất hiện ở top hoặc bottom, không che nội dung
```

### A07 — Trend Indicator (Tăng/Giảm)

Atom đặc thù của ShopHub — hiển thị % thay đổi so với kỳ trước.

```tsx
// pattern: [arrow icon] [percentage] [vs period text]
const trendPositive = 'inline-flex items-center gap-0.5 text-success-600 text-xs font-medium'
const trendNegative = 'inline-flex items-center gap-0.5 text-danger-600 text-xs font-medium'
const trendNeutral  = 'inline-flex items-center gap-0.5 text-secondary-500 text-xs font-medium'

// Note: Cho một số metric như "tỷ lệ hoàn", giảm = tốt → dùng trendPositive khi giảm
```

---

## 3.2 Molecules (Phân tử — kết hợp atoms)

### M01 — KPI Card

**Đây là component trung tâm của Dashboard.** Hiển thị một chỉ số kinh doanh quan trọng.

**Anatomy:**
```
┌─────────────────────────────────┐
│ [icon]  Tiêu đề chỉ số          │  ← Header: icon (20px) + label text-overline
│                                 │
│  1,247,500 ₫                    │  ← Số chính: text-numeric-lg + font-mono
│                                 │
│  ↑ +12.3%  so với hôm qua       │  ← Trend indicator + period text
│                                 │
│  ─────────────────────────      │  ← (optional) sparkline mini chart
│  Shopee: 847,500 | TikTok: 400k │  ← (optional) breakdown by platform
└─────────────────────────────────┘
```

**Tailwind Structure:**
```tsx
// Naming: kpi-card + modifier
const kpiCard = `
  bg-white rounded-xl p-6 shadow-md
  border border-secondary-200
  hover:shadow-lg transition-shadow duration-200
  relative overflow-hidden
`
const kpiCard__header = `flex items-center justify-between mb-3`
const kpiCard__icon   = `w-10 h-10 rounded-lg flex items-center justify-center bg-primary-50`
const kpiCard__label  = `text-[11px] font-semibold uppercase tracking-wider text-secondary-500`
const kpiCard__value  = `text-3xl font-bold font-mono tabular-nums text-secondary-900 mt-1`
const kpiCard__trend  = `flex items-center gap-1 mt-2`
const kpiCard__breakdown = `
  mt-4 pt-3 border-t border-secondary-100
  flex items-center justify-between
  text-xs text-secondary-500
`
```

**4 KPI Cards chính của Dashboard:**
```
1. Doanh thu hôm nay      — icon: DollarSign  — color: primary
2. Tổng đơn hàng          — icon: ShoppingBag — color: info
3. Đơn cần xử lý          — icon: AlertCircle — color: warning (luôn highlight nếu > 0)
4. Tỷ lệ hoàn/huỷ (%)     — icon: RotateCcw   — color: danger nếu > threshold
```

**State variants:**
```tsx
// Alert state — KPI vượt ngưỡng nguy hiểm
const kpiCard__alert = `border-danger-300 bg-danger-50/50`

// Loading skeleton
const kpiCard__skeleton = `animate-pulse bg-secondary-100`
```

### M02 — Data Table Row

```tsx
// Table container
const tableWrapper = `w-full overflow-x-auto rounded-xl border border-secondary-200 shadow-sm`

// Table base
const table        = `w-full text-sm border-collapse`
const thead        = `bg-secondary-50 border-b border-secondary-200`
const th           = `
  px-4 py-3 text-left
  text-[11px] font-semibold uppercase tracking-wider text-secondary-500
  whitespace-nowrap select-none
  first:rounded-tl-xl last:rounded-tr-xl
`
const tbody        = `divide-y divide-secondary-100`
const tr           = `
  hover:bg-secondary-50 transition-colors duration-100 cursor-pointer
  [&.selected]:bg-primary-50 [&.selected]:border-l-2 [&.selected]:border-l-primary-500
`
// ⚠️ JS-controlled pattern: [&.selected] và [&.active] là Tailwind arbitrary variants —
// chúng chỉ hoạt động khi class "selected"/"active" được thêm vào element bằng JavaScript.
// Ví dụ: element.classList.add('selected') hoặc trong React: className={cn(tr, isSelected && 'selected')}
// Không phải CSS-only — cần có logic toggle trong component.
const td           = `px-4 py-3 text-secondary-700 whitespace-nowrap`
const td__numeric  = `px-4 py-3 font-mono tabular-nums text-right`
const td__action   = `px-4 py-3 text-right`

// Row states — áp dụng trực tiếp thay thế cho tr khi row có trạng thái đặc biệt
const tr__urgent   = `bg-warning-50/50 border-l-2 border-l-warning-500`
const tr__overdue  = `bg-danger-50/50 border-l-2 border-l-danger-500`
```

**Cột chuẩn cho bảng đơn hàng:**
```
# | Mã đơn | Sàn | Sản phẩm | Khách hàng | Tổng tiền | Trạng thái | Thời gian | Hành động
```

**Cột chuẩn cho bảng tồn kho:**
```
# | SKU | Tên SP | Phân loại | Tồn hiện tại | Đã đặt | Khả dụng | Dự báo 7d | Trạng thái | Hành động
```

### M03 — Platform Selector Tabs

```tsx
// Tab bar chọn sàn — xuất hiện ở nhiều màn hình
const platformTabs = `flex items-center gap-1 p-1 bg-secondary-100 rounded-lg`
const platformTab  = `
  flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
  text-secondary-600 hover:text-secondary-800 hover:bg-white transition-all
`
const platformTab__active = `bg-white shadow-sm text-secondary-900`

// Với platform badges riêng:
// [Tất cả (1,247)] [Shopee (847)] [TikTok (400)]
```

### M04 — Search & Filter Bar

```tsx
const filterBar = `flex items-center gap-3 p-4 bg-white border-b border-secondary-200`
const searchInput = `
  flex-1 max-w-xs
  flex items-center gap-2 px-3 py-2
  bg-secondary-50 border border-secondary-200 rounded-lg
  text-sm text-secondary-600
`
const filterGroup = `flex items-center gap-2`
const filterChip  = `
  flex items-center gap-1.5 px-3 py-1.5 rounded-full
  text-sm font-medium border cursor-pointer transition-all
  border-secondary-300 text-secondary-600 hover:border-primary-400 hover:text-primary-600
  [&.active]:bg-primary-50 [&.active]:border-primary-400 [&.active]:text-primary-700
`
```

### M05 — Notification / Alert Banner

```tsx
const alertBanner = {
  success: `flex items-start gap-3 p-4 rounded-lg bg-success-50 border border-success-200 text-success-800`,
  warning: `flex items-start gap-3 p-4 rounded-lg bg-warning-50 border border-warning-200 text-warning-800`,
  danger:  `flex items-start gap-3 p-4 rounded-lg bg-danger-50  border border-danger-200  text-danger-800`,
  info:    `flex items-start gap-3 p-4 rounded-lg bg-info-50    border border-info-200    text-info-800`,
}
```

### M06 — Pagination

```tsx
const pagination = `flex items-center justify-between px-4 py-3 border-t border-secondary-200`
const paginationInfo = `text-sm text-secondary-600`  // "Hiển thị 1-20 trong 347 đơn"
const paginationControls = `flex items-center gap-1`
const paginationBtn = `
  w-8 h-8 flex items-center justify-center rounded-md text-sm
  text-secondary-600 hover:bg-secondary-100 transition-colors
  [&.active]:bg-primary-600 [&.active]:text-white
  disabled:opacity-40 disabled:cursor-not-allowed
`
```

---

## 3.3 Organisms (Tổ chức — components phức tạp)

### O01 — AI Insight Block

**Component đặc thù nhất của ShopHub.** Hiển thị kết quả từ AI/ML models.

**Anatomy:**
```
┌──────────────────────────────────────────────┐
│ ✨ AI  Dự báo Tồn kho                [i]    │  ← Header: AI badge + title + info
│ Cập nhật: 2 giờ trước · Model: LSTM v2.1     │  ← Meta: timestamp + model name
├──────────────────────────────────────────────┤
│                                              │
│  Áo thun basic trắng L                       │  ← Product name
│  ┌───────────────────────────┐               │
│  │ Còn: 23 units             │ Dự báo:       │
│  │ ████████████░░░ 67%       │ Hết hàng      │
│  └───────────────────────────┘ trong 5 ngày  │
│                                              │
│  🎯 Độ tin cậy: 87%          ⚠️ Cần nhập    │  ← Confidence + CTA
│                                              │
│  [Xem chi tiết]  [Đặt hàng ngay]            │  ← Actions
└──────────────────────────────────────────────┘
```

**Tailwind Structure:**
```tsx
const aiBlock = `
  bg-white rounded-2xl border border-primary-200
  shadow-md overflow-hidden
`
const aiBlock__header = `
  flex items-center justify-between
  px-6 py-4 bg-gradient-to-r from-primary-50 to-violet-50
  border-b border-primary-100
`
const aiBlock__badge = `
  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
  bg-primary-100 text-primary-700 text-xs font-semibold
`
// Bắt buộc có icon Sparkles trước chữ "AI"
const aiBlock__meta = `
  px-6 py-2 bg-secondary-50 border-b border-secondary-100
  text-xs text-secondary-500 flex items-center gap-3
`
const aiBlock__body    = `px-6 py-5`
const aiBlock__confidence = `
  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
  bg-success-50 border border-success-200 text-success-700 text-xs font-medium
`
const aiBlock__footer = `
  px-6 py-4 bg-secondary-50 border-t border-secondary-100
  flex items-center justify-between
`
```

**3 loại AI Insight Block:**

**Type 1 — Inventory Forecast (Dự báo tồn kho):**
- Model: LSTM time-series
- Input: lịch sử bán + tồn kho hiện tại + seasonal factors
- Output: ngày dự báo hết hàng + số lượng cần nhập
- Confidence: 70–95%

**Type 2 — Review Sentiment (Phân tích cảm xúc):**
- Model: PhoBERT + custom fine-tune
- Input: text reviews từ Shopee/TikTok
- Output: Positive/Neutral/Negative % + key themes
- Confidence: 80–92%

**Type 3 — Price Recommendation (Gợi ý giá):**
- Model: Competitor price monitoring + demand elasticity
- Input: giá đối thủ + lịch sử chuyển đổi + margin target
- Output: khoảng giá tối ưu
- Confidence: 65–85%

### O02 — Dashboard Main Layout

```tsx
// ─── Page wrapper — bắt buộc phải có để offset sidebar fixed 240px ───
// Đây là element bao bọc toàn bộ content area, không phải chính grid
const pageWrapper = `
  ml-[240px]            /* offset = đúng bằng sidebar width */
  pt-16                 /* offset = đúng bằng topbar height (h-16) */
  min-h-screen
  bg-secondary-50
`

// ─── Content container bên trong pageWrapper ───
const contentContainer = `
  max-w-[1600px] mx-auto
  px-6 py-6
`

// ─── Dashboard grid (bên trong contentContainer) ───
// ⚠️ Đổi lg: → xl: để khớp với desktop breakpoint chính của ShopHub (1280px)
const dashboardGrid = `
  grid grid-cols-1 xl:grid-cols-4 gap-4
  xl:grid-rows-[auto_auto_1fr]
`

// Row 1: KPI Cards
const kpiRow = `xl:col-span-4 grid grid-cols-2 xl:grid-cols-4 gap-4`

// Row 2: Charts
const chartsRow = `xl:col-span-4 grid grid-cols-1 xl:grid-cols-5 gap-4`
const chartMain = `xl:col-span-3`    // 60% — Revenue trend line chart
const chartSide = `xl:col-span-2`    // 40% — Donut / breakdown

// Row 3: Tables + AI Insights
const contentRow   = `xl:col-span-4 grid grid-cols-1 xl:grid-cols-3 gap-4`
const tableSection = `xl:col-span-2`
const aiSection    = `xl:col-span-1`
```

**HTML structure mẫu (app/(dashboard)/layout.tsx):**
```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Sidebar />   {/* fixed left-0, w-[240px], z-40 */}
      <Topbar />    {/* fixed top-0 left-[240px] right-0, h-16, z-30 */}
      <main className="ml-[240px] pt-16 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### O03 — Sidebar Navigation

```tsx
const sidebar = `
  fixed left-0 top-0 h-full w-[240px]
  bg-secondary-900 text-white
  flex flex-col
  z-40
`
const sidebar__logo = `flex items-center gap-3 px-6 py-5 border-b border-secondary-700/50`
const sidebar__nav  = `flex-1 px-3 py-4 space-y-1 overflow-y-auto`
const sidebar__item = `
  flex items-center gap-3 px-3 py-2.5 rounded-lg
  text-secondary-400 hover:text-white hover:bg-secondary-700/50
  text-sm font-medium transition-all duration-150 cursor-pointer
  [&.active]:bg-primary-600 [&.active]:text-white [&.active]:shadow-sm
`
const sidebar__section = `
  px-3 pt-4 pb-1
  text-[10px] font-bold uppercase tracking-widest text-secondary-500
`
const sidebar__footer = `
  px-3 py-4 border-t border-secondary-700/50
  flex items-center gap-3
`
const sidebar__badge = `
  ml-auto min-w-[20px] h-5 px-1.5
  flex items-center justify-center
  bg-danger-500 text-white text-[10px] font-bold rounded-full
`
```

### O04 — Top Header Bar

```tsx
const topbar = `
  fixed top-0 left-[240px] right-0 h-16
  bg-white border-b border-secondary-200
  flex items-center justify-between px-6
  z-30 shadow-sm
`
const topbar__title    = `text-lg font-semibold text-secondary-900`
const topbar__breadcrumb = `text-sm text-secondary-500`
const topbar__actions  = `flex items-center gap-3`
const topbar__notifBtn = `
  relative w-9 h-9 flex items-center justify-center
  rounded-lg hover:bg-secondary-100 text-secondary-600
  transition-colors cursor-pointer
`
```

### O05 — Order Detail Panel (Slide-over)

```tsx
const slideOver = `
  fixed right-0 top-0 h-full w-[480px]
  bg-white shadow-xl z-50
  flex flex-col
  transform transition-transform duration-300
  translate-x-full [&.open]:translate-x-0
`
const slideOver__header = `
  flex items-center justify-between
  px-6 py-4 border-b border-secondary-200
`
const slideOver__body = `flex-1 overflow-y-auto px-6 py-4`
const slideOver__footer = `
  px-6 py-4 border-t border-secondary-200
  flex items-center justify-end gap-3
`
```

### O06 — Empty State

```tsx
const emptyState = `
  flex flex-col items-center justify-center
  py-16 px-8 text-center
`
const emptyState__icon = `
  w-16 h-16 mb-4
  text-secondary-300
`
const emptyState__title = `text-lg font-semibold text-secondary-700 mb-2`
const emptyState__desc  = `text-sm text-secondary-500 max-w-sm mb-6`
```

---

# Chương 4: UI Architecture & Tailwind Configuration


```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx           ← Main dashboard layout (sidebar + topbar)
│   │   ├── page.tsx             ← Dashboard overview
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── inventory/
│   │   ├── revenue/
│   │   ├── products/
│   │   ├── crm/
│   │   └── settings/
│   └── globals.css
├── components/
│   ├── ui/                      ← Atoms & Molecules (shadcn/ui base)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── data-table.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── features/                ← Organisms (domain-specific)
│   │   ├── dashboard/
│   │   │   ├── kpi-card.tsx
│   │   │   ├── revenue-chart.tsx
│   │   │   └── ai-insight-block.tsx
│   │   ├── orders/
│   │   │   ├── order-table.tsx
│   │   │   └── order-detail-panel.tsx
│   │   ├── inventory/
│   │   │   ├── sku-table.tsx
│   │   │   └── inventory-forecast-block.tsx
│   │   └── crm/
│   │       ├── sentiment-chart.tsx
│   │       └── review-inbox.tsx
│   └── layout/                  ← Layout organisms
│       ├── sidebar.tsx
│       ├── topbar.tsx
│       └── page-header.tsx
├── lib/
│   ├── utils.ts                 ← cn() helper (clsx + tailwind-merge)
│   └── constants.ts             ← Design tokens as JS constants
├── types/
│   ├── order.ts
│   ├── inventory.ts
│   └── analytics.ts
└── styles/
    └── design-tokens.css        ← CSS custom properties
```



```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        accent: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        // Semantic
        success: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        danger: {
          50:  '#FFF1F2',
          100: '#FFE4E6',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',   // ← Thêm: dùng cho text-info-700 trong badge variants
        },
        // Neutral — dùng cho badge "neutral" (trạng thái đã huỷ cũ, disabled)
        neutral: {
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
        },
      },
      fontSize: {
        // Custom type scale — tránh phụ thuộc vào Tailwind default sizes không khớp
        'heading-1':  ['1.75rem',     { lineHeight: '1.3', fontWeight: '700' }],
        'heading-2':  ['1.375rem',    { lineHeight: '1.4', fontWeight: '600' }],
        'numeric-lg': ['2rem',        { lineHeight: '1.2', fontWeight: '700' }],
        'overline':   ['0.6875rem',   { lineHeight: '1.4', fontWeight: '600' }],
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'focus':      '0 0 0 2px rgba(99, 102, 241, 0.20)',  // WCAG focus ring: 2px, 20% opacity
        'focus-dark': '0 0 0 2px rgba(129, 140, 248, 0.30)', // Dark mode focus ring
        'card':       '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
        'card-hover': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      spacing: {
        '18':  '4.5rem',
        '22':  '5.5rem',
        '72':  '18rem',
        '84':  '21rem',
        '96':  '24rem',
        '240': '60rem',   // sidebar width alias: w-[240px] → w-240 (optional)
      },
      animation: {
        'pulse-fast':     'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in':        'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class',   // Toggle dark mode bằng class 'dark' trên <html> element
  plugins: [
    require('@tailwindcss/forms'),
    // ⚠️ @tailwindcss/line-clamp đã được tích hợp native vào Tailwind CSS v3.3+
    // Chỉ thêm plugin này nếu đang dùng Tailwind < v3.3:
    // require('@tailwindcss/line-clamp'),
    require('tailwindcss-animate'),
  ],
}

export default config
```

## 4.3 Naming Convention

### Atomic Design Layer Prefix
```
a-[name]    → Atom         (a-badge, a-button, a-input)
m-[name]    → Molecule     (m-kpi-card, m-data-table-row, m-filter-bar)
o-[name]    → Organism     (o-dashboard-layout, o-sidebar, o-ai-insight-block)
t-[name]    → Template     (t-dashboard, t-orders, t-inventory)
```

### BEM-style cho Tailwind Class Comments
```tsx
// KHÔNG dùng BEM làm classname trong Tailwind (conflicts với utility classes)
// DÙNG BEM làm comment để tổ chức code:

// kpi-card
const kpiCard = `...`
// kpi-card__header
const kpiCardHeader = `...`
// kpi-card__value
const kpiCardValue = `...`
// kpi-card--alert (modifier)
const kpiCardAlert = `...`
```

### Component File Naming
```
PascalCase cho component files:    KpiCard.tsx, AiInsightBlock.tsx
kebab-case cho utility/hook files: use-order-sync.ts, format-currency.ts
SCREAMING_SNAKE cho constants:     ORDER_STATUS, PLATFORM_COLORS
```

### CSS Custom Properties Pattern
```css
/* Trong design-tokens.css */
:root {
  /* Pattern: --[category]-[property]-[variant] */
  --color-primary-500: #6366F1;
  --font-size-numeric-lg: 2rem;
  --spacing-card: 1.5rem;
  --radius-card: 12px;
}
```

## 4.4 Utility Functions

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency VND
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format large numbers (1,247,500 → 1.2M)
export function formatCompact(num: number): string {
  return new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num)
}

// Get trend class
export function getTrendClass(value: number, inversePositive = false): string {
  const isPositive = inversePositive ? value < 0 : value > 0
  if (value === 0) return 'text-secondary-500'
  return isPositive ? 'text-success-600' : 'text-danger-600'
}

// Order status config
export const ORDER_STATUS_CONFIG = {
  pending:    { label: 'Chờ xác nhận', variant: 'info',    icon: 'Clock' },
  shipping:   { label: 'Đang giao',    variant: 'primary', icon: 'Truck' },
  delivered:  { label: 'Đã giao',      variant: 'success', icon: 'CheckCircle' },
  cancelled:  { label: 'Đã huỷ',       variant: 'neutral', icon: 'XCircle' },
  returning:  { label: 'Hoàn hàng',    variant: 'warning', icon: 'RotateCcw' },
  urgent:     { label: 'Cần xử lý',    variant: 'danger',  icon: 'AlertTriangle' },
} as const
```

## 4.5 Performance Guidelines

- **Code splitting:** Mỗi route là một dynamic import. AI Insight Block lazy load riêng.
- **Image:** Dùng `next/image` cho tất cả ảnh sản phẩm. WebP format.
- **Table virtualization:** Bảng > 100 rows dùng `@tanstack/react-virtual`.
- **Chart:** Dùng `recharts` cho dashboard charts. Lazy import.
- **Font loading:** `next/font/google` với `display: 'swap'`.
- **Tailwind purge:** Chỉ giữ classes được dùng. Không dùng dynamic class strings.

---

## Phụ lục A — Design Token Reference Card

```css
/* Paste đoạn này vào globals.css */
:root {
  /* ── Light Mode Colors ── */
  --color-primary:  #6366F1;
  --color-accent:   #F97316;
  --color-success:  #22C55E;
  --color-warning:  #F59E0B;
  --color-danger:   #EF4444;
  --color-info:     #3B82F6;

  /* Surfaces */
  --color-bg:       #F8FAFC;
  --color-sidebar:  #0F172A;   /* sidebar không đổi ở cả 2 mode */
  --color-card:     #FFFFFF;
  --color-border:   #E2E8F0;
  --color-text:     #1E293B;
  --color-muted:    #64748B;

  /* Platform */
  --color-shopee:   #EE4D2D;
  --color-tiktok:   #010101;

  /* ── Interaction States ── */
  --focus-ring: 0 0 0 2px rgba(99, 102, 241, 0.20);   /* WCAG: 2px, indigo-500, 20% */
  --focus-ring-offset: 2px;

  /* ── Typography ── */
  --font-sans: 'Be Vietnam Pro', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* ── Spacing ── */
  --space-card: 1.5rem;
  --space-section: 2rem;

  /* ── Radius ── */
  --radius-card: 12px;
  --radius-btn:  8px;
  --radius-badge: 9999px;

  /* ── Shadow ── */
  --shadow-card:  0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05);
  --shadow-focus: 0 0 0 2px rgba(99,102,241,0.20);   /* 2px, 20% opacity — WCAG AA */
}

/* ── Dark Mode — class toggled via JS on <html> ── */
.dark {
  --color-bg:      #0F172A;   /* slate-900 */
  --color-card:    #1E293B;   /* slate-800 */
  --color-border:  #334155;   /* slate-700 */
  --color-text:    #F1F5F9;   /* slate-100 */
  --color-muted:   #94A3B8;   /* slate-400 */

  /* Semantic — lighter variants for dark surfaces */
  --color-success: #4ADE80;   /* green-400 */
  --color-warning: #FCD34D;   /* amber-300 */
  --color-danger:  #F87171;   /* red-400 */
  --color-info:    #60A5FA;   /* blue-400 */

  /* Primary — brighter for dark bg */
  --color-primary: #818CF8;   /* indigo-400 */

  /* Focus ring — stronger opacity for dark */
  --shadow-focus: 0 0 0 2px rgba(129, 140, 248, 0.30);
}
```

## Phụ lục B — Quick Reference: Trạng thái đơn hàng

| Trạng thái | Badge Variant | Icon | Color |
|---|---|---|---|
| Chờ xác nhận | info | Clock | #3B82F6 |
| Đã xác nhận | primary | CheckCircle | #6366F1 |
| Đang đóng gói | primary | Package | #6366F1 |
| Đang giao | primary | Truck | #6366F1 |
| Đã giao | success | CheckCircle2 | #22C55E |
| Đã huỷ | neutral | XCircle | #6B7280 |
| Đang hoàn | warning | RotateCcw | #F59E0B |
| Đã hoàn | warning | PackageCheck | #F59E0B |
| **Cần xử lý ngay** | **danger** | **AlertTriangle** | **#EF4444** |

---

*Tài liệu này được duy trì và cập nhật theo từng sprint. Mọi thay đổi design token phải được phản ánh đồng thời trong: tài liệu này → `tailwind.config.ts` → `globals.css` (`:root` + `.dark`) → Stitch Project Settings.*

**Version History:**
- v1.0 (03/2026): Initial release — full Design System + 5 Stitch prompt templates
- v1.1 (03/2026): Patch — sửa breakpoint lg→xl, fix info-700/neutral tokens, line-clamp note, [&.selected] annotation, sidebar ml-offset, focus ring spec, type scale arbitrary values
- v1.2 (03/2026): Feature — thêm Dark Mode tokens (mục 2.1.4), Interaction States (mục 2.1.5), Component-First Prompting strategy (mục 5.5), Dark Mode Prompting guide (mục 5.6), renumber 5.5→5.7→5.8→5.9, cập nhật Phụ lục A+C
