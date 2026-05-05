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

---

## [2026-05-04] Lỗi ESLint `react-hooks/set-state-in-effect` khi đồng bộ dữ liệu Form Dialog

### 1. Lỗi: Calling setState synchronously within an effect
- **Triệu chứng**: ESLint chặn build bước lint ở `KpiCrudFormDialog.tsx` với rule `react-hooks/set-state-in-effect`.
- **Nguyên nhân**: Dùng `useEffect` để gọi `setMetricId`, `setTitle`, `setStatus` mỗi khi mở dialog/chuyển mode Create/Edit.
- **Khắc phục**: Bỏ đồng bộ state bằng `useEffect`; chuyển sang khởi tạo state từ giá trị ban đầu và dùng `key` trên component dialog để remount form khi mode/item thay đổi.
- **Bài học**: Với form modal, ưu tiên cơ chế remount có kiểm soát (`key`) hoặc init state một lần thay vì setState hàng loạt trong effect.

---

## [2026-05-05] Lỗi MSW 'Failed to fetch' và TanStack Query 'data cannot be undefined'

### 1. Lỗi: TypeError: Failed to fetch và Query data cannot be undefined
- **Triệu chứng**: Console báo lỗi `Failed to fetch` từ Service Worker và TanStack Query báo lỗi data trả về bị `undefined` cho query key `["dashboard-revenue-events"]`.
- **Nguyên nhân**: 
    - Trong `dashboardRevenueChartsCrudService.ts`, các đường dẫn API bị viết dư tiền tố `/api/` (ví dụ: `/api/dashboard/...`). Do `apiClient` đã có `baseURL: '/api'`, yêu cầu thực tế trở thành `/api/api/dashboard/...`, không khớp với bất kỳ MSW handler nào.
    - Khi không khớp handler và bắt đầu bằng `/api/`, MSW thực hiện `passthrough()`. Vì không có backend thật, trình duyệt ném lỗi `Failed to fetch`.
    - Khi fetch thất bại, hàm `getEvents` không trả về dữ liệu hợp lệ, dẫn đến `useQuery` nhận giá trị `undefined`.
- **Khắc phục**: 
    - Loại bỏ tiền tố `/api/` trong `dashboardRevenueChartsCrudService.ts`.
    - Thêm một "Global Catch-all Handler" ở cuối file `src/mocks/handlers/index.ts` để bắt mọi request `/api/*` không có handler và trả về lỗi 404 thay vì để MSW passthrough gây crash fetch.
- **Bài học**: Luôn kiểm tra `baseURL` của HttpClient để tránh trùng lặp tiền tố. Sử dụng catch-all handler cho mock API để tăng tính ổn định của ứng dụng khi thiếu handler.

### 2. Lỗi: Cảnh báo lint `react-hooks/exhaustive-deps` gây nguy cơ vòng lặp render
- **Triệu chứng**: `npm run lint` báo lỗi tại `InventoryGridView.tsx` và `OrdersAllTable.tsx`.
- **Nguyên nhân**: Sử dụng các biến/hàm được định nghĩa lại mỗi lần render làm dependency cho `useMemo`.
- **Khắc phục**: 
    - Bọc các hàm xử lý trong `useCallback`.
    - Di chuyển logic tính toán dữ liệu trung gian vào bên trong `useMemo`.
- **Bài học**: Tuân thủ Rule 8 của dự án để đảm bảo ViewModel và Handlers luôn ổn định, tránh render không cần thiết hoặc vô hạn.

---
