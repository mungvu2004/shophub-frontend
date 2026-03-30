import { apiClient } from '@/services/apiClient'

export type NotificationPreferencePayload = {
  orders?: boolean
  inventory?: boolean
  reviews?: boolean
  sync?: boolean
}

export const notificationAPI = {
  /**
   * Mark a single notification as read
   */
  markAsRead: async (notificationId: string) => {
    return apiClient.post(`/notifications/${notificationId}/read`)
  },

  /**
   * Mark all unread notifications as read
   */
  markAllAsRead: async () => {
    return apiClient.post('/notifications/read-all')
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (preferences: NotificationPreferencePayload) => {
    return apiClient.put('/notifications/preferences', preferences)
  },

  /**
   * Get all notifications for current user
   */
  getNotifications: async () => {
    return apiClient.get('/notifications')
  },
}
