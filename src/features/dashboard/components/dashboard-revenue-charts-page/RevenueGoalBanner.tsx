type RevenueGoalBannerProps = {
  label: string
  progressPercent: number
  progressLabel: string
}

export function RevenueGoalBanner({ label, progressPercent, progressLabel }: RevenueGoalBannerProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-primary-100 bg-primary-50 px-6 py-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-black text-primary-900 leading-none">{label}</p>
          <p className="text-xs font-medium text-primary-600 opacity-80">Mục tiêu tăng trưởng tháng hiện tại</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary-700">{progressLabel}</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-black text-primary-600 shadow-sm border border-primary-100">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-white border border-primary-100 shadow-inner">
        <div 
          className="absolute inset-y-0 left-0 rounded-full bg-success-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-1000 ease-out" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>
    </section>
  )
}
