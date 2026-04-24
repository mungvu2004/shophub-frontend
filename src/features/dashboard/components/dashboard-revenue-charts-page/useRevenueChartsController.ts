import { useState, useCallback, useMemo } from 'react'
import { useDashboardRevenueCharts } from '@/features/dashboard/hooks/useDashboardRevenueCharts'
import type { 
  RevenueChartExportFormat,
  RevenueChartExportTarget,
  RevenueChartsPlatformId, 
  RevenueChartsRangeDays,
  RevenueChartsViewModel 
} from '@/features/dashboard/logic/dashboardRevenueCharts.types'
import { buildDashboardRevenueChartsViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.logic'
import { handleRevenueChartExport } from '@/features/dashboard/handlers/dashboardRevenueChartsExport.handlers'

export function useRevenueChartsController() {
  const [selectedPlatform, setSelectedPlatform] = useState<RevenueChartsPlatformId>('all')
  const [selectedRange, setSelectedRange] = useState<RevenueChartsRangeDays>(30)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

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

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId)
  }, [])

  const model: RevenueChartsViewModel | null = useMemo(() => {
    if (!data) return null
    return buildDashboardRevenueChartsViewModel({
      data,
      selectedPlatform,
    })
  }, [data, selectedPlatform])

  const activeCategoryId = useMemo(() => {
    if (!model || model.categoryItems.length === 0) return null
    if (!selectedCategoryId) return model.categoryItems[0].id

    const exists = model.categoryItems.some((item) => item.id === selectedCategoryId)
    return exists ? selectedCategoryId : model.categoryItems[0].id
  }, [model, selectedCategoryId])

  const handleExport = useCallback(
    (target: RevenueChartExportTarget, format: RevenueChartExportFormat) => {
      if (!model) return

      handleRevenueChartExport({
        target,
        format,
        model,
        selectedCategoryId: activeCategoryId,
      })
    },
    [model, activeCategoryId],
  )

  return {
    model,
    isLoading,
    isError,
    isRefreshing: isFetching && !isLoading,
    onPlatformChange: handlePlatformChange,
    onRangeChange: handleRangeChange,
    onCategorySelect: handleCategorySelect,
    selectedCategoryId: activeCategoryId,
    onExportChart: handleExport,
    refetch,
  }
}
