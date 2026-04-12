import { AlertTriangle, ShieldCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfileSecuritySectionProps = {
  checks: SettingsProfileViewModel['securityChecks']
}

export function ProfileSecuritySection({ checks }: ProfileSecuritySectionProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Bảo mật tài khoản</CardTitle>
        <CardDescription>Kiểm tra định kỳ giúp giảm rủi ro khi vận hành đa nền tảng.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {checks.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            <div className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-700">
              {item.status === 'healthy' ? <ShieldCheck className="size-4" /> : <AlertTriangle className="size-4" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-600">{item.description}</p>
            </div>

            <Badge variant={item.status === 'healthy' ? 'secondary' : 'destructive'}>
              {item.status === 'healthy' ? 'An toàn' : 'Cần xử lý'}
            </Badge>
            <Button type="button" size="sm" variant="outline">{item.actionLabel}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
