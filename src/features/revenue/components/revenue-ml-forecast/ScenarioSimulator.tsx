import { Calculator, RotateCcw, Sparkles } from 'lucide-react'
import React, { useState, memo } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RevenueMlForecastInputAssumption, RevenueMlForecastScenarioInput } from '@/types/revenue.types'

interface ScenarioSimulatorProps {
  inputs?: RevenueMlForecastInputAssumption[]
  onSimulate: (input: RevenueMlForecastScenarioInput) => void
  isLoading?: boolean
}

export const ScenarioSimulator = memo<ScenarioSimulatorProps>(({ inputs, onSimulate, isLoading }) => {
  const [title, setTitle] = useState('Kịch bản tăng trưởng T4')
  const [assumptions, setAssumptions] = useState<Record<string, number>>(
    inputs?.reduce((acc, input) => ({ ...acc, [input.id]: input.currentValue }), {}) || {},
  )

  const handleAssumptionChange = (id: string, value: string) => {
    const numValue = Number(value)
    setAssumptions((prev) => ({ ...prev, [id]: numValue }))
  }

  const handleReset = () => {
    const defaultAssumptions = inputs?.reduce((acc, input) => ({ ...acc, [input.id]: input.currentValue }), {}) || {}
    setAssumptions(defaultAssumptions)
    setTitle('Kịch bản tăng trưởng T4')
    toast.info('Đã đặt lại các thông số về mặc định.')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSimulate({ title, assumptions })
    toast.loading(`Đang tiến hành mô phỏng kịch bản: ${title}`, {
      duration: 2000
    })
  }

  const calculateAbsoluteValue = (input: RevenueMlForecastInputAssumption, value: number) => {
    // Giả định đơn giản: Nếu đơn vị là %, tính dựa trên giá trị tham chiếu (giả định 50tr VNĐ cho mục đích hiển thị)
    // Trong thực tế, giá trị này nên đến từ ViewModel
    if (input.unit === '%') {
      const baseValue = 50_000_000 
      const absChange = (value * baseValue) / 100
      return `${absChange > 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN').format(Math.round(absChange))} ₫`
    }
    return ''
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Input Name Section */}
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="scenario-title" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tên kịch bản giả định</Label>
            <div className="relative group">
              <Input
                id="scenario-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 pl-9 bg-slate-50 border-slate-100 focus:bg-white focus:ring-indigo-500/10 focus:border-indigo-200 rounded-lg transition-all duration-200 text-xs font-medium text-slate-700"
              />
              <Sparkles className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Adjustments Section */}
        <div className="flex-1 px-4 pb-4 space-y-5 overflow-y-auto">
          {inputs?.map((input) => (
            <div key={input.id} className="space-y-2.5 p-3 rounded-lg border border-slate-50 bg-slate-50/30">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <Label htmlFor={input.id} className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    {input.label}
                  </Label>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase">Hiện tại: {input.currentValue}{input.unit}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number"
                      value={assumptions[input.id]}
                      onChange={(e) => handleAssumptionChange(input.id, e.target.value)}
                      className="w-14 h-7 text-right font-mono text-xs font-bold text-indigo-600 bg-white border border-indigo-100 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500/20 px-1.5"
                    />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{input.unit}</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600">
                    {calculateAbsoluteValue(input, assumptions[input.id])}
                  </span>
                </div>
              </div>
              
              <div className="relative px-1">
                <input
                  type="range"
                  id={input.id}
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={assumptions[input.id]}
                  onChange={(e) => handleAssumptionChange(input.id, e.target.value)}
                  aria-label={`Điều chỉnh ${input.label}`}
                  aria-valuemin={input.min}
                  aria-valuemax={input.max}
                  aria-valuenow={assumptions[input.id]}
                  className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Simulation Action */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 rounded-lg border-slate-200 bg-white text-slate-600 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-all"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-2" />
              Đặt lại
            </Button>
            <Button 
              type="submit" 
              className="flex-[2] h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider transition-all shadow-none" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <>
                  <Calculator className="h-3.5 w-3.5 mr-2" />
                  Chạy mô phỏng
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
})

ScenarioSimulator.displayName = 'ScenarioSimulator'
