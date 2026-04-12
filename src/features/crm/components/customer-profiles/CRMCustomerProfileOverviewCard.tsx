import { PencilLine, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CRMCustomerProfileOverviewCardProps = {
  selectedCustomer: {
    avatarUrl: string
    fullName: string
    maskedPhone: string
    email: string
    customerSinceLabel: string
    segmentBadge: { label: string; className: string }
    platformBadges: Array<{ id: string; label: string; className: string }>
    primaryCtaLabel: string
    secondaryCtaLabel: string
  } | null
}

export function CRMCustomerProfileOverviewCard({ selectedCustomer }: CRMCustomerProfileOverviewCardProps) {
  if (!selectedCustomer) {
    return <div className="rounded-[12px] border border-slate-200 bg-white p-8 text-sm text-slate-500">Chưa có khách hàng nào được chọn.</div>
  }

  return (
    <section className="overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_32px_0px_rgba(15,23,42,0.06)]">
      <div className="h-2 w-full bg-gradient-to-r from-[#3525cd] to-[#4f46e5]" />

      <div className="p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex gap-6">
            <div className="relative shrink-0">
              <img src={selectedCustomer.avatarUrl} alt={selectedCustomer.fullName} className="size-20 rounded-2xl object-cover shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]" />
              <div className="absolute -bottom-2 -right-2 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-white shadow-[0px_0px_0px_2px_white]">
                VIP
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="max-w-[260px] text-[24px] font-bold leading-[1.25] tracking-[-0.03em] text-slate-900">
                  {selectedCustomer.fullName}
                </h2>
                <span className={cn('inline-flex rounded-[6px] border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]', selectedCustomer.segmentBadge.className)}>
                  {selectedCustomer.segmentBadge.label}
                </span>
              </div>

              <div className="space-y-1 text-sm text-slate-500">
                <div>{selectedCustomer.maskedPhone}</div>
                <div>{selectedCustomer.email}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="text-xs text-slate-500">
                  Khách hàng từ: <span className="font-semibold text-slate-900">{selectedCustomer.customerSinceLabel}</span>
                </div>
                {selectedCustomer.platformBadges.map((badge) => (
                  <span key={badge.id} className={cn('inline-flex items-center gap-1 rounded-[4px] px-2 py-1 text-[10px] font-bold', badge.className)}>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="h-9 rounded-lg border-[#3525cd] px-4 text-[#3525cd]">
              <Sparkles className="size-4" />
              {selectedCustomer.primaryCtaLabel}
            </Button>
            <Button type="button" variant="outline" className="h-9 rounded-lg px-4 text-slate-900">
              <PencilLine className="size-4" />
              {selectedCustomer.secondaryCtaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
