import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SectionTitle } from '@/features/settings/components/platform-connections/SectionTitle'
import type { SettingsPlatformConnectionsViewModel } from '@/features/settings/logic/settingsPlatformConnections.types'
import { cn } from '@/lib/utils'

type WebhookStatusSectionProps = {
  title: string
  endpointConfigLabel: string
  items: SettingsPlatformConnectionsViewModel['webhookStatuses']
}

export function WebhookStatusSection({ title, endpointConfigLabel, items }: WebhookStatusSectionProps) {
  return (
    <section className="space-y-4">
      <SectionTitle
        title={title}
        rightSlot={(
          <a href="#" className="text-xs font-bold text-primary hover:opacity-90">
            {endpointConfigLabel}
          </a>
        )}
      />

      <Card className="border-border bg-card px-5 py-5 shadow-sm xl:px-6 xl:py-6">
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{item.eventName}</p>
                <Badge className={cn('h-5 rounded-md px-2 text-[10px] font-bold', item.statusTone === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                  {item.statusLabel}
                </Badge>
              </div>

              <p className="mt-2 rounded bg-muted/40 px-2 py-1 font-mono text-[11px] text-muted-foreground">{item.endpoint}</p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                <p className="text-muted-foreground">
                  Lượt gọi (24h): <span className="font-semibold text-foreground">{item.requests24hLabel}</span>
                </p>
                <p className={cn('text-muted-foreground', item.errors24hLabel !== '0' ? 'font-semibold text-destructive' : '')}>
                  Lỗi (24h): <span className="font-semibold">{item.errors24hLabel}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </section>
  )
}
