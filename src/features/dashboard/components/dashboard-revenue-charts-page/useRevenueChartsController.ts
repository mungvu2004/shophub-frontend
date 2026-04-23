import { useState, useCallback, useMemo } from 'react'
import { useDashboardRevenueCharts } from '@/features/dashboard/hooks/useDashboardRevenueCharts'
import type { 
  RevenueChartsPlatformId, 
  RevenueChartsRangeDays,
  RevenueChartsViewModel 
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'
import { buildDashboardRevenueChartsViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.logic'

export function useRevenueChartsController() {
  const [selectedPlatform, setSelectedPlatform] = useState<RevenueChartsPlatformId>('all')
  const [selectedRange, setSelectedRange] = useState<RevenueChartsRangeDays>(30)

  const { data, isLoading, isFetching, isError, refetch } = useDashboardRevenueCharts({
    platform: selectedPlatform,
    range: selectedRange,
  })

  const handlePlatformChange = useCallback((platform: RevenueChartsPlatformId) => {
    setSelectedPlatform(platform)
  }, [])

  const handleRangeChange = useCallback((range: RevenueChartsRangeDays) => {
    setSelectedRange(range)
  }, [])

  const model: RevenueChartsViewModel | null = useMemo(() => {
    if (!data) return null
    return buildDashboardRevenueChartsViewModel({
      data,
      selectedPlatform,
    })
  }, [data, selectedPlatform])

  return {
    model,
    isLoading,
    isError,
    isRefreshing: isFetching && !isLoading,
    onPlatformChange: handlePlatformChange,
    onRangeChange: handleRangeChange,
    refetch,
  }
}
