import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

type OrdersAllHeaderProps = {
  title: string
  totalOrders: number
  pendingOrders: number
  isRefreshing: boolean
  onConfirmBatch: () => void
  onExportCsv: () => void
  onPrintWaybills: () => void
}

export function OrdersAllHeader({
  title,
  totalOrders,
  pendingOrders,
  isRefreshing,
  onConfirmBatch,
  onExportCsv,
  onPrintWaybills,
}: OrdersAllHeaderProps) {
  return (
    <ThemedPageHeader
      title={title}
      subtitle={
        <span className="flex items-center gap-2">
          <span>{totalOrders} đơn hôm nay</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span className="font-bold text-amber-600">{pendingOrders} cần xử lý ngay</span>
          {isRefreshing ? <span className="ml-2 text-[11px] font-bold text-amber-500 animate-pulse">Đang cập nhật...</span> : null}
        </span> as any
      }
      theme="orders"
      badge={{ text: 'Orders Management', icon: <ShoppingCart className="size-3.5" /> }}
    >
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl border-amber-300/50 bg-white/80 backdrop-blur px-4 text-sm font-black text-amber-700 hover:bg-white hover:text-amber-900 shadow-sm"
          onClick={onConfirmBatch}
        >
          Xác nhận loạt
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl border-amber-200/50 bg-white/80 backdrop-blur px-4 text-sm font-black text-slate-700 hover:bg-white hover:text-slate-900 shadow-sm"
          onClick={onExportCsv}
        >
          Xuất CSV
        </Button>
        <Button
          type="button"
          className="h-10 rounded-xl bg-amber-600 px-5 text-sm font-black text-white hover:bg-amber-700 shadow-sm"
          onClick={onPrintWaybills}
        >
          In mã VĐ
        </Button>
      </div>
    </ThemedPageHeader>
  )
}
