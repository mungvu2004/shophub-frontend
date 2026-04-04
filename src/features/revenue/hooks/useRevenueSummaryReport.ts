import { useQuery } from '@tanstack/react-query'

import { revenueSummaryService } from '@/features/revenue/services/revenueSummaryService'

export function useRevenueSummaryReport(month: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['revenue', 'summary-report', month],
    queryFn: () => revenueSummaryService.getSummaryReport(month),
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
