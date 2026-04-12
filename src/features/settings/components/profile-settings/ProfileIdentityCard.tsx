import { MapPin, Mail, UserCircle2 } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfileIdentityCardProps = {
  model: SettingsProfileViewModel['profileCard']
}

export function ProfileIdentityCard({ model }: ProfileIdentityCardProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{model.title}</CardTitle>
        <CardDescription>{model.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="grid size-12 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">{model.initials}</div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[1px] text-slate-500">Identity Badge</p>
            <p className="text-sm font-semibold text-slate-900">{model.joinedAtLabel}</p>
          </div>
          <UserCircle2 className="ml-auto size-5 text-slate-400" />
        </div>

        <div className="space-y-2 rounded-xl border border-slate-200 p-3">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Mail className="size-4 text-slate-400" />
            {model.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <MapPin className="size-4 text-slate-400" />
            {model.location}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
