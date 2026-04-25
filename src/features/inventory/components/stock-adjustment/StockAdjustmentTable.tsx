import { ArrowRight, Info } from 'lucide-react'
import type { StockAdjustmentItem } from '@/features/inventory/logic/stockAdjustment.types'
import { cn } from '@/lib/utils'

interface StockAdjustmentTableProps {
  items: StockAdjustmentItem[]
  onItemChange?: (id: string, actualQty: number) => void
  isEditable?: boolean
}

export function StockAdjustmentTable({ items, onItemChange, isEditable }: StockAdjustmentTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <tr>
            <th className="px-6 py-4">Sản phẩm / SKU</th>
            <th className="px-6 py-4">Hệ thống</th>
            <th className="px-6 py-4">Thực tế (Kiểm kê)</th>
            <th className="px-6 py-4">Chênh lệch</th>
            <th className="px-6 py-4">Xem trước (Tồn mới)</th>
            <th className="px-6 py-4">Lý do</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((item) => (
            <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{item.productName}</div>
                <div className="text-xs font-mono text-slate-400">{item.sku}</div>
              </td>
              <td className="px-6 py-4 font-mono font-medium text-slate-600">
                {item.systemQty}
              </td>
              <td className="px-6 py-4">
                {isEditable ? (
                  <input
                    type="number"
                    min="0"
                    value={item.actualQty}
                    onChange={(e) => onItemChange?.(item.id, parseInt(e.target.value) || 0)}
                    className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  />
                ) : (
                  <span className="font-mono font-bold text-slate-900">{item.actualQty}</span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                  item.difference > 0 ? "bg-emerald-50 text-emerald-700" : 
                  item.difference < 0 ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-500"
                )}>
                  {item.difference > 0 ? `+${item.difference}` : item.difference}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400">{item.systemQty}</span>
                  <ArrowRight className="size-3 text-slate-300" />
                  <span className={cn(
                    "font-bold",
                    item.difference !== 0 ? "text-primary-600 underline decoration-primary-200 underline-offset-4" : "text-slate-900"
                  )}>
                    {item.actualQty}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 max-w-[200px]">
                  <p className="truncate text-slate-600">{item.reason}</p>
                  {item.note && (
                    <div title={item.note} className="cursor-help text-slate-300 hover:text-primary-400">
                      <Info className="size-4" />
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
