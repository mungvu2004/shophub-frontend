# ShopHub Knowledge Base - Kinh nghiệm sửa lỗi

Tài liệu này ghi lại các lỗi đã gặp và cách xử lý để tránh lặp lại.

## 2026-04-25

### 1. Lỗi thiếu thẻ đóng JSX (Tag Mismatch)
- **File:** `src/features/dashboard/components/dashboard-revenue-charts-page/parts/RevenueTrendCard.tsx`
- **Lỗi:** `[PARSE_ERROR] Error: Expected corresponding JSX closing tag for 'header'`.
- **Nguyên nhân:** Thẻ `<header>` được mở nhưng không có thẻ đóng `</header>` tương ứng.
- **Giải pháp:** Đảm bảo mọi thẻ mở đều có thẻ đóng đúng vị trí.

### 2. Lỗi thiếu câu lệnh `return` và cấu trúc Component sai
- **File:** `src/features/dashboard/components/dashboard-revenue-charts-page/parts/RevenueHeroSection.tsx`
- **Lỗi:** `[PARSE_ERROR] Error: Unexpected token`.
- **Nguyên nhân:** Thiếu từ khóa `return (` và đóng thẻ `<div>` không khớp.
- **Giải pháp:** Luôn kiểm tra `return (...)` và cặp thẻ đóng/mở.

### 3. Lỗi Kỹ thuật và Anti-patterns trên trang Dashboard Top Products
- **Vấn đề:** 
    - Thiếu các thuộc tính ARIA cho accessibility.
    - Lạm dụng mã màu hex cứng thay vì design tokens.
    - Thiếu tối ưu hiệu năng (useCallback, useMemo).
    - Dữ liệu hiển thị dư thừa.
- **Giải pháp:**
    - Bổ sung ARIA roles/labels.
    - Chuyển mã màu hex sang Tailwind classes.
    - Sử dụng `useCallback` cho handlers và `useMemo` cho calculations.
    - Làm sạch UI, loại bỏ dữ liệu lặp.
