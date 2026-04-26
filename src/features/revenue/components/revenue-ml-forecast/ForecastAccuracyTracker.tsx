import { Info, Target, ShieldCheck, Activity } from 'lucide-react'
import React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import type { RevenueMlForecastAccuracy } from '@/types/revenue.types'
import { cn } from '@/lib/utils'

interface ForecastAccuracyTrackerProps {
  accuracy?: RevenueMlForecastAccuracy
}

export const ForecastAccuracyTracker: React.FC<ForecastAccuracyTrackerProps> = ({ accuracy }) => {
  if (!accuracy) return null

  const metrics = [
    { 
      label: 'MAPE', 
      value: `${accuracy.mape}%`, 
      sub: 'Mean Error', 
      icon: Activity, 
      color: 'text-amber-500',
      bg: 'bg-amber-500/10' 
    },
    { 
      label: 'RMSE', 
      value: new Intl.NumberFormat('vi-VN').format(accuracy.rmse), 
      sub: 'Deviance', 
      icon: Target, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10' 
    },
    { 
      label: 'Confidence', 
      value: `${accuracy.confidenceLevel}%`, 
      sub: accuracy.periodLabel, 
      icon: ShieldCheck, 
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10' 
    },
  ]

  return (
    <div className="flex items-center gap-4">
      {metrics.map((m, i) => (
        <div 
          key={m.label} 
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-2xl border border-white bg-white/40 backdrop-blur-md shadow-sm transition-all hover:shadow-md",
            i === metrics.length - 1 ? "hidden md:flex" : "flex"
          )}
        >
          <div className={cn("p-2 rounded-xl", m.bg)}>
            <m.icon className={cn("h-4 w-4", m.color)} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{m.label}</span>
              <Info className="h-2.5 w-2.5 text-muted-foreground/40" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-slate-900 font-mono tracking-tight">{m.value}</span>
              <span className="text-[9px] text-muted-foreground font-medium">{m.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
