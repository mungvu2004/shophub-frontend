type RevenueGoalSectionProps = {
  monthlyGoalLabel: string
  goalProgressLabel: string
  goalProgressPercent: number
}

export function RevenueGoalSection({
  monthlyGoalLabel,
  goalProgressLabel,
  goalProgressPercent,
}: RevenueGoalSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">Mục tiêu tháng: {monthlyGoalLabel}</p>
        <p className="text-sm font-semibold text-slate-700">{goalProgressLabel}</p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${goalProgressPercent}%` }} />
      </div>
    </section>
  )
}
