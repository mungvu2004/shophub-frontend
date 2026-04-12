import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SectionTitle } from '@/features/settings/components/platform-connections/SectionTitle'
import type { SettingsPlatformConnectionsViewModel } from '@/features/settings/logic/settingsPlatformConnections.types'
import { cn } from '@/lib/utils'

type AddPlatformSectionProps = {
  title: string
  items: SettingsPlatformConnectionsViewModel['addablePlatforms']
}

const accentClassByCode = {
  shopee: 'bg-[#EE4D2D]',
  tiktok_shop: 'bg-black',
  lazada: 'bg-[#3B82F6]',
} as const

export function AddPlatformSection({ title, items }: AddPlatformSectionProps) {
  return (
    <section className="space-y-4">
      <SectionTitle title={title} />

      <div className="space-y-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className={cn(
              'border border-dashed px-4 py-4',
              item.isUpcoming ? 'border-border bg-muted/30' : 'border-primary/40 bg-card shadow-sm',
            )}
          >
            <div className="flex items-start gap-3">
              <span className={cn('mt-1 inline-block size-3 rounded-full', accentClassByCode[item.platformCode])} />
              <div>
                <p className={cn('text-sm font-semibold', item.isUpcoming ? 'text-muted-foreground' : 'text-foreground')}>{item.ctaLabel}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.isUpcoming ? 'Tính năng sẽ được mở sau khi hoàn tất tích hợp API chính thức.' : 'Kết nối để mở rộng đồng bộ tồn kho, đơn hàng và trạng thái vận chuyển.'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              {item.badgeLabel ? (
                <Badge variant="outline" className="h-5 rounded-md px-2 text-[10px] font-bold uppercase text-muted-foreground">
                  {item.badgeLabel}
                </Badge>
              ) : null}

              <Button size="sm" variant={item.isUpcoming ? 'outline' : 'default'} className="ml-auto h-8 rounded-xl px-3 text-xs font-semibold" disabled={item.isUpcoming}>
                {item.isUpcoming ? 'Chưa khả dụng' : 'Tạo kết nối'}
              </Button>
            </div>
          </Card>
        ))}

        <Card className="border-border bg-card px-4 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">Checklist triển khai</p>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            <li>1. Cấu hình app key và callback URL.</li>
            <li>2. Kiểm tra webhook và đồng bộ thử.</li>
            <li>3. Bật đồng bộ định kỳ theo chu kỳ 5 phút.</li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
