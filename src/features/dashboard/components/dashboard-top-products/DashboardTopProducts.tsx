import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { DashboardTopProductsView } from '@/features/dashboard/components/dashboard-top-products/DashboardTopProductsView'
import { useDashboardTopProducts } from '@/features/dashboard/hooks/useDashboardTopProducts'
import { buildDashboardTopProductsViewModel } from '@/features/dashboard/logic/dashboardTopProducts.logic'
import type {
  TopProductsMetricId,
  TopProductsPlatformId,
  TopProductsRangeDays,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

export function DashboardTopProducts() {
  const navigate = useNavigate()
  const [selectedMetric, setSelectedMetric] = useState<TopProductsMetricId>('revenue')
  const [selectedRange, setSelectedRange] = useState<TopProductsRangeDays>(30)
  const [selectedPlatform, setSelectedPlatform] = useState<TopProductsPlatformId>('all')

  const { data, isLoading, isFetching, isError, refetch } = useDashboardTopProducts({
    metric: selectedMetric,
    range: selectedRange,
    platform: selectedPlatform,
  })

  const model = useMemo(() => {
    if (!data) return null

    return buildDashboardTopProductsViewModel({
      data,
      selectedMetric,
      selectedRange,
      selectedPlatform,
    })
  }, [data, selectedMetric, selectedPlatform, selectedRange])

  const handleOpenProductDetail = (productId: string) => {
    // Pass 'from' query param to enable back navigation to Top Products page
    console.log('[DashboardTopProducts] Navigating to product:', productId)
    navigate(`/products/${productId}?from=/dashboard/top-products`)
  }

  const handleQuickFilterPlatform = (platform: TopProductsPlatformId) => {
    setSelectedPlatform(platform)
  }

  const handleViewDecliningReason = (productId: string) => {
    toast.info('Đang mở phân tích nguyên nhân giảm hiệu suất.')
    // Pass 'from' query param to enable back navigation to Top Products page
    navigate(`/products/${productId}?from=/dashboard/top-products`)
  }

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu top sản phẩm...</div>
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không tải được dữ liệu Top Products." onRetry={() => refetch()} />
  }

  return (
    <DashboardTopProductsView
      model={model}
      onMetricChange={setSelectedMetric}
      onRangeChange={setSelectedRange}
      onPlatformChange={setSelectedPlatform}
      onProductClick={handleOpenProductDetail}
      onQuickFilterPlatform={handleQuickFilterPlatform}
      onViewDecliningReason={handleViewDecliningReason}
      isRefreshing={isFetching}
    />
  )
}
