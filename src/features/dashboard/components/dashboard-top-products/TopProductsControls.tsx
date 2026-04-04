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
    <section className="space-y-4 rounded-2xl border border-[#e8ebff] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold leading-7 text-[#111c2d]">{model.title}</h2>
          <p className="mt-1 text-sm text-[#464555]">
            {model.subtitle} <span className="font-mono font-medium">{model.updatedAtLabel}</span>
            {isRefreshing ? <span className="ml-2 text-xs text-indigo-600">(đang cập nhật...)</span> : null}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-lg bg-[#f0f3ff] p-1">
            {model.metricTabs.map((tab) => {
              const active = tab.id === model.selectedMetric

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onMetricChange(tab.id)}
                  className={
                    active
                      ? 'rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-[#3525cd] shadow-sm'
                      : 'rounded-md px-4 py-1.5 text-xs font-semibold text-[#464555] hover:bg-white/70'
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="inline-flex rounded-lg bg-[#f0f3ff] p-1">
            {model.rangeTabs.map((tab) => {
              const active = tab.days === model.selectedRange

              return (
                <button
                  key={tab.days}
                  type="button"
                  onClick={() => onRangeChange(tab.days)}
                  className={
                    active
                      ? 'rounded-md bg-white px-4 py-1.5 text-xs font-semibold text-[#3525cd] shadow-sm'
                      : 'rounded-md px-4 py-1.5 text-xs font-semibold text-[#464555] hover:bg-white/70'
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 border-b border-[#e7eeff]">
        {model.platformTabs.map((tab) => {
          const active = tab.id === model.selectedPlatform

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onPlatformChange(tab.id)}
              className={
                active
                  ? 'border-b-2 border-[#3525cd] pb-3 text-sm font-bold text-[#3525cd]'
                  : 'pb-3 text-sm font-medium text-[#464555] hover:text-[#111c2d]'
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
