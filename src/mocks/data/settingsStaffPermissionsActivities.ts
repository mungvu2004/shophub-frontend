import type { SettingsStaffPermissionsActivityResponse } from '@/features/settings/logic/settingsStaffPermissionsActivity.types'

export const settingsStaffPermissionsActivitiesMock: Record<string, SettingsStaffPermissionsActivityResponse> = {
  'member-warehouse-a': {
    memberId: 'member-warehouse-a',
    memberName: 'Trần Kho A',
    headerTitle: 'Hoạt động — Trần Kho A',
    summaryLabel: 'Hiển thị 1-20 trong 247 hoạt động',
    sections: [
      {
        id: 'today',
        entries: [
          { id: 'a1', title: 'Tạo phiếu nhập kho PN-0034', detail: 'Cập nhật số lượng 50 sản phẩm Áo thun Basic', timeLabel: '14:32', kind: 'inventory' },
          { id: 'a2', title: 'Xác nhận đơn SPE-001244', timeLabel: '14:15', kind: 'order' },
          { id: 'a3', title: 'Xuất CSV danh sách đơn', detail: "Bộ lọc: Trạng thái 'Chờ lấy hàng'", timeLabel: '13:58', kind: 'export' },
          { id: 'a4', title: 'Cập nhật tồn kho SKU: TS-001', timeLabel: '13:45', kind: 'inventory', dimmed: true },
          { id: 'a5', title: 'Xác nhận đơn SPE-001240', timeLabel: '13:20', kind: 'order', dimmed: true },
          { id: 'a6', title: 'Tạo phiếu nhập kho PN-0033', timeLabel: '12:10', kind: 'inventory', dimmed: true },
          { id: 'a7', title: 'Đóng gói đơn SPE-001239', timeLabel: '11:45', kind: 'order', dimmed: true },
          { id: 'a8', title: 'In 12 phiếu giao hàng', timeLabel: '11:30', kind: 'export', dimmed: true },
          { id: 'a9', title: 'Kiểm kê kho khu vực A', timeLabel: '11:00', kind: 'inventory', dimmed: true },
          { id: 'a10', title: 'Hoàn tất đơn SPE-001230', timeLabel: '10:45', kind: 'order', dimmed: true },
        ],
      },
      {
        id: 'yesterday',
        label: 'Hôm qua, 23 Oct',
        entries: [
          { id: 'a11', title: 'Điều chuyển kho nội bộ', timeLabel: '17:30', kind: 'inventory', dimmed: true },
          { id: 'a12', title: 'Xác nhận 5 đơn hàng mới', timeLabel: '16:45', kind: 'order', dimmed: true },
          { id: 'a13', title: 'Xuất báo cáo tồn kho tháng 10', timeLabel: '16:00', kind: 'export', dimmed: true },
          { id: 'a14', title: 'Nhập hàng bổ sung SKU: BT-02', timeLabel: '15:15', kind: 'inventory', dimmed: true },
          { id: 'a15', title: 'Đổi trạng thái đơn SPE-001220', timeLabel: '14:30', kind: 'order', dimmed: true },
          { id: 'a16', title: 'Tạo phiếu xuất trả nhà cung cấp', timeLabel: '11:20', kind: 'inventory', dimmed: true },
          { id: 'a17', title: 'Xác nhận 12 đơn sàn TMĐT', timeLabel: '10:15', kind: 'order', dimmed: true },
          { id: 'a18', title: 'Cập nhật vị trí kệ hàng', timeLabel: '09:30', kind: 'inventory', dimmed: true },
          { id: 'a19', title: 'Đăng nhập hệ thống', timeLabel: '08:00', kind: 'order', dimmed: true },
        ],
      },
    ],
  },
}