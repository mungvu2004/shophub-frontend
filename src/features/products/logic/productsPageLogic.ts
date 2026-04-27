import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { Product } from '@/types/product.types'
import type { ProductsListViewModel, SortOption } from './productsListPage.types'
import { MOCK_QUICK_STATS, MOCK_INSIGHTS_DATA, MOCK_STATUS_COUNTS } from '../mocks/productsListPage.mock'

export interface ProductsPageState {
  viewMode: 'table' | 'grid'
  searchValue: string
  sortBy: SortOption
  selectedStatus: string
  selectedCategory: string
  selectedPlatform: string
  currentPage: number
  pageSize: number
}

export function useProductsPageLogic(): ProductsListViewModel {
  const navigate = useNavigate()
  const [state, setState] = useState<ProductsPageState>({
    viewMode: 'table',
    searchValue: '',
    sortBy: 'newest',
    selectedStatus: '',
    selectedCategory: '',
    selectedPlatform: '',
    currentPage: 1,
    pageSize: 10,
  })

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Fetch products based on filters
  const { products: rawProducts, totalCount, isLoading, refetch } = useProducts({
    search: state.searchValue,
    status: state.selectedStatus || undefined,
    platform: state.selectedPlatform || undefined,
    category: state.selectedCategory || undefined,
    limit: state.pageSize,
    offset: (state.currentPage - 1) * state.pageSize,
  })

  const products = useMemo(() => rawProducts, [rawProducts])

  // Handlers
  const onSearchChange = useCallback((search: string) => {
    setState((prev) => ({ ...prev, searchValue: search, currentPage: 1 }))
  }, [])

  const onStatusChange = useCallback((status: string) => {
    setState((prev) => ({ ...prev, selectedStatus: status, currentPage: 1 }))
  }, [])

  const onCategoryChange = useCallback((category: string) => {
    setState((prev) => ({ ...prev, selectedCategory: category, currentPage: 1 }))
  }, [])

  const onPlatformChange = useCallback((platform: string) => {
    setState((prev) => ({ ...prev, selectedPlatform: platform, currentPage: 1 }))
  }, [])

  const onSortChange = useCallback((sortBy: SortOption) => {
    setState((prev) => ({ ...prev, sortBy, currentPage: 1 }))
  }, [])

  const onPageChange = useCallback((page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }))
  }, [])

  const onPageSizeChange = useCallback((size: number) => {
    setState((prev) => ({ ...prev, pageSize: size, currentPage: 1 }))
  }, [])

  const onViewModeChange = useCallback((mode: 'table' | 'grid') => {
    setState((prev) => ({ ...prev, viewMode: mode }))
  }, [])

  const onEdit = useCallback((product: Product) => {
    console.log('Feature: Edit Product', product)
  }, [])

  const onSaveProduct = useCallback((productData: { id?: string; name: string; sku: string; price: string; brand: string; status: string; syncedPlatforms: string[] }) => {
    console.log('API Call: Save Product', productData)
    refetch()
  }, [refetch])

  const onDelete = useCallback((product: Product) => {
    if (window.confirm(`Xác nhận xóa sản phẩm: ${product.name}?`)) {
      console.log('API Call: Delete Product', product.id)
      refetch()
    }
  }, [refetch])

  const onViewVariants = useCallback((product: Product) => {
    navigate(`/products/${product.id}`)
  }, [navigate])

  const onSelectionChange = useCallback((ids: string[]) => {
    setSelectedIds(ids)
  }, [])

  const onToggleAdvancedFilters = useCallback(() => {
    console.log('Feature: Toggle Advanced Filters')
  }, [])

  // Bulk Handlers
  const onBulkUpdatePrice = useCallback(() => {
    console.log('Feature: Bulk Update Price for', selectedIds)
  }, [selectedIds])

  const onBulkSync = useCallback(() => {
    console.log('Feature: Bulk Sync for', selectedIds)
  }, [selectedIds])

  const onBulkPause = useCallback(() => {
    console.log('Feature: Bulk Pause for', selectedIds)
  }, [selectedIds])

  const onBulkDelete = useCallback(() => {
    if (selectedIds.length === 0) return
    if (window.confirm(`Xác nhận xóa hàng loạt ${selectedIds.length} sản phẩm đã chọn?`)) {
       console.log('API Call: Bulk Delete', selectedIds)
       setSelectedIds([])
       refetch()
    }
  }, [selectedIds, refetch])

  const onBulkExport = useCallback(() => {
    console.log('Feature: Export Excel for', selectedIds)
  }, [selectedIds])

  const onImportExcel = useCallback(() => {
    console.log('Feature: Import Excel')
  }, [])

  const availableCategories = useMemo(() => ["Áo thun", "Váy nữ", "Quần nam", "Áo sơ mi", "Áo khoác", "Quần tây", "Đồ thể thao"], [])
  
  const availablePlatforms = useMemo(() => [
    { id: 'shopee', label: 'Shopee', color: 'bg-orange-500' },
    { id: 'tiktok_shop', label: 'TikTok Shop', color: 'bg-slate-900' },
    { id: 'lazada', label: 'Lazada', color: 'bg-indigo-600' },
  ], [])

  return useMemo(() => ({
    state,
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / state.pageSize),
    isLoading,
    platformStats: { shopee: 45, tiktok_shop: 32, lazada: 28 }, 
    statusCounts: MOCK_STATUS_COUNTS,
    availableCategories,
    availablePlatforms,
    quickStats: MOCK_QUICK_STATS,
    insightsData: MOCK_INSIGHTS_DATA,

    // Handlers
    onViewModeChange,
    onSearchChange,
    onStatusChange,
    onCategoryChange,
    onPlatformChange,
    onSortChange,
    onPageChange,
    onPageSizeChange,
    onEdit,
    onSaveProduct,
    onDelete,
    onViewVariants,
    onSelectionChange,
    onToggleAdvancedFilters,
    
    // Feature Actions
    onBulkUpdatePrice,
    onBulkSync,
    onBulkPause,
    onBulkDelete,
    onBulkExport,
    onImportExcel,
  }), [
    state, products, totalCount, isLoading, availableCategories, availablePlatforms,
    onViewModeChange, onSearchChange, onStatusChange, onCategoryChange, onPlatformChange,
    onSortChange, onPageChange, onPageSizeChange, onEdit, onSaveProduct, onDelete,
    onViewVariants, onSelectionChange, onToggleAdvancedFilters, onBulkUpdatePrice,
    onBulkSync, onBulkPause, onBulkDelete, onBulkExport, onImportExcel
  ])
}
