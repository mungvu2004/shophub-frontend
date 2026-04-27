import { Badge } from '@/components/ui/badge'
import type { SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfileSettingsHeaderProps = {
  title: SettingsProfileViewModel['title']
  subtitle: SettingsProfileViewModel['subtitle']
  updatedAtLabel: SettingsProfileViewModel['updatedAtLabel']
  isRefreshing: boolean
}

export function ProfileSettingsHeader({ title, subtitle, updatedAtLabel, isRefreshing }: ProfileSettingsHeaderProps) {
  return (
    <header className="bg-abstract-geometric space-y-3 pb-2">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-secondary-900 xl:text-4xl">{title}</h1>
        {isRefreshing ? (
          <Badge variant="secondary" className="animate-pulse bg-primary-50 text-primary-700">
            Đang cập nhật...
          </Badge>
        ) : null}
      </div>
      <div className="space-y-1">
        <p className="max-w-2xl text-base text-secondary-600">{subtitle}</p>
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-secondary-400">{updatedAtLabel}</p>
      </div>
    </header>
  )
}
