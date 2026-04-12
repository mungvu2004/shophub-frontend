import type { SettingsProfileResponse } from '@/features/settings/logic/settingsProfile.types'

export const settingsProfileMock: SettingsProfileResponse = {
  title: 'Profile Settings',
  subtitle: 'Quản lý hồ sơ quản trị và tuỳ chọn vận hành cá nhân.',
  saveButtonLabel: 'Lưu thay đổi',
  profileCardTitle: 'Tài khoản chính',
  profileCardSubtitle: 'Thông tin dùng để hiển thị nội bộ trên hệ thống',
  stats: [
    {
      id: 'profile-stat-login-days',
      label: 'Ngày hoạt động liên tục',
      value: 21,
      suffix: ' ngày',
    },
    {
      id: 'profile-stat-handled-alerts',
      label: 'Alerts đã xử lý tuần này',
      value: 48,
    },
    {
      id: 'profile-stat-rules-owned',
      label: 'Luồng automation phụ trách',
      value: 12,
    },
  ],
  identity: {
    fullName: 'Nguyen Hoang Minh',
    email: 'minh.nguyen@shophub.vn',
    phone: '+84 909 123 456',
    jobTitle: 'Operations Lead',
    timezone: 'Asia/Ho_Chi_Minh',
    bio: 'Vận hành đa sàn tập trung vào SLA và tối ưu tỷ lệ giao thành công.',
    location: 'Ho Chi Minh City, Vietnam',
    joinedAt: '2023-02-14T02:10:00.000Z',
  },
  preferences: [
    {
      id: 'profile-preference-alert-digest',
      label: 'Gộp cảnh báo theo giờ',
      description: 'Nhận alert digest mỗi 60 phút thay vì gửi realtime.',
      enabled: true,
    },
    {
      id: 'profile-preference-autoswitch',
      label: 'Tự chuyển dashboard theo ca làm',
      description: 'Ưu tiên hiển thị KPI đúng theo khung giờ vận hành.',
      enabled: false,
    },
    {
      id: 'profile-preference-order-priority',
      label: 'Ưu tiên đơn trễ SLA',
      description: 'Đưa các đơn có nguy cơ trễ lên đầu danh sách xử lý.',
      enabled: true,
    },
  ],
  securityChecks: [
    {
      id: 'profile-security-2fa',
      label: 'Xác thực 2 bước',
      description: 'Đã kích hoạt qua ứng dụng Authenticator.',
      status: 'healthy',
      actionLabel: 'Quản lý',
    },
    {
      id: 'profile-security-backup-mail',
      label: 'Email dự phòng',
      description: 'Chưa xác thực email backup, nên cập nhật trong hôm nay.',
      status: 'warning',
      actionLabel: 'Xác thực',
    },
  ],
  updatedAt: '2026-04-03T15:20:00.000Z',
}
