import type { PlatformCode } from '@/types/platform.types'

export type PlatformConnectionActionType = 'sync' | 'refresh_token' | 'disconnect'

export type PlatformConnectionAction = {
  id: string
  label: string
  type: PlatformConnectionActionType
}

export type ConnectedPlatformConnection = {
  id: string
  platformCode: PlatformCode
  platformName: string
  shopId: string
  shopName: string
  joinedAt: string
  tokenExpiredAt: string
  tokenExpired: boolean
  apiCallsUsed: number
  apiCallsLimit: number
  permissions: string[]
  webhookRealtimeEnabled: boolean
  autoSyncMinutes: number
  lastSyncedMinutesAgo: number
  todayEventCount: number
  todayErrorCount: number
  actions: PlatformConnectionAction[]
}

export type AddablePlatformConnection = {
  id: string
  platformCode: PlatformCode
  platformName: string
  ctaLabel: string
  isUpcoming: boolean
  badgeLabel?: string
}

export type WebhookStatusItem = {
  id: string
  eventName: string
  endpoint: string
  status: 'healthy' | 'warning'
  requests24h: number
  errors24h: number
}

export type SettingsPlatformConnectionsResponse = {
  title: string
  subtitle: string
  connectedSectionTitle: string
  addNewSectionTitle: string
  webhookSectionTitle: string
  endpointConfigLabel: string
  connectedPlatforms: ConnectedPlatformConnection[]
  addablePlatforms: AddablePlatformConnection[]
  webhookStatuses: WebhookStatusItem[]
}

export type ConnectionCardViewModel = {
  id: string
  platformCode: PlatformCode
  platformName: string
  shopId: string
  shopName: string
  joinedAtLabel: string
  tokenExpiredAtLabel: string
  tokenExpired: boolean
  apiUsageLabel: string
  apiUsagePercent: number
  apiUsageTone: 'normal' | 'warning'
  permissions: string[]
  syncLabel: string
  lastSyncedLabel: string
  eventSummaryLabel: string
  errorSummaryLabel: string
  actions: PlatformConnectionAction[]
}

export type AddablePlatformViewModel = {
  id: string
  platformCode: PlatformCode
  platformName: string
  ctaLabel: string
  isUpcoming: boolean
  badgeLabel?: string
}

export type WebhookStatusViewModel = {
  id: string
  eventName: string
  endpoint: string
  statusLabel: string
  statusTone: 'healthy' | 'warning'
  requests24hLabel: string
  errors24hLabel: string
}

export type SettingsPlatformConnectionsViewModel = {
  title: string
  subtitle: string
  connectedSectionTitle: string
  addNewSectionTitle: string
  webhookSectionTitle: string
  endpointConfigLabel: string
  connectedPlatforms: ConnectionCardViewModel[]
  addablePlatforms: AddablePlatformViewModel[]
  webhookStatuses: WebhookStatusViewModel[]
}
