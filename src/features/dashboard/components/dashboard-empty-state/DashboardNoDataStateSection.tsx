import { CircleHelp, Music2, Store } from 'lucide-react'

export function DashboardNoDataStateSection() {
  return (
    <section className="relative min-h-[500px] rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[420px] flex-col items-center px-6 pb-10 pt-16 text-center">
        <div className="relative mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-indigo-50/50">
          <span className="absolute left-[30%] top-[40%] h-1 w-5 -rotate-[55deg] rounded-full bg-indigo-300/70" />
          <span className="absolute right-[28%] top-[34%] h-1 w-5 rotate-[55deg] rounded-full bg-indigo-300/70" />
          <CircleHelp className="h-16 w-16 text-indigo-700" strokeWidth={2.1} />
        </div>

        <h3 className="text-lg font-semibold leading-7 text-slate-800">Chưa có dữ liệu hôm nay</h3>
        <p className="mt-3 text-sm leading-[22px] text-slate-500">
          Kết nối Shopee hoặc TikTok Shop để bắt đầu đồng bộ
          <br />
          đơn hàng và quản lý kinh doanh hiệu quả.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            className="h-12 rounded-xl bg-indigo-700 px-10 text-sm font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(99,102,241,0.2),0px_4px_6px_-4px_rgba(99,102,241,0.2)] hover:bg-indigo-600"
          >
            Kết nối sàn ngay
          </button>
          <button
            type="button"
            className="h-12 rounded-xl border border-slate-200 bg-white px-10 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Xem hướng dẫn
          </button>
        </div>

        <div className="mt-8 flex items-center gap-8 text-xs font-bold uppercase tracking-[0.1em] text-slate-300">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Shopee</span>
          </div>
          <span className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4" />
            <span>TikTok Shop</span>
          </div>
        </div>
      </div>
    </section>
  )
}
