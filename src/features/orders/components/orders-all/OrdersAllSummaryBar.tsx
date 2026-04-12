type OrdersAllSummaryBarProps = {
  totalOrdersLabel: string
  totalRevenueLabel: string
  pendingLabel: string
}

export function OrdersAllSummaryBar({ totalOrdersLabel, totalRevenueLabel, pendingLabel }: OrdersAllSummaryBarProps) {
  return (
    <section className="border-b border-slate-200 bg-white px-6 pb-[9px] pt-[7px] text-[13px] text-slate-500">
      Tổng: <span className="font-semibold text-slate-800">{totalOrdersLabel}</span>
      <span className="mx-2.5 text-slate-300">|</span>
      Doanh thu: <span className="font-mono font-bold text-slate-800">{totalRevenueLabel}</span>
      <span className="mx-2.5 text-slate-300">|</span>
      Cần xử lý: <span className="font-bold text-orange-500">{pendingLabel}</span>
    </section>
  )
}
