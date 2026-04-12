import type { RevenueChartsHourlyPointViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueHourlyDistributionCardProps = {
  title: string
  peakHoursLabel: string
  points: RevenueChartsHourlyPointViewModel[]
}

export function RevenueHourlyDistributionCard({ title, peakHoursLabel, points }: RevenueHourlyDistributionCardProps) {
  const maxRevenue = points.reduce((max, item) => Math.max(max, item.revenue), 0)

  return (
    <section className="rounded-xl border border-indigo-100 bg-white px-6 pb-6 pt-6 shadow-sm">
      <header className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <span className="rounded-lg bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700">{peakHoursLabel}</span>
      </header>

      <div className="flex h-[220px] items-end gap-0.5">
        {points.map((point) => {
          const barHeight = maxRevenue > 0 ? Math.max(8, Math.round((point.revenue / maxRevenue) * 100)) : 0

          return (
            <div key={point.hourLabel} className="flex min-w-0 flex-1 flex-col items-stretch justify-end">
              <div
                className={`rounded-t-[2px] ${point.isPeak ? 'bg-indigo-600' : 'bg-indigo-100'}`}
                style={{ height: `${barHeight}%` }}
                title={`${point.hourLabel}: ${point.revenue.toLocaleString('vi-VN')}₫`}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-500">
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>23h</span>
      </div>
    </section>
  )
}
