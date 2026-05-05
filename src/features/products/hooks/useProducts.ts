import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { productsService } from '@/features/products/services/productsService'
import type { GetProductsParams } from '@/features/products/services/productsService'
import type { Product } from '@/types/product.types'
import { useProductStore } from '@/stores/productStore'
import { productDataService } from '@/services/productDataService'

export const useProducts = (params: GetProductsParams = {}) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  })

  const { addProducts } = useProductStore()

  // Sync to ProductStore for centralized cache
  useEffect(() => {
    if (data?.items) {
      const normalizedProducts = data.items.map((product) =>
        productDataService.normalizeFromProduct(product)
      )
      addProducts(normalizedProducts)
    }
  }, [data, addProducts])

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

  const { addProduct } = useProductStore()

  // Sync to ProductStore for centralized cache
  useEffect(() => {
    if (data) {
      const normalizedProduct = productDataService.normalizeFromProduct(data)
      addProduct(normalizedProduct)
    }
  }, [data, addProduct])

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
  const { addProduct, invalidateProduct } = useProductStore()

  const mutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<Product> }) => productsService.updateProduct(params.id, params.data),
    onSuccess: (updatedProduct) => {
      // Update React Query cache
      queryClient.setQueryData(['products', updatedProduct.id], updatedProduct)
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      
      // Sync to ProductStore and invalidate for refresh
      const normalizedProduct = productDataService.normalizeFromProduct(updatedProduct)
      addProduct(normalizedProduct)
      invalidateProduct(updatedProduct.id)
    },
  })

  return {
    updateProduct: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  }
}
