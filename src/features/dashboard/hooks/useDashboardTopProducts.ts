import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type {
  DashboardTopProductsResponse,
  TopProductsMetricId,
  TopProductsPlatformId,
  TopProductsRangeDays,
} from '@/features/dashboard/logic/dashboardTopProducts.types'
import { dashboardTopProductsService } from '@/features/dashboard/services/dashboardTopProductsService'

export function useDashboardTopProducts(params: {
  metric: TopProductsMetricId
  range: TopProductsRangeDays
  platform: TopProductsPlatformId
}) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['dashboard', 'top-products', params.metric, params.range, params.platform] as const,
    queryFn: (): Promise<DashboardTopProductsResponse> => dashboardTopProductsService.getTopProducts(params),
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
