import { Button } from '@/components/ui/button'
import { Link2 } from 'lucide-react'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

type PlatformConnectionsHeaderProps = {
  title: string
  subtitle: string
}

export function PlatformConnectionsHeader({ title, subtitle }: PlatformConnectionsHeaderProps) {
  return (
    <ThemedPageHeader
      title={title}
      subtitle={subtitle}
      theme="settings"
      badge={{ text: 'Platform Ops Console', icon: <Link2 className="size-3.5" /> }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="h-10 rounded-xl px-4 text-sm font-black bg-white/80 backdrop-blur border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm">Kiểm tra sức khỏe</Button>
        <Button className="h-10 rounded-xl px-4 text-sm font-black bg-slate-800 text-white hover:bg-slate-900 shadow-sm">Đồng bộ toàn bộ</Button>
      </div>
    </ThemedPageHeader>
  )
}
