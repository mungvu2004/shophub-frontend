import { useQuery } from '@tanstack/react-query'

import { settingsStaffPermissionsService } from '@/features/settings/services/settingsStaffPermissionsService'

export function useSettingsStaffPermissions() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['settings', 'staff-permissions'],
    queryFn: () => settingsStaffPermissionsService.getPermissionsOverview(),
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