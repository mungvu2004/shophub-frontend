import { delay, http, HttpResponse } from 'msw'

import type {
  DashboardKpiCrudPayload,
  DashboardKpiCrudStatus,
} from '@/features/dashboard/logic/dashboardKpiCrud.types'
import {
  createDashboardKpiCrudMock,
  dashboardKpiCrudMock,
  deleteDashboardKpiCrudMock,
  updateDashboardKpiCrudMock,
  updateDashboardKpiCrudStatusMock,
} from '@/mocks/data/dashboardKpiCrud'

const NETWORK_DELAY_MS = 700

const isValidPayload = (payload: Partial<DashboardKpiCrudPayload>): payload is DashboardKpiCrudPayload => {
  return Boolean(payload.metricId && payload.title && payload.status)
}

export const kpiOverviewCrudHandlers = [
  http.get('/api/dashboard/kpi-overview/configs', async () => {
    await delay(NETWORK_DELAY_MS)
    return HttpResponse.json({ success: true, data: dashboardKpiCrudMock }, { status: 200 })
  }),

  http.post('/api/dashboard/kpi-overview/configs', async ({ request }) => {
    await delay(NETWORK_DELAY_MS)
    const payload = (await request.json()) as Partial<DashboardKpiCrudPayload>
    if (!isValidPayload(payload)) {
      return HttpResponse.json({ success: false, message: 'Dữ liệu tạo cấu hình KPI không hợp lệ.' }, { status: 400 })
    }

    const createdItem = createDashboardKpiCrudMock(payload)
    return HttpResponse.json({ success: true, data: createdItem }, { status: 201 })
  }),

  http.put('/api/dashboard/kpi-overview/configs/:id', async ({ params, request }) => {
    await delay(NETWORK_DELAY_MS)
    const payload = (await request.json()) as Partial<DashboardKpiCrudPayload>
    if (!isValidPayload(payload)) {
      return HttpResponse.json({ success: false, message: 'Dữ liệu cập nhật cấu hình KPI không hợp lệ.' }, { status: 400 })
    }

    const updatedItem = updateDashboardKpiCrudMock(String(params.id), payload)
    if (!updatedItem) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy cấu hình KPI cần cập nhật.' }, { status: 404 })
    }

    return HttpResponse.json({ success: true, data: updatedItem }, { status: 200 })
  }),

  http.delete('/api/dashboard/kpi-overview/configs/:id', async ({ params }) => {
    await delay(NETWORK_DELAY_MS)
    const isDeleted = deleteDashboardKpiCrudMock(String(params.id))
    if (!isDeleted) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy cấu hình KPI cần xóa.' }, { status: 404 })
    }

    return HttpResponse.json({ success: true }, { status: 200 })
  }),

  http.patch('/api/dashboard/kpi-overview/configs/:id/status', async ({ params, request }) => {
    await delay(NETWORK_DELAY_MS)
    const payload = (await request.json()) as { status?: DashboardKpiCrudStatus }
    if (!payload.status) {
      return HttpResponse.json({ success: false, message: 'Trạng thái cập nhật không hợp lệ.' }, { status: 400 })
    }

    const updatedItem = updateDashboardKpiCrudStatusMock(String(params.id), payload.status)
    if (!updatedItem) {
      return HttpResponse.json({ success: false, message: 'Không tìm thấy cấu hình KPI cần đổi trạng thái.' }, { status: 404 })
    }

    return HttpResponse.json({ success: true, data: updatedItem }, { status: 200 })
  }),
]
