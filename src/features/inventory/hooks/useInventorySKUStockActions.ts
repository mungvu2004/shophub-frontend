import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'
import { inventoryService } from '@/features/inventory/services/inventoryService'
import type { StockLevel } from '@/types/inventory.types'
import { useMemo, useCallback } from 'react'

export function useInventorySKUStockActions(onSuccess?: () => void) {
  const crud = useCRUDActions<StockLevel | void>()

  const handleCreate = useCallback(
    async (data: Partial<StockLevel>) => {
      await crud.handleCreate(() => inventoryService.createSKU(data), { onSuccess })
    },
    [crud, onSuccess]
  )

  const handleUpdate = useCallback(
    async (id: string, data: Partial<StockLevel>) => {
      await crud.handleUpdate(() => inventoryService.updateSKU(id, data), { onSuccess })
    },
    [crud, onSuccess]
  )

  const handleDelete = useCallback(
    async (ids: string[]) => {
      await crud.handleDelete(() => inventoryService.deleteSKUs(ids), { onSuccess })
    },
    [crud, onSuccess]
  )

  const handleStatusChange = useCallback(
    async (id: string, status: string) => {
      // Placeholder for status change logic if needed
      // e.g. await crud.handleStatusChange(() => inventoryService.updateSKUStatus(id, status), { onSuccess })
      console.log('Status change requested for', id, status)
    },
    []
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
    }),
    [crud.isProcessing, crud.actionType, handleCreate, handleUpdate, handleDelete, handleStatusChange]
  )
}
