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
