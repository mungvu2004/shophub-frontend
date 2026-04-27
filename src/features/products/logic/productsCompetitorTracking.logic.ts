import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useProductsCompetitorTracking } from '@/features/products/hooks/useProductsCompetitorTracking'
import type { 
  CompetitorPlatform, 
  CompetitorTrackingViewModel 
} from '@/features/products/logic/productsCompetitorTracking.types'
import type { ApiError } from '@/services/apiClient'

const fallbackViewModel: Omit<
  CompetitorTrackingViewModel,
  'onSearchChange' | 'onThresholdChange' | 'onPageChange' | 'onPageSizeChange' | 'onRefresh'
> = {
  isLoading: false,
  isError: false,
  errorMessage: null,
  alertBanner: {
    matchedCount: 0,
    message: 'chưa có cảnh báo mới',
  },
  totalProductsTracked: 0,
  avgPriceDiff: 0,
  topPlatform: 'n/a',
  totalAlerts: 0,
  filteredRows: [],
  paginatedRows: [],
  currentPage: 1,
  pageSize: 5,
  totalPages: 1,
  topCompetitors: [],
  alertSettings: {
    thresholdPercent: 5,
    updatedAt: new Date().toISOString(),
  },
  heatmap: [],
  searchValue: '',
  thresholdPercentInput: '5',
  onOpenProductDetail: () => undefined,
}

const normalizeErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'Không thể tải dữ liệu theo dõi đối thủ'
  }

  const apiError = error as Partial<ApiError>
  if (typeof apiError.message === 'string' && apiError.message.trim()) {
    return apiError.message
  }

  return 'Không thể tải dữ liệu theo dõi đối thủ'
}

export const useProductsCompetitorTrackingPageLogic = (): CompetitorTrackingViewModel => {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useProductsCompetitorTracking()
  const [searchValue, setSearchValue] = useState('')
  const [thresholdPercentInput, setThresholdPercentInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const sourceData = useMemo(() => data ?? {
    alertBanner: fallbackViewModel.alertBanner,
    totalProductsTracked: fallbackViewModel.totalProductsTracked,
    comparisonRows: fallbackViewModel.filteredRows,
    topCompetitors: fallbackViewModel.topCompetitors,
    alertSettings: fallbackViewModel.alertSettings,
    heatmap: fallbackViewModel.heatmap,
  }, [data])

  const normalizedSearch = searchValue.trim().toLowerCase()

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) {
      return sourceData.comparisonRows
    }

    return sourceData.comparisonRows.filter((row) => row.productName.toLowerCase().includes(normalizedSearch))
  }, [sourceData.comparisonRows, normalizedSearch])

  // Logic Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const safePage = currentPage > totalPages ? totalPages : currentPage

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, safePage, pageSize])

  // Tính toán KPIs
  const kpis = useMemo(() => {
    const totalAlerts = sourceData.alertBanner.matchedCount
    
    // Tính mức chênh lệch giá trung bình
    const priceDiffs = sourceData.comparisonRows.map(row => 
      ((row.yourPrice - row.marketAveragePrice) / row.marketAveragePrice) * 100
    )
    const avgPriceDiff = priceDiffs.length > 0 
      ? priceDiffs.reduce((acc, curr) => acc + curr, 0) / priceDiffs.length 
      : 0

    // Tìm nền tảng cạnh tranh nhất (nền tảng có nhiều đối thủ nhất trong topCompetitors)
    const platformCounts = sourceData.topCompetitors.reduce((acc, curr) => {
      acc[curr.platform] = (acc[curr.platform] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    let topPlatform: CompetitorPlatform | 'n/a' = 'n/a'
    let maxCount = 0
    Object.entries(platformCounts).forEach(([platform, count]) => {
      if (count > maxCount) {
        maxCount = count
        topPlatform = platform as CompetitorPlatform
      }
    })

    return { avgPriceDiff, topPlatform, totalAlerts }
  }, [sourceData])

  const resolvedThresholdInput = thresholdPercentInput || String(sourceData.alertSettings.thresholdPercent)

  return {
    isLoading,
    isError,
    errorMessage: isError ? normalizeErrorMessage(error) : null,
    alertBanner: sourceData.alertBanner,
    totalProductsTracked: sourceData.totalProductsTracked,
    
    avgPriceDiff: kpis.avgPriceDiff,
    topPlatform: kpis.topPlatform,
    totalAlerts: kpis.totalAlerts,
    
    filteredRows,
    paginatedRows,
    currentPage: safePage,
    pageSize,
    totalPages,
    
    topCompetitors: sourceData.topCompetitors,
    alertSettings: sourceData.alertSettings,
    heatmap: sourceData.heatmap,
    searchValue,
    thresholdPercentInput: resolvedThresholdInput,
    onSearchChange: (val) => {
      setSearchValue(val)
      setCurrentPage(1)
    },
    onThresholdChange: setThresholdPercentInput,
    onPageChange: setCurrentPage,
    onPageSizeChange: (size) => {
      setPageSize(size)
      setCurrentPage(1)
    },
    onOpenProductDetail: (productId: string) => {
      if (!productId.trim()) return
      navigate(`/products/${productId}`)
    },
    onRefresh: () => {
      void refetch()
    },
  }
}
