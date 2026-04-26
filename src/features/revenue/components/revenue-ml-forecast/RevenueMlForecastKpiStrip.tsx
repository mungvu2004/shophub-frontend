import React from 'react'
import { TrendingUp, AlertCircle, CalendarRange, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RevenueMlForecastKpiCard } from '@/types/revenue.types'

interface RevenueMlForecastKpiStripProps {
  cards: RevenueMlForecastKpiCard[]
}

export const RevenueMlForecastKpiStrip: React.FC<RevenueMlForecastKpiStripProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const isForecast = card.type === 'forecast'
        const isPeak = card.type === 'peak'
        const isRisk = card.type === 'risk'

        return (
          <div 
            key={card.id} 
            className={cn(
              "relative rounded-3xl border p-6 transition-all bg-white border-slate-100 shadow-sm hover:shadow-md",
              isRisk && "border-rose-100"
            )}
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center shadow-inner",
                    isForecast ? "bg-indigo-50 text-indigo-600" : 
                    isPeak ? "bg-amber-50 text-amber-600" : 
                    "bg-rose-50 text-rose-600"
                  )}>
                    {isForecast && <TrendingUp className="size-5" />}
                    {isPeak && <CalendarRange className="size-5" />}
                    {isRisk && <AlertCircle className="size-5" />}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {card.label.toLowerCase() === 'dự báo tháng tới' ? 'Dự báo tháng 4' : card.label}
                  </span>
                </div>
                {isForecast && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                    <ArrowUpRight className="size-3.5" />
                    <span className="text-[10px] font-bold tracking-tight">{card.trendPercent}% vs T3</span>
                  </div>
                )}
              </div>

              <div className="mt-2">
                {isForecast && (
                  <div className="space-y-2">
                    <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none font-mono">
                      {new Intl.NumberFormat('vi-VN').format(card.predictionValue!)} đ
                    </p>
                    <div className="flex flex-wrap items-center gap-3 border-t border-slate-50 pt-3 mt-4">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Độ tin cậy</p>
                        <p className="text-sm font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-lg inline-block">{card.confidencePercent}%</p>
                      </div>
                      <div className="w-px h-6 bg-slate-100 mx-1" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Khoảng biến động</p>
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                          {new Intl.NumberFormat('vi-VN').format(card.rangeMin! / 1000000)}M - {new Intl.NumberFormat('vi-VN').format(card.rangeMax! / 1000000)}M ₫
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isPeak && (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{card.peakWindow}</p>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-lg inline-block">{card.reason}</p>
                  </div>
                )}

                {isRisk && (
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold tracking-tight text-rose-600 leading-none font-mono">{card.riskCount}</p>
                      <p className="text-xs font-bold text-slate-900 uppercase">Yếu tố ảnh hưởng</p>
                    </div>
                    <div className="border-t border-slate-50 pt-3 mt-4">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate">{card.riskSummary}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
