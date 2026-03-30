import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  ChevronRight,
  MessageSquare,
  RefreshCw,
  Settings,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { notificationsMock } from '@/mocks/data/notifications'
import { notificationAPI } from '@/services/notificationAPI'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  filterNotificationsByTab,
  NOTIFICATION_PREFERENCE_ITEMS,
  NOTIFICATION_TABS,
} from '@/components/layout/navbar/navbarNotifications.utils'
import type {
  NotificationPreferences,
  NotificationTab,
} from '@/components/layout/navbar/navbarNotifications.utils'

function getNotificationIcon(category: string) {
  const iconProps = { className: 'size-[15px]' }
  switch (category) {
    case 'orders':
      return { icon: <AlertCircle {...iconProps} />, bgColor: 'bg-red-100' }
    case 'inventory':
      return { icon: <AlertTriangle {...iconProps} />, bgColor: 'bg-yellow-100' }
    case 'reviews':
      return { icon: <MessageSquare {...iconProps} />, bgColor: 'bg-blue-100' }
    case 'sync':
      return { icon: <RefreshCw {...iconProps} />, bgColor: 'bg-purple-100' }
    default:
      return { icon: <Bell {...iconProps} />, bgColor: 'bg-blue-100' }
  }
}

export function NavbarNotificationsMenu() {
  const navigate = useNavigate()
  const [notificationTab, setNotificationTab] = useState<NotificationTab>('all')
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    orders: true,
    inventory: true,
    reviews: true,
    sync: false,
  })

  const unreadCount = useMemo(
    () => notificationsMock.filter((item) => item.unread).length,
    [],
  )

  const filteredNotifications = useMemo(() => {
    return filterNotificationsByTab(notificationsMock, notificationTab)
  }, [notificationTab])

  const getTabCount = (tab: NotificationTab) => {
    switch (tab) {
      case 'all':
        return notificationsMock.length
      case 'unread':
        return unreadCount
      case 'orders':
        return notificationsMock.filter((n) => n.category === 'orders').length
      case 'inventory':
        return notificationsMock.filter((n) => n.category === 'inventory').length
      default:
        return 0
    }
  }

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    // Navigate immediately
    if (actionUrl) {
      navigate(actionUrl)
    }

    // Mark as read in background (fire-and-forget)
    notificationAPI
      .markAsRead(notificationId)
      .catch((error) => {
        console.error('Failed to mark notification as read:', error)
        toast.error('Lỗi khi cập nhật thông báo: ' + (error?.message || 'Server không phản hồi'))
      })
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      toast.success('Đánh dấu tất cả thành đã đọc')
      // Reload notifications or update local state here if needed
    } catch (error) {
      toast.error('Lỗi khi cập nhật thông báo')
      console.error('Failed to mark all as read:', error)
    }
  }

  const handlePreferenceToggle = async (preferenceKey: keyof NotificationPreferences) => {
    try {
      const newPreferences = {
        ...notificationPreferences,
        [preferenceKey]: !notificationPreferences[preferenceKey],
      }
      setNotificationPreferences(newPreferences)

      // Send to API
      await notificationAPI.updatePreferences(newPreferences)
      toast.success('Cập nhật tùy chỉnh thành công')
    } catch (error) {
      // Revert on error
      setNotificationPreferences((prev) => ({
        ...prev,
        [preferenceKey]: !prev[preferenceKey],
      }))
      toast.error('Lỗi khi cập nhật tùy chỉnh')
      console.error('Failed to update preferences:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 outline-none hover:bg-slate-50 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 overflow-hidden p-0">
        {!showNotificationSettings ? (
          <>
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-slate-900">Thông báo</p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-600">
                    {unreadCount} chưa đọc
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNotificationSettings(true)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Settings className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-1">
                {NOTIFICATION_TABS.map((tab) => {
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setNotificationTab(tab.key as NotificationTab)}
                      className={cn(
                        'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        notificationTab === tab.key
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                      )}
                    >
                      {tab.label} ({getTabCount(tab.key)})
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-thin-custom">
              {filteredNotifications.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center gap-2 py-6 text-center">
                  <div className="rounded-full bg-slate-100 p-2 text-slate-400">
                    <Bell className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Tất cả đã đọc</p>
                </div>
              ) : (
                filteredNotifications.map((item, index) => {
                  const { icon, bgColor } = getNotificationIcon(item.category)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNotificationClick(item.id, item.actionUrl)}
                      className={cn(
                        'border-l-3 w-full flex gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50',
                        item.unread ? 'border-l-indigo-600 bg-indigo-50' : 'border-l-slate-200 bg-white',
                        index !== filteredNotifications.length - 1 && 'border-b border-b-slate-100',
                      )}
                    >
                      <div
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-full',
                          bgColor,
                        )}
                      >
                        {icon}
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-600">{item.description}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-slate-400">{item.timeAgo}</span>
                          {item.actionLabel && (
                            <span className="rounded px-2 py-0.5 text-xs font-bold text-indigo-600 bg-indigo-50">
                              {item.actionLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            <DropdownMenuSeparator className="m-0" />
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="flex w-full items-center justify-center gap-1 py-2 text-xs font-bold text-indigo-600 hover:bg-slate-50"
            >
              Xem tất cả thông báo
              <ChevronRight className="size-3" />
            </button>
          </>
        ) : (
          <>
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Tùy chỉnh thông báo</p>
                <button
                  type="button"
                  onClick={() => setShowNotificationSettings(false)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  [Đóng]
                </button>
              </div>
            </div>

            <div className="space-y-2 px-4 py-3">
              {NOTIFICATION_PREFERENCE_ITEMS.map((pref) => {
                const key = pref.key as keyof NotificationPreferences
                return (
                  <div key={pref.key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{pref.label}</span>
                    <button
                      type="button"
                      onClick={() => handlePreferenceToggle(key)}
                      className={cn(
                        'relative inline-flex h-5 w-9 rounded-full transition-colors',
                        notificationPreferences[key] ? 'bg-indigo-600' : 'bg-slate-300',
                      )}
                    >
                      <span
                        className={cn(
                          'absolute size-4 rounded-full bg-white transition-transform',
                          notificationPreferences[key] ? 'right-0.5 top-0.5' : 'left-0.5 top-0.5',
                        )}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
