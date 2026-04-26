import { Button } from '@/components/ui/button'

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
    <section className="rounded-xl bg-white bg-abstract-geometric px-6 py-4 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[22px] font-bold leading-[33px] tracking-[-0.55px] text-slate-800">{title}</h1>
          <p className="text-[14px] leading-5 text-slate-500">
            {totalOrders} đơn hôm nay - <span className="font-semibold text-orange-500">{pendingOrders} cần xử lý ngay</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-lg border-indigo-500 px-4 text-[14px] font-semibold text-indigo-600"
            onClick={onConfirmBatch}
          >
            Xác nhận loạt
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-lg border-slate-300 px-4 text-[14px] font-semibold text-slate-600"
            onClick={onExportCsv}
          >
            Xuất CSV
          </Button>
          <Button
            type="button"
            className="h-9 rounded-lg bg-indigo-600 px-4 text-[14px] font-semibold text-white hover:bg-indigo-700"
            onClick={onPrintWaybills}
          >
            In mã VĐ
          </Button>
        </div>
      </div>
      {isRefreshing ? <p className="mt-2 text-[11px] font-semibold text-slate-400">Đang cập nhật dữ liệu...</p> : null}
    </section>
  )
}
