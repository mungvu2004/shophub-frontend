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
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={cn('h-6 w-1.5 rounded-full', barClass[section.severity])} />
        <h2 className={cn('text-lg font-extrabold uppercase tracking-[0.18em]', headingClass[section.severity])}>{section.title}</h2>
      </div>

      <div className="space-y-4">
        {section.cards.map((card) => (
          <AlertCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}
