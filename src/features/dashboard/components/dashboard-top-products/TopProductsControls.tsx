import type {
  DashboardTopProductsViewModel,
  TopProductsMetricId,
  TopProductsPlatformId,
  TopProductsRangeDays,
} from '@/features/dashboard/logic/dashboardTopProducts.types'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'
import { Trophy } from 'lucide-react'

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
    <div className="space-y-6">
      <ThemedPageHeader
        title={model.title}
        subtitle={
          <span className="flex items-center gap-2">
            <span>{model.subtitle}</span>
            {isRefreshing ? <span className="text-[11px] font-bold text-blue-600 animate-pulse">(đang cập nhật...)</span> : null}
          </span> as any
        }
        theme="dashboard"
        badge={{ text: 'Top Performers', icon: <Trophy className="size-3.5" /> }}
      >
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-xl bg-white/60 p-1 backdrop-blur shadow-sm border border-blue-200/50" role="tablist" aria-label="Metric selection">
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
                      ? 'rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm'
                      : 'rounded-lg px-4 py-2 text-xs font-bold text-blue-900 hover:bg-white hover:text-blue-700 transition-colors'
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="inline-flex rounded-xl bg-white/60 p-1 backdrop-blur shadow-sm border border-blue-200/50" role="tablist" aria-label="Date range selection">
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
                      ? 'rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm'
                      : 'rounded-lg px-4 py-2 text-xs font-bold text-blue-900 hover:bg-white hover:text-blue-700 transition-colors'
                  }
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </ThemedPageHeader>

      <div className="flex flex-wrap gap-8 border-b border-slate-100 px-2" role="tablist" aria-label="Platform selection">
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
    </div>
  )
}
