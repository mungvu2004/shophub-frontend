export type NotificationTab = 'all' | 'unread' | 'orders' | 'inventory' | 'reviews' | 'sync'

export type NotificationPreferences = {
  orders: boolean
  inventory: boolean
  reviews: boolean
  sync: boolean
}

type NotificationItemBase = {
  category: 'orders' | 'inventory' | 'reviews' | 'sync'
  unread: boolean
}

export const NOTIFICATION_TABS = [
  { key: 'all' as const, label: 'Tất cả' },
  { key: 'unread' as const, label: 'Chưa đọc' },
  { key: 'orders' as const, label: 'Đơn hàng' },
  { key: 'inventory' as const, label: 'Kho hàng' },
]

export const NOTIFICATION_PREFERENCE_ITEMS = [
  { key: 'orders' as const, label: 'Đơn hàng SLA' },
  { key: 'inventory' as const, label: 'Tồn kho thấp' },
  { key: 'reviews' as const, label: 'Review tiêu cực' },
  { key: 'sync' as const, label: 'Đồng bộ hoàn tất' },
]

export function filterNotificationsByTab<T extends NotificationItemBase>(
  notifications: T[],
  tab: NotificationTab,
) {
  if (tab === 'all') {
    return notifications
  }

  if (tab === 'unread') {
    return notifications.filter((item) => item.unread)
  }

  return notifications.filter((item) => item.category === tab)
}
