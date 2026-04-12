import type { PlatformCode } from '@/types/platform.types'

export type AutomationLogStatusFilter = 'all' | 'success' | 'error'

export type AutomationRuleLogItemStatus = 'success' | 'error'

export type AutomationRuleLogItem = {
  id: string
  executedAt: string
  orderCode: string
  platform: PlatformCode
  status: AutomationRuleLogItemStatus
  detail: string
}

export type SettingsAutomationRuleLogsResponse = {
  ruleId: string
  ruleTitle: string
  totalRunsToday: number
  page: number
  pageSize: number
  totalCount: number
  items: AutomationRuleLogItem[]
}

export type AutomationRuleLogItemViewModel = {
  id: string
  timeLabel: string
  orderCode: string
  statusLabel: string
  status: AutomationRuleLogItemStatus
  detail: string
  platformLabel: string
}

export type SettingsAutomationRuleLogsViewModel = {
  title: string
  totalRunsTodayLabel: string
  tabs: Array<{
    id: AutomationLogStatusFilter
    label: string
  }>
  rows: AutomationRuleLogItemViewModel[]
  page: number
  pageSize: number
  totalCount: number
}
