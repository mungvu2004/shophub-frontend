import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'
import { inventoryService } from '@/features/inventory/services/inventoryService'
import type { StockLevel } from '@/types/inventory.types'
import { useMemo, useCallback } from 'react'
import { MESSAGES } from '@/constants/messages'

export type InventoryItem = StockLevel

interface UseInventoryActionsOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useInventoryActions(options: UseInventoryActionsOptions = {}) {
  const { onSuccess, onError } = options
  const crud = useCRUDActions<StockLevel | { deletedCount: number }>()

  const handleCreate = useCallback(
    async (data: Partial<StockLevel>) => {
      await crud.handleCreate(
        () => inventoryService.createSKU(data),
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        }
      )
    },
    [crud, onSuccess, onError]
  )

  const handleUpdate = useCallback(
    async (id: string, data: Partial<StockLevel>) => {
      await crud.handleUpdate(
        () => inventoryService.updateSKU(id, data),
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        }
      )
    },
    [crud, onSuccess, onError]
  )

  const handleDelete = useCallback(
    async (ids: string[]) => {
      await crud.handleDelete(
        () => inventoryService.deleteSKUs(ids),
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        }
      )
    },
    [crud, onSuccess, onError]
  )

  const handleDeleteSingle = useCallback(
    async (id: string) => {
      await handleDelete([id])
    },
    [handleDelete]
  )

  const getButtonLabel = useCallback(
    (baseLabel: string, loadingLabel: string) => {
      return crud.isProcessing ? loadingLabel : baseLabel
    },
    [crud.isProcessing]
  )

  return useMemo(
    () => ({
      // States
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      isCreating: crud.actionType === 'creating',
      isUpdating: crud.actionType === 'updating',
      isDeleting: crud.actionType === 'deleting',

      // Actions
      handleCreate,
      handleUpdate,
      handleDelete,
      handleDeleteSingle,

      // Helpers
      getButtonLabel,

      // Messages
      messages: {
        create: MESSAGES.INVENTORY.SKU.FORM.CREATE_SUBMIT,
        createLoading: MESSAGES.INVENTORY.SKU.BUTTON.ADD_LOADING,
        update: MESSAGES.INVENTORY.SKU.FORM.UPDATE_SUBMIT,
        updateLoading: MESSAGES.INVENTORY.SKU.BUTTON.EDIT_LOADING,
        delete: MESSAGES.INVENTORY.SKU.BUTTON.DELETE,
        deleteLoading: MESSAGES.INVENTORY.SKU.BUTTON.DELETE_LOADING,
      },
    }),
    [
      crud.isProcessing,
      crud.actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleDeleteSingle,
      getButtonLabel,
    ]
  )
}
