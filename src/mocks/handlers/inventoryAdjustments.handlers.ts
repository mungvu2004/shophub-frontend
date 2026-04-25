import { http, HttpResponse, delay } from 'msw'
import { mockAdjustments } from '../data/inventoryAdjustments'

export const inventoryAdjustmentsHandlers = [
  http.get('/api/inventory/adjustments', async () => {
    await delay(500)
    return HttpResponse.json(mockAdjustments)
  }),

  http.get('/api/inventory/adjustments/:id', async ({ params }) => {
    await delay(300)
    const { id } = params
    const adjustment = mockAdjustments.find(a => a.id === id)
    if (!adjustment) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(adjustment)
  }),

  http.post('/api/inventory/adjustments', async ({ request }) => {
    await delay(1000)
    const newAdjustment = (await request.json()) as any
    return HttpResponse.json({ ...newAdjustment, id: `adj-${Date.now()}`, status: 'PENDING_APPROVAL' }, { status: 201 })
  }),

  http.post('/api/inventory/adjustments/:id/approve', async ({ params }) => {
    await delay(800)
    return HttpResponse.json({ success: true, status: 'APPROVED' })
  }),

  http.post('/api/inventory/adjustments/:id/reject', async ({ params, request }) => {
    await delay(800)
    const { reason } = (await request.json()) as any
    return HttpResponse.json({ success: true, status: 'REJECTED', reason })
  }),
]
