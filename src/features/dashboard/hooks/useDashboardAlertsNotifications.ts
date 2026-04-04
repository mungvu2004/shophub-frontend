import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { dashboardAlertsNotificationsService } from '@/features/dashboard/services/dashboardAlertsNotificationsService'

const queryKey = ['dashboard', 'alerts-notifications'] as const

export function useDashboardAlertsNotifications() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey,
    queryFn: () => dashboardAlertsNotificationsService.getAlertsNotifications(),
    staleTime: 20 * 1000,
    refetchInterval: 30 * 1000,
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => dashboardAlertsNotificationsService.markAllAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    ...query,
    markAllRead: markAllReadMutation.mutate,
    isMarkingAllRead: markAllReadMutation.isPending,
  }
}
