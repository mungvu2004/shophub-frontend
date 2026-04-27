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
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 rounded-xl bg-primary-50/50 p-4 transition-colors hover:bg-primary-50">
          <div className="grid size-14 place-items-center rounded-full bg-primary-100 text-lg font-bold text-primary-700 shadow-inner">
            {model.initials}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">Member Identity</p>
            <p className="text-sm font-semibold text-secondary-900">{model.joinedAtLabel}</p>
          </div>
          <UserCircle2 className="size-5 text-primary-400" />
        </div>

        <div className="space-y-3 px-1">
          <div className="flex items-center gap-3 text-sm text-secondary-600 transition-colors hover:text-secondary-900">
            <div className="grid size-8 place-items-center rounded-lg bg-secondary-100">
              <Mail className="size-4 text-secondary-500" />
            </div>
            <span className="font-medium">{model.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-secondary-600 transition-colors hover:text-secondary-900">
            <div className="grid size-8 place-items-center rounded-lg bg-secondary-100">
              <MapPin className="size-4 text-secondary-500" />
            </div>
            <span className="font-medium">{model.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
