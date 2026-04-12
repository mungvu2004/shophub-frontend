import { useQuery } from '@tanstack/react-query'

import { settingsStaffPermissionsInviteService } from '@/features/settings/services/settingsStaffPermissionsInviteService'

export function useSettingsStaffPermissionsInvite() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['settings', 'staff-permissions', 'invite'],
    queryFn: () => settingsStaffPermissionsInviteService.getInviteConfig(),
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