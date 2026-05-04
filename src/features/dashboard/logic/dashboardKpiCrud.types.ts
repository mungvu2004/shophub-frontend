export type DashboardKpiCrudStatus = 'success' | 'processing' | 'cancelled' | 'error'

export type DashboardKpiMetricId = 'today-revenue' | 'total-orders' | 'urgent-orders' | 'refund-rate'

export type DashboardKpiCrudRecord = {
  id: string
  metricId: DashboardKpiMetricId
  title: string
  status: DashboardKpiCrudStatus
  updatedAt: string
}

export type DashboardKpiCrudPayload = {
  metricId: DashboardKpiMetricId
  title: string
  status: DashboardKpiCrudStatus
}
