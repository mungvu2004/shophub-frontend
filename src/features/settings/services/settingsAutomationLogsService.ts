import { apiClient } from '@/services/apiClient'

import type {
  AutomationLogStatusFilter,
  AutomationRuleLogItem,
  SettingsAutomationRuleLogsResponse,
} from '@/features/settings/logic/settingsAutomationLogs.types'
import type { PlatformCode } from '@/types/platform.types'

type SettingsAutomationRuleLogsApiResponse = Partial<SettingsAutomationRuleLogsResponse>

const supportedStatuses: Array<AutomationRuleLogItem['status']> = ['success', 'error']
const supportedPlatforms: PlatformCode[] = ['shopee', 'lazada', 'tiktok_shop']

function toPlatform(value: unknown): PlatformCode {
  if (typeof value === 'string' && supportedPlatforms.includes(value as PlatformCode)) {
    return value as PlatformCode
  }

  return 'shopee'
}

function toStatus(value: unknown): AutomationRuleLogItem['status'] {
  if (typeof value === 'string' && supportedStatuses.includes(value as AutomationRuleLogItem['status'])) {
    return value as AutomationRuleLogItem['status']
  }

  return 'success'
}

function toItems(value: unknown): AutomationRuleLogItem[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `run-${index + 1}`,
        executedAt: typeof entry.executedAt === 'string' ? entry.executedAt : '',
        orderCode: typeof entry.orderCode === 'string' ? entry.orderCode : '--',
        platform: toPlatform(entry.platform),
        status: toStatus(entry.status),
        detail: typeof entry.detail === 'string' ? entry.detail : '--',
      }
    })
}

class SettingsAutomationLogsService {
  async getRuleLogs(params: {
    ruleId: string
    status: AutomationLogStatusFilter
    page: number
    pageSize: number
  }): Promise<SettingsAutomationRuleLogsResponse> {
    const response = await apiClient.get<SettingsAutomationRuleLogsApiResponse>('/settings/automation/rule-logs', {
      params: {
        ruleId: params.ruleId,
        status: params.status,
        page: params.page,
        pageSize: params.pageSize,
      },
    })

    return {
      ruleId: response.data?.ruleId ?? params.ruleId,
      ruleTitle: response.data?.ruleTitle ?? 'Run Log',
      totalRunsToday: typeof response.data?.totalRunsToday === 'number' ? response.data.totalRunsToday : 0,
      page: typeof response.data?.page === 'number' ? response.data.page : params.page,
      pageSize: typeof response.data?.pageSize === 'number' ? response.data.pageSize : params.pageSize,
      totalCount: typeof response.data?.totalCount === 'number' ? response.data.totalCount : 0,
      items: toItems(response.data?.items),
    }
  }
}

export const settingsAutomationLogsService = new SettingsAutomationLogsService()
