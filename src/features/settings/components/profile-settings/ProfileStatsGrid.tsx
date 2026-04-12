import { Card, CardContent } from '@/components/ui/card'
import type { SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfileStatsGridProps = {
  stats: SettingsProfileViewModel['stats']
}

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.id} className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-1 pt-1">
            <p className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-slate-900">{stat.valueLabel}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
