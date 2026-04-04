import { useQuery } from '@tanstack/react-query'

import { productsCompetitorTrackingService } from '@/features/products/services/productsCompetitorTrackingService'

export const useProductsCompetitorTracking = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', 'competitor-tracking'],
    queryFn: () => productsCompetitorTrackingService.getCompetitorTrackingData(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  }
}
