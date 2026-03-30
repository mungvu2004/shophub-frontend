import { KpiCard } from '@/features/dashboard/components/dashboard-kpi-overview/KpiCard'
import type { DashboardKPIOverviewViewModel } from '@/features/dashboard/logic/dashboardKpiOverview.types'

type DashboardKPIOverviewViewProps = {
  model: DashboardKPIOverviewViewModel
}

export function DashboardKPIOverviewView({ model }: DashboardKPIOverviewViewProps) {
  return (
    <section className="space-y-6">
      <nav className="inline-flex w-full max-w-fit items-center gap-2 rounded-xl bg-indigo-50 p-1" aria-label="Platform tabs">
        {model.tabs.map((tab) => {
          const isActive = tab.id === model.selectedTabId

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => model.onTabChange?.(tab.id)}
              className={
                isActive
                  ? 'inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm'
                  : 'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-white/70'
              }
            >
              {tab.dotColor ? (
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tab.dotColor }} aria-hidden />
              ) : null}
              <span>{tab.label}</span>
              {tab.count ? <span className={isActive ? 'opacity-80' : 'opacity-60'}>{tab.count}</span> : null}
            </button>
          )
        })}
      </nav>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-500">{model.monthlyGoal.label}</p>
          <p className="text-sm text-slate-600">
            <span className={model.monthlyGoal.isPlaceholder ? 'font-bold text-slate-400' : 'font-bold text-slate-900'}>
              {model.monthlyGoal.currentValue}
            </span>
            <span className="px-1.5 text-slate-400">/</span>
            <span>{model.monthlyGoal.targetValue}</span>
            <span className="pl-1.5 font-bold text-emerald-600">({model.monthlyGoal.safeProgressPercent}%)</span>
          </p>
        </div>

        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
            style={{ width: `${model.monthlyGoal.safeProgressPercent}%` }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {model.metrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>

      {!model.hasRealMetrics ? <p className="text-sm text-slate-500">{model.noDataHint}</p> : null}
    </section>
  )
}
