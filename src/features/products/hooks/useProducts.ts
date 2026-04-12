import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productsService } from '@/features/products/services/productsService'
import type { GetProductsParams } from '@/features/products/services/productsService'
import type { Product } from '@/types/product.types'

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

export const useProductAutomationTriggers = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', id, 'automation-triggers'],
    queryFn: () => productsService.getProductAutomationTriggers(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  })

  return {
    triggers: data?.items ?? [],
    lastUpdatedAt: data?.lastUpdatedAt,
    isLoading,
    isError,
    error,
  }
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<Product> }) => productsService.updateProduct(params.id, params.data),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['products', updatedProduct.id], updatedProduct)
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    updateProduct: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  }
}
