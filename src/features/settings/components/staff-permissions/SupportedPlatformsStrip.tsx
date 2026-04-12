import type { StaffPermissionPlatformViewModel } from '@/features/settings/logic/settingsStaffPermissions.types'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type SupportedPlatformsStripProps = {
  platforms: StaffPermissionPlatformViewModel[]
}

const platformToneClassMap: Record<string, string> = {
  lazada: 'border-violet-200 bg-violet-50 text-violet-700',
  shopee: 'border-orange-200 bg-orange-50 text-orange-700',
  tiktok_shop: 'border-slate-200 bg-slate-50 text-slate-700',
}

export function SupportedPlatformsStrip({ platforms }: SupportedPlatformsStripProps) {
  if (platforms.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[18px] border border-slate-200/70 bg-white px-5 py-4 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Áp dụng cho</span>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Badge
            key={platform.id}
            variant="outline"
            className={cn('h-7 rounded-full px-3 text-xs font-semibold', platformToneClassMap[platform.code] ?? 'bg-slate-50 text-slate-700')}
          >
            {platform.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}