import { useQuery } from '@tanstack/react-query'

import { productsDynamicPricingService } from '@/features/products/services/productsDynamicPricingService'

export const useProductsDynamicPricing = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', 'dynamic-pricing'],
    queryFn: () => productsDynamicPricingService.getDynamicPricingData(),
    staleTime: 2 * 60 * 1000,
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
