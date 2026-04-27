import { Card, CardContent } from '@/components/ui/card'
import type { SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfileStatsGridProps = {
  stats: SettingsProfileViewModel['stats']
}

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:gap-6">
      {stats.map((stat) => (
        <Card key={stat.id} className="border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="space-y-1.5 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-500">{stat.label}</p>
            <p className="font-mono text-3xl font-bold tabular-nums text-secondary-900">{stat.valueLabel}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
