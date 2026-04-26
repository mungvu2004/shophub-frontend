# Lịch sử lỗi và bài học kinh nghiệm

## [2024-04-25] Lỗi compilation và MSW trên trang Nhập/Xuất kho

### 1. Lỗi: Identifier `Search` has already been declared
- **Nguyên nhân**: Khi dùng `replace`, tôi đã chèn thêm một khối code chứa các khai báo `import` và `type` đã tồn tại, dẫn đến việc khai báo trùng lặp.
- **Khắc phục**: Dọn dẹp lại file, xóa bỏ các phần trùng lặp, gộp chung các `import` từ cùng một thư viện.
- **Bài học**: Luôn kiểm tra toàn bộ nội dung file sau khi `replace` để đảm bảo không có code dư thừa.

### 2. Lỗi: ReferenceError: ArrowLeftRight / Search is not defined
- **Nguyên nhân**: Sử dụng icon từ `lucide-react` trong JSX nhưng quên không import ở đầu file.
- **Khắc phục**: Thêm các import thiếu vào `InventoryStockMovementsView.tsx`.
- **Bài học**: Kiểm tra kỹ danh sách icon được sử dụng trước khi lưu file.

### 3. Lỗi: MSW Failed to fetch
- **Nguyên nhân**: Thường do lỗi logic bên trong Handler hoặc dữ liệu trả về chứa tham chiếu vòng (circular reference). Trong trường hợp này, lỗi compilation (OxC) làm gián đoạn việc tải script, khiến trình duyệt báo lỗi fetch.
- **Khắc phục**: Sửa lỗi compilation và tối ưu hóa logic builder dữ liệu để tin tưởng hoàn toàn vào API.
- **Bài học**: Lỗi fetch trong MSW đôi khi chỉ là "triệu chứng" của lỗi compilation ở các file liên quan.

### 5. Lỗi lặp lại: ReferenceError (Missing Imports)
- **Triệu chứng**: Trình duyệt báo lỗi `X is not defined` và MSW báo `Failed to fetch`.
- **Nguyên nhân**: Khi dùng `replace` để cấu trúc lại các khối mã lớn, các dòng `import` ở đầu file bị vô tình xóa mất hoặc không được cập nhật đầy đủ.
- **Khắc phục**: Luôn kiểm tra danh sách các thành phần (Component, Icon, Hook) được sử dụng trong JSX và đảm bảo chúng có mặt trong phần Import.
### 6. Lỗi: In HTML, <button> cannot be a descendant of <button>
- **Nguyên nhân**: Sử dụng `DropdownMenuTrigger` (từ Base UI) với thuộc tính `asChild` và bọc một component `Button` (cũng render thẻ `button`) bên trong. Khác với Radix UI, Base UI `Trigger` mặc định render `button` và không thay thế nó khi dùng `asChild` một cách đơn giản, dẫn đến việc thẻ `button` bị lồng nhau.
- **Khắc phục**: Sử dụng thuộc tính `render` của Base UI: `<DropdownMenuTrigger render={<Button ... />} />`.
- **Bài học**: Phải nắm vững API của thư viện UI đang sử dụng. Với Base UI, ưu tiên dùng `render` prop để tùy chỉnh element trigger thay vì `asChild` nếu có component phức tạp bên trong.

### 7. Lỗi: Không hiển thị dữ liệu khi chọn bộ lọc "Tất cả"
- **Nguyên nhân**: Giá trị `"all"` từ state bộ lọc được gửi trực tiếp lên API/Mock. Mock Handler thực hiện so sánh chính xác (`item.warehouseId === "all"`), dẫn đến việc không có kết quả nào khớp (vì ID thực tế là `"wh-001"`, `"wh-002"`).
- **Khắc phục**: Chuyển đổi giá trị `"all"` thành `undefined` ở tầng Service hoặc xử lý ngoại lệ `"all"` trong Mock Handler.
- **Bài học**: Luôn kiểm tra cách tầng API/Mock xử lý các giá trị mặc định của bộ lọc. Giá trị `"all"` ở UI thường tương ứng với việc "không lọc" (không gửi tham số) ở phía Server.

## [2026-04-26] Lỗi giật lag và Failed to fetch trên trang Dự báo ML

