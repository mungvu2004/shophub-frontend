import { BarChart3, Crown, MessageSquare, Package } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { StaffPermissionSummaryCardViewModel } from '@/features/settings/logic/settingsStaffPermissions.types'

type StaffSummaryCardsProps = {
  cards: StaffPermissionSummaryCardViewModel[]
}

const iconMap = {
  crown: Crown,
  box: Package,
  chat: MessageSquare,
  chart: BarChart3,
} as const

const cardToneClassMap: Record<StaffPermissionSummaryCardViewModel['tone'], string> = {
  indigo: 'bg-indigo-50 text-indigo-600',
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-50 text-slate-600',
}

const countToneClassMap: Record<StaffPermissionSummaryCardViewModel['tone'], string> = {
  indigo: 'text-indigo-600',
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  purple: 'text-violet-600',
  slate: 'text-slate-600',
}

export function StaffSummaryCards({ cards }: StaffSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconMap[card.icon]

        return (
          <Card key={card.id} className="gap-0 border-0 bg-[#f0f3ff] px-5 py-5 shadow-[0px_10px_24px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-4">
              <div className={cn('flex size-12 items-center justify-center rounded-full bg-white shadow-sm', cardToneClassMap[card.tone])}>
                <Icon className="size-5" />
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{card.label}</p>
                <p className={cn('text-[20px] font-bold leading-none', countToneClassMap[card.tone])}>
                  {card.countLabel}
                  <span className="ml-1 text-sm font-medium text-slate-400">thành viên</span>
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </section>
  )
}