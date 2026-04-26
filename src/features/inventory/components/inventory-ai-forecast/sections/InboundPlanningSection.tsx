import { useState } from 'react'
import { PackagePlus, CalendarDays, ArrowRight, CheckCircle2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { InboundPlanItemViewModel } from '@/features/inventory/logic/inventoryAIForecast.types'

type InboundPlanningSectionProps = {
  plan: InboundPlanItemViewModel[]
}

const priorityMapping = {
  high: { variant: 'danger', label: 'Ưu tiên cao' },
  medium: { variant: 'warning', label: 'Trung bình' },
  low: { variant: 'info', label: 'Ưu tiên thấp' },
} as const

export function InboundPlanningSection({ plan }: InboundPlanningSectionProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(plan.map(p => p.id)))

  const handleToggleAll = () => {
    if (selectedIds.size === plan.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(plan.map(p => p.id)))
    }
  }

  const handleToggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleBulkOrder = () => {
    if (selectedIds.size === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm để tạo đơn nhập hàng.')
      return
    }
    toast.success(`Đã tạo thành công ${selectedIds.size} đơn nhập hàng dự kiến!`)
    // Optionally clear selection after success
    // setSelectedIds(new Set())
  }

  const handleSingleOrder = (productName: string) => {
    toast.success(`Đã chuyển ${productName} vào danh sách đặt hàng.`)
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <PackagePlus className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Kế hoạch nhập hàng đề xuất</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">AI đề xuất dựa trên nhu cầu & lead time</p>
          </div>
        </div>
        
        <Button 
          onClick={handleBulkOrder}
          disabled={selectedIds.size === 0}
          className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-widest px-5 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
        >
           <CheckCircle2 className="mr-2 size-4" />
           Tạo đơn hàng loạt ({selectedIds.size})
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="w-12 px-6 py-4 text-center">
                 <input 
                   type="checkbox" 
                   className="size-3.5 rounded border-slate-200 cursor-pointer" 
                   checked={selectedIds.size === plan.length && plan.length > 0} 
                   onChange={handleToggleAll} 
                 />
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Số lượng</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày gợi ý đặt</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                 Lead time
                 <Info className="size-3 text-slate-300 cursor-help" />
              </th>
              <th className="px-6 py-4 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {plan.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-center">
                   <input 
                     type="checkbox" 
                     className="size-3.5 rounded border-slate-200 cursor-pointer" 
                     checked={selectedIds.has(item.id)} 
                     onChange={() => handleToggleOne(item.id)}
                   />
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{item.productName}</p>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">{item.sku}</p>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col">
                      <span className="font-mono text-sm font-black text-indigo-600">{item.suggestedQuantity}</span>
                      <Badge variant={priorityMapping[item.priority].variant} className="w-fit text-[8px] font-black uppercase mt-1 border-none shadow-none h-4">
                         {priorityMapping[item.priority].label}
                      </Badge>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-3.5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">{item.suggestedOrderDateLabel}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                    {item.leadTimeDays} ngày
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleSingleOrder(item.productName)}
                    className="size-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-primary-600 transition-all ml-auto group-hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
