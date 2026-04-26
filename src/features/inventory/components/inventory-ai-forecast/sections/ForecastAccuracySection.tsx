import { TrendingDown, TrendingUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ForecastAccuracyViewModel } from '@/features/inventory/logic/inventoryAIForecast.types'

type ForecastAccuracySectionProps = {
  accuracy: ForecastAccuracyViewModel
}

export function ForecastAccuracySection({ accuracy }: ForecastAccuracySectionProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Độ chính xác mô hình</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dựa trên {accuracy.lastPeriodLabel}</p>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
          accuracy.status === 'improved' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
        )}>
          {accuracy.status === 'improved' ? <TrendingDown className="size-3" /> : <TrendingUp className="size-3" />}
          MAPE {accuracy.status === 'improved' ? 'Giảm' : 'Tăng'} {Math.abs(Math.round((accuracy.mape - accuracy.previousMape) / accuracy.previousMape * 100))}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50 relative group">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MAPE</span>
            <div className="relative">
               <Info className="size-3 text-slate-300 cursor-help" />
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-[9px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">
                  <span className="font-bold block mb-1">Mean Absolute Percentage Error</span>
                  Phần trăm sai lệch trung bình giữa dự báo và thực tế. Chỉ số càng thấp, dự báo càng chính xác.
               </div>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-slate-900 tracking-tight">{accuracy.mape}%</span>
            <span className="text-[10px] font-bold text-slate-400 line-through font-mono">{accuracy.previousMape}%</span>
          </div>
        </div>

        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-50 relative group">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RMSE</span>
            <div className="relative">
               <Info className="size-3 text-slate-300 cursor-help" />
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-[9px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">
                  <span className="font-bold block mb-1">Root Mean Square Error</span>
                  Sai số tuyệt đối trung bình tính theo đơn vị sản phẩm. Giúp hình dung mức độ lệch hàng thực tế.
               </div>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-slate-900 tracking-tight">{accuracy.rmse}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Units</span>
          </div>
        </div>
      </div>
    </div>
  )
}
