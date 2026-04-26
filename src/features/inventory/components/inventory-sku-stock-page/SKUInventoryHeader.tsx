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
    <div className="bg-abstract-geometric grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-200 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tổng SKU</p>
            <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{totalSKUs.toLocaleString()}</p>
            <p className="text-[11px] font-medium text-slate-500">Danh mục đang theo dõi</p>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            <Boxes className="h-5 w-5" />
          </div>
        </div>
      </article>

      <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-amber-200 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SKU cảnh báo</p>
            <p className="text-3xl font-black text-amber-600 font-mono tracking-tighter">{lowStockCount.toLocaleString()}</p>
            <p className="text-[11px] font-medium text-slate-500">Tỉ lệ rủi ro: <span className="text-amber-600 font-bold">{lowStockRatio}%</span></p>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </article>

      {totalValue && (
        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Giá trị tồn kho</p>
              <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter truncate max-w-[180px]">{totalValue}</p>
              <p className="text-[11px] font-medium text-slate-500">Ước tính theo snapshot</p>
            </div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </article>
      )}

      {lastUpdated && (
        <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cập nhật gần nhất</p>
              <p className="text-2xl font-black text-slate-700 font-mono tracking-tighter">{lastUpdated}</p>
              <p className="text-[11px] font-medium text-slate-500">Đồng bộ dữ liệu trong ngày</p>
            </div>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-800 group-hover:text-white">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </article>
      )}
    </div>
  )
}

