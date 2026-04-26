import { Sparkles, BarChart3 } from 'lucide-react'
import type { SeasonalityPatternViewModel } from '@/features/inventory/logic/inventoryAIForecast.types'

type SeasonalityPatternCardProps = {
  patterns: SeasonalityPatternViewModel[]
}

export function SeasonalityPatternCard({ patterns }: SeasonalityPatternCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
          <BarChart3 className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Phân tích mùa vụ</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">AI đã nhận diện được {patterns.length} chu kỳ</p>
        </div>
      </div>

      <div className="space-y-4">
        {patterns.map((p) => (
          <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sparkles className="size-12 text-amber-600" />
            </div>
            <div className="relative z-10">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{p.name}</span>
                  <div className="flex flex-col items-end">
                     <span className="text-xs font-black text-amber-600 font-mono">{p.impactLabel} Demand</span>
                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Impact Multiplier</span>
                  </div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed mb-3">{p.description}</p>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.periodLabel}</span>
                  <div className="flex items-center gap-1.5">
                     <span className="text-[10px] font-bold text-slate-400">Độ tin cậy:</span>
                     <span className="text-[10px] font-black text-primary-600">{p.confidencePercent}%</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
