import { useMemo, useState } from 'react'

import { DashboardAlertsNotificationsView } from '@/features/dashboard/components/dashboard-alerts-notifications/DashboardAlertsNotificationsView'
import { useDashboardAlertsNotifications } from '@/features/dashboard/hooks/useDashboardAlertsNotifications'
import { buildDashboardAlertsNotificationsViewModel } from '@/features/dashboard/logic/dashboardAlertsNotifications.logic'
import type {
  AlertsSeverity,
  AlertsTabId,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

export function DashboardAlertsNotifications() {
  const [selectedTab, setSelectedTab] = useState<AlertsTabId>('all')
  const [selectedSeverities, setSelectedSeverities] = useState<AlertsSeverity[]>([])

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    markAllRead,
    isMarkingAllRead,
  } = useDashboardAlertsNotifications()

  const model = useMemo(() => {
    if (!data) return null

    return buildDashboardAlertsNotificationsViewModel({
      data,
      filter: {
        tab: selectedTab,
        severities: selectedSeverities,
      },
    })
  }, [data, selectedSeverities, selectedTab])

  const toggleSeverity = (severity: AlertsSeverity) => {
    setSelectedSeverities((prev) => {
      if (prev.includes(severity)) {
        return prev.filter((item) => item !== severity)
      }

      return [...prev, severity]
    })
  }

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải cảnh báo vận hành...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không tải được dữ liệu cảnh báo và thông báo.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <DashboardAlertsNotificationsView
      model={model}
      isRefreshing={isFetching}
      isMarkingAllRead={isMarkingAllRead}
      selectedSeverities={selectedSeverities}
      onTabChange={setSelectedTab}
      onToggleSeverity={toggleSeverity}
      onClearSeverity={() => setSelectedSeverities([])}
      onMarkAllRead={() => markAllRead()}
    />
  )
}
