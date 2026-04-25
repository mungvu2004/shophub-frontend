import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { toast } from 'sonner'

import { DashboardAlertsNotificationsSkeleton } from '@/features/dashboard/components/dashboard-alerts-notifications/DashboardAlertsNotificationsSkeleton'
import { DashboardAlertsNotificationsView } from '@/features/dashboard/components/dashboard-alerts-notifications/DashboardAlertsNotificationsView'
import { useDashboardAlertsNotifications } from '@/features/dashboard/hooks/useDashboardAlertsNotifications'
import { buildDashboardAlertsNotificationsViewModel } from '@/features/dashboard/logic/dashboardAlertsNotifications.logic'
import { useAlertKeyboardNavigation } from '@/features/dashboard/hooks/useAlertKeyboardNavigation'
import type {
  AlertsSeverity,
  AlertsTabId,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

export function DashboardAlertsNotifications() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<AlertsTabId>('all')
  const [selectedSeverities, setSelectedSeverities] = useState<AlertsSeverity[]>([])
  const [assigningAlertId, setAssigningAlertId] = useState<string | null>(null)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    markAllRead,
    isMarkingAllRead,
    dismissAlert,
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

  const visibleAlertIds = useMemo(() => {
    if (!model) return []
    return model.sections.flatMap(s => s.cards.map(c => s.id === 'history' ? null : c.id)).filter((id): id is string => Boolean(id))
  }, [model])

  const { focusedAlertId } = useAlertKeyboardNavigation({
    alertIds: visibleAlertIds,
    onAssign: (id) => setAssigningAlertId(id),
    onDismiss: (id) => dismissAlert(id),
    onAction: (id) => {
      const alert = data?.alerts.find(a => a.id === id)
      if (alert && alert.actions.length > 0) {
        handleAlertAction({
          alertId: alert.id,
          actionId: alert.actions[0].id,
          actionLabel: alert.actions[0].label,
          category: alert.category
        })
      }
    }
  })

  const toggleSeverity = (severity: AlertsSeverity) => {
    setSelectedSeverities((prev) => {
      if (prev.includes(severity)) {
        return prev.filter((item) => item !== severity)
      }

      return [...prev, severity]
    })
  }

  const getFallbackRouteByCategory = (category: 'orders' | 'inventory' | 'revenue' | 'system') => {
    if (category === 'orders') return '/orders/all'
    if (category === 'inventory') return '/inventory/sku-stock'
    if (category === 'revenue') return '/revenue/summary-report'
    return '/settings/platform-connections'
  }

  const handleAlertAction = (payload: {
    alertId: string
    actionId: string
    actionLabel: string
    category: 'orders' | 'inventory' | 'revenue' | 'system'
  }) => {
    const { alertId, actionId, actionLabel, category } = payload

    switch (actionId) {
      case 'confirm-order':
        navigate('/orders/pending-actions')
        return
      case 'view-order':
      case 'view-eta':
      case 'open-cod-report':
      case 'open-batch':
        navigate('/orders/all')
        return
      case 'dismiss-order':
        dismissAlert(alertId)
        return
      case 'create-po':
      case 'check-skus':
        navigate('/inventory/sku-stock')
        return
      case 'pause-listing':
        navigate('/products/list')
        toast.info('Đến trang sản phẩm để tạm ngừng bán.')
        return
      case 'open-ai':
        navigate('/inventory/ai-forecast')
        return
      case 'reply-reviews':
        navigate('/crm/review-inbox')
        return
      case 'open-report':
      case 'open-aov':
        navigate('/revenue/summary-report')
        return
      case 'open-log':
      case 'open-maintenance':
      case 'view-all':
        navigate('/settings/platform-connections')
        return
      default:
        navigate(getFallbackRouteByCategory(category))
        toast.info(`${actionLabel}: đang mở màn hình liên quan.`)
    }
  }

  if (isLoading && !model) {
    return <DashboardAlertsNotificationsSkeleton />
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không tải được dữ liệu cảnh báo và thông báo." onRetry={() => refetch()} />
  }

  return (
    <DashboardAlertsNotificationsView
      model={model}
      selectedTab={selectedTab}
      isRefreshing={isFetching}
      isMarkingAllRead={isMarkingAllRead}
      selectedSeverities={selectedSeverities}
      onTabChange={setSelectedTab}
      onToggleSeverity={toggleSeverity}
      onClearSeverity={() => setSelectedSeverities([])}
      onMarkAllRead={() => markAllRead()}
      onOpenSettings={() => navigate('/settings/automation')}
      onActionClick={handleAlertAction}
      focusedAlertId={focusedAlertId}
      assigningAlertId={assigningAlertId}
      onAssignAlertIdChange={setAssigningAlertId}
    />
  )
}
