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
  resolved: 'Đã giải quyết',
}

const platformLabel: Record<DashboardAlertRecord['platform'], string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok_shop: 'TikTok Shop',
}

const sectionMeta: Record<'critical' | 'action' | 'info', string> = {
  critical: 'Rủi ro vận hành - Cần xử lý ngay lập tức',
  action: 'Công việc tồn đọng - Xử lý trong hôm nay',
  info: 'Thông tin hệ thống - Cập nhật định kỳ',
}

const tabDefinitions: Array<{ id: AlertsTabId; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'critical', label: 'Khẩn cấp' },
  { id: 'orders', label: 'Đơn hàng' },
  { id: 'inventory', label: 'Kho hàng' },
  { id: 'revenue', label: 'Doanh thu' },
  { id: 'system', label: 'Hệ thống' },
  { id: 'history', label: 'Lịch sử' },
]

const toCountdownLabel = (expiresAt?: string) => {
  if (!expiresAt) return undefined
  
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return '00:00'
  
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours <= 0) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const matchesTab = (alert: DashboardAlertRecord, tab: AlertsTabId): boolean => {
  if (tab === 'all') return alert.severity !== 'resolved'
  if (tab === 'critical') return alert.severity === 'critical'
  if (tab === 'history') return alert.severity === 'resolved'
  return alert.category === tab && alert.severity !== 'resolved'
}

const matchesSeverity = (alert: DashboardAlertRecord, selected: AlertsSeverity[]) => {
  if (!selected.length) return true
  return selected.includes(alert.severity)
}

const priorityLabelMap: Record<string, string> = {
  P1: 'Ưu tiên: Rất cao',
  P2: 'Ưu tiên: Cao',
  P3: 'Ưu tiên: Trung bình',
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
    priorityLabel: priorityLabelMap[alert.priority] || `Ưu tiên: ${alert.priority}`,
    countdownLabel: toCountdownLabel(alert.expiresAt),
    expiresAt: alert.expiresAt,
    quote: alert.quote,
    actions: alert.actions,
    assignedTo: alert.assignedTo,
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
      return { ...item, count: alerts.filter(a => a.severity !== 'resolved').length }
    }

    if (item.id === 'critical') {
      return {
        ...item,
        count: alerts.filter((row) => row.severity === 'critical').length,
      }
    }

    if (item.id === 'history') {
      return {
        ...item,
        count: alerts.filter((row) => row.severity === 'resolved').length,
      }
    }

    return {
      ...item,
      count: alerts.filter((row) => row.category === item.id && row.severity !== 'resolved').length,
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
    subtitle: `Hệ thống ghi nhận ${severityCounts.critical} mục khẩn cấp cần hành động ngay`,
    autoRefreshLabel: `Tự làm mới sau ${Math.max(5, data.autoRefreshSeconds)}s`,
    updatedAtLabel: data.updatedAt,
    markAllReadLabel: 'Đánh dấu tất cả đã đọc',
    settingsTooltip: 'Cài đặt thông báo',
    filterLabel: 'Lọc mức độ',
    clearFilterLabel: 'Bỏ lọc',
    emptyMessage: 'Không có cảnh báo phù hợp với bộ lọc hiện tại.',
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
