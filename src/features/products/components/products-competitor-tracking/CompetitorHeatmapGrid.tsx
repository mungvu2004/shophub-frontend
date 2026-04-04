import type { PriceHeatmapRow } from '@/features/products/logic/productsCompetitorTracking.types'

export function CompetitorHeatmapGrid({ rows }: { rows: PriceHeatmapRow[] }) {
  const maxValue = Math.max(1, ...rows.flatMap((row) => row.buckets.map((bucket) => bucket.totalCompetitors)))
  const bucketLabels = rows[0]?.buckets.map((bucket) => bucket.rangeLabel) ?? []

  return (
    <div className="overflow-x-auto space-y-5">
      <div className="flex items-center justify-end gap-3 pr-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Số lượng đối thủ: ít</p>
        <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-indigo-100 via-indigo-400 to-indigo-700" />
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Nhiều</p>
      </div>

      <div className="min-w-[740px] space-y-3">
        {rows.map((row) => (
          <div key={row.category} className="grid grid-cols-[120px_repeat(6,minmax(0,1fr))] gap-2.5">
            <p className="flex items-center text-sm font-semibold text-slate-600">{row.category}</p>
            {row.buckets.map((bucket) => {
              const intensity = bucket.totalCompetitors / maxValue
              const bgOpacity = Math.max(0.12, Math.min(0.95, intensity))

              return (
                <div
                  key={`${row.category}-${bucket.rangeLabel}`}
                  className="flex h-14 items-center justify-center rounded-lg border border-white/80 text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: `rgba(79, 70, 229, ${bgOpacity})` }}
                  title={`${bucket.rangeLabel}: ${bucket.totalCompetitors} đối thủ`}
                >
                  {bucket.totalCompetitors}
                </div>
              )
            })}
          </div>
        ))}

        {bucketLabels.length > 0 ? (
          <div className="grid grid-cols-[120px_repeat(6,minmax(0,1fr))] gap-2.5 pt-1">
            <div />
            {bucketLabels.map((label) => (
              <p key={label} className="text-center text-[11px] font-semibold text-slate-400">
                {label}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-500">Khoảng giá (price buckets)</p>
    </div>
  )
}
