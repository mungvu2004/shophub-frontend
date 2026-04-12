import { useQuery } from '@tanstack/react-query'

import { settingsPlatformConnectionsService } from '@/features/settings/services/settingsPlatformConnectionsService'

export function useSettingsPlatformConnections() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['settings', 'platform-connections'],
    queryFn: () => settingsPlatformConnectionsService.getConnectionsOverview(),
    staleTime: 3 * 60 * 1000,
  })

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  }
}
