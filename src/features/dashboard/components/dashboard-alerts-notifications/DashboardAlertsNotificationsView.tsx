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
  selectedTab: AlertsTabId
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
  selectedTab,
  selectedSeverities,
  isRefreshing,
  isMarkingAllRead,
  onTabChange,
  onToggleSeverity,
  onClearSeverity,
  onMarkAllRead,
}: DashboardAlertsNotificationsViewProps) {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/60 p-5 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.45)] md:space-y-8 md:p-7">
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

      <AlertsTabs activeTab={selectedTab} tabs={model.tabs} onTabChange={onTabChange} />

      <div className="space-y-10">
        {model.sections.map((section) => (
          <AlertsSection key={section.id} section={section} />
        ))}
      </div>

      {model.totalVisible === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center text-sm font-medium text-slate-500">
          Không có cảnh báo phù hợp với bộ lọc hiện tại.
        </div>
      ) : null}
    </div>
  )
}
