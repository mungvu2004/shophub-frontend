import { DashboardRevenueChartsView } from './DashboardRevenueChartsView'
import { useRevenueChartsController } from './useRevenueChartsController'
import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { PageSkeleton } from '@/components/PageSkeleton'

export function DashboardRevenueCharts() {
  const { 
    model, 
    isLoading, 
    isError,
    isRefreshing, 
    onPlatformChange, 
    onRangeChange, 
    refetch 
  } = useRevenueChartsController()

  if (isLoading && !model) {
    return <PageSkeleton />
  }

  if (isError && !model) {
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
        onPlatformChange={onPlatformChange}
        onRangeChange={onRangeChange}
      />
    </div>
  )
}
