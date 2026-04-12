import { useQuery } from '@tanstack/react-query'

import type { SettingsAutomationBuilderResponse } from '@/features/settings/logic/settingsAutomationBuilder.types'
import { settingsAutomationBuilderService } from '@/features/settings/services/settingsAutomationBuilderService'

export function useSettingsAutomationBuilder() {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['settings', 'automation', 'builder'],
    queryFn: (): Promise<SettingsAutomationBuilderResponse> => settingsAutomationBuilderService.getBuilderSetup(),
    staleTime: 3 * 60 * 1000,
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
