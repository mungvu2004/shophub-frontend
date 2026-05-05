import { useState, useCallback, useMemo } from 'react'
import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'
import type { StockAdjustment, AdjustmentStatus } from '@/features/inventory/logic/stockAdjustment.types'
import { MESSAGES } from '@/constants/messages'

export type AdjustmentActionType = 'approving' | 'rejecting' | 'deleting' | null

interface UseStockAdjustmentActionsOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

interface ApprovalResult {
  success: boolean
  status: AdjustmentStatus
}

export function useStockAdjustmentActions(options: UseStockAdjustmentActionsOptions = {}) {
  const { onSuccess, onError } = options
  const crud = useCRUDActions<ApprovalResult>()

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'approve' | 'reject' | 'delete' | null
    adjustment: StockAdjustment | null
    rejectReason: string
  }>({
    isOpen: false,
    type: null,
    adjustment: null,
    rejectReason: '',
  })

  // Open confirmation dialogs
  const openApproveConfirm = useCallback((adjustment: StockAdjustment) => {
    setConfirmDialog({
      isOpen: true,
      type: 'approve',
      adjustment,
      rejectReason: '',
    })
  }, [])

  const openRejectConfirm = useCallback((adjustment: StockAdjustment) => {
    setConfirmDialog({
      isOpen: true,
      type: 'reject',
      adjustment,
      rejectReason: '',
    })
  }, [])

  const openDeleteConfirm = useCallback((adjustment: StockAdjustment) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      adjustment,
      rejectReason: '',
    })
  }, [])

  const closeConfirm = useCallback(() => {
    setConfirmDialog(prev => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  const setRejectReason = useCallback((reason: string) => {
    setConfirmDialog(prev => ({
      ...prev,
      rejectReason: reason,
    }))
  }, [])

  // Handle approve
  const handleApprove = useCallback(async (adjustmentId: string) => {
    const actionMessages = {
      processing: MESSAGES.PROCESSING.STATUS_CHANGE,
      success: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.SUCCESS.APPROVE,
      error: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.ERROR.APPROVE,
    }

    try {
      await crud.handleStatusChange(
        async () => {
          const response = await fetch(`/api/inventory/adjustments/${adjustmentId}/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          })
          if (!response.ok) throw new Error('Approval failed')
          return { success: true, status: 'APPROVED' as AdjustmentStatus }
        },
        {
          onSuccess: () => {
            onSuccess?.()
            closeConfirm()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        actionMessages
      )
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }, [crud, onSuccess, onError, closeConfirm])

  // Handle reject
  const handleReject = useCallback(async (adjustmentId: string, reason?: string) => {
    const actionMessages = {
      processing: MESSAGES.PROCESSING.STATUS_CHANGE,
      success: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.SUCCESS.REJECT,
      error: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.ERROR.REJECT,
    }

    try {
      await crud.handleStatusChange(
        async () => {
          const response = await fetch(`/api/inventory/adjustments/${adjustmentId}/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
          })
          if (!response.ok) throw new Error('Rejection failed')
          return { success: true, status: 'REJECTED' as AdjustmentStatus }
        },
        {
          onSuccess: () => {
            onSuccess?.()
            closeConfirm()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        actionMessages
      )
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }, [crud, onSuccess, onError, closeConfirm])

  // Get confirmation dialog content based on type
  const getConfirmDialogContent = useCallback(() => {
    switch (confirmDialog.type) {
      case 'approve':
        return {
          title: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.APPROVE_TITLE,
          description: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.APPROVE_DESC,
          confirmText: 'Phê duyệt',
          variant: 'primary' as const,
        }
      case 'reject':
        return {
          title: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.REJECT_TITLE,
          description: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.REJECT_DESC,
          confirmText: 'Từ chối',
          variant: 'danger' as const,
        }
      case 'delete':
        return {
          title: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.DELETE_TITLE,
          description: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.DELETE_DESC,
          confirmText: 'Xóa',
          variant: 'danger' as const,
        }
      default:
        return {
          title: '',
          description: '',
          confirmText: 'Xác nhận',
          variant: 'primary' as const,
        }
    }
  }, [confirmDialog.type])

  return useMemo(
    () => ({
      // States
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      isApproving: crud.actionType === 'status-changing' && confirmDialog.type === 'approve',
      isRejecting: crud.actionType === 'status-changing' && confirmDialog.type === 'reject',

      // Confirmation dialog state
      confirmDialog,

      // Actions
      openApproveConfirm,
      openRejectConfirm,
      openDeleteConfirm,
      closeConfirm,
      setRejectReason,
      handleApprove,
      handleReject,

      // Helpers
      getConfirmDialogContent,

      // Messages
      messages: {
        approve: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.APPROVE_TITLE,
        reject: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.REJECT_TITLE,
        delete: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.DELETE_TITLE,
        statusLabels: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.STATUS,
      },
    }),
    [
      crud.isProcessing,
      crud.actionType,
      confirmDialog,
      openApproveConfirm,
      openRejectConfirm,
      openDeleteConfirm,
      closeConfirm,
      setRejectReason,
      handleApprove,
      handleReject,
      getConfirmDialogContent,
    ]
  )
}
