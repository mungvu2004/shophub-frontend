import { useQuery } from '@tanstack/react-query'

import { revenueMlForecastService } from '@/features/revenue/services/revenueMlForecastService'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'

export function useRevenueMlForecast(days: RevenueMlForecastRangeDays) {
  return useQuery({
    queryKey: ['revenue', 'ml-forecast', days],
    queryFn: () => revenueMlForecastService.getForecast(days),
    staleTime: 5 * 60 * 1000,
  })
}
