import { Boxes, CircleCheck, CircleOff, Store } from 'lucide-react'

import type { ProductDetailStats } from '@/features/products/logic/productDetailPage.types'

type ProductDetailStatsGridProps = {
  stats: ProductDetailStats
}

export function ProductDetailStatsGrid({ stats }: ProductDetailStatsGridProps) {
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <article className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
            <Boxes className="size-4 text-slate-600" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tổng biến thể</p>
        </div>
        <p className="text-3xl font-black text-slate-900">{stats.totalVariants}</p>
      </article>

      <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
            <CircleCheck className="size-4 text-emerald-600" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Biến thể hoạt động</p>
        </div>
        <p className="text-3xl font-black text-emerald-700">{stats.activeVariants}</p>
      </article>

      <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
            <CircleOff className="size-4 text-amber-600" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Biến thể tạm dừng</p>
        </div>
        <p className="text-3xl font-black text-amber-700">{stats.inactiveVariants}</p>
      </article>

      <article className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100">
            <Store className="size-4 text-indigo-600" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Kênh đang bán</p>
        </div>
        <p className="text-3xl font-black text-indigo-700">{stats.listedChannels}</p>
      </article>
    </section>
  )
}
