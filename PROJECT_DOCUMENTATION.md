# TÀI LIỆU TOÀN DIỆN HỆ THỐNG SHOPHUB FRONTEND
## PHIÊN BẢN: 1.0 | NGÀY CẬP NHẬT: 28-04-2026

---

## MỤC LỤC TỔNG QUAN

1. [PHẦN I: BỐI CẢNH VÀ TẦM NHÌN DỰ ÁN](#phần-i-bối-cảnh-và-tầm-nhìn-dự-án)
    - 1.1. Sự ra đời của ShopHub
    - 1.2. Bài toán thị trường Thương mại điện tử (TMĐT)
    - 1.3. Mục tiêu chiến lược của hệ thống
    - 1.4. Đối tượng người dùng mục tiêu
2. [PHẦN II: KIẾN TRÚC HỆ THỐNG VÀ CÔNG NGHỆ](#phần-ii-kiến-trúc-hệ-thống-và-công-nghệ)
    - 2.1. Lựa chọn Stack công nghệ (Tech Stack Selection)
    - 2.2. Kiến trúc Modular Feature-based
    - 2.3. Luồng dữ liệu và Quản lý trạng thái (Data Flow & State Management)
    - 2.4. Chiến lược xử lý bất đồng bộ với TanStack Query
3. [PHẦN III: QUY CHUẨN PHÁT TRIỂN (DEVELOPMENT STANDARDS)](#phần-iii-quy-chuẩn-phát-triển)
    - 3.1. Nguyên tắc tách biệt UI và Logic
    - 3.2. Hệ thống Mock Service Worker (MSW)
    - 3.3. Quy trình "Nghiên cứu -> Chiến lược -> Thực thi"
    - 3.4. Quản lý lỗi và ERROR_HISTORY.md
4. [PHẦN IV: CHI TIẾT CÁC MODULE CHỨC NĂNG](#phần-iv-chi-tiết-các-module-chức-năng)
    - 4.1. Module 0: Xác thực & Bảo mật (Auth)
    - 4.2. Module 1: Dashboard Analytics & Trực quan hóa
    - 4.3. Module 2: Quản lý Đơn hàng Đa sàn (Orders)
    - 4.4. Module 3: Kho hàng & Dự báo AI (Inventory)
    - 4.5. Module 4: Sản phẩm & Chiến lược giá (Products)
    - 4.6. Module 5: Doanh thu & Kịch bản tài chính (Revenue)
    - 4.7. Module 6: CRM & Phân tích cảm xúc (Customer Relation)
    - 4.8. Module 7: Cài đặt & Tự động hóa (Settings)
5. [PHẦN V: LUỒNG VẬN HÀNH CHI TIẾT (OPERATIONAL WORKFLOWS)](#phần-v-luồng-vận-hành-chi-tiết)
6. [PHẦN VI: HƯỚNG DẪN BẢO TRÌ VÀ MỞ RỘNG](#phần-vi-hướng-dẫn-bảo-trì-và-mở-rộng)

---

## PHẦN I: BỐI CẢNH VÀ TẦM NHÌN DỰ ÁN

### 1.1. Sự ra đời của ShopHub
Trong kỷ nguyên số hóa bùng nổ, việc bán hàng không còn gói gọn trong một cửa hàng vật lý hay một trang web đơn lẻ. Các nhà bán hàng hiện đại (Sellers) phải đối mặt với áp lực duy trì sự hiện diện trên hàng loạt nền tảng lớn như Shopee, Lazada, TikTok Shop, và Facebook. ShopHub ra đời với sứ mệnh trở thành "Bộ não trung tâm" (The Central Brain) giúp hợp nhất mọi dòng chảy dữ liệu, từ đó giải phóng sức lao động thủ công và tối ưu hóa lợi nhuận bằng trí tuệ nhân tạo.

### 1.2. Bài toán thị trường Thương mại điện tử (TMĐT)
Thị trường TMĐT tại Việt Nam và Đông Nam Á đang trải qua giai đoạn "đa cực". Mỗi sàn TMĐT lại có một hệ thống quản trị (Seller Center) riêng biệt với các quy tắc, định dạng dữ liệu và cơ chế vận hành khác nhau. 
- **Nỗi đau của người bán:**
    - **Phân mảnh dữ liệu:** Không có cái nhìn tổng thể về doanh thu và lợi nhuận thực tế sau khi trừ mọi loại phí sàn.
    - **Rủi ro tồn kho:** Việc đồng bộ kho thủ công dẫn đến tình trạng "overselling" (bán quá số lượng thực tế) gây phạt từ sàn hoặc mất uy tín với khách hàng.
    - **Phản hồi chậm:** Khách hàng đánh giá tiêu cực trên nhiều sàn nhưng team vận hành không kịp theo dõi và xử lý kịp thời.
    - **Định giá cảm tính:** Thiếu công cụ theo dõi đối thủ và điều chỉnh giá tự động theo biến động thị trường.

### 1.3. Mục tiêu chiến lược của hệ thống
ShopHub được xây dựng để đạt được 4 mục tiêu cốt lõi:
1. **Hợp nhất (Unification):** Gom tất cả đơn hàng, sản phẩm, tin nhắn từ mọi sàn về một giao diện duy nhất.
2. **Thông minh (Intelligence):** Sử dụng các mô hình Machine Learning để dự báo tồn kho và đề xuất giá bán tối ưu.
3. **Tự động hóa (Automation):** Giảm thiểu tối đa các thao tác lặp đi lặp lại thông qua các "Automation Rules".
4. **Trực quan (Visualization):** Biến những con số khô khan thành biểu đồ sinh động, giúp chủ doanh nghiệp đưa ra quyết định dựa trên dữ liệu (Data-driven decisions).

---

## PHẦN II: KIẾN TRÚC HỆ THỐNG VÀ CÔNG NGHỆ

### 2.1. Lựa chọn Stack công nghệ (Tech Stack Selection)
Hệ thống được xây dựng trên nền tảng Frontend hiện đại nhất tính đến năm 2026:
- **React 19:** Tận dụng tối đa các tính năng mới như `use` API, Server Components (nếu cần) và cải tiến về hiệu năng render.
- **Vite:** Công cụ build siêu nhanh, hỗ trợ Hot Module Replacement (HMR) giúp tăng tốc độ phát triển.
- **TypeScript:** Đảm bảo an toàn kiểu dữ liệu (Type-safety) tuyệt đối, giảm thiểu lỗi runtime trong các tính toán tài chính phức tạp.
- **Tailwind CSS:** Hệ thống Utility-first CSS giúp xây dựng giao diện tùy chỉnh nhanh chóng mà không làm phình t dung lượng file CSS.
- **TanStack Query (v5):** Quản lý trạng thái server (Server state), tự động hóa việc caching, retry và đồng bộ dữ liệu.
- **Zustand:** Quản lý trạng thái client (Global state) một cách nhẹ nhàng và hiệu quả thay vì sử dụng Redux phức tạp.
- **Recharts:** Thư viện biểu đồ mạnh mẽ, linh hoạt để hiển thị các báo cáo doanh thu và tăng trưởng.

### 2.2. Kiến trúc Modular Feature-based
Thay vì chia theo thư mục `components`, `containers`, ShopHub áp dụng kiến trúc **Feature-based**. Mỗi tính năng (như `auth`, `orders`, `inventory`) là một module độc lập nằm trong `src/features/`.
- **Cấu trúc một Feature:**
    - `components/`: Các UI components dành riêng cho feature đó.
    - `hooks/`: Các custom hooks xử lý logic nghiệp vụ.
    - `services/`: Các hàm gọi API (Axios).
    - `logic/`: Chứa các ViewModel hoặc hàm xử lý dữ liệu thuần túy (Pure functions).
    - `mocks/`: Định nghĩa các handlers và dữ liệu giả lập cho MSW.
    - `types/`: Định nghĩa interfaces/types cho feature.

Lợi ích của kiến trúc này là khả năng mở rộng (Scalability) và dễ dàng bảo trì. Khi một developer muốn sửa lỗi ở trang Đơn hàng, họ chỉ cần tập trung vào thư mục `src/features/orders`.

### 2.3. Luồng dữ liệu và Quản lý trạng thái (Data Flow & State Management)
Luồng dữ liệu trong ShopHub tuân thủ nguyên tắc "Một chiều và Ổn định":
1. **Request:** UI Component gọi một custom hook từ `hooks/`.
2. **Fetch:** Custom hook sử dụng `useQuery` hoặc `useMutation` từ TanStack Query, gọi đến hàm trong `services/`.
3. **Service:** Hàm service thực hiện request HTTP (được bắt bởi MSW trong môi trường dev).
4. **Processing:** Dữ liệu trả về được đưa qua lớp `logic/` để định dạng, tính toán (ví dụ: chuyển đổi tiền tệ, tính phần trăm tăng trưởng).
5. **Caching:** TanStack Query lưu dữ liệu vào cache.
6. **Render:** UI Component nhận dữ liệu từ hook và hiển thị. Toàn bộ ViewModel trả về đều được bọc trong `useMemo` để tránh re-render không cần thiết.

### 2.4. Chiến lược xử lý bất đồng bộ với TanStack Query
Hệ thống sử dụng các chiến lược nâng cao:
- **Optimistic Updates:** Cập nhật UI ngay lập tức trước khi server phản hồi (ví dụ: khi nhấn "Xác nhận đơn hàng") để tạo cảm giác mượt mà.
- **Prefetching:** Tự động tải trước dữ liệu khi người dùng hover vào một link hoặc menu.
- **Infinite Queries:** Áp dụng cho các danh sách lớn như Lịch sử đơn hàng để tối ưu hóa bộ nhớ.

---

## PHẦN III: QUY CHUẨN PHÁT TRIỂN (DEVELOPMENT STANDARDS)

### 3.1. Nguyên tắc tách biệt UI và Logic
Đây là quy tắc tối thượng trong ShopHub. Một file `tsx` (Component) chỉ nên chứa:
- Cấu trúc JSX/HTML.
- CSS/Tailwind classes.
- Các lời gọi hàm từ Hook (như `const { data, handleAction } = useMyLogic()`).
Tuyệt đối không viết các hàm tính toán phức tạp, `if/else` nghiệp vụ dày đặc bên trong Component. Toàn bộ "não bộ" phải nằm ở thư mục `logic/` và `hooks/`.

### 3.2. Hệ thống Mock Service Worker (MSW)
Để việc phát triển không bị phụ thuộc vào Backend, ShopHub sử dụng MSW để giả lập một Server thực thụ ngay trong trình duyệt.
- **Nguyên tắc vàng:** MSW không được can thiệp vào tài nguyên hệ thống (Vite assets, HMR).
- **Cấu hình:** Sử dụng `onUnhandledRequest: 'bypass'` để bỏ qua các request không thuộc API.
- **Dữ liệu Mock:** Được tổ chức trong `src/mocks/data/`, mô phỏng sát nhất với cấu hình thực tế của các sàn TMĐT.

### 3.3. Quy trình "Nghiên cứu -> Chiến lược -> Thực thi"
Mọi thay đổi trong mã nguồn đều phải đi qua 3 bước:
1. **Nghiên cứu (Research):** Tìm hiểu file liên quan, đọc `ERROR_HISTORY.md` để tránh vết xe đổ.
2. **Chiến lược (Strategy):** Phác thảo cách giải quyết, liệt kê các file sẽ sửa đổi.
3. **Thực thi (Execution):** Viết mã nguồn, kiểm tra lại bằng `lint` và `type-check`, sau đó chạy `build` để đảm bảo không có lỗi tiềm ẩn.

### 3.4. Quản lý lỗi và ERROR_HISTORY.md
Mọi lỗi phát sinh trong quá trình phát triển (từ lỗi cú pháp đến lỗi logic render) đều phải được ghi lại. Tài liệu này là "cuốn nhật ký kinh nghiệm" giúp team không bao giờ mắc lại một lỗi hai lần.

---

## PHẦN IV: CHI TIẾT CÁC MODULE CHỨC NĂNG

### 4.1. Module 0: Xác thực & Bảo mật (Auth)
Module Auth không chỉ đơn thuần là các ô nhập liệu, mà là lớp bảo vệ đầu tiên của hệ thống, quản lý danh tính người dùng và phân quyền truy cập.

#### 4.1.1. Trang Đăng nhập (`/login`)
- **Giao diện (UI):** Sử dụng `AuthSplitLayout` chia màn hình thành 2 phần. Phần bên trái là hình ảnh thương hiệu sống động, phần bên phải là form đăng nhập tinh tế. Các trường Email và Mật khẩu đều có icon minh họa và phản hồi real-time.
- **Logic & Nghiệp vụ:**
    - **Remember Me:** Sử dụng `localStorage` để lưu trữ email người dùng nếu checkbox được chọn, giúp tối ưu trải nghiệm người dùng trong lần đăng nhập sau.
    - **Xử lý trạng thái (Loading):** Nút đăng nhập tự động chuyển sang trạng thái disabled và hiển thị spinner khi đang gọi API để ngăn chặn việc spam request.
    - **Bảo mật:** Mật khẩu được ẩn mặc định và có nút toggle để người dùng kiểm tra lại thông tin.
- **Hệ thống Hook:** `useLoginLogic` quản lý toàn bộ state của form, tích hợp với `useAuthStore` để lưu thông tin token và profile người dùng vào global state.

#### 4.1.2. Trang Quên mật khẩu (`/forgot-password`)
- **Luồng hoạt động:** Người dùng nhập email -> Hệ thống kiểm tra định dạng (Zod validation) -> Gửi yêu cầu qua `authService` -> Hiển thị Toast thông báo thành công hoặc lỗi chi tiết.
- **Trải nghiệm:** Nút "Quay lại đăng nhập" luôn hiện diện để người dùng dễ dàng chuyển hướng nếu nhớ lại mật khẩu.

#### 4.1.3. Lớp bảo vệ (ProtectedRoute)
Đây là một Higher-Order Component (HOC) kiểm tra trạng thái đăng nhập trước khi render bất kỳ trang nào bên trong dashboard. Nếu chưa đăng nhập, người dùng sẽ bị redirect về trang `/login` kèm theo tham số `from` để quay lại đúng trang cũ sau khi đăng nhập thành công.

---

### 4.2. Module 1: Dashboard Analytics & Trực quan hóa
Dashboard là "phòng chỉ huy" của ShopHub, nơi dữ liệu khổng lồ từ nhiều sàn được cô đọng lại thành những chỉ số hành động được (actionable insights).

#### 4.2.1. KPI Overview (`/dashboard/kpi-overview`)
Đây là màn hình đầu tiên chủ shop nhìn thấy mỗi sáng.
- **Thanh Platform Tabs:** Cho phép lọc nhanh dữ liệu theo từng sàn (Shopee, Lazada, TikTok) hoặc xem tổng hợp toàn bộ. Việc chuyển tab sẽ trigger lại các API fetch dữ liệu tương ứng.
- **KPI Cards (4 cột):** Hiển thị 4 chỉ số sinh tử: Doanh thu, Đơn hàng, Tỷ lệ chuyển đổi và Giá trị trung bình đơn. Mỗi card có màu sắc và icon đặc trưng, giúp nhận diện nhanh chóng.
- **Monthly Goal Tracker:** Một thanh tiến độ trực quan so sánh doanh thu thực tế với mục tiêu tháng đã đặt ra. Logic tính toán phần trăm hoàn thành được thực hiện trong `dashboardLogic.ts`.
- **Hệ thống Biểu đồ:**
    - **Revenue Line Chart:** Biểu đồ đường đa trục thể hiện xu hướng doanh thu 7 ngày qua. Mỗi sàn là một đường có màu sắc khác nhau để dễ so sánh.
    - **Allocation Donut Chart:** Phân tích cơ cấu doanh thu theo sàn hoặc danh mục sản phẩm, giúp chủ shop biết kênh nào đang hiệu quả nhất.
- **Top Products Table:** Danh sách sản phẩm bán chạy nhất, tích hợp breakdown theo sàn để thấy rõ hiệu suất của từng mặt hàng trên từng kênh.

#### 4.2.2. Revenue Charts (`/dashboard/revenue-charts`)
Mô đun chuyên sâu về tài chính, cung cấp cái nhìn chi tiết hơn về dòng tiền.
- **Range Selector:** Người dùng có thể chọn xem theo 7 ngày, 30 ngày, 90 ngày hoặc một khoảng thời gian tùy chỉnh.
- **Hourly Distribution:** Biểu đồ cột thể hiện các khung giờ vàng có nhiều đơn hàng nhất, hỗ trợ việc lập kế hoạch quảng cáo và trực nhân sự hỗ trợ.
- **Weekly Comparison:** Bảng so sánh doanh thu giữa tuần này và tuần trước, tự động tính toán tỷ lệ tăng trưởng dương (xanh) hoặc âm (đỏ).

#### 4.2.3. Top Products Analytics (`/dashboard/top-products`)
Tập trung vào việc phân tích "ngôi sao" và "điểm đen" trong danh mục hàng hóa.
- **Podium Section:** Vinh danh Top 3 sản phẩm xuất sắc nhất bằng giao diện bục huy chương độc đáo.
- **Declining Section:** Cảnh báo những sản phẩm đang có xu hướng giảm doanh thu đột ngột kèm theo gợi ý nguyên nhân từ AI (như đối thủ giảm giá, hết hàng, hoặc giảm tương tác).

#### 4.2.4. Alerts & Notifications (`/dashboard/alerts-notifications`)
Hệ thống cảnh báo thông minh giúp quản lý các sự kiện khẩn cấp.
- **Phân loại độ nghiêm trọng:** Critical (Đỏ), Warning (Vàng), Info (Xanh).
- **Hành động trực tiếp:** Mỗi thông báo (như "Tồn kho thấp") đều đi kèm nút action dẫn thẳng đến module xử lý tương ứng (như "Nhập hàng ngay").
- **Auto-refresh:** Trang này có cơ chế tự động cập nhật định kỳ để đảm bảo không bỏ sót bất kỳ biến động nào từ sàn.

---

### 4.3. Module 2: Quản lý Đơn hàng Đa sàn (Orders)
Module Đơn hàng là nơi tập trung mọi giao dịch từ các sàn TMĐT. Thách thức lớn nhất ở đây là việc chuẩn hóa các trạng thái đơn hàng khác nhau từ Shopee, Lazada, TikTok về một hệ quy chiếu chung của ShopHub.

#### 4.3.1. All Orders (`/orders/all`)
- **Bộ lọc thông minh (Advanced Filters):** Cho phép lọc theo mã đơn, khách hàng, sản phẩm, khoảng giá và đặc biệt là bộ lọc nhanh "Hôm nay" / "7 ngày qua". Logic lọc này được xử lý tối ưu tại Client thông qua TanStack Query để đảm bảo tốc độ phản hồi tức thì.
- **Bulk Action Toolbar:** Khi người dùng chọn nhiều đơn hàng, một thanh công cụ nổi (floating toolbar) sẽ xuất hiện, cho phép thực hiện các thao tác hàng loạt như "Xác nhận đơn", "In vận đơn" hoặc "Xuất CSV". Điều này giúp giảm tới 80% thời gian thao tác thủ công.
- **Data Table:** Bảng dữ liệu được thiết kế theo phong cách tối giản nhưng đầy đủ thông tin, tích hợp skeleton loading để cải thiện cảm giác về tốc độ.

#### 4.3.2. Pending Actions & SLA Tracking (`/orders/pending-actions`)
Đây là module quan trọng nhất dành cho đội ngũ vận hành kho.
- **SLA Countdown:** Hệ thống tự động tính toán thời hạn xử lý còn lại cho mỗi đơn hàng dựa trên quy định của từng sàn. Các đơn hàng sắp hết hạn (Urgent) sẽ được highlight màu đỏ và đẩy lên đầu danh sách.
- **Sidebar Charts:** Cung cấp cái nhìn nhanh về tỷ lệ đơn hàng theo mức độ khẩn cấp (Urgent / Warning / Normal) và phân bổ đơn hàng theo sàn, giúp quản lý điều phối nhân sự kịp thời.

#### 4.3.3. Returns & Cancellations (`/orders/returns`)
- **Timeline View:** Một cách hiển thị sáng tạo giúp theo dõi quá trình hoàn trả theo dòng thời gian, từ lúc khách yêu cầu đến khi kho nhận lại hàng và hoàn tiền.
- **Phân tích lý do:** Hệ thống thống kê các lý do huỷ/trả hàng phổ biến nhất để chủ shop có kế hoạch cải thiện chất lượng sản phẩm hoặc dịch vụ đóng gói.

#### 4.3.4. Order Detail Overlay
Thay vì chuyển trang, ShopHub sử dụng Modal hoặc Drawer để hiển thị chi tiết đơn hàng. Điều này giữ cho người dùng không bị mất ngữ cảnh của danh sách đang duyệt. Chi tiết đơn hàng bao gồm: Timeline sự kiện, Thông tin khách hàng, Danh sách sản phẩm và Lịch sử đánh giá.

---

### 4.4. Module 3: Kho hàng & Dự báo AI (Inventory)
Quản lý kho trong ShopHub không chỉ là đếm số lượng, mà là tối ưu hóa dòng luân chuyển hàng hóa.

#### 4.4.1. SKU Stock & Multi-warehouse (`/inventory/sku-stock`)
- **Đồng bộ đa sàn:** Khi tồn kho của một SKU thay đổi (do bán hàng hoặc nhập thêm), hệ thống sẽ tính toán và sẵn sàng đẩy số liệu mới lên tất cả các sàn đã kết nối thông qua lớp Automation.
- **Inventory Alert Banner:** Một banner cảnh báo thông minh xuất hiện khi có sản phẩm chạm ngưỡng tồn tối thiểu, giúp ngăn chặn tình trạng "cháy hàng".

#### 4.4.2. Stock Movements (`/inventory/stock-movements`)
- **Audit Trail:** Mọi biến động kho (Nhập, Xuất, Điều chỉnh) đều được ghi lại chi tiết: ai thực hiện, lúc nào, lý do gì. Điều này cực kỳ quan trọng trong việc kiểm soát thất thoát và minh bạch hóa vận hành.
- **Timeline Visualization:** Biểu đồ hóa các biến động kho theo nhóm ngày, giúp nhận diện các giai đoạn cao điểm nhập hàng hoặc xuất hàng.

#### 4.4.3. AI Forecast & Demand Prediction (`/inventory/ai-forecast`)
Đây là "vũ khí bí mật" của ShopHub.
- **Mô hình LSTM:** Sử dụng các thuật toán Deep Learning để phân tích dữ liệu bán hàng lịch sử, từ đó dự báo nhu cầu trong 7, 14 hoặc 30 ngày tới.
- **Urgent Restock Cards:** AI tự động liệt kê các sản phẩm có nguy cơ hết hàng cao nhất kèm theo "Số lượng nhập đề xuất" và "Độ tin cậy của dự báo".
- **Lý do dự báo:** AI cung cấp các thẻ lý do (như "Xu hướng tăng trưởng 20% tuần qua", "Ảnh hưởng từ chiến dịch Marketing") để người quản lý có cơ sở đưa ra quyết định nhập hàng.

#### 4.4.4. Stock Adjustment Workflow
Quy trình điều chỉnh kho được thiết kế chặt chẽ với các bước: Chọn SKU -> Xem tồn hiện tại -> Nhập số lượng mới -> Chọn lý do (Hư hỏng, Kiểm kê định kỳ, Sai sót hệ thống) -> Xác nhận. Toàn bộ quá trình được bọc trong các `useMutation` để đảm bảo tính toàn vẹn dữ liệu.

---

### 4.5. Module 4: Sản phẩm & Chiến lược giá (Products)
Quản lý sản phẩm trong môi trường đa sàn đòi hỏi sự đồng bộ và linh hoạt trong định giá để duy trì lợi thế cạnh tranh.

#### 4.5.1. Products List & Catalog Management (`/products/list`)
- **Giao diện đa chế độ:** Người dùng có thể chuyển đổi giữa Grid View (xem ảnh lớn, trực quan) và Table View (xem nhiều chỉ số, so sánh nhanh).
- **Phân tích hiệu suất sản phẩm:** Mỗi card sản phẩm hiển thị không chỉ giá và tồn kho, mà còn cả metrics breakdown theo từng platform, giúp nhận diện ngay sản phẩm nào đang "gánh team" trên sàn nào.

#### 4.5.2. Dynamic Pricing & AI Recommendations (`/products/dynamic-pricing`)
Đây là tính năng giúp ShopHub nổi bật so với các công cụ quản lý kho thông thường.
- **AI Recommendation Engine:** Hệ thống tự động phân tích nhu cầu thị trường, giá đối thủ và tồn kho để đưa ra các mức giá đề xuất (Recommended Prices) kèm theo mức độ tin cậy (Confidence Level).
- **Cơ chế áp dụng hàng loạt:** Người dùng có thể duyệt nhanh hàng trăm đề xuất giá chỉ bằng một cú click thông qua tính năng "Áp dụng tất cả giá AI".
- **Lịch sử biến động giá:** Biểu đồ time-series giúp theo dõi hiệu quả của việc điều chỉnh giá đối với doanh số bán hàng trong quá khứ.

#### 4.5.3. Competitor Tracking & Market Intelligence
- **Bảng so sánh giá (Comparison Matrix):** Hiển thị giá của shop so với các đối thủ hàng đầu trên cùng một mặt hàng. Các ô dữ liệu được tô màu theo vị thế (Rẻ nhất, Trung bình, Đắt nhất).
- **Competitor Heatmap:** Trực quan hóa bản đồ cạnh tranh, giúp chủ shop nhận diện được "vùng an toàn" và "vùng nguy hiểm" về giá trên thị trường.

#### 4.5.4. Product Detail & Automation Triggers
Trang chi tiết sản phẩm không chỉ là nơi sửa thông tin cơ bản mà còn là nơi cấu hình các **Automation Triggers** (ví dụ: "Nếu đối thủ A giảm giá, tự động giảm giá sản phẩm này xuống thấp hơn 500đ nhưng không dưới giá sàn").

---

### 4.6. Module 5: Doanh thu & Kịch bản tài chính (Revenue)
Module này biến dữ liệu giao dịch thô thành những báo cáo tài chính chuyên sâu, phục vụ mục đích lập kế hoạch kinh doanh.

#### 4.6.1. Summary Report & Profit Analysis (`/revenue/summary-report`)
- **Waterfall Chart (Biểu đồ thác nước):** Đây là thành phần UI phức tạp nhất, giúp bóc tách từng lớp chi phí: Doanh thu gộp -> Phí sàn -> Phí vận chuyển -> Voucher -> Giá vốn -> Lợi nhuận ròng. Cách hiển thị này giúp chủ shop thấy rõ dòng tiền bị "rơi rụng" ở đâu nhiều nhất.
- **Top Products Contribution:** Biểu đồ thanh ngang thể hiện tỷ trọng đóng góp doanh thu của 15 sản phẩm hàng đầu, tích hợp tính năng smooth scroll đến bảng lợi nhuận chi tiết.

#### 4.6.2. Platform Comparison Analytics
- **Cross-platform Metrics:** So sánh hiệu suất giữa Shopee, Lazada và TikTok trên cùng một biểu đồ radar hoặc trend chart. 
- **Gợi ý phân bổ nguồn lực:** Dựa trên lợi nhuận thực tế (sau khi trừ phí sàn khác nhau), hệ thống đưa ra gợi ý nên tập trung ngân sách quảng cáo vào sàn nào để đạt ROI cao nhất.

#### 4.6.3. ML Forecast & Scenario Planning (`/revenue/ml-forecast`)
- **Kịch bản "What-if":** Người dùng có thể chọn các kịch bản khác nhau (Tích cực, Trung lập, Rủi ro) để xem dự báo doanh thu tương ứng. AI sẽ tính toán các dải sai số (Confidence Interval) và đánh dấu các sự kiện quan trọng (như Flash Sale) lên đường dự báo.
- **Smart Alerts:** Đưa ra các khuyến nghị hành động dựa trên dự báo, ví dụ: "Dự báo doanh thu tuần tới giảm 10%, đề xuất chạy chương trình Flash Sale cho danh mục Điện tử".

---

### 4.7. Module 6: CRM & Phân tích cảm xúc (Customer Relation)
Trong TMĐT, uy tín được xây dựng từ sự hài lòng của khách hàng. ShopHub cung cấp các công cụ mạnh mẽ để quản lý và thấu hiểu khách hàng.

#### 4.7.1. Sentiment Analysis & Review Management (`/crm/sentiment-analysis`)
- **AI Sentiment Scoring:** Hệ thống tự động quét và phân loại các đánh giá (Reviews) của khách hàng thành 3 nhóm: Positive (Tích cực), Neutral (Trung lập) và Negative (Tiêu cực). Điểm số này giúp chủ shop nhận diện nhanh các vấn đề về chất lượng sản phẩm.
- **Review Detail Panel:** Hiển thị toàn bộ nội dung đánh giá kèm ảnh và thông tin đơn hàng liên quan. Người dùng có thể soạn phản hồi trực tiếp ngay tại đây.
- **AI Reply Draft:** AI hỗ trợ soạn thảo phản hồi dựa trên nội dung đánh giá và tone giọng được chọn (Chuyên nghiệp, Thân thiện, hoặc Biết ơn), giúp tiết kiệm thời gian phản hồi hàng nghìn lượt đánh giá.

#### 4.7.2. Review Inbox & Template Replies
- **Hộp thư tập trung:** Gom tất cả review chưa phản hồi từ mọi sàn về một giao diện dạng inbox.
- **Hệ thống Template:** Cho phép lưu trữ các mẫu phản hồi thường dùng để điền nhanh, đảm bảo tính nhất quán trong giao tiếp với khách hàng.

#### 4.7.3. Customer Profiles & Lifecycle Tracking (`/crm/customer-profiles`)
- **Hồ sơ 360 độ:** Mỗi khách hàng được xây dựng một profile bao gồm lịch sử mua hàng đa sàn, tổng chi tiêu (LTV) và tần suất mua hàng.
- **Customer Lifecycle Stage:** Hệ thống tự động phân loại khách hàng vào các nhóm: New (Mới), Active (Đang hoạt động), At Risk (Có rủi ro rời bỏ), Churned (Đã rời bỏ), và Champion (Khách hàng trung thành).
- **Phân đoạn RFM:** Tự động tính toán các chỉ số Recency (Lần mua cuối), Frequency (Tần suất) và Monetary (Giá trị) để phục vụ các chiến dịch Marketing nhắm mục tiêu.

---

### 4.8. Module 7: Cài đặt & Tự động hóa (Settings)
Đây là nơi cấu hình "hệ điều hành" của ShopHub, giúp hệ thống hoạt động chính xác theo ý muốn của chủ shop.

#### 4.8.1. Profile & Security Management
- **Quản lý định danh:** Cập nhật thông tin cá nhân, chức danh và múi giờ vận hành.
- **Security Section:** Kiểm tra định kỳ trạng thái bảo mật của tài khoản và quản lý các phiên đăng nhập.

#### 4.8.2. Platform Connections & Webhooks
- **Trung tâm kết nối:** Quản lý các mã Token API của Shopee, Lazada, TikTok. Hệ thống có cơ chế cảnh báo khi Token sắp hết hạn để tránh gián đoạn đồng bộ.
- **Webhook Healthy Monitoring:** Theo dõi trạng thái của các endpoint nhận dữ liệu realtime từ sàn, đảm bảo mọi đơn hàng mới đều được đẩy về ShopHub ngay lập tức.

#### 4.8.3. Staff & Permissions Matrix
- **Phân quyền chi tiết (RBAC):** Hệ thống sử dụng một ma trận quyền hạn (Permissions Matrix) cho phép bật/tắt quyền truy cập vào từng module nhỏ cho từng vai trò nhân viên (Admin, Manager, Staff, Viewer).
- **Invite Workflow:** Quy trình mời nhân viên qua email kèm theo việc gán vai trò và quyền hạn ngay từ bước khởi tạo.

#### 4.8.4. Automation Builder (`/settings/automation`)
Đây là module mang tính kỹ thuật cao nhất, cho phép tạo ra các luồng xử lý tự động.
- **Multi-step Builder (5 bước):**
    1. **Chọn Trigger:** Sự kiện kích hoạt (Ví dụ: "Có đơn hàng mới").
    2. **Cấu hình Trigger:** Chi tiết sự kiện (Ví dụ: "Trên sàn Shopee").
    3. **Chọn Điều kiện:** Logic lọc (Ví dụ: "Giá trị đơn hàng > 2 triệu").
    4. **Chọn Hành động:** Việc cần làm (Ví dụ: "Tự động xác nhận đơn" hoặc "Gửi thông báo Telegram").
    5. **Cấu hình Hành động:** Chi tiết thực thi.
- **Automation Stats:** Thống kê số lần quy tắc đã chạy và lượng thời gian/công sức đã tiết kiệm được cho doanh nghiệp.

---

## PHẦN V: LUỒNG VẬN HÀNH CHI TIẾT (OPERATIONAL WORKFLOWS)

Trong phần này, chúng ta sẽ xem xét cách các module tương tác với nhau để xử lý các kịch bản thực tế trong kinh doanh đa sàn.

### 5.1. Luồng đơn hàng hoàn hảo (The Perfect Order Flow)
Đây là luồng xử lý lý tưởng từ lúc có khách mua đến khi hoàn tất đơn hàng:
1. **Tiếp nhận:** Webhook từ sàn Shopee đẩy dữ liệu đơn hàng mới về. MSW (trong môi trường dev) hoặc API thực nhận diện và lưu vào database.
2. **Thông báo:** Module Alerts nhận tín hiệu đơn hàng mới, hiển thị thông báo trên Navbar và đẩy đơn vào `orders/pending-actions`.
3. **Kiểm tra tồn kho:** Hệ thống tự động kiểm tra SKU liên kết. Nếu đủ hàng, trạng thái chuyển sang "Sẵn sàng giao". Nếu thiếu hàng, AI Forecast sẽ gợi ý nhập hàng ngay.
4. **Xử lý:** Nhân viên sử dụng Bulk Action để xác nhận và in vận đơn hàng loạt. Trạng thái trên sàn Shopee được cập nhật tự động thông qua API.
5. **Đồng bộ kho:** Ngay khi đơn hàng được xác nhận, số lượng tồn kho khả dụng (Available Stock) sẽ giảm xuống. Module Inventory sẽ phát tín hiệu đồng bộ số tồn mới này lên Lazada và TikTok Shop để tránh overselling.
6. **Chăm sóc sau bán:** Sau khi đơn giao thành công, khách hàng đánh giá. Module CRM nhận review, AI phân tích cảm xúc và soạn phản hồi cảm ơn.

### 5.2. Luồng tối ưu giá tự động (AI-Driven Pricing Workflow)
1. **Theo dõi:** Module Competitor Tracking phát hiện đối thủ chính đang giảm giá sản phẩm điện thoại.
2. **Phân tích:** AI Dynamic Pricing tính toán dựa trên giá vốn, biên lợi nhuận tối thiểu và giá đối thủ.
3. **Đề xuất:** Một Alert "Đề xuất giảm giá" xuất hiện trong dashboard.
4. **Phê duyệt:** Chủ shop xem biểu đồ tác động doanh thu dự kiến và nhấn "Áp dụng".
5. **Thực thi:** Hệ thống tự động gọi API cập nhật giá mới lên tất cả các sàn cùng lúc.

### 5.3. Luồng xử lý sự cố tồn kho (Crisis Management: Out of Stock)
1. **Cảnh báo:** SKU "Tai nghe Bluetooth" chạm ngưỡng tồn bằng 0.
2. **Ngắt kết nối:** Automation Rule tự động tạm dừng hiển thị sản phẩm trên TikTok Shop để tránh bị phạt do không có hàng giao.
3. **Dự báo:** AI Forecast tính toán lượng hàng cần nhập dựa trên tốc độ bán của 30 ngày qua và tạo một "Purchase Draft".
4. **Phục hồi:** Nhân viên nhập hàng mới vào kho qua module Stock Adjustment. Hệ thống tự động kích hoạt lại sản phẩm trên các sàn.

---

## PHẦN VI: HƯỚNG DẪN BẢO TRÌ VÀ MỞ RỘNG

### 6.1. Quy trình thêm một Nền tảng (Platform) mới
Để tích hợp một sàn TMĐT mới (Ví dụ: Tiki hoặc Amazon):
1. **Định nghĩa Type:** Thêm enum platform mới vào `platform.types.ts`.
2. **Thiết kế Mock Data:** Tạo file dữ liệu mẫu cho platform mới trong `src/mocks/data/`.
3. **Xây dựng Handler:** Viết các MSW handlers để giả lập API của platform đó.
4. **Cập nhật UI:** Thêm logo và màu sắc nhận diện vào `PlatformBadge` component và cấu hình trong `platform-connections`.
5. **Mapping Logic:** Viết hàm chuyển đổi dữ liệu từ format của platform mới về format chuẩn của ShopHub bên trong lớp `services/`.

### 6.2. Quy chuẩn Code Review & Kiểm soát chất lượng
Mọi Pull Request (PR) phải tuân thủ:
- **Linting:** Chạy `npm run lint` và không còn lỗi đỏ.
- **Type Checking:** Chạy `tsc` để đảm bảo không có lỗi kiểu dữ liệu tiềm ẩn.
- **Build Test:** Phải chạy `npm run build` thành công trên máy local trước khi đẩy code.
- **Logic Validation:** Các ViewModel trả về từ hook phải được kiểm tra xem đã sử dụng `useMemo` chưa để tránh loop render.

### 6.3. Chiến lược mở rộng tính năng (Scalability)
- **Lazy Loading:** Sử dụng `React.lazy` và `Suspense` cho các module lớn (như Revenue, AI Forecast) để giảm kích thước bundle ban đầu.
- **Container Queries:** Sử dụng `@container` thay cho `@media` để các component có thể tự thích nghi với mọi kích thước vùng chứa (như trong Sidebar hoặc Modal).
- **Zustand Slices:** Khi Global State quá lớn, hãy chia nhỏ store thành các "Slices" theo feature để dễ quản lý.

---

## TỔNG KẾT
Tài liệu này cung cấp cái nhìn toàn cảnh và chi tiết về hệ thống ShopHub Frontend. Với cấu trúc modular, tư duy tách biệt logic và sự hỗ trợ mạnh mẽ từ AI, ShopHub sẵn sàng đáp ứng mọi nhu cầu quản trị TMĐT phức tạp nhất trong tương lai. 

---

## PHẦN VII: PHỤ LỤC KỸ THUẬT (TECHNICAL APPENDIX) - TYPESCRIPT INTERFACES
Hệ thống sử dụng các Interfaces được định nghĩa chặt chẽ để đảm bảo Type-Safety từ Frontend đến Backend. Các model chính bao gồm:

### 7.1. API & Base Types (`api.types.ts`)
Mọi response từ API đều tuân thủ cấu trúc chuẩn:
- `ApiResponse<T>`: Gói gọn `data`, `success`, `message`.
- `PaginatedResponse<T>`: Sử dụng cursor-based pagination với `items`, `nextCursor`, `hasMore`.
- `ApiError`: Cấu trúc lỗi chuẩn hóa (RFC 7807) chứa `status`, `title`, `detail`, `errors`.

### 7.2. Entities Cốt Lõi
- **Đơn hàng (`order.types.ts`):** `Order` map trực tiếp với các trường như `externalOrderId`, `totalAmount`, `status` (chuẩn hóa về OrderStatus common format). Đi kèm là `OrderItem` và `OrderStatusHistory`.
- **Sản phẩm (`product.types.ts`):** Phân cấp từ `Product` (thông tin chung) -> `ProductVariant` (biến thể như Đỏ/XL) -> `PlatformSkuMapping` (kết nối SKU nội bộ với SKU trên Shopee/Lazada).
- **Kho hàng (`inventory.types.ts`):** Quản lý tồn kho vật lý qua `StockLevel` (PhysicalQty, ReservedQty, AvailableQty) và lịch sử biến động qua `StockMovement` (Immutable log với MovementType).

### 7.3. AI & Dự báo (`ai.types.ts`)
- `SalesForecastResult`: Chứa các `ForecastPoint` dự báo doanh thu kèm độ tin cậy (`rSquared`, `lowerBound`, `upperBound`).
- `InventoryForecastResult`: Đề xuất số lượng cần nhập (`suggestedOrderQty`) và ngày cần nhập (`recommendedRestockDate`).

---

## PHẦN VIII: QUY CHUẨN THIẾT KẾ VÀ HỆ THỐNG GIAO DIỆN (DESIGN SYSTEM)
ShopHub tuân thủ **ShopHub Design System v1.0** theo nguyên tắc "Clarity First, Action-Oriented, Trustworthy & Calm".

### 8.1. Color Palette (Bảng màu hệ thống)
- **Primary (Indigo Blue):** Thể hiện sự tin cậy. Dùng cho background hover (`#EEF2FF`), primary button (`#6366F1`), và text focus.
- **Accent (Coral Orange):** Dành riêng cho các CTA quan trọng (`#F97316`). Không nhầm lẫn với Warning.
- **Semantic Colors:**
  - Success (`#22C55E`): Đơn thành công, tăng trưởng dương.
  - Warning (`#F59E0B`): Cảnh báo tồn thấp.
  - Danger (`#EF4444`): Lỗi hệ thống, đơn hủy.
  - Info (`#3B82F6`): Trạng thái xử lý, thông báo AI.

### 8.2. Typography System
- **Font chính (UI):** `Be Vietnam Pro` (Sans-serif, hỗ trợ tiếng Việt tốt).
- **Font số (Numbers/Metrics):** `JetBrains Mono` (Monospace, giúp số liệu tài chính thẳng hàng khi hiển thị trong bảng).
- **Quy tắc Focus Ring:** Mọi tương tác (Input, Button) bắt buộc có focus ring: `ring-2 ring-primary-500/20` để đảm bảo WCAG 2.1 AA.

### 8.3. Spacing & Border Radius
- Hệ thống lưới cơ sở **8px grid** (`space-1`: 4px, `space-2`: 8px, `space-4`: 16px).
- Bán kính góc mềm mại: `md` (8px) cho button, `lg` (12px) cho card, `2xl` (24px) cho panel AI Insight.

### 8.4. UI Components (Organisms)
- **AI Insight Block:** Mảnh ghép đặc thù hiển thị kết quả Machine Learning (Dự báo tồn kho, Sentiment, Giá) tích hợp thẻ Confidence và CTA.
- **Data Table:** Chuẩn hóa bảng với hover effect, row-level action và trạng thái dòng (urgent, overdue).
- **KPI Card:** Chứa icon, trend indicator, số liệu chính (Monospace font) và micro-chart (Sparkline).

---
**Người viết:** *Gemini CLI Agent*  
**Ngày hoàn thiện:** *28-04-2026*





