import type { RevenueSummaryKpiViewModel } from '@/features/revenue/logic/revenueSummaryReport.logic'

type RevenueKpiSectionProps = {
  kpis: RevenueSummaryKpiViewModel[]
}

export function RevenueKpiSection({ kpis }: RevenueKpiSectionProps) {
  const groupedKpis = Array.from({ length: Math.ceil(kpis.length / 2) }, (_, index) => {
    return {
      id: `kpi-group-${index + 1}`,
      primary: kpis[index * 2],
      secondary: kpis[index * 2 + 1],
    }
  })

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {groupedKpis.map((group) => (
        <article key={group.id} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm ring-1 ring-transparent transition hover:ring-slate-200">
          {[group.primary, group.secondary].filter(Boolean).map((kpi, index) => (
            <div key={kpi.id} className={index === 0 ? '' : 'mt-3 border-t border-slate-100 pt-3'}>
              <p className="line-clamp-1 text-[11px] font-bold tracking-[0.08em] text-slate-500">{kpi.label}</p>

              <div className="mt-1.5 flex items-end justify-between gap-2">
                <p className="break-words font-mono text-[1.02rem] font-bold leading-tight text-slate-900">{kpi.valueLabel}</p>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${kpi.deltaClassName}`}>{kpi.deltaLabel}</span>
              </div>

              <p className="mt-1.5 line-clamp-2 min-h-7 text-[11px] leading-4 text-slate-500">{kpi.note}</p>
            </div>
          ))}
        </article>
      ))}
    </section>
  )
}
