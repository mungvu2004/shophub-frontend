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
    title: 'Đơn SHOPEE-1047 sắp trễ SLA!',
    description: 'Còn 18 phút để xác nhận — Shopee sẽ tự hủy',
    timeAgo: '2 phút trước',
    category: 'orders',
    unread: true,
    actionLabel: 'Xử lý ngay',
    actionUrl: '/orders/SHOPEE-1047',
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
    description: '⭐⭐ — Sản phẩm tới muộn, không như mô tả',
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
  {
    id: 'n6',
    title: 'Đơn LAZADA-1042 chuyển sang "Packed"',
    description: 'Khách hàng: Trần Thị B (Ha Noi)',
    timeAgo: '45 phút trước',
    category: 'orders',
    unread: false,
    actionLabel: 'Xem chi tiết',
    actionUrl: '/orders/LAZADA-1042',
  },
  {
    id: 'n7',
    title: 'Hoàn tiền tự động: ord-042',
    description: 'Khách hàng Nguyễn Văn A yêu cầu hoàn',
    timeAgo: '1.5 tiếng trước',
    category: 'orders',
    unread: false,
    actionLabel: 'Kiểm tra',
    actionUrl: '/orders/ord-042',
  },
  {
    id: 'n8',
    title: 'Review 5 sao từ TikTok Shop',
    description: '⭐⭐⭐⭐⭐ — Chất lượng tuyệt vời!!!',
    timeAgo: '2 tiếng trước',
    category: 'reviews',
    unread: false,
  },
  {
    id: 'n9',
    title: 'SKU "Áo thun XL" hết hạn nhập vào',
    description: 'Kiểm tra lô hàng LOT-2026-04-001',
    timeAgo: '3 tiếng trước',
    category: 'inventory',
    unread: false,
    actionLabel: 'Xem batch',
    actionUrl: '/inventory/batches',
  },
  {
    id: 'n10',
    title: 'API Lazada hoạt động bình thường',
    description: 'Khôi phục kết nối sau sự cố 1h trước',
    timeAgo: '4 tiếng trước',
    category: 'sync',
    unread: false,
  },
  {
    id: 'n11',
    title: 'Doanh thu hôm nay: 450K',
    description: 'Tăng 15% so với hôm qua',
    timeAgo: '5 tiếng trước',
    category: 'orders',
    unread: false,
  },
  {
    id: 'n12',
    title: 'Quần jean XL stock cảnh báo',
    description: '5 units còn lại — automatic reorder được kích hoạt',
    timeAgo: '6 tiếng trước',
    category: 'inventory',
    unread: false,
    actionLabel: 'Xem chi tiết',
    actionUrl: '/inventory/alerts',
  },
  {
    id: 'n13',
    title: 'Review tiêu cực - Yêu cầu trả lời',
    description: '⭐⭐⭐ — Giao muộn, nhưng sản phẩm OK',
    timeAgo: '7 tiếng trước',
    category: 'reviews',
    unread: false,
    actionLabel: 'Trả lời ngay',
    actionUrl: '/crm/reviews',
  },
  {
    id: 'n14',
    title: 'Quy tắc tự động "Auto-confirm" chạy',
    description: '89 đơn được xác nhận tự động hôm nay',
    timeAgo: '8 tiếng trước',
    category: 'orders',
    unread: false,
  },
  {
    id: 'n15',
    title: 'Lazada Sync hoàn tất',
    description: '158 sản phẩm đã đồng bộ',
    timeAgo: '9 tiếng trước',
    category: 'sync',
    unread: false,
  },
]
