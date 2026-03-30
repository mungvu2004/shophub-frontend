export type NotificationCategory = 'orders' | 'inventory' | 'reviews' | 'sync'

export type NotificationItem = {
  id: string
  title: string
  description: string
  timeAgo: string
  category: NotificationCategory
  unread: boolean
  actionLabel?: string
  actionUrl?: string
}

export const notificationsMock: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Đơn SPE-001247 sắp trễ SLA!',
    description: 'Còn 18 phút để xác nhận — Shopee sẽ tự hủy',
    timeAgo: '2 phút trước',
    category: 'orders',
    unread: true,
    actionLabel: 'Xử lý ngay',
    actionUrl: '/orders/SPE-001247',
  },
  {
    id: 'n2',
    title: 'Tồn kho AT-WHT-XL sắp hết',
    description: 'Còn 6 units — dự báo hết trong 3 ngày',
    timeAgo: '8 phút trước',
    category: 'inventory',
    unread: true,
    actionLabel: 'Nhập kho',
    actionUrl: '/inventory',
  },
  {
    id: 'n3',
    title: 'Review tiêu cực mới từ Shopee',
    description: '⭐⭐⭐⭐⭐ — Ấn được giải đáp nhanh!!!',
    timeAgo: '14 phút trước',
    category: 'reviews',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Đồng bộ Shopee hoàn tất',
    description: '247 đơn được cập nhật, 3 đơn mới',
    timeAgo: '20 phút trước',
    category: 'sync',
    unread: false,
  },
  {
    id: 'n5',
    title: 'AI Dự báo mới sẵn sàng',
    description: '30 SKU được dự báo tồn kho — 8 cần nhập gấp',
    timeAgo: '1 tiếng trước',
    category: 'inventory',
    unread: false,
  },
]
