import { Target, ShieldCheck, Activity } from 'lucide-react'
import React from 'react'
import type { RevenueMlForecastAccuracy } from '@/types/revenue.types'
import { cn } from '@/lib/utils'

interface ForecastAccuracyTrackerProps {
  accuracy?: RevenueMlForecastAccuracy
}

export const ForecastAccuracyTracker: React.FC<ForecastAccuracyTrackerProps> = ({ accuracy }) => {
  if (!accuracy) return null

  const metrics = [
    { 
      label: 'Sai số MAPE', 
      value: `${accuracy.mape}%`, 
      sub: 'Mean Error', 
      icon: Activity, 
      color: 'text-amber-500',
      bg: 'bg-amber-500/10' 
    },
    { 
      label: 'Độ lệch RMSE', 
      value: new Intl.NumberFormat('vi-VN').format(accuracy.rmse), 
      sub: 'Deviance', 
      icon: Target, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10' 
    },
    { 
      label: 'Độ tin cậy', 
      value: `${accuracy.confidenceLevel}%`, 
      sub: accuracy.periodLabel, 
      icon: ShieldCheck, 
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10' 
    },
  ]

  return (
    <div className="flex flex-row items-center gap-2 w-full max-w-2xl">
      {metrics.map((m) => (
        <div 
          key={m.label} 
          className="flex-1 flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:bg-white hover:border-primary-200 group"
        >
          <div className={cn("p-1.5 rounded-lg shrink-0", m.bg)}>
            <m.icon className={cn("h-3.5 w-3.5", m.color)} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">{m.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-slate-900 font-mono tracking-tight">{m.value}</span>
              <span className="text-[8px] font-medium text-slate-400 uppercase truncate">{m.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
