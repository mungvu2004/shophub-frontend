import { apiClient } from '@/services/apiClient'
import type { RevenuePlatformComparisonResponse } from '@/types/revenue.types'

class RevenuePlatformComparisonService {
  async getPlatformComparison(month: string): Promise<RevenuePlatformComparisonResponse> {
    const response = await apiClient.get('/revenue/platform-comparison', {
      params: {
        month,
      },
    })

    return response.data
  }
}

export const revenuePlatformComparisonService = new RevenuePlatformComparisonService()
