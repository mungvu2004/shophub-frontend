import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type SKULowStockAlertProps = {
  count: number
  percentage?: number
  onViewAlerts?: () => void
  onDismiss?: () => void
  isDismissed?: boolean
}

export function SKULowStockAlert({
  count,
  percentage,
  onViewAlerts,
  onDismiss,
  isDismissed = false,
}: SKULowStockAlertProps) {
  if (isDismissed || count === 0) {
    return null
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-white p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(244,63,94,0.08),_transparent_45%)]" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              {count} SKU đang dưới ngưỡng an toàn
              {percentage ? ` (${percentage}%)` : ''}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Khuyến nghị điều chỉnh tồn kho hoặc lên đơn nhập bổ sung để tránh gián đoạn đơn hàng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-start">
          {onViewAlerts && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewAlerts}
              className="border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
            >
              Xem chi tiết
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
