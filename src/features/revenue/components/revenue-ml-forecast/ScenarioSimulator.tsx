import { Calculator, Plus, RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RevenueMlForecastInputAssumption, RevenueMlForecastScenarioInput } from '@/types/revenue.types'
import { cn } from '@/lib/utils'

interface ScenarioSimulatorProps {
  inputs?: RevenueMlForecastInputAssumption[]
  onSimulate: (input: RevenueMlForecastScenarioInput) => void
  isLoading?: boolean
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ inputs, onSimulate, isLoading }) => {
  const [title, setTitle] = useState('Kịch bản tăng trưởng T4')
  const [assumptions, setAssumptions] = useState<Record<string, number>>(
    inputs?.reduce((acc, input) => ({ ...acc, [input.id]: input.currentValue }), {}) || {},
  )

  const handleAssumptionChange = (id: string, value: string) => {
    const numValue = Number(value)
    setAssumptions((prev) => ({ ...prev, [id]: numValue }))
  }

  const handleReset = () => {
    setAssumptions(inputs?.reduce((acc, input) => ({ ...acc, [input.id]: input.currentValue }), {}) || {})
    setTitle('Kịch bản mặc định')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSimulate({ title, assumptions })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        {/* Header giả định */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-4 w-4 text-primary-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parameters Configuration</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scenario-title" className="text-xs font-bold text-slate-500 uppercase">Scenario Name</Label>
            <div className="relative">
              <Input
                id="scenario-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-9 bg-white border-slate-200 focus:ring-primary-500/20 rounded-xl font-medium"
              />
              <Sparkles className="absolute left-3 top-2.5 h-4 w-4 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Sliders Area */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto max-h-[400px]">
          {inputs?.map((input) => (
            <div key={input.id} className="group space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <Label htmlFor={input.id} className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
                    {input.label}
                  </Label>
                  <p className="text-[10px] text-muted-foreground font-medium">Giá trị mặc định: {input.currentValue}{input.unit}</p>
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  <span className="text-xs font-black font-mono text-slate-900">
                    {assumptions[input.id] > 0 ? '+' : ''}
                    {assumptions[input.id]}
                    {input.unit}
                  </span>
                </div>
              </div>
              
              <div className="relative pt-2">
                <input
                  type="range"
                  id={input.id}
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={assumptions[input.id]}
                  onChange={(e) => handleAssumptionChange(input.id, e.target.value)}
                  aria-label={`Điều chỉnh ${input.label}`}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none"
                />
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-[9px] font-bold text-slate-300">{input.min}{input.unit}</span>
                  <span className="text-[9px] font-bold text-slate-300">{input.max}{input.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest gap-2"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              type="submit" 
              className="flex-[2] h-12 rounded-xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all font-bold text-xs uppercase tracking-widest gap-2" 
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              Initialize Simulation
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
