import { AlertTriangle, ShieldCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfileSecuritySectionProps = {
  security: SettingsProfileViewModel['security']
}

export function ProfileSecuritySection({ security }: ProfileSecuritySectionProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{security.title}</CardTitle>
        <CardDescription>{security.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {security.checks.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center gap-4 rounded-xl border p-4 transition-all',
              item.status === 'healthy' ? 'border-secondary-100 bg-white' : 'border-destructive/20 bg-destructive/5'
            )}
          >
            <div
              className={cn(
                'grid size-10 place-items-center rounded-lg shadow-sm',
                item.status === 'healthy' ? 'bg-success-100 text-success-600' : 'bg-destructive-100 text-destructive-600'
              )}
            >
              {item.status === 'healthy' ? <ShieldCheck className="size-5" /> : <AlertTriangle className="size-5" />}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-bold text-secondary-900">{item.label}</p>
              <p className="text-xs leading-relaxed text-secondary-500">{item.description}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge variant={item.status === 'healthy' ? 'secondary' : 'destructive'} className="h-5 px-1.5 text-[10px] font-bold uppercase tracking-wider">
                {item.status === 'healthy' ? 'An toàn' : 'Cần xử lý'}
              </Badge>
              <Button type="button" size="xs" variant="outline" className="h-7 px-2 text-[10px] font-semibold uppercase tracking-wider">
                {item.actionLabel}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
