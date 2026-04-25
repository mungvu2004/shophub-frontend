import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardAlertsNotificationsService } from '@/features/dashboard/services/dashboardAlertsNotificationsService'
import type { AlertThreshold } from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

const queryKey = ['dashboard', 'alerts-thresholds'] as const

export function useAlertSettings() {
  const queryClient = useQueryClient()

  const thresholdsQuery = useQuery({
    queryKey,
    queryFn: () => dashboardAlertsNotificationsService.getThresholds(),
    staleTime: 5 * 60 * 1000,
  })

  const updateThresholdMutation = useMutation({
    mutationFn: (threshold: AlertThreshold) => dashboardAlertsNotificationsService.updateThreshold(threshold),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    thresholds: thresholdsQuery.data ?? [],
    isLoading: thresholdsQuery.isLoading,
    updateThreshold: updateThresholdMutation.mutate,
    isUpdating: updateThresholdMutation.isPending,
  }
}
