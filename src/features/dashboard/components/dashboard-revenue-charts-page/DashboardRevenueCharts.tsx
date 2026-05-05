import { DashboardRevenueChartsView } from './DashboardRevenueChartsView'
import { useRevenueChartsController } from './useRevenueChartsController'
import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { PageSkeleton } from '@/components/PageSkeleton'
import { useProductData } from '@/features/products/hooks/useProductData'

  // eslint-disable-next-line react-refresh/only-export-components
export function shouldShowBlockingRevenueChartsError(input: { isError: boolean; hasModel: boolean }) {
  return input.isError && !input.hasModel
}

export function DashboardRevenueCharts() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'DashboardRevenueChartsPage',
  })

  const { 
    model, 
    isLoading, 
    isError,
    isRefreshing,
    isSettingsOpen,
    onPlatformChange, 
    onRangeChange, 
    onCategorySelect,
    selectedCategoryId,
    onExportChart,
    onExportFullReport,
    onToggleSettings,
    refetch 
  } = useRevenueChartsController()

  if (isLoading && !model) {
    return <PageSkeleton />
  }

  if (shouldShowBlockingRevenueChartsError({ isError, hasModel: Boolean(model) })) {
    return (
      <DataLoadErrorState
        title="Không thể tải dữ liệu doanh thu"
        description="Đã xảy ra lỗi khi kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại."
        onRetry={refetch}
      />
    )
  }

  if (!model) return null

  return (
    <div className="relative">
      {isError && (
        <div className="sticky top-4 z-50 mb-6 rounded-2xl border border-amber-200 bg-amber-50/90 px-6 py-4 text-sm font-bold text-amber-800 shadow-xl backdrop-blur-md">
          ⚠️ Hệ thống đang gặp sự cố khi tải dữ liệu mới. Đang hiển thị dữ liệu lưu tạm gần nhất.
        </div>
      )}
      
      <DashboardRevenueChartsView
        model={model}
        isRefreshing={isRefreshing}
        isSettingsOpen={isSettingsOpen}
        onPlatformChange={onPlatformChange}
        onRangeChange={onRangeChange}
        onCategorySelect={onCategorySelect}
        selectedCategoryId={selectedCategoryId}
        onExportChart={onExportChart}
        onExportFullReport={onExportFullReport}
        onToggleSettings={onToggleSettings}
      />
    </div>
  )
}
