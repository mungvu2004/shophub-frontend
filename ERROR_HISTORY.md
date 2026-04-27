# Lịch sử lỗi và bài học kinh nghiệm

## [2026-04-26] Lỗi ReferenceError, Vi phạm Rule of Hooks và Syntax Error làm sập hệ thống (TRANG DANH MỤC SẢN PHẨM)

### 1. Lỗi: Uncaught ReferenceError: onSaveProduct is not defined
- **Triệu chứng**: Trang web bị trắng xóa (White Screen of Death).
- **Nguyên nhân**: Tôi đã thêm `onSaveProduct` vào danh sách các hàm trả về của `useProductsPageLogic` nhưng lại quên định nghĩa nó bằng `const onSaveProduct = ...` bên trong hook.
- **Khắc phục**: Định nghĩa đầy đủ tất cả các hàm trước khi trả về chúng trong object ViewModel.
- **Bài học**: Phải kiểm tra sự tồn tại của mọi định danh (identifier) được trả về. `tsc` đôi khi không bắt được lỗi này nếu object literal được khai báo nhưng biến bên trong nó bị thiếu (ReferenceError at runtime).

### 2. Lỗi: React has detected a change in the order of Hooks
- **Nguyên nhân**: Hệ thống crash do ReferenceError dẫn đến việc render bị ngắt quãng. Khi HMR (Hot Module Replacement) cố gắng cập nhật, thứ tự hook bị lệch.
- **Khắc phục**: Khôi phục luồng render ổn định bằng cách sửa lỗi ReferenceError đầu tiên.
- **Bài học**: Luôn đảm bảo code không có lỗi runtime cơ bản trước khi tin tưởng vào HMR.

### 3. Lỗi: Vite 500 Internal Server Error (Unexpected token)
- **Nguyên nhân**: Có ký tự lạ hoặc thẻ đóng Component bị sai cú pháp trong `ProductsListView.tsx` khi sử dụng `replace`.
- **Khắc phục**: Rà soát lại toàn bộ cú pháp JSX và dùng `write_file` để đảm bảo file sạch sẽ hoàn toàn.

---

## [2026-04-26] Khắc phục 50 lỗi TypeScript trong quá trình Build hệ thống

### 1. Lỗi: Thiếu export/import và sai đường dẫn Type
- **Triệu chứng**: `tsc` báo lỗi `no exported member`, `Cannot find name`, `Cannot find module`.
- **Nguyên nhân**: Quên export helper function (`buildTopProductsCsv`), quên import type (`ComparisonPeriod`), hoặc sai đường dẫn tương đối khi chuyển component vào thư mục con.
- **Khắc phục**: Thêm các export thiếu, cập nhật import path chính xác (`../../logic/...`), và đồng bộ hóa type định nghĩa giữa các file.

### 2. Lỗi: Sai lệch kiểu dữ liệu giữa Mock Data và Interface
- **Triệu chứng**: `Property 'X' is missing in type`, `metrics does not exist in type`.
- **Nguyên nhân**: Mock data chứa các thuộc tính cũ hoặc thừa so với Interface định nghĩa cho ViewModel. Ngược lại, một số ViewModel thiếu các thuộc tính cần thiết cho UI.
- **Khắc phục**: Cập nhật Interface (ví dụ: thêm `aiInsightText` vào `OrdersReturnsViewModel`) và dọn dẹp Mock data để khớp hoàn toàn với Type hệ thống.

### 3. Lỗi: Biến không sử dụng (Unused Variables)
- **Triệu chứng**: `is declared but its value is never read`.
- **Nguyên nhân**: Để lại các biến rác sau khi refactor hoặc copy-paste code.
- **Khắc phục**: Xóa các import và khai báo không dùng đến. Với các tham số callback bắt buộc của thư viện nhưng không dùng, sử dụng tiền tố `_` (ví dụ: `_query`).

---

## [2026-04-26] Lỗi thiết kế AI Slop và Thiếu Accessibility trong trang Dự báo ML

### 1. Lỗi: Giao diện bị nhiễu thị giác (Visual Noise) và lạm dụng ngôn ngữ AI
- **Nguyên nhân**: Sử dụng quá nhiều hiệu ứng blur, shadow và tiêu đề phóng đại ("Simulation Lab Cockpit", "AI Strategic Deck").
- **Khắc phục**: Loại bỏ blur nền, đơn giản hóa UX writing sang tiếng Việt chuyên môn.
- **Bài học**: Ưu tiên sự rõ ràng của dữ liệu hơn các hiệu ứng thị giác hào ngoáng.

### 2. Lỗi: Thiếu hỗ trợ Accessibility và Hard-coded colors
- **Nguyên nhân**: Quên bổ sung ARIA labels cho slider/chart và gán mã hex trực tiếp cho biểu đồ.
- **Khắc phục**: Thêm `role="region"`, `aria-label` và chuyển mã hex sang palette màu hệ thống. 

---

## [2026-04-27] Lỗi MSW 'TypeError: Failed to fetch' và Kẹt giao diện (Sentiment Analysis)

### 1. Lỗi: TypeError: Failed to fetch tại mockServiceWorker.js
- **Triệu chứng**: Console log tràn ngập lỗi `Failed to fetch` từ Service Worker, đôi khi gây treo tab.
- **Nguyên nhân**: MSW cố gắng can thiệp (passthrough) vào các request nội bộ của Vite như HMR (`/@vite/client`, `hot-update.json`) hoặc static assets. Khi trình duyệt chặn các request này tại tầng Service Worker, nó ném lỗi `TypeError`.
- **Khắc phục**: Cập nhật `onUnhandledRequest` trong `worker.start` để chủ động trả về `'bypass'` cho tất cả các request hệ thống, HMR và static assets. Chỉ cho phép xử lý các request bắt đầu bằng `/api/`.
- **Bài học**: Luôn cấu hình phạm vi (scope) hẹp nhất có thể cho Mock Service Worker để tránh xung đột với tài nguyên hệ thống.

### 2. Lỗi: Hiện tượng giật lag và không chọn được sản phẩm (Sentiment Analysis)
- **Triệu chứng**: Bấm vào biểu đồ bị grayscale/khóa click (lag), chọn sản phẩm mới nhưng dữ liệu không đổi hoặc phản hồi rất chậm.
- **Nguyên nhân**: Sử dụng `useDeferredValue` cho `productId` gây trễ nhân tạo, kết hợp với hiệu ứng `pointer-events-none` và `grayscale` mỗi khi `isRefreshing=true` làm khóa toàn bộ UI trong thời gian fetch.
- **Khắc phục**: Loại bỏ `useDeferredValue` để fetch tức thì, gỡ bỏ `pointer-events-none` để cho phép tương tác liên tục khi đang refresh ngầm.
- **Bài học**: Không nên khóa tương tác người dùng (blocking UI) cho các tác vụ cập nhật dữ liệu thường xuyên trừ khi thực sự cần thiết.
