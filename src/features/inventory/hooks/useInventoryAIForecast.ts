import { useQuery } from '@tanstack/react-query'

import {
  inventoryAIForecastService,
  type InventoryAIForecastResponse,
} from '@/features/inventory/services/inventoryAIForecastService'

export function useInventoryAIForecast() {
  return useQuery<InventoryAIForecastResponse>({
    queryKey: ['inventory', 'ai-forecast'],
    queryFn: () => inventoryAIForecastService.getForecast(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  })
}