### 1. Lỗi: Trang bị "load lại" và giật lag khi chuyển đổi 7/30/90 ngày
- **Triệu chứng**: Khi người dùng nhấn nút chọn khoảng thời gian, toàn bộ nội dung biến mất, hiện spinner rồi mới hiện lại biểu đồ kèm hiệu ứng fade-in.
- **Nguyên nhân**: 
    - Thiếu `placeholderData: keepPreviousData` trong hook `useRevenueMlForecast`. Khi query key thay đổi, TanStack Query xóa data cũ, làm `isLoading && !forecast` trở thành `true`.
    - Logic render trong component cha unmount toàn bộ nội dung chính để hiện spinner, làm mất trạng thái DOM và kích hoạt lại animation khi mount lại.
- **Khắc phục**: 
    - Thêm `placeholderData: keepPreviousData` vào `useQuery`.
    - Tách biệt `isInitialLoading` (chỉ true khi lần đầu tiên không có dữ liệu) để giữ UI cũ hiển thị trong khi tải dữ liệu mới ở background.
- **Bài học**: Luôn sử dụng chiến lược "giữ dữ liệu cũ" cho các biểu đồ hoặc trang dashboard khi thay đổi bộ lọc để tránh trải nghiệm người dùng bị ngắt quãng.

### 2. Lỗi: MSW Uncaught (in promise) TypeError: Failed to fetch (mockServiceWorker.js:238)
- **Triệu chứng**: Console báo lỗi fetch không mong muốn từ Service Worker.
- **Nguyên nhân**: Một số yêu cầu không khớp chính xác với Handler (do sai lệch tham số hoặc path) bị đẩy ra mạng thật (`passthrough`) và thất bại vì không có server thật.
- **Khắc phục**: 
    - Bổ sung Handler catch-all (`http.all('/api/revenue/*', ...)`) để bắt các yêu cầu không khớp và trả về 404 thay vì để nó thoát ra ngoài.
    - Thêm các kiểm tra phòng vệ (defensive checks) trong Handler để tránh crash logic (như check `baseline?.[0]`).
- **Bài học**: Khi sử dụng MSW, luôn có một handler catch-all cho mỗi prefix API để dễ dàng debug các request bị bỏ sót.

## [2024-04-26] Lỗi import Label và sai lệch kiểu dữ liệu trong ML Forecast

### 1. Lỗi: Failed to resolve import "@/components/ui/label"
- **Nguyên nhân**: Sử dụng component `Label` trong UI nhưng component này chưa tồn tại trong thư mục `src/components/ui`.
- **Khắc phục**: Tạo mới file `src/components/ui/label.tsx` với phong cách thiết kế nhất quán với hệ thống.
- **Bài học**: Khi sử dụng các component UI cơ bản (atoms), cần kiểm tra xem chúng đã được triển khai trong thư mục `ui/` hay chưa trước khi import.

### 2. Lỗi: Type mismatch in Recharts Tooltip formatter
- **Nguyên nhân**: Kiểu dữ liệu của tham số trong `formatter` của Recharts không khớp với mong đợi (nhận `number | string` nhưng khai báo `number`).
- **Khắc phục**: Ép kiểu hoặc xử lý linh hoạt tham số đầu vào bằng `Number(val)`.

### 3. Lỗi: Invalid variant for Badge component
- **Nguyên nhân**: Sử dụng variant `"destructive"` cho `Badge` trong khi hệ thống chỉ hỗ trợ `"danger"`.
- **Khắc phục**: Chỉnh sửa variant về đúng giá trị hợp lệ của hệ thống thiết kế.

## [2026-04-26] Lỗi thiết kế AI Slop và Thiếu Accessibility trong trang Dự báo ML

### 1. Lỗi: Giao diện bị nhiễu thị giác (Visual Noise) và lạm dụng ngôn ngữ AI
- **Nguyên nhân**: Sử dụng quá nhiều hiệu ứng blur, shadow và tiêu đề phóng đại ("Simulation Lab Cockpit", "AI Strategic Deck").
- **Khắc phục**: Loại bỏ blur nền, đơn giản hóa UX writing sang tiếng Việt chuyên môn (Ví dụ: "Giả lập kịch bản").
- **Bài học**: Ưu tiên sự rõ ràng của dữ liệu hơn các hiệu ứng thị giác hào nhoáng.

### 2. Lỗi: Thiếu hỗ trợ Accessibility và Hard-coded colors
- **Nguyên nhân**: Quên bổ sung ARIA labels cho slider/chart và gán mã hex trực tiếp cho biểu đồ.
- **Khắc phục**: Thêm `role="region"`, `aria-label` và chuyển mã hex sang palette màu hệ thống. Giảm thời gian animation biểu đồ để tăng tốc độ phản hồi.
- **Bài học**: Luôn kiểm tra Accessibility cho các thành phần custom và sử dụng design tokens.

