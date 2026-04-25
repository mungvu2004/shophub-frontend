import { useQuery } from '@tanstack/react-query'
import { dashboardAlertsNotificationsService } from '@/features/dashboard/services/dashboardAlertsNotificationsService'

export function useStaffList() {
  return useQuery({
    queryKey: ['users', 'staff'],
    queryFn: () => dashboardAlertsNotificationsService.getStaffList(),
    staleTime: 10 * 60 * 1000,
  })
}
