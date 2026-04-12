import { PlatformConnectionCard } from '@/features/settings/components/platform-connections/PlatformConnectionCard'
import { SectionTitle } from '@/features/settings/components/platform-connections/SectionTitle'
import type { SettingsPlatformConnectionsViewModel } from '@/features/settings/logic/settingsPlatformConnections.types'

type ConnectedPlatformsSectionProps = {
  title: string
  items: SettingsPlatformConnectionsViewModel['connectedPlatforms']
}

export function ConnectedPlatformsSection({ title, items }: ConnectedPlatformsSectionProps) {
  return (
    <section className="space-y-4">
      <SectionTitle title={title} />
      <div className="space-y-3">
        {items.map((item) => (
          <PlatformConnectionCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
