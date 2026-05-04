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
    updatedAt: nowIso(),
  },
  {
    id: 'kpi-conf-2',
    metricId: 'total-orders',
    title: 'Giám sát đơn hàng toàn sàn',
    status: 'processing',
    updatedAt: nowIso(),
  },
  {
    id: 'kpi-conf-3',
    metricId: 'urgent-orders',
    title: 'Cảnh báo đơn cần xử lý',
    status: 'error',
    updatedAt: nowIso(),
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
