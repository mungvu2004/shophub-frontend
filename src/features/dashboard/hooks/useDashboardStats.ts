import { useQuery } from '@tanstack/react-query'

import { dashboardService } from '@/features/dashboard/services/dashboardService'

export const useInventoryAlerts = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['inventory', 'alerts'],
    queryFn: () => dashboardService.getInventoryAlerts(),
    staleTime: 2 * 60 * 1000,
  })

  return { data, isLoading, isError, error }
}

export const usePlatformConnections = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['platforms', 'connections'],
    queryFn: () => dashboardService.getPlatformConnections(),
    staleTime: 15 * 60 * 1000,
  })

  return { data, isLoading, isError, error }
}

const toDateYmd = (date: Date) => date.toISOString().slice(0, 10)

export const useRevenueData = (days: number) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard', 'revenue', days],
    queryFn: () => {
      const endDate = new Date()
      const startDate = new Date(endDate)
      startDate.setDate(endDate.getDate() - Math.max(days - 1, 0))

      return dashboardService.getOrdersForRevenue(
        toDateYmd(startDate),
        toDateYmd(endDate),
      )
    },
    staleTime: 5 * 60 * 1000,
    enabled: Number.isFinite(days) && days > 0,
  })

  return { data, isLoading, isError, error }
}
