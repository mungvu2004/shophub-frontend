import { apiClient } from '@/services/apiClient'

import type {
  DashboardKpiCrudPayload,
  DashboardKpiCrudRecord,
  DashboardKpiCrudStatus,
} from '@/features/dashboard/logic/dashboardKpiCrud.types'

type DashboardKpiCrudEnvelope = {
  success?: boolean
  data?: unknown
}

const toRecord = (value: unknown): DashboardKpiCrudRecord | null => {
  if (!value || typeof value !== 'object') return null

  const row = value as Record<string, unknown>

  const metricId = row.metricId
  const status = row.status

  if (
    typeof row.id !== 'string' ||
    typeof row.title !== 'string' ||
    typeof row.updatedAt !== 'string' ||
    (metricId !== 'today-revenue' &&
      metricId !== 'total-orders' &&
      metricId !== 'urgent-orders' &&
      metricId !== 'refund-rate') ||
    (status !== 'success' && status !== 'processing' && status !== 'cancelled' && status !== 'error')
  ) {
    return null
  }

  return {
    id: row.id,
    metricId,
    title: row.title,
    updatedAt: row.updatedAt,
    status,
  }
}

const toList = (value: unknown): DashboardKpiCrudRecord[] => {
  if (!Array.isArray(value)) return []
  return value.map(toRecord).filter((item): item is DashboardKpiCrudRecord => Boolean(item))
}

class DashboardKpiCrudService {
  async getConfigs(): Promise<DashboardKpiCrudRecord[]> {
    const response = await apiClient.get<DashboardKpiCrudEnvelope>('/dashboard/kpi-overview/configs')
    return toList(response.data?.data)
  }

  async createConfig(payload: DashboardKpiCrudPayload): Promise<DashboardKpiCrudRecord> {
    const response = await apiClient.post<DashboardKpiCrudEnvelope>('/dashboard/kpi-overview/configs', payload)
    const parsed = toRecord(response.data?.data)
    if (!parsed) {
      throw new Error('Không đọc được dữ liệu cấu hình KPI vừa tạo.')
    }
    return parsed
  }

  async updateConfig(id: string, payload: DashboardKpiCrudPayload): Promise<DashboardKpiCrudRecord> {
    const response = await apiClient.put<DashboardKpiCrudEnvelope>(`/dashboard/kpi-overview/configs/${id}`, payload)
    const parsed = toRecord(response.data?.data)
    if (!parsed) {
      throw new Error('Không đọc được dữ liệu cấu hình KPI sau khi cập nhật.')
    }
    return parsed
  }

  async deleteConfig(id: string): Promise<void> {
    await apiClient.delete(`/dashboard/kpi-overview/configs/${id}`)
  }

  async updateStatus(id: string, status: DashboardKpiCrudStatus): Promise<DashboardKpiCrudRecord> {
    const response = await apiClient.patch<DashboardKpiCrudEnvelope>(`/dashboard/kpi-overview/configs/${id}/status`, {
      status,
    })
    const parsed = toRecord(response.data?.data)
    if (!parsed) {
      throw new Error('Không đọc được dữ liệu cấu hình KPI sau khi đổi trạng thái.')
    }
    return parsed
  }
}

export const dashboardKpiCrudService = new DashboardKpiCrudService()
