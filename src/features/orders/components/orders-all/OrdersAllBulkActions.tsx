type OrdersAllBulkActionsProps = {
  selectedCount: number
  onClearSelection: () => void
}

export function OrdersAllBulkActions({ selectedCount, onClearSelection }: OrdersAllBulkActionsProps) {
  if (selectedCount <= 0) return null

  return (
    <section className="flex items-center justify-between border-b border-indigo-200 bg-indigo-50 px-6 pb-[11px] pt-[10px]">
      <p className="text-[13px] font-semibold leading-[19.5px] text-indigo-600">{selectedCount} đơn đã chọn</p>

      <div className="flex flex-1 items-center justify-center gap-2">
        <button type="button" className="h-8 rounded-lg bg-indigo-600 px-4 text-[12px] font-semibold leading-[18px] text-white">
          Xác nhận tất cả
        </button>
        <button type="button" className="h-8 rounded-lg border border-indigo-600 bg-white px-4 text-[12px] font-semibold leading-[18px] text-indigo-600">
          In vận đơn
        </button>
        <button type="button" className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-4 text-[12px] font-semibold leading-[18px] text-slate-500">
          Xuất CSV
        </button>
        <button type="button" className="h-8 px-4 text-[12px] font-semibold leading-[18px] text-rose-500" onClick={onClearSelection}>
          Huỷ chọn
        </button>
      </div>

      <button type="button" className="text-xl leading-none text-slate-400 hover:text-slate-600" aria-label="Đóng thanh thao tác" onClick={onClearSelection}>×</button>
    </section>
  )
}
