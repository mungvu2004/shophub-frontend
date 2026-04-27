# Quy tắc hoạt động của Gemini CLI

Tài liệu này chứa các quy tắc nền tảng mà Gemini CLI phải tuân thủ tuyệt đối trong dự án này.

## 1. Ngôn ngữ giao tiếp
- Luôn trả lời và tương tác với người dùng bằng **tiếng Việt**.

## 2. Cấu trúc mã nguồn và tổ chức thư mục
Khi triển khai tính năng mới hoặc chỉnh sửa, phải tách biệt rõ ràng các lớp sau:
- **UI (Components):** Chỉ chứa logic hiển thị và giao diện.
- **Logic (Hooks/Services):** Chứa các hàm xử lý dữ liệu, tính toán và gọi API.
- **Mock Data:** Dữ liệu giả lập cho môi trường phát triển.
- **Handlers:** Các bộ xử lý sự kiện hoặc xử lý mock API (MSW).

## 3. Tư duy thiết kế Component
- Phải chia nhỏ một trang (page) thành các thành phần (components) nhỏ gọn, dễ tái sử dụng và dễ bảo trì. Không viết các file quá lớn.

## 4. Quản lý lỗi và bài học kinh nghiệm
- Mỗi khi gặp một lỗi hệ thống, lỗi logic hoặc lỗi cấu hình, phải ghi lại nguyên nhân và cách khắc phục vào file `ERROR_HISTORY.md`.
- Trước khi thực hiện nhiệm vụ mới, phải kiểm tra `ERROR_HISTORY.md` để đảm bảo không lặp lại các lỗi tương tự.

## 5. Quy trình làm việc
- Tuân thủ nghiêm ngặt quy trình: **Nghiên cứu -> Chiến lược -> Thực thi**.
- Luôn kiểm tra lại mã nguồn bằng các công cụ như `lint` hoặc `type-check` sau khi chỉnh sửa.

## 6. Kiểm tra và xác nhận hoàn thành
- Trước khi báo cáo hoàn thành bất kỳ tác vụ nào, phải chạy các lệnh kiểm tra hệ thống (như `npm run lint`, `tsc`, hoặc các lệnh chạy test liên quan) và bắt buộc phải chạy lệnh build (`npm run build`) để đảm bảo không còn lỗi cú pháp, lỗi kiểu (type) hoặc lỗi logic.
- Nếu quá trình build phát sinh lỗi, phải tiến hành fix lỗi triệt để trước khi báo cáo hoàn thành với người dùng. Chỉ khi tất cả các kiểm tra đều vượt qua mới được coi là hoàn thành nhiệm vụ.

## 7. Quản lý Mock Service Worker (MSW)
- **Cấm can thiệp tài nguyên hệ thống:** MSW không được phép bắt các request liên quan đến tài nguyên tĩnh của Vite (`/src/assets/*`), các file hệ thống (`/node_modules/*`), hoặc các request HMR (`/@vite/client`, `hot-update.json`).
- **Cấu hình `onUnhandledRequest`:** Luôn cấu hình `onUnhandledRequest` trong `worker.start` để chủ động bỏ qua các request không thuộc phạm vi API. Điều này ngăn chặn lỗi `TypeError: Failed to fetch` tại tầng Service Worker.
- **Phạm vi Handler:** Các handler trong `assets.handlers.ts` chỉ được dùng để giả lập các dịch vụ ảnh bên ngoài (như Unsplash, Placeholder), tuyệt đối không dùng regex quá rộng (ví dụ: `http.get(/https?:\/\/.*/, ...)`) gây xung đột với các request hệ thống hoặc browser extensions.

## 8. Phòng chống Vòng lặp Render (Infinite Loop)
- **Ổn định ViewModel:** Toàn bộ ViewModel trả về từ Hook xử lý logic (`logic/*.ts`) phải được bọc trong `useMemo`.
- **Ổn định Handler:** Tất cả các hàm xử lý sự kiện (handlers) truyền xuống component con phải được bọc trong `useCallback`.
- **Tách biệt Side-effects:** Tuyệt đối không gọi callback từ prop (như `onSelectionChange`) trực tiếp bên trong `useEffect` nếu callback đó là một phần của dependency array. Hãy gọi callback trực tiếp từ các hàm xử lý sự kiện của người dùng (như `onClick`, `onChange`) để đảm bảo luồng dữ liệu một chiều và ổn định.
