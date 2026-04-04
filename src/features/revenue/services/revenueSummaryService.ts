import { apiClient } from '@/services/apiClient'
import type { RevenueSummaryReportResponse } from '@/types/revenue.types'

class RevenueSummaryService {
  async getSummaryReport(month: string): Promise<RevenueSummaryReportResponse> {
    const response = await apiClient.get('/revenue/summary-report', {
      params: {
        month,
      },
    })

    return response.data
  }
}

export const revenueSummaryService = new RevenueSummaryService()
