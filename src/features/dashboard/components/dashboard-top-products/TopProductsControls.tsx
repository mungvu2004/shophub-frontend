import type {
  DashboardTopProductsViewModel,
  TopProductsMetricId,
  TopProductsPlatformId,
  TopProductsRangeDays,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

type TopProductsControlsProps = {
  model: DashboardTopProductsViewModel
  isRefreshing: boolean
  onMetricChange: (metric: TopProductsMetricId) => void
  onRangeChange: (rangeDays: TopProductsRangeDays) => void
  onPlatformChange: (platform: TopProductsPlatformId) => void
}

export function TopProductsControls({
  model,
  isRefreshing,
  onMetricChange,
  onRangeChange,
  onPlatformChange,
}: TopProductsControlsProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold leading-7 text-slate-900">{model.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {model.subtitle}
            {isRefreshing ? <span className="ml-2 text-xs text-primary-600">(đang cập nhật...)</span> : null}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-lg bg-slate-50 p-1" role="tablist" aria-label="Metric selection">
            {model.metricTabs.map((tab) => {
              const active = tab.id === model.selectedMetric

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onMetricChange(tab.id)}
                  className={
                    active
                      ? 'rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-primary-600 shadow-sm'
                      : 'rounded-md px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-white/70'
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="inline-flex rounded-lg bg-slate-50 p-1" role="tablist" aria-label="Date range selection">
            {model.rangeTabs.map((tab) => {
              const active = tab.days === model.selectedRange

              return (
                <button
                  key={tab.days}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onRangeChange(tab.days)}
                  className={
                    active
                      ? 'rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-primary-600 shadow-sm'
                      : 'rounded-md px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-white/70'
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 border-b border-slate-100" role="tablist" aria-label="Platform selection">
        {model.platformTabs.map((tab) => {
          const active = tab.id === model.selectedPlatform

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onPlatformChange(tab.id)}
              className={
                active
                  ? 'border-b-2 border-primary-600 pb-3 text-sm font-bold text-primary-600'
                  : 'pb-3 text-sm font-medium text-slate-500 hover:text-slate-900'
              }
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
