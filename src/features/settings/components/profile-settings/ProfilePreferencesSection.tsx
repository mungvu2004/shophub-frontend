import { Check, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfilePreferencesSectionProps = {
  preferences: SettingsProfileViewModel['preferences']
  onToggle: (id: string) => void
}

export function ProfilePreferencesSection({ preferences, onToggle }: ProfilePreferencesSectionProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Tùy chọn vận hành</CardTitle>
        <CardDescription>Bật hoặc tắt các nhắc nhở và chế độ làm việc cá nhân.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {preferences.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-600">{item.description}</p>
            </div>

            <Badge variant={item.enabled ? 'secondary' : 'outline'}>{item.enabled ? 'Đang bật' : 'Đang tắt'}</Badge>

            <Button type="button" variant={item.enabled ? 'outline' : 'default'} size="sm" onClick={() => onToggle(item.id)}>
              {item.enabled ? <X className="size-4" /> : <Check className="size-4" />}
              {item.enabled ? 'Tắt' : 'Bật'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
