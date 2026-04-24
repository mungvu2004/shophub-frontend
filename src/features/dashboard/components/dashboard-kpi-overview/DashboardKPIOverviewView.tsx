import { RefreshCcw } from 'lucide-react'
import { KpiCard } from '@/features/dashboard/components/dashboard-kpi-overview/KpiCard'
import type { DashboardKPIOverviewViewModel } from '@/features/dashboard/logic/dashboardKpiOverview.types'
import { useKPIReorderUI } from '@/features/dashboard/components/dashboard-kpi-overview/useKPIReorderUI'
import { KPIPeriodSelector } from '@/features/dashboard/components/dashboard-kpi-overview/KPIPeriodSelector'
import { DashboardExportActions } from '@/features/dashboard/components/dashboard-kpi-overview/DashboardExportActions'
import { MonthlyGoalWidget } from '@/features/dashboard/components/dashboard-kpi-overview/MonthlyGoalWidget'

type DashboardKPIOverviewViewProps = {
  model: DashboardKPIOverviewViewModel
}

export function DashboardKPIOverviewView({ model }: DashboardKPIOverviewViewProps) {
  const { draggedId, targetId, handleDragStart, handleDragOver, handleDragEnd } = useKPIReorderUI(
    model.metrics,
    model.onReorderMetrics
  )

  return (
    <section className="space-y-6" aria-label="KPI Overview Dashboard">
      {/* Dynamic Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <nav className="inline-flex max-w-fit items-center gap-2 rounded-xl bg-indigo-50 p-1" aria-label="Lọc theo sàn thương mại điện tử" role="tablist">
            {model.tabs.map((tab) => {
              const isActive = tab.id === model.selectedTabId

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  aria-label={`Xem dữ liệu sàn ${tab.label}`}
                  onClick={() => model.onTabChange?.(tab.id)}
                  className={
                    isActive
                      ? 'inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm'
                      : 'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  }
                >
                  {tab.dotColor ? (
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tab.dotColor }} aria-hidden="true" />
                  ) : null}
                  <span>{tab.label}</span>
                  {tab.count ? <span className={isActive ? 'opacity-80' : 'opacity-60'}>{tab.count}</span> : null}
                </button>
              )
            })}
          </nav>

          <KPIPeriodSelector 
            selectedPeriod={model.comparisonPeriod} 
            onPeriodChange={model.onPeriodChange} 
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {model.showMonthlyGoal && <MonthlyGoalWidget goal={model.monthlyGoal} />}
          
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <DashboardExportActions isRefreshing={model.isRefreshing} />

            {model.onRefresh ? (
              <button
                type="button"
                onClick={model.onRefresh}
                disabled={model.isRefreshing}
                aria-label="Làm mới toàn bộ dữ liệu dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <RefreshCcw className={`h-4 w-4 ${model.isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span className="hidden sm:inline">Làm mới</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
        role="list"
        aria-label="Danh sách chỉ số KPI"
      >
        {model.metrics.map((metric) => (
          <KpiCard
            key={metric.id}
            metric={metric}
            draggable={model.hasRealMetrics}
            onDragStart={() => handleDragStart(metric.id)}
            onDragOver={(e) => handleDragOver(e, metric.id)}
            onDragEnd={handleDragEnd}
            isDragging={draggedId === metric.id}
            isOver={targetId === metric.id}
            comparisonPeriod={model.comparisonPeriod}
          />
        ))}
      </div>

      {!model.hasRealMetrics && model.noDataHint.trim() ? (
        <p className="text-center text-sm text-slate-500 py-4 italic border border-dashed border-slate-200 rounded-xl" role="alert">
          {model.noDataHint}
        </p>
      ) : null}
    </section>
  )
}
