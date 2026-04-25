import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StockAdjustment } from '@/features/inventory/logic/stockAdjustment.types'
import { cn } from '@/lib/utils'

interface ApprovalBannerProps {
  adjustment: StockAdjustment
  canApprove: boolean
  onApprove: () => void
  onReject: (reason: string) => void
}

export function ApprovalBanner({ adjustment, canApprove, onApprove, onReject }: ApprovalBannerProps) {
  if (adjustment.status === 'COMPLETED' || adjustment.status === 'APPROVED') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
        <CheckCircle2 className="size-5" />
        <p className="text-sm font-medium">Đã phê duyệt bởi {adjustment.approvedBy} vào {adjustment.approvedAt}</p>
      </div>
    )
  }

  if (adjustment.status === 'REJECTED') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-800">
        <XCircle className="size-5" />
        <div>
          <p className="text-sm font-bold">Yêu cầu bị từ chối</p>
          <p className="text-xs opacity-90">Lý do: {adjustment.rejectionReason}</p>
        </div>
      </div>
    )
  }

  return (
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
          <p className={cn("text-sm font-bold", adjustment.requiresApproval ? "text-amber-900" : "text-slate-900")}>
            {adjustment.requiresApproval ? "Cần phê duyệt từ cấp trên" : "Chờ hoàn tất điều chỉnh"}
          </p>
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
            onClick={() => {
              const reason = window.prompt('Lý do từ chối:')
              if (reason) onReject(reason)
            }}
          >
            Từ chối
          </Button>
          <Button 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onApprove}
          >
            Phê duyệt ngay
          </Button>
        </div>
      )}
    </div>
  )
}
