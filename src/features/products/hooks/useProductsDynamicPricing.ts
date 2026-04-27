import { useQuery } from '@tanstack/react-query'

import { productsDynamicPricingService } from '@/features/products/services/productsDynamicPricingService'
import { productsDynamicPricingMock } from '@/mocks/data/productsDynamicPricing'

export const useProductsDynamicPricing = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', 'dynamic-pricing'],
    queryFn: () => productsDynamicPricingService.getDynamicPricingData(),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: productsDynamicPricingMock,
  })

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  }
}
