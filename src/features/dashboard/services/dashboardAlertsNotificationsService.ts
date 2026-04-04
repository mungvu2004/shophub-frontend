import { apiClient } from '@/services/apiClient'

import type {
  AlertsActionVariant,
  AlertsCategory,
  AlertsPlatform,
  AlertsPriority,
  AlertsSeverity,
  DashboardAlertAction,
  DashboardAlertRecord,
  DashboardAlertsNotificationsResponse,
} from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

type DashboardAlertsApiEnvelope = {
  success?: boolean
  data?: unknown
}

const parseActionVariant = (value: unknown): AlertsActionVariant => {
  if (value === 'outline' || value === 'ghost' || value === 'soft') return value
  return 'primary'
}

const parseSeverity = (value: unknown): AlertsSeverity => {
  if (value === 'critical' || value === 'action' || value === 'info' || value === 'resolved') return value
  return 'info'
}

const parseCategory = (value: unknown): AlertsCategory => {
  if (value === 'orders' || value === 'inventory' || value === 'revenue' || value === 'system') return value
  return 'system'
}

const parsePlatform = (value: unknown): AlertsPlatform => {
  if (value === 'shopee' || value === 'lazada' || value === 'tiktok_shop') return value
  return 'shopee'
}

const parsePriority = (value: unknown): AlertsPriority => {
  if (value === 'P1' || value === 'P2' || value === 'P3') return value
  return 'P3'
}

const toAction = (value: unknown, index: number): DashboardAlertAction | null => {
  if (!value || typeof value !== 'object') return null

  const row = value as Record<string, unknown>

  return {
    id: typeof row.id === 'string' ? row.id : `action-${index + 1}`,
    label: typeof row.label === 'string' ? row.label : 'Xem chi tiết',
    variant: parseActionVariant(row.variant),
  }
}

const toAlert = (value: unknown, index: number): DashboardAlertRecord | null => {
  if (!value || typeof value !== 'object') return null

  const row = value as Record<string, unknown>

  return {
    id: typeof row.id === 'string' ? row.id : `alert-${index + 1}`,
    title: typeof row.title === 'string' ? row.title : 'Cảnh báo hệ thống',
    description: typeof row.description === 'string' ? row.description : '',
    statusLabel: typeof row.statusLabel === 'string' ? row.statusLabel : 'Thông tin',
    timeAgo: typeof row.timeAgo === 'string' ? row.timeAgo : 'Vừa xong',
    severity: parseSeverity(row.severity),
    category: parseCategory(row.category),
    platform: parsePlatform(row.platform),
    priority: parsePriority(row.priority),
    countdownMinutes: typeof row.countdownMinutes === 'number' ? row.countdownMinutes : undefined,
    quote: typeof row.quote === 'string' ? row.quote : undefined,
    actions: Array.isArray(row.actions)
      ? row.actions.map(toAction).filter((item): item is DashboardAlertAction => Boolean(item))
      : [],
    isRead: typeof row.isRead === 'boolean' ? row.isRead : false,
  }
}

const toResponse = (value: unknown): DashboardAlertsNotificationsResponse => {
  if (!value || typeof value !== 'object') {
    return {
      updatedAt: '--:--',
      autoRefreshSeconds: 30,
      alerts: [],
      summaryTotals: undefined,
    }
  }

  const payload = value as Record<string, unknown>
  const summaryTotalsRaw = payload.summaryTotals
  const summaryTotals =
    summaryTotalsRaw && typeof summaryTotalsRaw === 'object'
      ? {
          critical:
            typeof (summaryTotalsRaw as Record<string, unknown>).critical === 'number'
              ? Math.max(0, (summaryTotalsRaw as Record<string, number>).critical)
              : undefined,
          action:
            typeof (summaryTotalsRaw as Record<string, unknown>).action === 'number'
              ? Math.max(0, (summaryTotalsRaw as Record<string, number>).action)
              : undefined,
          info:
            typeof (summaryTotalsRaw as Record<string, unknown>).info === 'number'
              ? Math.max(0, (summaryTotalsRaw as Record<string, number>).info)
              : undefined,
          resolved:
            typeof (summaryTotalsRaw as Record<string, unknown>).resolved === 'number'
              ? Math.max(0, (summaryTotalsRaw as Record<string, number>).resolved)
              : undefined,
        }
      : undefined

  return {
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : '--:--',
    autoRefreshSeconds:
      typeof payload.autoRefreshSeconds === 'number' && Number.isFinite(payload.autoRefreshSeconds)
        ? Math.max(5, payload.autoRefreshSeconds)
        : 30,
    alerts: Array.isArray(payload.alerts)
      ? payload.alerts.map(toAlert).filter((item): item is DashboardAlertRecord => Boolean(item))
      : [],
    summaryTotals,
  }
}

class DashboardAlertsNotificationsService {
  async getAlertsNotifications(): Promise<DashboardAlertsNotificationsResponse> {
    const response = await apiClient.get<DashboardAlertsApiEnvelope>('/dashboard/alerts-notifications')
    return toResponse(response.data?.data)
  }

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/dashboard/alerts-notifications/read-all')
  }
}

export const dashboardAlertsNotificationsService = new DashboardAlertsNotificationsService()
