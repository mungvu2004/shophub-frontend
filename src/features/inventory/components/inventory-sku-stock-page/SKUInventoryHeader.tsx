import { AlertTriangle, Boxes, Package, TrendingUp } from 'lucide-react'

export type SKUInventoryHeaderProps = {
  totalSKUs: number
  lowStockCount: number
  totalValue?: string
  lastUpdated?: string
}

export function SKUInventoryHeader({
  totalSKUs,
  lowStockCount,
  totalValue,
  lastUpdated,
}: SKUInventoryHeaderProps) {
  const lowStockRatio = totalSKUs > 0 ? Math.round((lowStockCount / totalSKUs) * 100) : 0

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className="relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-100 via-white to-cyan-100 p-4">
        <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-sky-200/50" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Tổng SKU</p>
            <p className="text-3xl font-black text-slate-900">{totalSKUs}</p>
            <p className="text-xs text-slate-600">Danh mục đang được theo dõi</p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
            <Boxes className="h-5 w-5" />
          </span>
        </div>
      </article>

      <article className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-100 via-white to-orange-100 p-4">
        <div className="absolute -left-4 bottom-0 h-14 w-14 rounded-full bg-orange-200/55" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">SKU cảnh báo</p>
            <p className="text-3xl font-black text-slate-900">{lowStockCount}</p>
            <p className="text-xs text-slate-600">Chiếm {lowStockRatio}% tổng tồn kho</p>
          </div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
            <AlertTriangle className="h-5 w-5" />
          </span>
        </div>
      </article>

      {totalValue && (
        <article className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 via-white to-lime-100 p-4">
          <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-emerald-200/50" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Giá trị tồn kho</p>
              <p className="text-2xl font-black text-slate-900">{totalValue}</p>
              <p className="text-xs text-slate-600">Giá trị ước tính theo snapshot hiện tại</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>
        </article>
      )}

      {lastUpdated && (
        <article className="relative overflow-hidden rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-100 via-white to-zinc-100 p-4">
          <div className="absolute -left-4 -top-3 h-16 w-16 rounded-full bg-slate-200/65" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Cập nhật gần nhất</p>
              <p className="text-sm font-black text-slate-900">{lastUpdated}</p>
              <p className="text-xs text-slate-600">Đồng bộ dữ liệu trong ngày</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 text-white shadow-sm">
              <Package className="h-5 w-5" />
            </span>
          </div>
        </article>
      )}
    </div>
  )
}
