import { cn } from '@/lib/utils'

import type { DashboardAlertsSectionModel } from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

import { AlertCard } from './AlertCard'

type AlertsSectionProps = {
  section: DashboardAlertsSectionModel
  onActionClick: (payload: {
    alertId: string
    actionId: string
    actionLabel: string
    category: DashboardAlertsSectionModel['cards'][number]['category']
  }) => void
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

export function AlertsSection({ section, onActionClick }: AlertsSectionProps) {
  const isActionSection = section.severity === 'action'
  const isInfoSection = section.severity === 'info'

  return (
    <section className={cn('space-y-5', isInfoSection && 'rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 md:p-5')}>
      <div className="flex items-center gap-3">
        <div className={cn('h-7 w-1.5 rounded-full', barClass[section.severity])} />
        <div className="space-y-1">
          <h2 className={cn('text-sm font-bold uppercase tracking-[0.14em]', headingClass[section.severity])}>{section.title}</h2>
          {isInfoSection ? <p className="text-xs font-medium text-slate-500">Chỉ theo dõi tổng quát, ưu tiên thấp hơn các mục còn lại.</p> : null}
        </div>
      </div>

      <div className={cn(isActionSection ? 'grid auto-rows-fr gap-4 xl:grid-cols-2' : isInfoSection ? 'grid auto-rows-fr gap-3 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4')}>
        {section.cards.map((card, index) => (
          <div
            key={card.id}
            className={cn(
              isActionSection && index === section.cards.length - 1 ? 'md:col-span-2' : '',
              isActionSection ? 'h-full' : '',
              isInfoSection ? 'rounded-2xl border border-slate-200/70 bg-white/95 p-2.5 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.25)]' : '',
            )}
          >
            <AlertCard card={card} compact={isActionSection || isInfoSection} onActionClick={onActionClick} />
          </div>
        ))}
      </div>
    </section>
  )
}
