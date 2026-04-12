import type { AutomationOverviewStatViewModel } from '@/features/settings/logic/settingsAutomation.types'

type AutomationStatsBarProps = {
  stats: AutomationOverviewStatViewModel[]
  savingChartLabel: string
  savingChartPoints: number[]
}

export function AutomationStatsBar({ stats, savingChartLabel, savingChartPoints }: AutomationStatsBarProps) {
  const maxPoint = savingChartPoints.reduce((max, value) => (value > max ? value : max), 0)

  return (
    <section className="rounded-xl border border-indigo-100 bg-white px-5 py-4 shadow-[0_12px_32px_0_rgba(15,23,42,0.06)]">
      <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
        {stats.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
            <span className="text-base" aria-hidden>
              {item.icon}
            </span>
            <span className="text-sm font-semibold text-slate-900">{item.valueLabel}</span>
            <span className="text-sm text-slate-500">{item.label}</span>
            {index < stats.length - 1 ? <span className="ml-2 hidden h-4 w-px bg-slate-200 md:block" /> : null}
          </div>
        ))}

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2">
          <p className="text-sm font-semibold text-slate-900">{savingChartLabel}</p>
          <div className="flex h-6 items-end gap-1">
            {savingChartPoints.map((point, index) => {
              const normalized = maxPoint > 0 ? point / maxPoint : 0
              const height = Math.max(6, Math.round(normalized * 24))

              return <span key={index} className="w-1.5 rounded-t-sm bg-emerald-500" style={{ height }} />
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
