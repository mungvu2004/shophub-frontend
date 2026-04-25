import { useState, useMemo } from 'react'
import type { StockAdjustment, StockAdjustmentItem } from '../logic/stockAdjustment.types'
import { calculateDifference, buildStockAdjustmentViewModel, checkRequiresApproval } from '../logic/stockAdjustment.logic'
import { toast } from 'sonner'

export function useStockAdjustment(initialAdjustment: StockAdjustment) {
  const [adjustment, setAdjustment] = useState<StockAdjustment>(initialAdjustment)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const viewModel = useMemo(() => {
    // Giả sử user hiện tại là ADMIN
    return buildStockAdjustmentViewModel(adjustment, 'ADMIN')
  }, [adjustment])

  const updateItemQty = (itemId: string, actualQty: number) => {
    setAdjustment(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === itemId) {
          const difference = calculateDifference(item.systemQty, actualQty)
          return { ...item, actualQty, difference }
        }
        return item
      })

      const totalDifference = newItems.reduce((acc, item) => acc + item.difference, 0)
      const requiresApproval = checkRequiresApproval(newItems)

      return {
        ...prev,
        items: newItems,
        totalDifference,
        requiresApproval
      }
    })
  }

  const submitAdjustment = async () => {
    setIsSubmitting(true)
    try {
      // Giả lập gọi API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setAdjustment(prev => ({ ...prev, status: prev.requiresApproval ? 'PENDING_APPROVAL' : 'COMPLETED' }))
      toast.success(adjustment.requiresApproval ? 'Đã gửi yêu cầu phê duyệt.' : 'Điều chỉnh kho thành công.')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu điều chỉnh.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const approveAdjustment = async () => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAdjustment(prev => ({ 
        ...prev, 
        status: 'COMPLETED', 
        approvedBy: 'Admin', 
        approvedAt: new Date().toLocaleString() 
      }))
      toast.success('Đã phê duyệt điều chỉnh kho.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const rejectAdjustment = async (reason: string) => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAdjustment(prev => ({ 
        ...prev, 
        status: 'REJECTED', 
        rejectionReason: reason 
      }))
      toast.error('Đã từ chối yêu cầu điều chỉnh.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    viewModel,
    updateItemQty,
    submitAdjustment,
    approveAdjustment,
    rejectAdjustment,
    isSubmitting
  }
}
