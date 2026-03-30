import { http, HttpResponse } from 'msw'


import { notificationsMock } from '@/mocks/data/notifications'

export const notificationsHandlers = [
  // GET /api/notifications
  http.get('/api/notifications', () => {
    return HttpResponse.json({
      success: true,
     data: notificationsMock,
    })
  }),

  // POST /api/notifications/:id/read
  http.post('/api/notifications/:id/read', async ({ params }) => {
    const { id } = params
      const notification = notificationsMock.find((n) => n.id === id)
      if (notification) {
        notification.unread = false
      }
    return HttpResponse.json({
      success: true,
      message: `Notification ${id} marked as read`,
    })
  }),

  // POST /api/notifications/read-all
  http.post('/api/notifications/read-all', () => {
      notificationsMock.forEach((n) => {
        n.unread = false
      })
    return HttpResponse.json({
      success: true,
      message: 'All notifications marked as read',
    })
  }),

  // PUT /api/notifications/preferences
  http.put('/api/notifications/preferences', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      message: 'Preferences updated',
      data: body,
    })
  }),
]
