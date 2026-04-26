import React, { useMemo, memo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts'
import { Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import type { 
  RevenueMlForecastViewModel, 
} from '@/features/revenue/logic/revenueMlForecast.types'
import type { RevenueMlForecastComparisonScenario, RevenueMlForecastRangeDays } from '@/types/revenue.types'
import { cn } from '@/lib/utils'

interface RevenueMlForecastViewProps {
  model: RevenueMlForecastViewModel
  onRangeChange: (days: RevenueMlForecastRangeDays) => void
  comparedScenarios?: RevenueMlForecastComparisonScenario[]
}

export const RevenueMlForecastView = memo(({ 
  model, 
  onRangeChange,
  comparedScenarios = [] 
}: RevenueMlForecastViewProps) => {
  const [hiddenScenarios, setHiddenScenarios] = React.useState<string[]>([])

  const toggleScenarioVisibility = (id: string) => {
    setHiddenScenarios(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const combinedData = useMemo(() => {
    const forecastStartIndex = model.chartPoints.findIndex(p => p.forecast !== null)
    
    return model.chartPoints.map((point, index) => {
      const extraData: Record<string, number | null> = {}
      
      for (const s of comparedScenarios) {
        if (hiddenScenarios.includes(s.id)) continue
        
        if (index >= forecastStartIndex) {
          const sIndex = index - forecastStartIndex
          extraData[s.id] = s.points[sIndex]?.value ?? null
        }
      }
      
      return { ...point, ...extraData }
    })
  }, [model.chartPoints, comparedScenarios, hiddenScenarios])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Chart Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50 text-indigo-600 border border-slate-100 shadow-sm transition-transform duration-300 hover:scale-105">
            <Zap className="size-5 fill-indigo-600/10" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Xu hướng doanh thu {model.selectedDays} ngày</h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-none">Mô hình: {model.header.modelLabel}</span>
               <Badge variant="success" className="text-[8px] py-0 h-4 font-bold shadow-none border-none">ĐỘ CHÍNH XÁC {model.header.accuracyLabel}</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-100" role="group" aria-label="Lọc theo khoảng thời gian">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => onRangeChange(d as RevenueMlForecastRangeDays)}
              aria-pressed={model.selectedDays === d}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 active:scale-95",
                model.selectedDays === d 
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {d} Ngày
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Stage */}
      <div className="h-[460px] w-full bg-white relative" role="region" aria-label="Biểu đồ dự báo doanh thu">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combinedData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              dy={15}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              tickFormatter={(val) => `${(val / 1_000_000).toFixed(0)}M`}
            />

            <Tooltip
              cursor={{ stroke: '#f1f5f9', strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px',
                zIndex: 50
              }}
              itemStyle={{ color: '#0f172a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}
              labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.05em' }}
              formatter={(val: string | number) => {
                return [new Intl.NumberFormat('vi-VN').format(Number(val)) + ' đ', 'Giá trị']
              }}
              position={{ y: 0 }}
            />

            <Area
              type="monotone"
              dataKey="historical"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#colorHistorical)"
              connectNulls
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="forecast"
              name="forecast"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#4f46e5' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
              animationDuration={500}
              hide={hiddenScenarios.includes('forecast')}
            />

            {comparedScenarios.map((s, idx) => (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.id}
                name={s.title}
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: s.color }}
                animationDuration={300 + idx * 100}
                hide={hiddenScenarios.includes(s.id)}
              />
            ))}

            <ReferenceLine x="15/04" stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'HIỆN TẠI', position: 'top', fill: '#f43f5e', fontSize: 10, fontWeight: 700 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Modern Legend */}
      <div className="flex flex-wrap items-center justify-center gap-8 pt-6 border-t border-slate-50">
        <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70" onClick={() => toggleScenarioVisibility('historical')}>
          <div className={cn("size-2 rounded-full", hiddenScenarios.includes('historical') ? "bg-slate-200" : "bg-slate-400")} />
          <span className={cn("text-[10px] font-bold uppercase tracking-wider", hiddenScenarios.includes('historical') ? "text-slate-300 line-through" : "text-slate-500")}>Lịch sử</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70" onClick={() => toggleScenarioVisibility('forecast')}>
          <div className={cn("size-2 rounded-full", hiddenScenarios.includes('forecast') ? "bg-slate-200" : "bg-indigo-600")} />
          <span className={cn("text-[10px] font-bold uppercase tracking-wider", hiddenScenarios.includes('forecast') ? "text-slate-300 line-through" : "text-slate-900")}>Dự báo cơ sở</span>
        </div>
        {comparedScenarios.map(s => (
          <div key={s.id} className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70" onClick={() => toggleScenarioVisibility(s.id)}>
            <div className={cn("h-0.5 w-4 border-t-2 border-dashed", hiddenScenarios.includes(s.id) ? "border-slate-200" : "")} style={{ borderColor: hiddenScenarios.includes(s.id) ? undefined : s.color }} />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", hiddenScenarios.includes(s.id) ? "text-slate-300 line-through" : "text-slate-600")}>{s.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

RevenueMlForecastView.displayName = 'RevenueMlForecastView'
