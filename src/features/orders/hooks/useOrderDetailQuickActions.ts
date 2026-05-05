import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'
import { MESSAGES } from '@/constants/messages'
import type { OrderDetailResponse } from '@/features/orders/logic/orderDetail.types'
import { orderDetailService } from '@/features/orders/services/orderDetailService'

type UseOrderDetailQuickActionsArgs = {
  orderId: string
  order?: OrderDetailResponse['order']
  refetchOrder: () => Promise<unknown>
}

export function useOrderDetailQuickActions(args: UseOrderDetailQuickActionsArgs) {
  const { orderId, order, refetchOrder } = args
  const queryClient = useQueryClient()
  const crud = useCRUDActions()

  const refreshOrderData = useCallback(async () => {
    await refetchOrder()
    await queryClient.invalidateQueries({ queryKey: ['orders'] })
  }, [refetchOrder, queryClient])

  const handleQuickAction = useCallback(async (actionId: string) => {
    if (!orderId || crud.isProcessing) return

    // Non-mutation actions
    if (actionId === 'track-order') {
      const trackingCode = order?.items?.find((item) => item.trackingCode)?.trackingCode
      if (trackingCode) {
        await navigator.clipboard.writeText(trackingCode)
      }
      return
    }

    if (actionId === 'view-proof') {
      return
    }

    if (actionId === 'view-support') {
      return
    }

    if (actionId === 'suggested-action') {
      return
    }

    // Mutation actions with standardized CRUD
    if (actionId === 'confirm-order') {
      await crud.handleStatusChange(
        () => orderDetailService.confirmOrder(orderId),
        { onSuccess: refreshOrderData },
        {
          processing: MESSAGES.PROCESSING.STATUS_CHANGE,
          success: MESSAGES.ORDERS.GENERAL.SUCCESS.CONFIRM_SUCCESS,
          error: MESSAGES.ORDERS.GENERAL.ERROR.CONFIRM_ERROR,
        },
      )
      return
    }

    if (actionId === 'cancel-order') {
      await crud.handleStatusChange(
        () => orderDetailService.cancelOrder(orderId),
        { onSuccess: refreshOrderData },
        {
          processing: MESSAGES.PROCESSING.STATUS_CHANGE,
          success: MESSAGES.ORDERS.GENERAL.SUCCESS.CANCEL_SUCCESS,
          error: MESSAGES.ORDERS.GENERAL.ERROR.CANCEL_ERROR,
        },
      )
      return
    }

    if (actionId === 'refund-order') {
      await crud.handleStatusChange(
        () => orderDetailService.refundOrder(orderId),
        { onSuccess: refreshOrderData },
        {
          processing: MESSAGES.PROCESSING.STATUS_CHANGE,
          success: MESSAGES.ORDERS.GENERAL.SUCCESS.REFUND_SUCCESS,
          error: MESSAGES.ORDERS.GENERAL.ERROR.REFUND_ERROR,
        },
      )
      return
    }
  }, [orderId, order, crud, refreshOrderData])

  return useMemo(() => ({
    isProcessing: crud.isProcessing,
    actionType: crud.actionType,
    activeActionId: crud.isProcessing ? 'processing' : null,
    handleQuickAction,
  }), [crud.isProcessing, crud.actionType, handleQuickAction])
}
