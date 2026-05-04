import { useCallback, useMemo } from 'react'
import { ordersAllService } from '@/features/orders/services/ordersAllService'
import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'
import type { Order } from '@/types/order.types'
import { MESSAGES } from '@/constants/messages'

export function useOrderActions(onSuccess?: () => void) {
  const crud = useCRUDActions()

  const handleCreate = useCallback(
    async (data: Partial<Order>) => {
      await crud.handleCreate(() => ordersAllService.createOrder(data), { onSuccess: () => onSuccess?.() })
    },
    [crud, onSuccess],
  )

  const handleUpdate = useCallback(
    async (id: string, data: Partial<Order>) => {
      await crud.handleUpdate(() => ordersAllService.updateOrder(id, data), { onSuccess: () => onSuccess?.() })
    },
    [crud, onSuccess],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await crud.handleDelete(() => ordersAllService.deleteOrder(id), { onSuccess: () => onSuccess?.() })
    },
    [crud, onSuccess],
  )

  const handleStatusChange = useCallback(
    async (id: string, status: string) => {
      await crud.handleStatusChange(() => ordersAllService.updateOrderStatus(id, status), { onSuccess: () => onSuccess?.() })
    },
    [crud, onSuccess],
  )

  const handleShip = useCallback(
    async (id: string) => {
      await crud.handleStatusChange(
        () => ordersAllService.updateOrderStatus(id, 'Shipped'),
        { onSuccess: () => onSuccess?.() },
        {
          processing: MESSAGES.PROCESSING.STATUS_CHANGE,
          success: MESSAGES.ORDERS.GENERAL.SUCCESS.SHIP_SUCCESS,
          error: MESSAGES.ORDERS.GENERAL.ERROR.SHIP_ERROR,
        },
      )
    },
    [crud, onSuccess],
  )

  const handleCancel = useCallback(
    async (id: string) => {
      await crud.handleStatusChange(
        () => ordersAllService.updateOrderStatus(id, 'Cancelled'),
        { onSuccess: () => onSuccess?.() },
        {
          processing: MESSAGES.PROCESSING.STATUS_CHANGE,
          success: MESSAGES.ORDERS.GENERAL.SUCCESS.CANCEL_SUCCESS,
          error: MESSAGES.ORDERS.GENERAL.ERROR.CANCEL_ERROR,
        },
      )
    },
    [crud, onSuccess],
  )

  const handleBulkConfirm = useCallback(
    async (ids: string[]) => {
      return await crud.handleStatusChange(
        () => ordersAllService.bulkConfirmOrders(ids),
        {
          onSuccess: (result) => {
            onSuccess?.()
            return result
          },
        },
        {
          processing: MESSAGES.PROCESSING.STATUS_CHANGE,
          success: MESSAGES.SUCCESS.STATUS_CHANGE,
          error: MESSAGES.ORDERS.GENERAL.ERROR.CONFIRM_BULK,
        },
      )
    },
    [crud, onSuccess],
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
      handleBulkConfirm,
      handleShip,
      handleCancel,
    }),
    [crud.actionType, crud.isProcessing, handleCreate, handleUpdate, handleDelete, handleStatusChange, handleBulkConfirm, handleShip, handleCancel],
  )
}
