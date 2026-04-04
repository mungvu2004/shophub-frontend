import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useProductsCompetitorTracking } from '@/features/products/hooks/useProductsCompetitorTracking'
import type { CompetitorTrackingViewModel } from '@/features/products/logic/productsCompetitorTracking.types'
import type { ApiError } from '@/services/apiClient'

const fallbackViewModel: Omit<CompetitorTrackingViewModel, 'onSearchChange' | 'onThresholdChange' | 'onRefresh'> = {
  isLoading: false,
  isError: false,
  errorMessage: null,
  alertBanner: {
    matchedCount: 0,
    message: 'chưa có cảnh báo mới',
  },
  totalProductsTracked: 0,
  filteredRows: [],
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

  const sourceData = data ?? {
    alertBanner: fallbackViewModel.alertBanner,
    totalProductsTracked: fallbackViewModel.totalProductsTracked,
    comparisonRows: fallbackViewModel.filteredRows,
    topCompetitors: fallbackViewModel.topCompetitors,
    alertSettings: fallbackViewModel.alertSettings,
    heatmap: fallbackViewModel.heatmap,
  }

  const normalizedSearch = searchValue.trim().toLowerCase()

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) {
      return sourceData.comparisonRows
    }

    return sourceData.comparisonRows.filter((row) => row.productName.toLowerCase().includes(normalizedSearch))
  }, [sourceData.comparisonRows, normalizedSearch])

  const resolvedThresholdInput = thresholdPercentInput || String(sourceData.alertSettings.thresholdPercent)

  return {
    isLoading,
    isError,
    errorMessage: isError ? normalizeErrorMessage(error) : null,
    alertBanner: sourceData.alertBanner,
    totalProductsTracked: sourceData.totalProductsTracked,
    filteredRows,
    topCompetitors: sourceData.topCompetitors,
    alertSettings: sourceData.alertSettings,
    heatmap: sourceData.heatmap,
    searchValue,
    thresholdPercentInput: resolvedThresholdInput,
    onSearchChange: setSearchValue,
    onThresholdChange: setThresholdPercentInput,
    onOpenProductDetail: (productId: string) => {
      if (!productId.trim()) return
      navigate(`/products/${productId}`)
    },
    onRefresh: () => {
      void refetch()
    },
  }
}
