import { Button } from '@/components/ui/button'
import { Check, X, Zap } from 'lucide-react'

type OrdersReturnsActionButtonsProps = {
  canAutoRefund: boolean
  status: string
  onApprove: (e: React.MouseEvent) => void
  onReject: (e: React.MouseEvent) => void
  onAutoRefund: (e: React.MouseEvent) => void
}

export function OrdersReturnsActionButtons({
  canAutoRefund,
  status,
  onApprove,
  onReject,
  onAutoRefund,
}: OrdersReturnsActionButtonsProps) {
  if (status !== 'ĐANG XỬ LÝ') return null

  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="outline"
        size="sm"
        className="h-8 border-rose-200 px-2.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/20"
        onClick={onReject}
      >
        <X className="mr-1 h-3.5 w-3.5" />
        TỪ CHỐI
      </Button>

      {canAutoRefund ? (
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-indigo-200 bg-indigo-50 px-2.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-400"
          onClick={onAutoRefund}
        >
          <Zap className="mr-1 h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
          HOÀN TIỀN NHANH
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-emerald-200 px-2.5 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
          onClick={onApprove}
        >
          <Check className="mr-1 h-3.5 w-3.5" />
          DUNG NHẬN
        </Button>
      )}
    </div>
  )
}
