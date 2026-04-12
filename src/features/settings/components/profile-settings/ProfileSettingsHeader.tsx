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
    <header className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {isRefreshing ? <Badge variant="outline">Đang làm mới dữ liệu</Badge> : null}
      </div>
      <p className="text-sm text-slate-600">{subtitle}</p>
      <p className="text-xs font-medium uppercase tracking-[1px] text-slate-400">{updatedAtLabel}</p>
    </header>
  )
}
