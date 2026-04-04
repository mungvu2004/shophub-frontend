import { useQuery } from '@tanstack/react-query'

import {
  inventoryAIForecastService,
  type InventoryAIForecastDetailResponse,
} from '@/features/inventory/services/inventoryAIForecastService'

export function useInventoryAIForecastDetail(sku: string | null) {
  return useQuery<InventoryAIForecastDetailResponse>({
    queryKey: ['inventory', 'ai-forecast', 'detail', sku],
    queryFn: () => inventoryAIForecastService.getForecastDetail(sku ?? ''),
    enabled: typeof sku === 'string' && sku.length > 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  })
}
