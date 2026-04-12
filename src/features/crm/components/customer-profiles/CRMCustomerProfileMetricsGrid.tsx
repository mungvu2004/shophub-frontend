import { Card } from '@/components/ui/card'

type CRMCustomerProfileMetricsGridProps = {
  selectedCustomer: {
    stats: Array<{
      label: string
      value: string
      subtext?: string
    }>
  } | null
}

export function CRMCustomerProfileMetricsGrid({ selectedCustomer }: CRMCustomerProfileMetricsGridProps) {
  if (!selectedCustomer) return null

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {selectedCustomer.stats.map((item) => (
        <Card key={item.label} className="gap-2 rounded-[12px] border-0 bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{item.label}</div>
          <div className="font-mono text-[28px] font-semibold leading-none text-slate-900">{item.value}</div>
          {item.subtext ? <div className="text-xs text-slate-500">{item.subtext}</div> : null}
        </Card>
      ))}
    </div>
  )
}
