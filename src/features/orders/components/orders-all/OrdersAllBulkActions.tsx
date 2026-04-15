type OrdersAllBulkActionsProps = {
  selectedCount: number
  onConfirmSelected: () => void
  onExportSelectedCsv: () => void
  onPrintSelectedWaybills: () => void
  onPushSelectedWarehouse: () => void
  onClearSelection: () => void
}

export function OrdersAllBulkActions({
  selectedCount,
  onConfirmSelected,
  onExportSelectedCsv,
  onPrintSelectedWaybills,
  onPushSelectedWarehouse,
  onClearSelection,
}: OrdersAllBulkActionsProps) {
  if (selectedCount <= 0) return null

  return (
    <section className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-5xl flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.55)] backdrop-blur">
        <p className="mr-1 text-[13px] font-semibold text-slate-700">Đã chọn {selectedCount} đơn</p>

        <button type="button" className="h-8 rounded-lg bg-indigo-600 px-3 text-[12px] font-semibold text-white" onClick={onConfirmSelected}>
          Xác nhận
        </button>
        <button type="button" className="h-8 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-[12px] font-semibold text-indigo-700" onClick={onPrintSelectedWaybills}>
          In mã VĐ
        </button>
        <button type="button" className="h-8 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-[12px] font-semibold text-emerald-700" onClick={onPushSelectedWarehouse}>
          Đẩy kho
        </button>
        <button type="button" className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[12px] font-semibold text-slate-600" onClick={onExportSelectedCsv}>
          Xuất CSV
        </button>
        <button type="button" className="h-8 px-2 text-[12px] font-semibold text-rose-500" onClick={onClearSelection}>
          Bỏ chọn
        </button>
      </div>
    </section>
  )
}
