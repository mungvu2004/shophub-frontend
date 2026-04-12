import type { RevenueChartsPlatformId } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenuePlatformTabsProps = {
  tabs: Array<{ id: RevenueChartsPlatformId; label: string }>
  selectedPlatform: RevenueChartsPlatformId
  onChange: (platform: RevenueChartsPlatformId) => void
}

export function RevenuePlatformTabs({ tabs, selectedPlatform, onChange }: RevenuePlatformTabsProps) {
  return (
    <section className="flex flex-wrap items-center gap-1 border-b border-indigo-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
            tab.id === selectedPlatform
              ? 'border-indigo-700 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </section>
  )
}
