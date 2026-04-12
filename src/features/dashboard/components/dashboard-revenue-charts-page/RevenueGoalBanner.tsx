type RevenueGoalBannerProps = {
  label: string
  progressPercent: number
  progressLabel: string
}

export function RevenueGoalBanner({ label, progressPercent, progressLabel }: RevenueGoalBannerProps) {
  return (
    <section className="space-y-3 rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-indigo-900">{label}</p>
        <span className="text-xs font-bold uppercase tracking-[0.6px] text-indigo-600">{progressLabel}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-indigo-200/60">
        <div className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" style={{ width: `${progressPercent}%` }} />
      </div>
    </section>
  )
}
