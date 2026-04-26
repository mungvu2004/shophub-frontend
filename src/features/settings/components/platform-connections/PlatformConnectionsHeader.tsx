import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type PlatformConnectionsHeaderProps = {
  title: string
  subtitle: string
}

export function PlatformConnectionsHeader({ title, subtitle }: PlatformConnectionsHeaderProps) {
  return (
    <Card className="bg-abstract-geometric relative overflow-hidden border-border bg-gradient-to-r from-card to-muted/40 px-5 py-5 shadow-sm xl:px-6 xl:py-6">
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/10" aria-hidden />
      <div className="absolute -bottom-12 right-20 size-28 rounded-full bg-primary/10" aria-hidden />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[1px] text-primary">Platform Ops Console</p>
          <h1 className="mt-1 text-[30px] font-bold tracking-[-0.5px] text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-xl px-3 text-xs font-semibold">Kiểm tra sức khỏe</Button>
          <Button size="sm" className="h-9 rounded-xl px-3 text-xs font-semibold">Đồng bộ toàn bộ</Button>
        </div>
      </div>
    </Card>
  )
}
