export type AlertsSeverity = 'critical' | 'action' | 'info' | 'resolved'

export type AlertsCategory = 'orders' | 'inventory' | 'revenue' | 'system'

export type AlertsPlatform = 'shopee' | 'lazada' | 'tiktok_shop'

export type AlertsPriority = 'P1' | 'P2' | 'P3'

export type AlertsActionVariant = 'primary' | 'outline' | 'ghost' | 'soft'

export type DashboardAlertAction = {
  id: string
  label: string
  variant: AlertsActionVariant
}

export type DashboardAlertRecord = {
  id: string
  title: string
  description: string
  statusLabel: string
  timeAgo: string
  severity: AlertsSeverity
  category: AlertsCategory
  platform: AlertsPlatform
  priority: AlertsPriority
  countdownMinutes?: number
  quote?: string
  actions: DashboardAlertAction[]
  isRead: boolean
}

export type DashboardAlertsNotificationsResponse = {
  updatedAt: string
  autoRefreshSeconds: number
  alerts: DashboardAlertRecord[]
  summaryTotals?: Partial<Record<AlertsSeverity, number>>
}

export type AlertsTabId = 'all' | 'critical' | AlertsCategory

export type AlertsFilter = {
  tab: AlertsTabId
  severities: AlertsSeverity[]
}

export type AlertsSummaryChip = {
  severity: AlertsSeverity
  label: string
  count: number
}

export type AlertsTabItem = {
  id: AlertsTabId
  label: string
  count: number
}

export type DashboardAlertCardModel = {
  id: string
  severity: AlertsSeverity
  category: AlertsCategory
  title: string
  description: string
  statusLabel: string
  timeAgo: string
  platformLabel: string
  platform: AlertsPlatform
  priorityLabel: string
  countdownLabel?: string
  quote?: string
  actions: DashboardAlertAction[]
}

export type DashboardAlertsSectionModel = {
  id: string
  severity: Exclude<AlertsSeverity, 'resolved'>
  title: string
  cards: DashboardAlertCardModel[]
}

export type DashboardAlertsNotificationsViewModel = {
  title: string
  subtitle: string
  autoRefreshLabel: string
  updatedAtLabel: string
  tabs: AlertsTabItem[]
  summaryChips: AlertsSummaryChip[]
  sections: DashboardAlertsSectionModel[]
  totalVisible: number
}
