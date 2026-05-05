import { useState } from 'react'
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import type { StockAdjustment } from '@/features/inventory/logic/stockAdjustment.types'
import { AdjustmentStatusBadge } from '@/features/inventory/components/shared'
import { cn } from '@/lib/utils'
import { MESSAGES } from '@/constants/messages'

interface ApprovalBannerProps {
  adjustment: StockAdjustment
  canApprove: boolean
  onApprove: () => Promise<unknown> | void
  onReject: (reason: string) => Promise<unknown> | void
  isProcessing?: boolean
  actionType?: 'approving' | 'rejecting' | null
}

export function ApprovalBanner({
  adjustment,
  canApprove,
  onApprove,
  onReject,
  isProcessing = false,
  actionType = null,
}: ApprovalBannerProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'approve' | 'reject' | null
    rejectReason: string
  }>({
    isOpen: false,
    type: null,
    rejectReason: '',
  })

  const handleOpenApprove = () => {
    setConfirmDialog({ isOpen: true, type: 'approve', rejectReason: '' })
  }

  const handleOpenReject = () => {
    setConfirmDialog({ isOpen: true, type: 'reject', rejectReason: '' })
  }

  const handleCloseConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }))
  }

  const handleConfirmAction = async () => {
    if (confirmDialog.type === 'approve') {
      await onApprove()
    } else if (confirmDialog.type === 'reject') {
      if (confirmDialog.rejectReason.trim()) {
        await onReject(confirmDialog.rejectReason)
      }
    }
    handleCloseConfirm()
  }

  if (adjustment.status === 'COMPLETED' || adjustment.status === 'APPROVED') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
        <CheckCircle2 className="size-5" />
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Đã phê duyệt bởi {adjustment.approvedBy} vào {adjustment.approvedAt}</p>
          <AdjustmentStatusBadge status={adjustment.status} />
        </div>
      </div>
    )
  }

  if (adjustment.status === 'REJECTED') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-800">
        <XCircle className="size-5" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold">Yêu cầu bị từ chối</p>
            <AdjustmentStatusBadge status={adjustment.status} />
          </div>
          <p className="text-xs opacity-90">Lý do: {adjustment.rejectionReason}</p>
        </div>
      </div>
    )
  }

  const isApproving = isProcessing && actionType === 'approving'
  const isRejecting = isProcessing && actionType === 'rejecting'

  return (
    <>
      <div className={cn(
        "flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between",
        adjustment.requiresApproval ? "border-amber-100 bg-amber-50" : "border-slate-100 bg-slate-50"
      )}>
        <div className="flex items-start gap-3">
          {adjustment.requiresApproval ? (
            <AlertTriangle className="size-5 text-amber-600 mt-0.5" />
          ) : (
            <Clock className="size-5 text-slate-500 mt-0.5" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className={cn("text-sm font-bold", adjustment.requiresApproval ? "text-amber-900" : "text-slate-900")}>
                {adjustment.requiresApproval ? "Cần phê duyệt từ cấp trên" : "Chờ hoàn tất điều chỉnh"}
              </p>
              <AdjustmentStatusBadge status={adjustment.status} />
            </div>
            <p className="text-xs text-slate-500">
              {adjustment.requiresApproval
                ? `Biến động vượt ngưỡng cho phép (${Math.abs(adjustment.totalDifference)} đơn vị).`
                : "Vui lòng kiểm tra lại thông tin trước khi xác nhận."}
            </p>
          </div>
        </div>

        {canApprove && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={handleOpenReject}
              disabled={isProcessing}
              isLoading={isRejecting}
              loadingText="Đang từ chối..."
            >
              Từ chối
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleOpenApprove}
              disabled={isProcessing}
              isLoading={isApproving}
              loadingText="Đang phê duyệt..."
            >
              Phê duyệt ngay
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseConfirm()
        }}
        title={confirmDialog.type === 'approve'
          ? MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.APPROVE_TITLE
          : MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.REJECT_TITLE
        }
        description={confirmDialog.type === 'approve'
          ? MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.APPROVE_DESC
          : (
            <div className="space-y-3">
              <p>{MESSAGES.INVENTORY.STOCK_ADJUSTMENT.CONFIRM.REJECT_DESC}</p>
              <textarea
                value={confirmDialog.rejectReason}
                onChange={(e) => setConfirmDialog(prev => ({ ...prev, rejectReason: e.target.value }))}
                placeholder="Nhập lý do từ chối..."
                className="w-full min-h-[80px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          )
        }
        confirmText={confirmDialog.type === 'approve' ? 'Phê duyệt' : 'Từ chối'}
        cancelText="Hủy bỏ"
        onConfirm={handleConfirmAction}
        isConfirming={isProcessing}
        variant={confirmDialog.type === 'approve' ? 'primary' : 'danger'}
      />
    </>
  )
}
