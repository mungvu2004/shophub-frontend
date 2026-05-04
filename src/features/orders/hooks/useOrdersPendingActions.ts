import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import { MESSAGES } from '@/constants/messages'
import { ordersPendingActionsService } from '@/features/orders/services/ordersPendingActionsService'
import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'
import type { Order, OrderStatus } from '@/types/order.types'

export function useOrdersPendingActions() {
  const queryClient = useQueryClient()
  const crud = useCRUDActions()

  const invalidatePendingActions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['orders', 'pending-actions'] })
    queryClient.invalidateQueries({ queryKey: ['orders'] })
  }, [queryClient])

  const handleCreate = useCallback(
    async (data: Partial<Order>) =>
      crud.handleCreate(
        () => ordersPendingActionsService.createPendingAction(data),
        { onSuccess: () => invalidatePendingActions() },
      ),
    [crud, invalidatePendingActions],
  )

  const handleUpdate = useCallback(
    async (id: string, data: Partial<Order>) =>
      crud.handleUpdate(
        () => ordersPendingActionsService.updatePendingAction(id, data),
        { onSuccess: () => invalidatePendingActions() },
      ),
    [crud, invalidatePendingActions],
  )

  const handleDelete = useCallback(
    async (id: string) =>
      crud.handleDelete(
        () => ordersPendingActionsService.deletePendingAction(id),
        { onSuccess: () => invalidatePendingActions() },
      ),
    [crud, invalidatePendingActions],
  )

  const handleStatusChange = useCallback(
    async (id: string, status: OrderStatus) =>
      crud.handleStatusChange(
        () => ordersPendingActionsService.updatePendingActionStatus(id, status),
        { onSuccess: () => invalidatePendingActions() },
      ),
    [crud, invalidatePendingActions],
  )

  const handleBulkApprove = useCallback(
    async (orderIds: string[]) =>
      crud.handleStatusChange(
        () => ordersPendingActionsService.bulkApprove(orderIds),
        {
          onSuccess: () => {
            invalidatePendingActions()
          },
        },
        {
          success: MESSAGES.ORDERS.PENDING_ACTIONS.SUCCESS.APPROVE_BULK,
          error: MESSAGES.ORDERS.PENDING_ACTIONS.ERROR.APPROVE_BULK,
        },
      ),
    [crud, invalidatePendingActions],
  )

  const handleBulkPrint = useCallback(
    async (orderIds: string[]) =>
      crud.handleUpdate(
        () => ordersPendingActionsService.bulkPrint(orderIds),
        {
          onSuccess: () => {
            invalidatePendingActions()
          },
        },
        {
          success: MESSAGES.ORDERS.PENDING_ACTIONS.SUCCESS.PRINT_BULK,
          error: MESSAGES.ORDERS.PENDING_ACTIONS.ERROR.PRINT_BULK,
        },
      ),
    [crud, invalidatePendingActions],
  )

  const handleBulkCancel = useCallback(
    async (orderIds: string[]) =>
      crud.handleDelete(
        () => ordersPendingActionsService.bulkCancel(orderIds),
        {
          onSuccess: () => {
            invalidatePendingActions()
          },
        },
        {
          success: MESSAGES.ORDERS.PENDING_ACTIONS.SUCCESS.CANCEL_BULK,
          error: MESSAGES.ORDERS.PENDING_ACTIONS.ERROR.CANCEL_BULK,
        },
      ),
    [crud, invalidatePendingActions],
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
      handleBulkApprove,
      handleBulkPrint,
      handleBulkCancel,
    }),
    [
      crud.isProcessing,
      crud.actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
      handleBulkApprove,
      handleBulkPrint,
      handleBulkCancel,
    ],
  )
}
