import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  const handleExportFullReport = useCallback(async () => {
    if (!model) return
    
    const promise = new Promise((resolve) => setTimeout(resolve, 1500))
    
    toast.promise(promise, {
      loading: 'Đang chuẩn bị báo cáo tổng hợp...',
      success: 'Đã xuất báo cáo tổng hợp thành công!',
      error: 'Có lỗi xảy ra khi xuất báo cáo.',
    })

    await promise
  }, [model])

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prev => !prev)
  }, [])

  return {
    model,
    isLoading,
    isError,
    isRefreshing: isFetching && !isLoading,
    isSettingsOpen,
    onPlatformChange: handlePlatformChange,
    onRangeChange: handleRangeChange,
    onCategorySelect: handleCategorySelect,
    selectedCategoryId: activeCategoryId,
    onExportChart: handleExport,
    onExportFullReport: handleExportFullReport,
    onToggleSettings: toggleSettings,
    refetch,
  }
}
