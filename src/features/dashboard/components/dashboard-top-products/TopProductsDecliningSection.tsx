import { ArrowDownRight, ArrowUpRight, ChevronRight } from 'lucide-react'

import type { DashboardTopProductsViewModel } from '@/features/dashboard/logic/dashboardTopProducts.types'

type TopProductsDecliningSectionProps = {
  title: string
  items: DashboardTopProductsViewModel['decliningItems']
}

export function TopProductsDecliningSection({ title, items }: TopProductsDecliningSectionProps) {
  return (
    <article className="rounded-2xl border border-[#f7d6d6] bg-white p-5 shadow-sm">
      <header className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#991b1b]">{title}</h4>
        <p className="text-xs text-[#64748b]">Gần đây</p>
      </header>

      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const down = item.trendTone === 'down'

          return (
            <article key={item.id} className="rounded-xl border border-[#eef2ff] p-3">
              <div className="flex items-center gap-3">
                <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-semibold text-[#111c2d]">{item.name}</p>
                  <p className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${down ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {down ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                    {item.trendLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-md border border-[#e2e8f0] px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#f8fafc]"
              >
                Xem lý do
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </article>
          )
        })}
      </div>
    </article>
  )
}
