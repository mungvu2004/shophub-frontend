import { Boxes, CircleCheck, CircleOff, Store } from 'lucide-react'

import type { ProductDetailStats } from '@/features/products/logic/productDetailPage.types'

type ProductDetailStatsGridProps = {
  stats: ProductDetailStats
}

export function ProductDetailStatsGrid({ stats }: ProductDetailStatsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <Boxes className="size-4" />
          <p className="text-[11px] uppercase tracking-[0.5px]">Tong bien the</p>
        </div>
        <p className="text-3xl font-black text-slate-900">{stats.totalVariants}</p>
      </article>

      <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-emerald-700">
          <CircleCheck className="size-4" />
          <p className="text-[11px] uppercase tracking-[0.5px]">Bien the hoat dong</p>
        </div>
        <p className="text-3xl font-black text-emerald-700">{stats.activeVariants}</p>
      </article>

      <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-amber-700">
          <CircleOff className="size-4" />
          <p className="text-[11px] uppercase tracking-[0.5px]">Bien the tam dung</p>
        </div>
        <p className="text-3xl font-black text-amber-700">{stats.inactiveVariants}</p>
      </article>

      <article className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-indigo-700">
          <Store className="size-4" />
          <p className="text-[11px] uppercase tracking-[0.5px]">Kenh dang ban</p>
        </div>
        <p className="text-3xl font-black text-indigo-700">{stats.listedChannels}</p>
      </article>
    </section>
  )
}
