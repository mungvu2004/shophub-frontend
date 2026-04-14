import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { toast } from '@/components/ui/toast'

import { DashboardAlertsNotificationsView } from '@/features/dashboard/components/dashboard-alerts-notifications/DashboardAlertsNotificationsView'
import { useDashboardAlertsNotifications } from '@/features/dashboard/hooks/useDashboardAlertsNotifications'
import { buildDashboardAlertsNotificationsViewModel } from '@/features/dashboard/logic/dashboardAlertsNotifications.logic'
import type {
  AlertsSeverity,
  AlertsTabId,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

export function DashboardAlertsNotifications() {
  const navigate = useNavigate()
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
    const { actionId, actionLabel, category } = payload

    switch (actionId) {
      case 'confirm-order':
        navigate('/orders/pending-actions')
        toast.success('Mở danh sách đơn cần xác nhận.')
        return
      case 'view-order':
      case 'view-eta':
      case 'open-cod-report':
      case 'open-batch':
        navigate('/orders/all')
        return
      case 'dismiss-order':
        toast.info('Đã ghi nhận thao tác bỏ qua cảnh báo.')
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
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải cảnh báo vận hành...</div>
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
    />
  )
}
