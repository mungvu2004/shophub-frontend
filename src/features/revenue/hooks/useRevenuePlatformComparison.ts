import { useQuery } from '@tanstack/react-query'

import { revenuePlatformComparisonService } from '@/features/revenue/services/revenuePlatformComparisonService'

export function useRevenuePlatformComparison(month: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['revenue', 'platform-comparison', month],
    queryFn: () => revenuePlatformComparisonService.getPlatformComparison(month),
    staleTime: 5 * 60 * 1000,
    enabled: month.trim().length > 0,
  })

  return {
    data,
    isLoading,
    isError,
    error,
  }
}
