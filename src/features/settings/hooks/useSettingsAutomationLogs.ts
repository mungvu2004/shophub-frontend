import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type {
  AutomationLogStatusFilter,
  SettingsAutomationRuleLogsResponse,
} from '@/features/settings/logic/settingsAutomationLogs.types'
import { settingsAutomationLogsService } from '@/features/settings/services/settingsAutomationLogsService'

export function useSettingsAutomationLogs(params: {
  ruleId: string
  status: AutomationLogStatusFilter
  page: number
  pageSize: number
  enabled: boolean
}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['settings', 'automation', 'rule-logs', params.ruleId, params.status, params.page, params.pageSize] as const,
    queryFn: (): Promise<SettingsAutomationRuleLogsResponse> =>
      settingsAutomationLogsService.getRuleLogs({
        ruleId: params.ruleId,
        status: params.status,
        page: params.page,
        pageSize: params.pageSize,
      }),
    staleTime: 60 * 1000,
    enabled: params.enabled && params.ruleId.trim().length > 0,
    placeholderData: keepPreviousData,
  })

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
