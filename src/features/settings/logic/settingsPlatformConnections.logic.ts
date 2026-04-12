import type {
  AddablePlatformViewModel,
  ConnectionCardViewModel,
  SettingsPlatformConnectionsResponse,
  SettingsPlatformConnectionsViewModel,
  WebhookStatusViewModel,
} from '@/features/settings/logic/settingsPlatformConnections.types'

const numberFormatter = new Intl.NumberFormat('vi-VN')

function toDateLabel(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--/--/----'
  }

  return date.toLocaleDateString('vi-VN')
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round(value)))
}

function toConnectionCardViewModel(connection: SettingsPlatformConnectionsResponse['connectedPlatforms'][number]): ConnectionCardViewModel {
  const usagePercent = connection.apiCallsLimit > 0
    ? (connection.apiCallsUsed / connection.apiCallsLimit) * 100
    : 0

  const safeUsagePercent = clampPercent(usagePercent)

  return {
    id: connection.id,
    platformCode: connection.platformCode,
    platformName: connection.platformName,
    shopId: connection.shopId,
    shopName: connection.shopName,
    joinedAtLabel: toDateLabel(connection.joinedAt),
    tokenExpiredAtLabel: toDateLabel(connection.tokenExpiredAt),
    tokenExpired: connection.tokenExpired,
    apiUsageLabel: `${numberFormatter.format(connection.apiCallsUsed)}/${numberFormatter.format(connection.apiCallsLimit)}`,
    apiUsagePercent: safeUsagePercent,
    apiUsageTone: safeUsagePercent >= 85 ? 'warning' : 'normal',
    permissions: connection.permissions,
    syncLabel: `Đồng bộ tự động mỗi ${connection.autoSyncMinutes} phút`,
    lastSyncedLabel: `Lần đồng bộ cuối: ${connection.lastSyncedMinutesAgo} phút trước`,
    eventSummaryLabel: `${numberFormatter.format(connection.todayEventCount)} sự kiện đồng bộ hôm nay`,
    errorSummaryLabel: `${numberFormatter.format(connection.todayErrorCount)} lỗi`,
    actions: connection.actions,
  }
}

function toAddablePlatformViewModel(
  platform: SettingsPlatformConnectionsResponse['addablePlatforms'][number],
): AddablePlatformViewModel {
  return {
    id: platform.id,
    platformCode: platform.platformCode,
    platformName: platform.platformName,
    ctaLabel: platform.ctaLabel,
    isUpcoming: platform.isUpcoming,
    badgeLabel: platform.badgeLabel,
  }
}

function toWebhookStatusViewModel(item: SettingsPlatformConnectionsResponse['webhookStatuses'][number]): WebhookStatusViewModel {
  return {
    id: item.id,
    eventName: item.eventName,
    endpoint: item.endpoint,
    statusLabel: item.status === 'healthy' ? 'Hoạt động' : 'Cảnh báo',
    statusTone: item.status,
    requests24hLabel: numberFormatter.format(item.requests24h),
    errors24hLabel: numberFormatter.format(item.errors24h),
  }
}

export function buildSettingsPlatformConnectionsViewModel(
  data: SettingsPlatformConnectionsResponse,
): SettingsPlatformConnectionsViewModel {
  return {
    title: data.title,
    subtitle: data.subtitle,
    connectedSectionTitle: data.connectedSectionTitle,
    addNewSectionTitle: data.addNewSectionTitle,
    webhookSectionTitle: data.webhookSectionTitle,
    endpointConfigLabel: data.endpointConfigLabel,
    connectedPlatforms: data.connectedPlatforms.map(toConnectionCardViewModel),
    addablePlatforms: data.addablePlatforms.map(toAddablePlatformViewModel),
    webhookStatuses: data.webhookStatuses.map(toWebhookStatusViewModel),
  }
}
