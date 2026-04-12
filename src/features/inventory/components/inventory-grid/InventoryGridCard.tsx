import { ShoppingCart } from 'lucide-react'
import type { InventoryTableRow } from '@/features/inventory/logic/inventoryTable.types'

type InventoryGridCardProps = {
  row: InventoryTableRow
  variant?: 'normal' | 'low'
  onAction?: (action: string, rowId: string) => void
  onOpenProductDetail?: (rowId: string, productId?: string) => void
}

export function InventoryGridCard({ row, variant = 'normal', onAction, onOpenProductDetail }: InventoryGridCardProps) {
  const displayId = row.id.slice(-4).toUpperCase()
  const isLow = variant === 'low'

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.05)] ${
        isLow ? 'h-[328.5px] border-2 border-amber-100' : 'h-[345px] border border-slate-100'
      }`}
      onClick={() => onOpenProductDetail?.(row.id, row.productId)}
    >
      <div className={`relative h-40 overflow-hidden ${isLow ? 'bg-amber-50' : 'bg-slate-50'}`}>
        {row.image ? (
          <img src={row.image} alt={row.sku} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}

        {isLow ? (
          <div className="absolute left-2 top-2 rounded-md border border-amber-200 bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase text-amber-800 shadow-sm">
            Thấp
          </div>
        ) : (
          <div className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-900 shadow-sm backdrop-blur-sm">
            ID: #{displayId}
          </div>
        )}
      </div>

      <div className={`space-y-1 px-4 ${isLow ? 'pb-5 pt-3' : 'py-3'}`}>
        <p className="font-mono text-[11px] font-medium tracking-[0.02em] text-slate-400">{row.sku}</p>

        <div className="h-10 overflow-hidden">
          <p className="line-clamp-2 text-[13px] font-semibold leading-[1.25] text-slate-900">
            {row.productName}
          </p>
        </div>

        <div className="pt-1">
          <p className={`flex items-center gap-2 text-xs font-bold ${isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
            <span className={`h-2 w-2 rounded-full ${isLow ? 'bg-amber-600' : 'bg-emerald-500'}`} />
            Tồn: {row.available} units
          </p>
        </div>

        {!isLow && (
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
            <p className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
              S: {row.shopeeStock}
            </p>
            <p className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-black" />
              T: {row.tiktokStock}
            </p>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onAction?.(isLow ? 'restock' : 'edit', row.id)
          }}
          className={`mt-3 w-full rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
            isLow
              ? 'bg-indigo-700 text-white shadow-[0px_4px_6px_-1px_rgba(53,37,205,0.2),0px_2px_4px_-2px_rgba(53,37,205,0.2)] hover:bg-indigo-600'
              : 'border border-indigo-200 text-indigo-700 hover:bg-indigo-50'
          }`}
        >
          {isLow ? 'Nhập kho' : 'Sửa'}
        </button>
      </div>
    </div>
  )
}
