import type { RevenueChartsPlatformId } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenuePlatformSelectorProps = {
  selectedPlatform: RevenueChartsPlatformId
  onChange: (id: RevenueChartsPlatformId) => void
  platforms: Array<{ id: RevenueChartsPlatformId; label: string }>
}

export function RevenuePlatformSelector({ selectedPlatform, onChange, platforms }: RevenuePlatformSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl bg-secondary-100 p-1">
      {platforms.map((p) => {
        const isSelected = selectedPlatform === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`
              inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-bold transition-all sm:px-4
              ${isSelected ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-800'}
            `}
          >
            {p.id !== 'all' && (
              <span className={`h-2 w-2 rounded-full ${
                p.id === 'shopee' ? 'bg-[#EE4D2D]' : 
                p.id === 'lazada' ? 'bg-indigo-600' : 'bg-secondary-900'
              }`} />
            )}
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
