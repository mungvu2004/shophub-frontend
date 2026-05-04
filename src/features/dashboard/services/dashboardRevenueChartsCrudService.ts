import { apiClient } from '@/services/apiClient'
import type { RevenueTimelineEvent } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

export const dashboardRevenueChartsCrudService = {
  getEvents: async (): Promise<RevenueTimelineEvent[]> => {
    const response = await apiClient.get<{ success: boolean; data: RevenueTimelineEvent[] }>(
      '/api/dashboard/revenue-charts/events'
    )
    return response.data.data
  },

  createEvent: async (payload: Omit<RevenueTimelineEvent, 'id'>): Promise<RevenueTimelineEvent> => {
    const response = await apiClient.post<{ success: boolean; data: RevenueTimelineEvent }>(
      '/api/dashboard/revenue-charts/events',
      payload
    )
    return response.data.data
  },

  updateEvent: async (id: string, payload: Partial<RevenueTimelineEvent>): Promise<RevenueTimelineEvent> => {
    const response = await apiClient.put<{ success: boolean; data: RevenueTimelineEvent }>(
      `/api/dashboard/revenue-charts/events/${id}`,
      payload
    )
    return response.data.data
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/dashboard/revenue-charts/events/${id}`)
  },
}
