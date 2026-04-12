import type { SettingsPlatformConnectionsViewModel } from '@/features/settings/logic/settingsPlatformConnections.types'
import { ShieldCheck, Siren, Unplug } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { AddPlatformSection } from '@/features/settings/components/platform-connections/AddPlatformSection'
import { ConnectedPlatformsSection } from '@/features/settings/components/platform-connections/ConnectedPlatformsSection'
import { PlatformConnectionsHeader } from '@/features/settings/components/platform-connections/PlatformConnectionsHeader'
import { WebhookStatusSection } from '@/features/settings/components/platform-connections/WebhookStatusSection'

type SettingsPlatformConnectionsViewProps = {
  model: SettingsPlatformConnectionsViewModel
}

export function SettingsPlatformConnectionsView({ model }: SettingsPlatformConnectionsViewProps) {
  const connectedCount = model.connectedPlatforms.length
  const expiredCount = model.connectedPlatforms.filter((item) => item.tokenExpired).length
  const healthyWebhookCount = model.webhookStatuses.filter((item) => item.statusTone === 'healthy').length

  return (
    <div className="bg-background pb-16 pt-1 md:pt-2 xl:pb-20">
      <div className="mx-auto max-w-[1152px] space-y-8 xl:space-y-10">
        <PlatformConnectionsHeader title={model.title} subtitle={model.subtitle} />

        <section className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:gap-4">
          <Card className="gap-0 border-border px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">Sàn hoạt động</p>
              <ShieldCheck className="size-4 text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{connectedCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Đang kết nối ổn định</p>
          </Card>

          <Card className="gap-0 border-border px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">Token cảnh báo</p>
              <Siren className="size-4 text-amber-600" />
            </div>
            <p className={cn('mt-3 text-3xl font-bold', expiredCount > 0 ? 'text-amber-600' : 'text-foreground')}>{expiredCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Cần làm mới trong hôm nay</p>
          </Card>

          <Card className="gap-0 border-border px-5 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">Webhook healthy</p>
              <Unplug className="size-4 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{healthyWebhookCount}/{model.webhookStatuses.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Endpoint đang hoạt động</p>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <ConnectedPlatformsSection title={model.connectedSectionTitle} items={model.connectedPlatforms} />
            <WebhookStatusSection
              title={model.webhookSectionTitle}
              endpointConfigLabel={model.endpointConfigLabel}
              items={model.webhookStatuses}
            />
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <AddPlatformSection title={model.addNewSectionTitle} items={model.addablePlatforms} />
          </aside>
        </section>
      </div>
    </div>
  )
}
