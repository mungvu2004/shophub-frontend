import type {
  AlertsSeverity,
  AlertsTabId,
  DashboardAlertsNotificationsViewModel,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

import { AlertsHeader } from './AlertsHeader'
import { AlertsSection } from './AlertsSection'
import { AlertsSummaryStrip } from './AlertsSummaryStrip'
import { AlertsTabs } from './AlertsTabs'

type DashboardAlertsNotificationsViewProps = {
  model: DashboardAlertsNotificationsViewModel
  selectedSeverities: AlertsSeverity[]
  isRefreshing: boolean
  isMarkingAllRead: boolean
  onTabChange: (tab: AlertsTabId) => void
  onToggleSeverity: (severity: AlertsSeverity) => void
  onClearSeverity: () => void
  onMarkAllRead: () => void
}

export function DashboardAlertsNotificationsView({
  model,
  selectedSeverities,
  isRefreshing,
  isMarkingAllRead,
  onTabChange,
  onToggleSeverity,
  onClearSeverity,
  onMarkAllRead,
}: DashboardAlertsNotificationsViewProps) {
  return (
    <div className="space-y-6 pb-8">
      <AlertsHeader
        title={model.title}
        subtitle={model.subtitle}
        autoRefreshLabel={model.autoRefreshLabel}
        updatedAtLabel={model.updatedAtLabel}
        isRefreshing={isRefreshing}
        isMarkingAllRead={isMarkingAllRead}
        onMarkAllRead={onMarkAllRead}
      />

      <AlertsSummaryStrip
        chips={model.summaryChips}
        selectedSeverities={selectedSeverities}
        onToggleSeverity={onToggleSeverity}
        onClearSeverity={onClearSeverity}
      />

      <AlertsTabs tabs={model.tabs} onTabChange={onTabChange} />

      <div className="space-y-10">
        {model.sections.map((section) => (
          <AlertsSection key={section.id} section={section} />
        ))}
      </div>

      {model.totalVisible === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm font-medium text-slate-500">
          Không có cảnh báo phù hợp với bộ lọc hiện tại.
        </div>
      ) : null}
    </div>
  )
}
