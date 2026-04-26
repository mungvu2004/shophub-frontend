import { useMemo, useState } from 'react'
import { Beaker, TrendingUp, Zap, Target, Lightbulb } from 'lucide-react'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { ForecastAccuracyTracker } from '@/features/revenue/components/revenue-ml-forecast/ForecastAccuracyTracker'
import { ForecastComparisonView } from '@/features/revenue/components/revenue-ml-forecast/ForecastComparisonView'
import { RevenueMlForecastView } from '@/features/revenue/components/revenue-ml-forecast/RevenueMlForecastView'
import { ScenarioSimulator } from '@/features/revenue/components/revenue-ml-forecast/ScenarioSimulator'
import { useRevenueMlForecast } from '@/features/revenue/hooks/useRevenueMlForecast'
import { buildRevenueMlForecastViewModel } from '@/features/revenue/logic/revenueMlForecast.logic'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RevenueMlForecast() {
  const [selectedDays, setSelectedDays] = useState<RevenueMlForecastRangeDays>(30)
  
  const {
    forecast,
    isLoading,
    isError,
    comparedScenarios,
    simulate,
    isSimulating
  } = useRevenueMlForecast(selectedDays)

  const model = useMemo(() => {
    if (!forecast) return null
    return buildRevenueMlForecastViewModel(forecast, selectedDays)
  }, [forecast, selectedDays])

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Intelligence Node...</p>
        </div>
      </div>
    )
  }

  if (isError || !model || !forecast) {
    return <DataLoadErrorState title="Hệ thống dự báo không khả dụng." onRetry={() => window.location.reload()} />
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
      {/* Tầng 1: Accuracy Ribbon - Mảnh và tinh tế */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Forecasting Stage</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Advanced ML Predictive Pipeline</p>
          </div>
        </div>
        
        <ForecastAccuracyTracker accuracy={forecast.accuracy} />
      </div>

      {/* Tầng 2: Hero Visualizer - Trung tâm dữ liệu */}
      <Card className="border-slate-200/60 shadow-xl shadow-slate-200/10 overflow-hidden rounded-3xl bg-white">
        <div className="p-8">
          <RevenueMlForecastView model={model} onRangeChange={setSelectedDays} />
        </div>
      </Card>

      {/* Tầng 3: The Interactive Basement - 3 Cột chức năng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1: Simulation Controls */}
        <div className="rounded-3xl bg-white border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 flex items-center gap-2">
            <Beaker className="h-4 w-4 text-primary-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hypothesis Input</span>
          </div>
          <div className="flex-1">
            <ScenarioSimulator
              inputs={forecast.inputs}
              onSimulate={simulate}
              isLoading={isSimulating}
            />
          </div>
        </div>

        {/* Cột 2: Comparative Intelligence */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Benchmark Registry</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Active Simulations: {comparedScenarios.length}</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ForecastComparisonView
              scenarios={comparedScenarios}
              onExport={() => alert('Exporting intelligence...')}
            />
          </div>
        </div>
      </div>

      {/* Tầng 4 (Phụ): AI Recommendations - Một dải ngang cuối trang */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecast.actionPlan.steps.map((step, idx) => (
          <div key={idx} className="bg-slate-900 p-4 rounded-2xl flex items-start gap-4 group hover:bg-slate-800 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              <span className="text-xs font-black text-primary-400">0{idx + 1}</span>
            </div>
            <p className="text-xs font-medium text-slate-300 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
