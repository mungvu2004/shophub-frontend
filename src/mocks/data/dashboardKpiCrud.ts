import type {
  DashboardKpiCrudPayload,
  DashboardKpiCrudRecord,
  DashboardKpiCrudStatus,
} from '@/features/dashboard/logic/dashboardKpiCrud.types'

const nowIso = () => new Date().toISOString()

const buildId = () => `kpi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const dashboardKpiCrudMock: DashboardKpiCrudRecord[] = [
  {
    id: 'kpi-conf-1',
    metricId: 'today-revenue',
    title: 'Theo dõi doanh thu theo ngày',
    status: 'success',
    updatedAt: '2026-05-05T08:30:00Z',
  },
  {
    id: 'kpi-conf-2',
    metricId: 'total-orders',
    title: 'Giám sát đơn hàng toàn sàn',
    status: 'success',
    updatedAt: '2026-05-05T07:45:00Z',
  },
  {
    id: 'kpi-conf-3',
    metricId: 'urgent-orders',
    title: 'Tỷ lệ chuyển đổi và tồn kho',
    status: 'success',
    updatedAt: '2026-05-05T06:15:00Z',
  },
  {
    id: 'kpi-conf-4',
    metricId: 'total-orders',
    title: 'Cảnh báo đơn cần xác nhận',
    status: 'processing',
    updatedAt: '2026-05-05T10:00:00Z',
  },
  {
    id: 'kpi-conf-5',
    metricId: 'today-revenue',
    title: 'Hiệu suất SLA Shopee/Lazada',
    status: 'success',
    updatedAt: '2026-05-04T23:30:00Z',
  },
  {
    id: 'kpi-conf-6',
    metricId: 'urgent-orders',
    title: 'SKU dưới ngưỡng tồn kho',
    status: 'error',
    updatedAt: '2026-05-05T09:20:00Z',
  },
  {
    id: 'kpi-conf-7',
    metricId: 'refund-rate',
    title: 'Tỷ lệ hoàn/hủy hàng',
    status: 'success',
    updatedAt: '2026-05-05T05:00:00Z',
  },
  {
    id: 'kpi-conf-8',
    metricId: 'today-revenue',
    title: 'Giá trị trung bình đơn hàng',
    status: 'success',
    updatedAt: '2026-05-04T20:10:00Z',
  },
  {
    id: 'kpi-conf-9',
    metricId: 'total-orders',
    title: 'Mức độ hài lòng khách hàng',
    status: 'processing',
    updatedAt: '2026-05-05T10:15:00Z',
  },
  {
    id: 'kpi-conf-10',
    metricId: 'refund-rate',
    title: 'Biên lợi nhuận theo danh mục',
    status: 'success',
    updatedAt: '2026-05-04T19:45:00Z',
  },
]

export const createDashboardKpiCrudMock = (payload: DashboardKpiCrudPayload): DashboardKpiCrudRecord => {
  const nextItem: DashboardKpiCrudRecord = {
    id: buildId(),
    metricId: payload.metricId,
    title: payload.title.trim(),
    status: payload.status,
    updatedAt: nowIso(),
  }

  dashboardKpiCrudMock.unshift(nextItem)
  return nextItem
}

export const updateDashboardKpiCrudMock = (
  id: string,
  payload: DashboardKpiCrudPayload,
): DashboardKpiCrudRecord | null => {
  const index = dashboardKpiCrudMock.findIndex((item) => item.id === id)
  if (index < 0) return null

  const updatedItem: DashboardKpiCrudRecord = {
    ...dashboardKpiCrudMock[index],
    metricId: payload.metricId,
    title: payload.title.trim(),
    status: payload.status,
    updatedAt: nowIso(),
  }

  dashboardKpiCrudMock[index] = updatedItem
  return updatedItem
}

export const deleteDashboardKpiCrudMock = (id: string): boolean => {
  const index = dashboardKpiCrudMock.findIndex((item) => item.id === id)
  if (index < 0) return false
  dashboardKpiCrudMock.splice(index, 1)
  return true
}

export const updateDashboardKpiCrudStatusMock = (
  id: string,
  status: DashboardKpiCrudStatus,
): DashboardKpiCrudRecord | null => {
  const index = dashboardKpiCrudMock.findIndex((item) => item.id === id)
  if (index < 0) return null

  const updatedItem: DashboardKpiCrudRecord = {
    ...dashboardKpiCrudMock[index],
    status,
    updatedAt: nowIso(),
  }

  dashboardKpiCrudMock[index] = updatedItem
  return updatedItem
}
