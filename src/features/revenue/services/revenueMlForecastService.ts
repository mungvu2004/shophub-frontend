import { apiClient } from '@/services/apiClient'
import type {
  RevenueMlForecastComparisonScenario,
  RevenueMlForecastRangeDays,
  RevenueMlForecastResponse,
  RevenueMlForecastScenarioInput,
} from '@/types/revenue.types'

class RevenueMlForecastService {
  async getForecast(days: RevenueMlForecastRangeDays): Promise<RevenueMlForecastResponse> {
    const response = await apiClient.get('/revenue/ml-forecast', {
      params: {
        days,
      },
    })

    return response.data
  }

  async simulateScenario(input: RevenueMlForecastScenarioInput): Promise<RevenueMlForecastComparisonScenario> {
    const response = await apiClient.post('/revenue/ml-forecast/simulate', input)
    return response.data
  }

  async getComparisonScenarios(): Promise<RevenueMlForecastComparisonScenario[]> {
    const response = await apiClient.get('/revenue/ml-forecast/comparison')
    return response.data
  }
}

export const revenueMlForecastService = new RevenueMlForecastService()
