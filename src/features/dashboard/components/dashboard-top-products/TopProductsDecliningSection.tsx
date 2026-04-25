import { ArrowDownRight, ArrowUpRight, ChevronRight, BellPlus } from 'lucide-react'
import { toast } from 'sonner'

import type { DashboardTopProductsViewModel } from '@/features/dashboard/logic/dashboardTopProducts.types'

type TopProductsDecliningSectionProps = {
  title: string
  items: DashboardTopProductsViewModel['decliningItems']
  onViewReason: (productId: string) => void
}

export function TopProductsDecliningSection({ title, items, onViewReason }: TopProductsDecliningSectionProps) {
  const handleCreateTask = (productName: string) => {
    toast.success(`Đã tạo nhiệm vụ kiểm tra sản phẩm "${productName}" cho nhân viên phụ trách.`)
  }

  return (
    <article className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-rose-900">{title}</h4>
        <p className="text-xs text-slate-500">Gần đây</p>
      </header>

      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const down = item.trendTone === 'down'

          return (
            <article key={item.id} className="rounded-xl border border-slate-50 p-3 transition-colors hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${down ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {down ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                    {item.trendLabel}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onViewReason(item.id)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
                >
                  Xem lý do
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateTask(item.name)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                  title="Tạo nhắc việc cho nhân viên"
                >
                  <BellPlus className="h-4 w-4" />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </article>
  )
}
