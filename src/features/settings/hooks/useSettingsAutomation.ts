import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  AutomationCategoryId,
  SettingsAutomationResponse,
} from '@/features/settings/logic/settingsAutomation.types'
import { settingsAutomationService } from '@/features/settings/services/settingsAutomationService'

export function useSettingsAutomation(params: { category: AutomationCategoryId }) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['settings', 'automation', params.category] as const,
    queryFn: (): Promise<SettingsAutomationResponse> => settingsAutomationService.getAutomationOverview(params.category),
    staleTime: 2 * 60 * 1000,
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

export function useToggleSettingsAutomationRuleStatus() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: { ruleId: string; status: 'on' | 'off' }) =>
      settingsAutomationService.updateRuleStatus(payload.ruleId, payload.status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings', 'automation'] })
    },
  })

  return {
    toggleRuleStatus: mutation.mutateAsync,
    isToggling: mutation.isPending,
  }
}
