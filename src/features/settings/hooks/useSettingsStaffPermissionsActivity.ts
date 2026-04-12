import { useQuery } from '@tanstack/react-query'

import { settingsStaffPermissionsActivityService } from '@/features/settings/services/settingsStaffPermissionsActivityService'

type UseSettingsStaffPermissionsActivityParams = {
  memberId: string
  enabled: boolean
}

export function useSettingsStaffPermissionsActivity({ memberId, enabled }: UseSettingsStaffPermissionsActivityParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['settings', 'staff-permissions', 'member-activities', memberId],
    queryFn: () => settingsStaffPermissionsActivityService.getMemberActivities(memberId),
    staleTime: 60 * 1000,
    enabled,
  })

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  }
}