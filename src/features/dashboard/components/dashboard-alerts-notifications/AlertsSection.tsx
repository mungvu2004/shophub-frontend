import { cn } from '@/lib/utils'

import type { DashboardAlertsSectionModel } from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

import { AlertCard } from './AlertCard'

type AlertsSectionProps = {
  section: DashboardAlertsSectionModel
}

const headingClass: Record<DashboardAlertsSectionModel['severity'], string> = {
  critical: 'text-rose-700',
  action: 'text-orange-700',
  info: 'text-blue-700',
}

const barClass: Record<DashboardAlertsSectionModel['severity'], string> = {
  critical: 'bg-rose-600',
  action: 'bg-orange-500',
  info: 'bg-blue-500',
}

export function AlertsSection({ section }: AlertsSectionProps) {
  const isActionSection = section.severity === 'action'

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className={cn('h-7 w-1.5 rounded-full', barClass[section.severity])} />
        <h2 className={cn('text-sm font-bold uppercase tracking-[0.14em]', headingClass[section.severity])}>{section.title}</h2>
      </div>

      <div className={cn(isActionSection ? 'grid gap-4 xl:grid-cols-2' : 'space-y-4')}>
        {section.cards.map((card, index) => (
          <div key={card.id} className={cn(isActionSection && index === section.cards.length - 1 ? 'md:col-span-2' : '')}>
            <AlertCard card={card} compact={isActionSection} />
          </div>
        ))}
      </div>
    </section>
  )
}
