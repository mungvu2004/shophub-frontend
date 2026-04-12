import type { RevenueChartsCategoryItemViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueCategoryBreakdownCardProps = {
  title: string
  items: RevenueChartsCategoryItemViewModel[]
}

export function RevenueCategoryBreakdownCard({ title, items }: RevenueCategoryBreakdownCardProps) {
  return (
    <section className="space-y-6 rounded-xl border border-indigo-100 bg-white px-6 py-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>

      <div className="space-y-5">
        {items.map((item) => (
          <article key={item.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="font-semibold text-slate-900">{item.label}</p>
              <p className="font-bold text-slate-900">{item.valueLabel}</p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full rounded-full" style={{ width: `${item.ratioPercent}%`, backgroundColor: item.barColor }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
