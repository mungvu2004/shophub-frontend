import { useMemo, useState } from 'react'
import { RefreshCcw, FileDown, Beaker, Database, Zap, Target, Activity, TrendingUp as HeaderIcon } from 'lucide-react'
import { toast } from 'sonner'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { ForecastAccuracyTracker } from '@/features/revenue/components/revenue-ml-forecast/ForecastAccuracyTracker'
import { ForecastComparisonView } from '@/features/revenue/components/revenue-ml-forecast/ForecastComparisonView'
import { RevenueMlForecastView } from '@/features/revenue/components/revenue-ml-forecast/RevenueMlForecastView'
import { ScenarioSimulator } from '@/features/revenue/components/revenue-ml-forecast/ScenarioSimulator'
import { RevenueMlForecastKpiStrip } from '@/features/revenue/components/revenue-ml-forecast/RevenueMlForecastKpiStrip'
import { useRevenueMlForecast } from '@/features/revenue/hooks/useRevenueMlForecast'
import { buildRevenueMlForecastViewModel } from '@/features/revenue/logic/revenueMlForecast.logic'
import type { RevenueMlForecastRangeDays } from '@/types/revenue.types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function RevenueMlForecast() {
  const [selectedDays, setSelectedDays] = useState<RevenueMlForecastRangeDays>(30)
  
  const {
    forecast,
    isLoading,
    isError,
    allScenarios,
    comparedScenarios,
    comparedScenarioIds,
    toggleComparison,
    simulate,
    isSimulating,
    refetch
  } = useRevenueMlForecast(selectedDays)

  const model = useMemo(() => {
    if (!forecast) return null
    return buildRevenueMlForecastViewModel(forecast, selectedDays)
  }, [forecast, selectedDays])

  const scenarioViewModels = useMemo(() => {
    return allScenarios.map(s => ({
      id: s.id,
      title: s.title,
      projectedRevenue: s.projectedRevenue,
      valueLabel: new Intl.NumberFormat('vi-VN').format(s.projectedRevenue) + ' ₫',
      note: s.note,
      accent: s.accent,
      isRecommended: s.isRecommended
    }))
  }, [allScenarios])

  // Logic for global buttons
  const handleExportReport = () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000))
    toast.promise(promise, {
      loading: 'Đang khởi tạo tệp báo cáo dự báo...',
      success: 'Tệp báo cáo đã được tải xuống máy tính của bạn.',
      error: 'Lỗi khi khởi tạo tệp báo cáo.',
    })
  }

  const handleApplyAll = () => {
    toast.success('Đã áp dụng toàn bộ chiến lược tăng trưởng vào hệ thống vận hành.', {
      description: 'Dữ liệu dự báo sẽ được cập nhật lại sau 24h.',
      icon: <Zap className="size-4 text-amber-500" />
    })
  }

  const handleApplyStep = (idx: number) => {
    toast.success(`Đã kích hoạt thành công đề xuất bước ${idx + 1}`, {
      description: 'Hệ thống đang điều chỉnh các thông số vận hành tương ứng.'
    })
  }

  const handleRefresh = () => {
    void refetch()
  }

  const isInitialLoading = isLoading && !forecast

  if (isInitialLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang khởi tạo hệ thống dự báo...</p>
        </div>
      </div>
    )
  }

  if (isError && !forecast) {
    return <DataLoadErrorState title="Hệ thống dự báo không phản hồi." onRetry={handleRefresh} />
  }

  if (!model || !forecast) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* 1. SYNCHRONIZED HEADER (Styled like Business Overview) */}
      <header className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
               <HeaderIcon className="size-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Dự báo doanh thu ML
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{forecast.modelLabel}</span>
                <div className="size-1 rounded-full bg-slate-200" />
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  Dữ liệu trực tuyến
                </span>
              </div>
            </div>
          </div>

          {/* Accuracy Tracker integrated in header row or action area */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="hidden xl:block pr-4 border-r border-slate-100">
               <ForecastAccuracyTracker accuracy={forecast.accuracy} />
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleRefresh}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600"
              >
                <RefreshCcw className={cn("mr-2 size-4", isLoading && "animate-spin")} />
                Làm mới
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleExportReport}
                className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800"
              >
                <FileDown className="mr-2 size-4" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Accuracy Tracker for Mobile/Tablet (Visible if not hidden in header) */}
      <div className="xl:hidden">
        <ForecastAccuracyTracker accuracy={forecast.accuracy} />
      </div>

      {/* SECTION 2: TOP METRICS RIBBON (Grid gap-6 like Overview) */}
      <RevenueMlForecastKpiStrip cards={forecast.cards} />

      {/* SECTION 3: MAIN WORKSPACE (8:4 layout with gap-6) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: VISUAL STAGE */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Main Visual Stage Card (Styled like Overview content) */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-fit">
            <RevenueMlForecastView 
              model={model} 
              onRangeChange={setSelectedDays} 
              comparedScenarios={comparedScenarios}
            />
          </div>

          {/* Benchmark Registry Card */}
          <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
             <ForecastComparisonView
                scenarios={scenarioViewModels}
                onExport={() => toast.info('Đang xuất dữ liệu đối chiếu kịch bản...')}
                comparedScenarioIds={comparedScenarioIds}
                onToggleComparison={toggleComparison}
             />
          </div>

          {/* NEW: Key Drivers & Insights - Balances the height with the right column */}
          {forecast.keyDrivers && forecast.keyDrivers.length > 0 && (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-indigo-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Các yếu tố ảnh hưởng chính</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Phân tích đa biến</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {forecast.keyDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                    <span className="text-xs font-semibold text-slate-600">{driver.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", driver.trend === 'positive' ? "bg-emerald-500" : "bg-rose-500")}
                          style={{ width: `${Math.abs(driver.impact)}%` }}
                        />
                      </div>
                      <span className={cn("text-[10px] font-bold w-8 text-right", driver.trend === 'positive' ? "text-emerald-600" : "text-rose-600")}>
                        {driver.trend === 'positive' ? '+' : '-'}{driver.impact}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CONTROLS & STRATEGY */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Simulation Lab - Height matched to visual stage card */}
          <div className="flex flex-col rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden" style={{ minHeight: 'calc(400px + 6rem)' }}>
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Giả lập kịch bản</span>
              </div>
              <Beaker className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <ScenarioSimulator
                inputs={forecast.inputs}
                onSimulate={simulate}
                isLoading={isSimulating}
              />
            </div>
          </div>

          {/* Strategic Deck */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col h-full min-h-[420px]">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner">
                    <Target className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Đề xuất chiến lược</h3>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Growth Engine v2.0</p>
                  </div>
                </div>
             </div>
             
             <div className="flex-1 space-y-5">
                {forecast.actionPlan.steps.map((step, idx) => (
                   <div key={idx} className="group cursor-default border-b border-slate-50 pb-4 last:border-none">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="size-6 rounded bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                             <span className="text-[10px] font-bold text-white">0{idx + 1}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 leading-relaxed">{step}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleApplyStep(idx)}
                          className="h-8 px-2.5 text-[10px] font-bold uppercase text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 shrink-0 transition-all active:scale-95"
                        >
                          Kích hoạt
                        </Button>
                      </div>
                   </div>
                ))}
             </div>

             <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="rounded-2xl bg-indigo-600 p-6 text-white relative overflow-hidden group transition-all shadow-lg shadow-indigo-100">
                   <div className="relative z-10">
                     <h4 className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                       <Activity className="size-3.5" /> 
                       Tổng thể kịch bản
                     </h4>
                     <p className="text-xs font-semibold leading-relaxed text-indigo-50 mb-4">
                        Tối ưu hóa ngân sách và vận hành theo mô hình đề xuất tốt nhất.
                     </p>
                     <Button 
                      onClick={handleApplyAll}
                      className="w-full h-10 bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-xs uppercase tracking-wider rounded-xl border-none shadow-md active:scale-95 transition-all"
                     >
                        Áp dụng tất cả
                     </Button>
                   </div>
                   <Zap className="absolute -right-4 -bottom-4 size-24 text-white/10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
                </div>
             </div>
          </div>

          {/* System Metadata Strip */}
          <div className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dữ liệu hợp nhất v2.4</span>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>

      </div>
    </div>
  )
}
