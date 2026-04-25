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
  onAssignClick: (alertId: string) => void
  focusedAlertId?: string | null
}

const headingClass: Record<DashboardAlertsSectionModel['severity'], string> = {
  critical: 'text-rose-900',
  action: 'text-orange-900',
  info: 'text-blue-900',
}

const barClass: Record<DashboardAlertsSectionModel['severity'], string> = {
  critical: 'bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.4)]',
  action: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]',
  info: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]',
}

export function AlertsSection({ section, onActionClick, onAssignClick, focusedAlertId }: AlertsSectionProps) {
  const isActionSection = section.severity === 'action'
  const isInfoSection = section.severity === 'info'

  return (
    <section className={cn('space-y-6', isInfoSection && 'rounded-3xl border border-slate-100 bg-slate-50/50 p-6')}>
      <div className="flex items-center gap-3.5 px-1">
        <div className={cn('h-6 w-1 rounded-full', barClass[section.severity])} />
        <div className="space-y-0.5">
          <h2 className={cn('text-xs font-black uppercase tracking-[0.2em]', headingClass[section.severity])}>{section.title}</h2>
          {isInfoSection ? <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Thanh theo dõi định kỳ • Ưu tiên thấp</p> : null}
        </div>
      </div>

      <div className={cn(
        isActionSection 
          ? 'grid auto-rows-fr gap-5 xl:grid-cols-2' 
          : isInfoSection 
            ? 'grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3' 
            : 'space-y-5'
      )}>
        {section.cards.map((card, index) => (
          <div
            key={card.id}
            className={cn(
              isActionSection && index === section.cards.length - 1 ? 'xl:col-span-2' : '',
              'h-full'
            )}
          >
            <AlertCard 
              card={card} 
              compact={isActionSection || isInfoSection} 
              onActionClick={onActionClick} 
              onAssignClick={onAssignClick}
              isFocused={focusedAlertId === card.id}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
