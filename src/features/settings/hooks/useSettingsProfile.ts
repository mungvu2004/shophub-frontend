import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { SettingsProfileResponse, SettingsProfileUpdatePayload } from '@/features/settings/logic/settingsProfile.types'
import { settingsProfileService } from '@/features/settings/services/settingsProfileService'

export function useSettingsProfile() {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['settings', 'profile'] as const,
    queryFn: (): Promise<SettingsProfileResponse> => settingsProfileService.getProfileSettings(),
    staleTime: 2 * 60 * 1000,
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

export function useUpdateSettingsProfile() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: SettingsProfileUpdatePayload) => settingsProfileService.updateProfileSettings(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] })
    },
  })

  return {
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  }
}
