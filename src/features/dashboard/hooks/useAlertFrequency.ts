import { useQuery } from '@tanstack/react-query'
import { dashboardAlertsNotificationsService } from '@/features/dashboard/services/dashboardAlertsNotificationsService'

const queryKey = ['dashboard', 'alerts-frequency'] as const

export function useAlertFrequency() {
  return useQuery({
    queryKey,
    queryFn: () => dashboardAlertsNotificationsService.getFrequencyData(),
    staleTime: 5 * 60 * 1000,
  })
}
