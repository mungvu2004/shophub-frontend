type OrderDetailCustomerCardProps = {
  customerName: string
  phone: string
  address: string
}

export function OrderDetailCustomerCard({ customerName, phone, address }: OrderDetailCustomerCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Thông tin khách hàng</p>
      <p className="mt-2 text-lg font-bold text-slate-800">{customerName}</p>
      <p className="text-sm text-slate-600">{phone}</p>
      <div className="mt-1 flex items-center justify-between gap-2 text-sm text-slate-500">
        <p>{address}</p>
        <button type="button" className="font-semibold text-indigo-600 hover:underline">Xem hồ sơ KH</button>
      </div>
    </section>
  )
}
