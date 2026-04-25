import { useQuery } from '@tanstack/react-query'
import { dashboardAlertsNotificationsService } from '@/features/dashboard/services/dashboardAlertsNotificationsService'

const queryKey = ['dashboard', 'alerts-history'] as const

export function useAlertHistory() {
  return useQuery({
    queryKey,
    queryFn: () => dashboardAlertsNotificationsService.getAlertHistory(),
    staleTime: 60 * 1000,
  })
}
