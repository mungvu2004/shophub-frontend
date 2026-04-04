import { apiClient } from '@/services/apiClient'
import type { RevenueMlForecastRangeDays, RevenueMlForecastResponse } from '@/types/revenue.types'

class RevenueMlForecastService {
  async getForecast(days: RevenueMlForecastRangeDays): Promise<RevenueMlForecastResponse> {
    const response = await apiClient.get('/revenue/ml-forecast', {
      params: {
        days,
      },
    })

    return response.data
  }
}

export const revenueMlForecastService = new RevenueMlForecastService()
