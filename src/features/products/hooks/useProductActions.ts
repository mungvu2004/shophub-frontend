import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCRUDActions, type ActionType } from '@/features/shared/hooks/useCRUDActions'
import { productsService } from '@/features/products/services/productsService'
import { MESSAGES } from '@/constants/messages'
import type { Product } from '@/types/product.types'

interface UseProductActionsCallbacks {
  onSuccess?: () => void
}

interface UseProductActionsReturn {
  isProcessing: boolean
  actionType: ActionType
  handleCreate: (data: Partial<Product>) => Promise<Product | undefined>
  handleUpdate: (id: string, data: Partial<Product>) => Promise<Product | undefined>
  handleDelete: (id: string) => Promise<void>
  handleStatusChange: (id: string, status: string) => Promise<Product | undefined>
  handleBulkDelete: (ids: string[]) => Promise<{ deletedCount: number } | undefined>
  handleBulkStatusChange: (ids: string[], status: string) => Promise<{ updatedCount: number } | undefined>
  handleSync: (productIds: string[]) => Promise<{ syncedCount: number } | undefined>
}

export function useProductActions(callbacks?: UseProductActionsCallbacks): UseProductActionsReturn {
  const queryClient = useQueryClient()
  const crud = useCRUDActions()

  const invalidateProducts = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['products'] })
  }, [queryClient])

  const handleCreate = useCallback(
    async (data: Partial<Product>) => {
      const result = await crud.handleCreate(
        () => productsService.createProduct(data),
        {
          onSuccess: () => {
            invalidateProducts()
            callbacks?.onSuccess?.()
          },
        }
      ) as Product | undefined
      return result
    },
    [crud, invalidateProducts, callbacks]
  )

  const handleUpdate = useCallback(
    async (id: string, data: Partial<Product>) => {
      const result = await crud.handleUpdate(
        () => productsService.updateProduct(id, data),
        {
          onSuccess: (updated) => {
            queryClient.setQueryData(['products', id], updated)
            invalidateProducts()
            callbacks?.onSuccess?.()
          },
        }
      ) as Product | undefined
      return result
    },
    [crud, queryClient, invalidateProducts, callbacks]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await crud.handleDelete(
        () => productsService.deleteProduct(id),
        {
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['products', id] })
            invalidateProducts()
            callbacks?.onSuccess?.()
          },
        }
      )
    },
    [crud, queryClient, invalidateProducts, callbacks]
  )

  const handleStatusChange = useCallback(
    async (id: string, status: string) => {
      const result = await crud.handleStatusChange(
        () => productsService.updateProductStatus(id, status),
        {
          onSuccess: (updated) => {
            queryClient.setQueryData(['products', id], updated)
            invalidateProducts()
            callbacks?.onSuccess?.()
          },
        }
      ) as Product | undefined
      return result
    },
    [crud, queryClient, invalidateProducts, callbacks]
  )

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      const result = await crud.handleDelete(
        () => productsService.bulkDeleteProducts(ids),
        {
          onSuccess: () => {
            ids.forEach(id => {
              queryClient.removeQueries({ queryKey: ['products', id] })
            })
            invalidateProducts()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: MESSAGES.PROCESSING.DELETE,
          success: `Đã xóa ${ids.length} sản phẩm thành công.`,
          error: MESSAGES.ERROR.DELETE,
        }
      ) as { deletedCount: number } | undefined
      return result
    },
    [crud, queryClient, invalidateProducts, callbacks]
  )

  const handleBulkStatusChange = useCallback(
    async (ids: string[], status: string) => {
      const result = await crud.handleStatusChange(
        () => productsService.bulkUpdateProductStatus(ids, status),
        {
          onSuccess: () => {
            invalidateProducts()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: MESSAGES.PROCESSING.STATUS_CHANGE,
          success: `Đã cập nhật trạng thái ${ids.length} sản phẩm thành công.`,
          error: MESSAGES.ERROR.STATUS_CHANGE,
        }
      ) as { updatedCount: number } | undefined
      return result
    },
    [crud, invalidateProducts, callbacks]
  )

  const handleSync = useCallback(
    async (productIds: string[]) => {
      const result = await crud.handleStatusChange(
        () => productsService.syncProducts(productIds),
        {
          onSuccess: () => {
            invalidateProducts()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: 'Đang đồng bộ sản phẩm...',
          success: `Đã đồng bộ ${productIds.length} sản phẩm thành công.`,
          error: 'Đồng bộ sản phẩm thất bại. Vui lòng thử lại.',
        }
      ) as { syncedCount: number } | undefined
      return result
    },
    [crud, invalidateProducts, callbacks]
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
      handleBulkDelete,
      handleBulkStatusChange,
      handleSync,
    }),
    [
      crud.isProcessing,
      crud.actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
      handleBulkDelete,
      handleBulkStatusChange,
      handleSync,
    ]
  )
}
