import { http, HttpResponse, delay } from 'msw'
import {
  getTimelineEvents,
  createTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
} from '@/mocks/data/dashboardRevenueCharts'
import type { RevenueTimelineEvent } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

export const dashboardRevenueChartsCrudHandlers = [
  http.get('/api/dashboard/revenue-charts/events', async () => {
    await delay(800)
    return HttpResponse.json({ success: true, data: getTimelineEvents() }, { status: 200 })
  }),

  http.post('/api/dashboard/revenue-charts/events', async ({ request }) => {
    await delay(1200)
    const payload = (await request.json()) as Omit<RevenueTimelineEvent, 'id'>
    const newEvent = createTimelineEvent(payload)
    return HttpResponse.json({ success: true, data: newEvent }, { status: 201 })
  }),

  http.put('/api/dashboard/revenue-charts/events/:id', async ({ params, request }) => {
    await delay(1200)
    const payload = (await request.json()) as Partial<RevenueTimelineEvent>
    const updated = updateTimelineEvent(String(params.id), payload)
    
    if (!updated) {
      return HttpResponse.json(
        { success: false, message: 'Không tìm thấy sự kiện để cập nhật.' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ success: true, data: updated }, { status: 200 })
  }),

  http.delete('/api/dashboard/revenue-charts/events/:id', async ({ params }) => {
    await delay(1200)
    const deleted = deleteTimelineEvent(String(params.id))
    
    if (!deleted) {
      return HttpResponse.json(
        { success: false, message: 'Không tìm thấy sự kiện để xóa.' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({ success: true, message: 'Xóa sự kiện thành công.' }, { status: 200 })
  }),
]
