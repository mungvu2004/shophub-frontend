type OrderDetailItemsCardProps = {
  productName: string
  quantity: number
  subtotalLabel: string
  shippingLabel: string
  voucherLabel: string
  totalLabel: string
}

export function OrderDetailItemsCard({
  productName,
  quantity,
  subtotalLabel,
  shippingLabel,
  voucherLabel,
  totalLabel,
}: OrderDetailItemsCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Sản phẩm đặt mua</p>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-amber-50 text-slate-500">👕</div>
          <div>
            <p className="font-semibold text-slate-800">{productName}</p>
            <p className="text-sm text-slate-500">Số lượng: x {quantity}</p>
          </div>
        </div>
        <p className="font-mono text-sm font-semibold text-slate-700">{totalLabel}</p>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between text-slate-500"><span>Tạm tính</span><span className="font-mono">{subtotalLabel}</span></div>
        <div className="flex justify-between text-slate-500"><span>Phí ship</span><span className="font-mono">{shippingLabel}</span></div>
        <div className="flex justify-between text-emerald-600"><span>Voucher</span><span className="font-mono">{voucherLabel}</span></div>
        <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900"><span>Tổng cộng</span><span className="font-mono">{totalLabel}</span></div>
      </div>
    </section>
  )
}
