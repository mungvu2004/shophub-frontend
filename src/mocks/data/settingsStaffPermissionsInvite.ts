import type { SettingsStaffPermissionsInviteResponse } from '@/features/settings/logic/settingsStaffPermissionsInvite.types'

export const settingsStaffPermissionsInviteMock: SettingsStaffPermissionsInviteResponse = {
  title: 'Mời nhân viên mới',
  emailLabel: 'Địa chỉ Email',
  emailPlaceholder: 'VD: nhanvien@shophub.vn',
  defaultRoleLabel: 'Vai trò mặc định',
  defaultRoleOptions: [
    { id: 'role-warehouse', label: 'Nhân viên kho' },
    { id: 'role-support', label: 'CSKH' },
    { id: 'role-sales', label: 'Kinh doanh' },
    { id: 'role-owner', label: 'Chủ shop' },
  ],
  permissionsLabel: 'Tuỳ chỉnh quyền nhanh',
  permissions: [
    { id: 'perm-revenue', label: 'Truy cập Báo cáo doanh thu', defaultChecked: false },
    { id: 'perm-stock', label: 'Chỉnh sửa tồn kho', defaultChecked: true },
    { id: 'perm-customer', label: 'Quản lý Khách hàng', defaultChecked: false },
  ],
  submitLabel: 'Gửi lời mời thành viên',
  helperText: 'Mỗi email chứa link kích hoạt sẽ được gửi đến nhân viên ngay lập tức.',
}