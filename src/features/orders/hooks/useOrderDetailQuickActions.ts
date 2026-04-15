import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { toast } from '@/components/ui/toast'
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
  const [activeActionId, setActiveActionId] = useState<string | null>(null)

  const refreshOrderData = async () => {
    await refetchOrder()
    await queryClient.invalidateQueries({ queryKey: ['orders'] })
  }

  const handleQuickAction = async (actionId: string) => {
    if (!orderId || activeActionId) return

    setActiveActionId(actionId)

    try {
      if (actionId === 'confirm-order') {
        await orderDetailService.confirmOrder(orderId)
        await refreshOrderData()
        toast.success('Đã xác nhận đơn hàng.')
        return
      }

      if (actionId === 'cancel-order') {
        await orderDetailService.cancelOrder(orderId)
        await refreshOrderData()
        toast.success('Đã cập nhật trạng thái hủy đơn.')
        return
      }

      if (actionId === 'refund-order') {
        await orderDetailService.refundOrder(orderId)
        await refreshOrderData()
        toast.success('Đã tạo yêu cầu hoàn cho đơn hàng.')
        return
      }

      if (actionId === 'track-order') {
        const trackingCode = order?.items?.find((item) => item.trackingCode)?.trackingCode

        if (trackingCode) {
          await navigator.clipboard.writeText(trackingCode)
          toast.success(`Đã sao chép mã vận đơn ${trackingCode}.`)
        } else {
          toast.info('Đơn chưa có mã vận đơn để theo dõi.')
        }

        return
      }

      if (actionId === 'view-proof') {
        toast.info('Đã chuyển sang phần lịch sử giao hàng để xem bằng chứng.')
        return
      }

      if (actionId === 'view-support') {
        toast.info('Đã mở phần Review KH để theo dõi phản hồi khách hàng.')
        return
      }

      if (actionId === 'suggested-action') {
        toast.info('Đã ghi nhận hành động gợi ý cho đơn hàng này.')
        return
      }

      toast.info('Hành động đang được cập nhật.')
    } catch {
      toast.error('Không thể thực hiện thao tác cho đơn hàng lúc này.')
    } finally {
      setActiveActionId(null)
    }
  }

  return {
    activeActionId,
    handleQuickAction,
  }
}
