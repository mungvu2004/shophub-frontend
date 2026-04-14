import type {
  AlertsFilter,
  AlertsSeverity,
  AlertsTabId,
  DashboardAlertCardModel,
  DashboardAlertRecord,
  DashboardAlertsNotificationsResponse,
  DashboardAlertsNotificationsViewModel,
  DashboardAlertsSectionModel,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

const severityOrder: AlertsSeverity[] = ['critical', 'action', 'info', 'resolved']

const severityLabel: Record<AlertsSeverity, string> = {
  critical: 'Khẩn cấp',
  action: 'Cần xử lý',
  info: 'Thông tin',
  resolved: 'Đã xử lý',
}

const platformLabel: Record<DashboardAlertRecord['platform'], string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok_shop: 'TikTok Shop',
}

const sectionMeta: Record<'critical' | 'action' | 'info', string> = {
  critical: 'Khẩn cấp - Cần hành động ngay',
  action: 'Cần xử lý - Trong ngày hôm nay',
  info: 'Thông tin tổng quan - Theo dõi chung',
}

const tabDefinitions: Array<{ id: AlertsTabId; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'critical', label: 'Khẩn cấp' },
  { id: 'orders', label: 'Đơn hàng' },
  { id: 'inventory', label: 'Kho hàng' },
  { id: 'revenue', label: 'Doanh thu' },
  { id: 'system', label: 'Hệ thống' },
]

const toCountdownLabel = (value?: number) => {
  if (!Number.isFinite(value) || value === undefined || value <= 0) return undefined

  const hours = Math.floor(value / 60)
  const minutes = value % 60

  if (hours <= 0) {
    return `00:${String(minutes).padStart(2, '0')}`
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const matchesTab = (alert: DashboardAlertRecord, tab: AlertsTabId): boolean => {
  if (tab === 'all') return true
  if (tab === 'critical') return alert.severity === 'critical'
  return alert.category === tab
}

const matchesSeverity = (alert: DashboardAlertRecord, selected: AlertsSeverity[]) => {
  if (!selected.length) return true
  return selected.includes(alert.severity)
}

const toCard = (alert: DashboardAlertRecord): DashboardAlertCardModel => {
  return {
    id: alert.id,
    severity: alert.severity,
    category: alert.category,
    title: alert.title,
    description: alert.description,
    statusLabel: alert.statusLabel,
    timeAgo: alert.timeAgo,
    platformLabel: platformLabel[alert.platform],
    platform: alert.platform,
    priorityLabel: `Độ ưu tiên: ${alert.priority}`,
    countdownLabel: toCountdownLabel(alert.countdownMinutes),
    quote: alert.quote,
    actions: alert.actions,
  }
}

const buildSections = (alerts: DashboardAlertRecord[]): DashboardAlertsSectionModel[] => {
  const groups: Array<DashboardAlertsSectionModel['severity']> = ['critical', 'action', 'info']

  return groups
    .map((severity) => {
      const cards = alerts.filter((item) => item.severity === severity).map(toCard)

      return {
        id: severity,
        severity,
        title: sectionMeta[severity],
        cards,
      }
    })
    .filter((section) => section.cards.length > 0)
}

const buildTabs = (alerts: DashboardAlertRecord[]) => {
  return tabDefinitions.map((item) => {
    if (item.id === 'all') {
      return { ...item, count: alerts.length }
    }

    if (item.id === 'critical') {
      return {
        ...item,
        count: alerts.filter((row) => row.severity === 'critical').length,
      }
    }

    return {
      ...item,
      count: alerts.filter((row) => row.category === item.id).length,
    }
  })
}

export const buildDashboardAlertsNotificationsViewModel = ({
  data,
  filter,
}: {
  data: DashboardAlertsNotificationsResponse
  filter: AlertsFilter
}): DashboardAlertsNotificationsViewModel => {
  const filtered = data.alerts.filter((alert) => matchesTab(alert, filter.tab) && matchesSeverity(alert, filter.severities))

  const severityCounts = severityOrder.reduce<Record<AlertsSeverity, number>>((acc, severity) => {
    const fallback = data.alerts.filter((item) => item.severity === severity).length
    const provided = data.summaryTotals?.[severity]
    acc[severity] = typeof provided === 'number' && Number.isFinite(provided) ? Math.max(0, provided) : fallback
    return acc
  }, {
    critical: 0,
    action: 0,
    info: 0,
    resolved: 0,
  })

  return {
    title: 'Cảnh báo & Thông báo',
    subtitle: `${severityCounts.critical} mục cần hành động ngay`,
    autoRefreshLabel: `${Math.max(5, data.autoRefreshSeconds)}s tự làm mới`,
    updatedAtLabel: data.updatedAt,
    tabs: buildTabs(data.alerts),
    summaryChips: severityOrder.map((severity) => ({
      severity,
      label: severityLabel[severity],
      count: severityCounts[severity],
    })),
    sections: buildSections(filtered),
    totalVisible: filtered.length,
  }
}
