import { apiClient } from '@/services/apiClient'

import type {
  AddablePlatformConnection,
  ConnectedPlatformConnection,
  SettingsPlatformConnectionsResponse,
  WebhookStatusItem,
} from '@/features/settings/logic/settingsPlatformConnections.types'
import type { PlatformCode } from '@/types/platform.types'

type SettingsPlatformConnectionsApiResponse = Partial<SettingsPlatformConnectionsResponse>

const platformCodeSet: PlatformCode[] = ['shopee', 'tiktok_shop', 'lazada']

function toPlatformCode(value: unknown): PlatformCode {
  if (typeof value === 'string' && platformCodeSet.includes(value as PlatformCode)) {
    return value as PlatformCode
  }

  return 'shopee'
}

function toActions(value: unknown): ConnectedPlatformConnection['actions'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>
      const type = entry.type === 'sync' || entry.type === 'refresh_token' || entry.type === 'disconnect'
        ? entry.type
        : 'sync'

      return {
        id: typeof entry.id === 'string' ? entry.id : `action-${index}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
        type,
      }
    })
}

function toConnectedPlatforms(value: unknown): ConnectedPlatformConnection[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `connection-${index}`,
        platformCode: toPlatformCode(entry.platformCode),
        platformName: typeof entry.platformName === 'string' ? entry.platformName : '--',
        shopId: typeof entry.shopId === 'string' ? entry.shopId : '--',
        shopName: typeof entry.shopName === 'string' ? entry.shopName : '--',
        joinedAt: typeof entry.joinedAt === 'string' ? entry.joinedAt : '',
        tokenExpiredAt: typeof entry.tokenExpiredAt === 'string' ? entry.tokenExpiredAt : '',
        tokenExpired: entry.tokenExpired === true,
        apiCallsUsed: typeof entry.apiCallsUsed === 'number' && Number.isFinite(entry.apiCallsUsed) ? entry.apiCallsUsed : 0,
        apiCallsLimit: typeof entry.apiCallsLimit === 'number' && Number.isFinite(entry.apiCallsLimit) ? entry.apiCallsLimit : 0,
        permissions: Array.isArray(entry.permissions)
          ? entry.permissions.filter((permission): permission is string => typeof permission === 'string')
          : [],
        webhookRealtimeEnabled: entry.webhookRealtimeEnabled !== false,
        autoSyncMinutes: typeof entry.autoSyncMinutes === 'number' && Number.isFinite(entry.autoSyncMinutes) ? entry.autoSyncMinutes : 5,
        lastSyncedMinutesAgo: typeof entry.lastSyncedMinutesAgo === 'number' && Number.isFinite(entry.lastSyncedMinutesAgo)
          ? entry.lastSyncedMinutesAgo
          : 0,
        todayEventCount: typeof entry.todayEventCount === 'number' && Number.isFinite(entry.todayEventCount) ? entry.todayEventCount : 0,
        todayErrorCount: typeof entry.todayErrorCount === 'number' && Number.isFinite(entry.todayErrorCount) ? entry.todayErrorCount : 0,
        actions: toActions(entry.actions),
      }
    })
}

function toAddablePlatforms(value: unknown): AddablePlatformConnection[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `addable-${index}`,
        platformCode: toPlatformCode(entry.platformCode),
        platformName: typeof entry.platformName === 'string' ? entry.platformName : '--',
        ctaLabel: typeof entry.ctaLabel === 'string' ? entry.ctaLabel : 'Kết nối',
        isUpcoming: entry.isUpcoming === true,
        badgeLabel: typeof entry.badgeLabel === 'string' ? entry.badgeLabel : undefined,
      }
    })
}

function toWebhookStatuses(value: unknown): WebhookStatusItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>
      const status = entry.status === 'warning' ? 'warning' : 'healthy'

      return {
        id: typeof entry.id === 'string' ? entry.id : `webhook-${index}`,
        eventName: typeof entry.eventName === 'string' ? entry.eventName : '--',
        endpoint: typeof entry.endpoint === 'string' ? entry.endpoint : '--',
        status,
        requests24h: typeof entry.requests24h === 'number' && Number.isFinite(entry.requests24h) ? entry.requests24h : 0,
        errors24h: typeof entry.errors24h === 'number' && Number.isFinite(entry.errors24h) ? entry.errors24h : 0,
      }
    })
}

class SettingsPlatformConnectionsService {
  async getConnectionsOverview(): Promise<SettingsPlatformConnectionsResponse> {
    const response = await apiClient.get<SettingsPlatformConnectionsApiResponse>('/settings/platform-connections')

    return {
      title: response.data?.title ?? 'Kết nối Sàn Thương mại',
      subtitle: response.data?.subtitle ?? 'Quản lý kết nối API với Shopee, TikTok Shop và Lazada',
      connectedSectionTitle: response.data?.connectedSectionTitle ?? 'Sàn đang kết nối',
      addNewSectionTitle: response.data?.addNewSectionTitle ?? 'Thêm sàn mới',
      webhookSectionTitle: response.data?.webhookSectionTitle ?? 'Webhook Status',
      endpointConfigLabel: response.data?.endpointConfigLabel ?? 'Cấu hình Endpoint',
      connectedPlatforms: toConnectedPlatforms(response.data?.connectedPlatforms),
      addablePlatforms: toAddablePlatforms(response.data?.addablePlatforms),
      webhookStatuses: toWebhookStatuses(response.data?.webhookStatuses),
    }
  }
}

export const settingsPlatformConnectionsService = new SettingsPlatformConnectionsService()
