import type { RevenueSummaryKpiViewModel } from '@/features/revenue/logic/revenueSummaryReport.logic'

type RevenueKpiSectionProps = {
  kpis: RevenueSummaryKpiViewModel[]
}

export function RevenueKpiSection({ kpis }: RevenueKpiSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {kpis.map((kpi) => (
        <article key={kpi.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-transparent transition hover:ring-slate-200">
          <p className="line-clamp-1 text-[11px] font-bold tracking-[0.08em] text-slate-500">{kpi.label}</p>

          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="truncate font-mono text-[1.6rem] font-bold leading-none text-slate-900">{kpi.valueLabel}</p>
            <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${kpi.deltaClassName}`}>{kpi.deltaLabel}</span>
          </div>

          <p className="mt-3 line-clamp-2 min-h-8 text-xs leading-4 text-slate-500">{kpi.note}</p>
        </article>
      ))}
    </section>
  )
}
