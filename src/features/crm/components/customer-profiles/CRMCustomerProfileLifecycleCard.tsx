import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type CRMCustomerProfileLifecycleCardProps = {
  selectedCustomer: {
    lifecycle: Array<{
      dateLabel: string
      title: string
      subtitle?: string
      isCurrent?: boolean
    }>
  } | null
}

export function CRMCustomerProfileLifecycleCard({ selectedCustomer }: CRMCustomerProfileLifecycleCardProps) {
  if (!selectedCustomer) return null

  return (
    <Card className="rounded-[12px] border-0 bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="text-base font-semibold text-slate-900">Customer Lifecycle Timeline</div>

      <div className="relative mt-8 flex items-start justify-between gap-6 border-t-2 border-slate-200 pt-6">
        {selectedCustomer.lifecycle.map((point) => (
          <div key={point.dateLabel} className="flex flex-1 flex-col items-center gap-2 text-center">
            <div
              className={cn(
                'size-3 rounded-full shadow-[0px_0px_0px_4px_rgba(53,37,205,0.18)]',
                point.isCurrent ? 'bg-[#4f46e5]' : 'bg-[#3525cd]',
              )}
            />
            <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.08em] text-[#3525cd]">
              {point.dateLabel}
            </div>
            <div className="text-[11px] text-slate-500">{point.title}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
