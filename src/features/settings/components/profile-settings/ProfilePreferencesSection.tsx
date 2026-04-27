import { Check, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfilePreferencesSectionProps = {
  preferences: SettingsProfileViewModel['preferences']
  onToggle: (id: string) => void
}

export function ProfilePreferencesSection({ preferences, onToggle }: ProfilePreferencesSectionProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{preferences.title}</CardTitle>
        <CardDescription>{preferences.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferences.items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center gap-4 rounded-xl border border-secondary-200 p-4 transition-all',
              item.enabled ? 'bg-secondary-50/50' : 'bg-white'
            )}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-bold text-secondary-900">{item.label}</p>
              <p className="text-xs leading-relaxed text-secondary-500">{item.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={item.enabled ? 'secondary' : 'outline'} className="h-6">
                {item.enabled ? 'Đang bật' : 'Đang tắt'}
              </Badge>

              <Button
                type="button"
                variant={item.enabled ? 'outline' : 'default'}
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => onToggle(item.id)}
              >
                {item.enabled ? <X className="size-3.5" /> : <Check className="size-3.5" />}
                <span className="text-xs font-semibold">{item.enabled ? 'Tắt' : 'Bật'}</span>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
