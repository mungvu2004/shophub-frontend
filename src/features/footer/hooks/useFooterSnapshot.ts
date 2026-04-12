import { useQuery } from '@tanstack/react-query'

import { footerService } from '@/features/footer/services/footerService'

export function useFooterSnapshot() {
  const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ['layout', 'footer'],
    queryFn: () => footerService.getFooterSnapshot(),
    staleTime: 5 * 60 * 1000,
  })

  return {
    data,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  }
}