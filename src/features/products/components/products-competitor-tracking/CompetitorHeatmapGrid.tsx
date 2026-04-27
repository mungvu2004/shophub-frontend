import type { PriceHeatmapRow } from '@/features/products/logic/productsCompetitorTracking.types'

export function CompetitorHeatmapGrid({ rows }: { rows: PriceHeatmapRow[] }) {
  const maxValue = Math.max(1, ...rows.flatMap((row) => row.buckets.map((bucket) => bucket.totalCompetitors)))
  const bucketLabels = rows[0]?.buckets.map((bucket) => bucket.rangeLabel) ?? []

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px] space-y-3">
        {rows.map((row) => (
          <div key={row.category} className="grid grid-cols-[140px_repeat(6,minmax(0,1fr))] gap-2">
            <p className="flex items-center text-[13px] font-bold text-slate-700">{row.category}</p>
            {row.buckets.map((bucket) => {
              const intensity = bucket.totalCompetitors / maxValue
              // Dải màu từ indigo-50 đến indigo-700
              const bgOpacity = Math.max(0.05, Math.min(0.9, intensity))
              const isDark = bgOpacity > 0.5

              return (
                <div
                  key={`${row.category}-${bucket.rangeLabel}`}
                  className={`flex h-12 items-center justify-center rounded-md border border-slate-50 text-[13px] font-black transition-all hover:scale-[1.02] hover:shadow-sm ${isDark ? 'text-white' : 'text-indigo-900'}`}
                  style={{ backgroundColor: `rgba(79, 70, 229, ${bgOpacity})` }}
                  title={`${bucket.rangeLabel}: ${bucket.totalCompetitors} đối thủ`}
                >
                  {bucket.totalCompetitors || ''}
                </div>
              )
            })}
          </div>
        ))}

        {bucketLabels.length > 0 ? (
          <div className="grid grid-cols-[140px_repeat(6,minmax(0,1fr))] gap-2 pt-2">
            <div />
            {bucketLabels.map((label) => (
              <p key={label} className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {label}
              </p>
            ))}
          </div>
        ) : null}
        
        <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-50 pt-4">
          <span className="text-[10px] font-black uppercase tracking-[2px] text-slate-300">Khoảng giá thị trường (VND)</span>
        </div>
      </div>
    </div>
  )
}
