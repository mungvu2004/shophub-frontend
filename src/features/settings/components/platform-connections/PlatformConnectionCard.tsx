import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@base-ui/react/progress'
import type { ConnectionCardViewModel } from '@/features/settings/logic/settingsPlatformConnections.types'
import { cn } from '@/lib/utils'

import { platformStyleByCode } from '@/features/settings/components/platform-connections/platformConnection.styles'

type PlatformConnectionCardProps = {
  item: ConnectionCardViewModel
}

function ActionButton({ label, type }: { label: string, type: ConnectionCardViewModel['actions'][number]['type'] }) {
  if (type === 'disconnect') {
    return (
      <Button variant="ghost" size="sm" className="h-8 rounded-xl px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700">
        {label}
      </Button>
    )
  }

  if (type === 'sync') {
    return (
      <Button variant="outline" size="sm" className="h-9 rounded-xl px-4 text-xs font-bold">
        {label}
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="sm" className="h-9 rounded-xl px-4 text-xs font-bold text-muted-foreground">
      {label}
    </Button>
  )
}

export function PlatformConnectionCard({ item }: PlatformConnectionCardProps) {
  const style = platformStyleByCode[item.platformCode]

  return (
    <Card className={cn('border-l-4 px-0 py-0 shadow-sm', style.cardBorderClassName)}>
      <div className="grid grid-cols-1 gap-4 px-5 py-5 lg:grid-cols-[1fr_auto]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-[10px] text-xs font-black tracking-[0.8px]', style.logoBackgroundClassName, style.logoTextClassName)}>
                {style.label}
              </div>
              <div>
                <h3 className="text-xl font-bold leading-6 text-foreground">{item.platformName}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.shopName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="h-5 gap-1 rounded-full bg-emerald-100 px-2 text-[11px] font-bold text-emerald-700">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                Đã kết nối
              </Badge>
              {item.tokenExpired ? (
                <Badge className="h-5 rounded-full bg-amber-100 px-2 text-[11px] font-bold text-amber-700">Token sắp hết hạn</Badge>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
            <div>
              <p className="font-semibold uppercase tracking-[0.6px] text-muted-foreground">Shop ID</p>
              <p className="mt-1 font-mono text-[13px] font-semibold text-foreground">{item.shopId}</p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-[0.6px] text-muted-foreground">Ngày tham gia</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground">{item.joinedAtLabel}</p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-[0.6px] text-muted-foreground">Hết hạn token</p>
              <p className={cn('mt-1 font-mono text-[13px] font-semibold', item.tokenExpired ? 'text-destructive' : 'text-foreground')}>
                {item.tokenExpiredAtLabel}
              </p>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-[0.6px] text-muted-foreground">Đồng bộ</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground">{item.lastSyncedLabel}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-muted-foreground">API calls hôm nay</span>
              <span className="font-mono font-semibold text-foreground">{item.apiUsageLabel}</span>
            </div>
            <Progress.Root value={item.apiUsagePercent} className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <Progress.Indicator
                className={cn('h-full rounded-full transition-all', item.apiUsageTone === 'warning' ? 'bg-amber-500' : 'bg-emerald-500')}
                style={{ width: `${item.apiUsagePercent}%` }}
              />
            </Progress.Root>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {item.permissions.map((permission) => (
              <Badge key={`${item.id}-${permission}`} variant="secondary" className="h-6 rounded-[8px] px-2 text-[10px] font-semibold text-muted-foreground">
                {permission}
              </Badge>
            ))}
            <Badge className="h-6 gap-1 rounded-[8px] bg-emerald-100 px-2 text-[10px] font-bold text-emerald-700">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              Webhook realtime
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
            <span>{item.eventSummaryLabel}</span>
            <span className="inline-block size-1 rounded-full bg-border" />
            <span>{item.errorSummaryLabel}</span>
          </div>
        </div>

        <div className="flex min-w-[220px] flex-col gap-2 rounded-xl border border-border/70 bg-card p-3 lg:self-start">
          {item.actions.map((action) => (
            <ActionButton key={action.id} label={action.label} type={action.type} />
          ))}

          <a href="#" className="pt-1 text-right text-xs font-bold text-primary hover:opacity-90">
            [Xem log chi tiết →]
          </a>
        </div>
      </div>
    </Card>
  )
}
