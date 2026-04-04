import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/features/products/services/productsService'
import type { GetProductsParams } from '@/features/products/services/productsService'

export const useProducts = (params: GetProductsParams = {}) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  })

  return {
    products: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}

export const useProductById = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getProductById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  return { product: data, isLoading, isError, error }
}
