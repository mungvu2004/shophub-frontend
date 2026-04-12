import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type {
  RevenueChartsPlatformId,
  RevenueChartsRangeDays,
  RevenueChartsResponse,
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'
import { dashboardRevenueChartsService } from '@/features/dashboard/services/dashboardRevenueChartsService'

export function useDashboardRevenueCharts(params: {
  platform: RevenueChartsPlatformId
  range: RevenueChartsRangeDays
}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', 'revenue-charts', params.platform, params.range] as const,
    queryFn: (): Promise<RevenueChartsResponse> => dashboardRevenueChartsService.getRevenueCharts(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
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
