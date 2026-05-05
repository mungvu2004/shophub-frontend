import type { SettingsStaffPermissionsActivityResponse } from '@/features/settings/logic/settingsStaffPermissionsActivity.types'

export const settingsStaffPermissionsActivitiesMock: Record<string, SettingsStaffPermissionsActivityResponse> = {
  'member-seller-001': {
    memberId: 'member-seller-001',
    memberName: 'Nguyễn Hoàng Minh',
    headerTitle: 'Hoạt động — Nguyễn Hoàng Minh (Chủ shop)',
    summaryLabel: 'Hiển thị 1-20 trong 580 hoạt động',
    sections: [
      {
        id: 'today',
        entries: [
          { id: 'a1', title: 'Cập nhật cài đặt tự động hóa', detail: '17 quy tắc đã bật/tắt', timeLabel: '10:15', kind: 'order' },
          { id: 'a2', title: 'Kiểm tra báo cáo doanh thu', detail: 'Doanh thu hôm nay: 450K', timeLabel: '09:30', kind: 'export' },
          { id: 'a3', title: 'Duyệt gợi ý giá AI', detail: '15 sản phẩm được áp dụng', timeLabel: '09:00', kind: 'order' },
          { id: 'a4', title: 'Xem báo cáo đơn hàng', timeLabel: '08:45', kind: 'export', dimmed: true },
          { id: 'a5', title: 'Cấp quyền cho 5 nhân viên', timeLabel: '08:20', kind: 'export', dimmed: true },
        ],
      },
      {
        id: 'yesterday',
        label: 'Hôm qua, 4 May',
        entries: [
          { id: 'a6', title: 'Thiết lập kết nối Lazada', timeLabel: '16:00', kind: 'order', dimmed: true },
          { id: 'a7', title: 'Kiểm tra log tự động hóa', timeLabel: '15:30', kind: 'export', dimmed: true },
          { id: 'a8', title: 'Cấu hình webhook cho 3 sàn', timeLabel: '14:15', kind: 'order', dimmed: true },
        ],
      },
    ],
  },
  'member-seller-002': {
    memberId: 'member-seller-002',
    memberName: 'Trần Thị Linh',
    headerTitle: 'Hoạt động — Trần Thị Linh (Quản lý vận hành)',
    summaryLabel: 'Hiển thị 1-20 trong 385 hoạt động',
    sections: [
      {
        id: 'today',
        entries: [
          { id: 'a1', title: 'Xác nhận 35 đơn hàng mới', detail: 'Từ Shopee, Lazada, TikTok', timeLabel: '10:30', kind: 'order' },
          { id: 'a2', title: 'Xử lý cảnh báo SLA', detail: '8 đơn nguy cơ trễ', timeLabel: '09:45', kind: 'order' },
          { id: 'a3', title: 'Cập nhật tồn kho', detail: '12 SKU nhập bổ sung', timeLabel: '09:15', kind: 'inventory' },
          { id: 'a4', title: 'Trả lời 8 review tiêu cực', timeLabel: '08:30', kind: 'export', dimmed: true },
          { id: 'a5', title: 'Gán order cho team warehouse', timeLabel: '08:00', kind: 'order', dimmed: true },
        ],
      },
      {
        id: 'yesterday',
        label: 'Hôm qua, 4 May',
        entries: [
          { id: 'a6', title: 'Kiểm tra hiệu suất đơn hàng', timeLabel: '17:00', kind: 'export', dimmed: true },
          { id: 'a7', title: 'Quản lý pending orders', detail: '15 đơn được xác nhận', timeLabel: '16:30', kind: 'order', dimmed: true },
          { id: 'a8', title: 'Cập nhật quy tắc SLA', timeLabel: '15:00', kind: 'order', dimmed: true },
        ],
      },
    ],
  },
  'member-seller-003': {
    memberId: 'member-seller-003',
    memberName: 'Phạm Văn Khoa',
    headerTitle: 'Hoạt động — Phạm Văn Khoa (Nhân viên kho)',
    summaryLabel: 'Hiển thị 1-20 trong 152 hoạt động',
    sections: [
      {
        id: 'today',
        entries: [
          { id: 'a1', title: 'Tạo phiếu nhập kho PN-0145', detail: 'Nhập 120 units áo thun', timeLabel: '14:45', kind: 'inventory' },
          { id: 'a2', title: 'Xuất kho 28 đơn hàng', detail: 'Chuẩn bị giao hàng', timeLabel: '14:20', kind: 'inventory' },
          { id: 'a3', title: 'Kiểm kê tồn kho', detail: 'Khu vực A: 245 units', timeLabel: '13:30', kind: 'inventory' },
          { id: 'a4', title: 'Xác nhận vận chuyển', detail: '15 kiện hàng', timeLabel: '12:15', kind: 'order', dimmed: true },
          { id: 'a5', title: 'Cập nhật vị trí kệ', timeLabel: '11:00', kind: 'inventory', dimmed: true },
        ],
      },
      {
        id: 'yesterday',
        label: 'Hôm qua, 4 May',
        entries: [
          { id: 'a6', title: 'Điều chuyển kho nội bộ', detail: '50 units sang khu vực B', timeLabel: '16:00', kind: 'inventory', dimmed: true },
          { id: 'a7', title: 'Nhập hoàn từ khách hàng', detail: '2 đơn hoàn', timeLabel: '14:30', kind: 'inventory', dimmed: true },
          { id: 'a8', title: 'Đăng nhập hệ thống', timeLabel: '07:45', kind: 'order', dimmed: true },
        ],
      },
    ],
  },
  'member-seller-004': {
    memberId: 'member-seller-004',
    memberName: 'Nguyễn Thị Hương',
    headerTitle: 'Hoạt động — Nguyễn Thị Hương (Marketing Analyst)',
    summaryLabel: 'Hiển thị 1-20 trong 245 hoạt động',
    sections: [
      {
        id: 'today',
        entries: [
          { id: 'a1', title: 'Phân tích doanh thu hôm nay', detail: 'Tăng 15% vs hôm qua (450K)', timeLabel: '11:00', kind: 'export' },
          { id: 'a2', title: 'Duyệt gợi ý giá động', detail: '15 sản phẩm (doanh thu +18.5%)', timeLabel: '10:30', kind: 'order' },
          { id: 'a3', title: 'Kiểm tra competitor tracking', detail: '47 sản phẩm theo dõi', timeLabel: '09:45', kind: 'export' },
          { id: 'a4', title: 'Cập nhật dashboard KPI', detail: '10 metrics đã tạo', timeLabel: '09:15', kind: 'export', dimmed: true },
          { id: 'a5', title: 'Xuất báo cáo sản phẩm bán chạy', timeLabel: '08:30', kind: 'export', dimmed: true },
        ],
      },
      {
        id: 'yesterday',
        label: 'Hôm qua, 4 May',
        entries: [
          { id: 'a6', title: 'Phân tích xu hướng tháng 5', timeLabel: '17:00', kind: 'export', dimmed: true },
          { id: 'a7', title: 'Kiểm tra ML forecast scenarios', detail: '3 kịch bản được đánh giá', timeLabel: '16:00', kind: 'export', dimmed: true },
          { id: 'a8', title: 'Tạo báo cáo top products', timeLabel: '15:30', kind: 'export', dimmed: true },
        ],
      },
    ],
  },
  'member-seller-005': {
    memberId: 'member-seller-005',
    memberName: 'Hoàng Đức Linh',
    headerTitle: 'Hoạt động — Hoàng Đức Linh (Viewer Read-only)',
    summaryLabel: 'Hiển thị 1-20 trong 68 hoạt động',
    sections: [
      {
        id: 'today',
        entries: [
          { id: 'a1', title: 'Xem báo cáo doanh thu', detail: 'Doanh thu hôm nay: 450K', timeLabel: '10:00', kind: 'export' },
          { id: 'a2', title: 'Xem danh sách đơn hàng', detail: '50 đơn trong hệ thống', timeLabel: '09:30', kind: 'order' },
          { id: 'a3', title: 'Kiểm tra tồn kho', detail: 'Xem dashboard kho', timeLabel: '09:00', kind: 'inventory' },
          { id: 'a4', title: 'Xem performance dashboard', timeLabel: '08:45', kind: 'export', dimmed: true },
        ],
      },
      {
        id: 'yesterday',
        label: 'Hôm qua, 4 May',
        entries: [
          { id: 'a5', title: 'Xem báo cáo tuần', timeLabel: '15:00', kind: 'export', dimmed: true },
          { id: 'a6', title: 'Kiểm tra trạng thái đơn hàng', detail: 'Xem chi tiết 5 đơn', timeLabel: '14:00', kind: 'order', dimmed: true },
          { id: 'a7', title: 'Xem dashboard KPI', timeLabel: '13:30', kind: 'export', dimmed: true },
        ],
      },
    ],
  },
}