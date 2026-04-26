import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { Product } from '@/types/product.types'
import type { SortOption } from '@/features/products/components/products-filters/ProductsFilters'
import type { ProductQuickStatData, ProductInsightsData } from './productsListPage.types'

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

export function useProductsPageLogic() {
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

  // Fetch products based on filters
  const { products, totalCount, isLoading, refetch } = useProducts({
    search: state.searchValue,
    status: state.selectedStatus || undefined,
    platform: state.selectedPlatform || undefined,
    category: state.selectedCategory || undefined,
    limit: state.pageSize,
    offset: (state.currentPage - 1) * state.pageSize,
  })

  const sortedProducts = useMemo(() => {
    const list = [...products]

    switch (state.sortBy) {
      case 'price-asc':
        return list.sort((a, b) => (a.variants?.[0]?.salePrice ?? 0) - (b.variants?.[0]?.salePrice ?? 0))
      case 'price-desc':
        return list.sort((a, b) => (b.variants?.[0]?.salePrice ?? 0) - (a.variants?.[0]?.salePrice ?? 0))
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name))
      case 'inventory-desc':
        return list.sort((a, b) => {
          // Mock inventory based on seeded id like in ProductsCardList
          const getStock = (id: string) => (Number((id.match(/\d+/)?.[0] ?? '1')) * 7) % 180 + 20
          return getStock(b.id) - getStock(a.id)
        })
      case 'revenue-desc':
        return list.sort((a, b) => {
          // Mock revenue based on sold * price
          const getRevenue = (item: Product) => {
            const sold = (Number((item.id.match(/\d+/)?.[0] ?? '1')) * 11) % 1100 + 20
            return sold * (item.variants?.[0]?.salePrice ?? 0)
          }
          return getRevenue(b) - getRevenue(a)
        })
      case 'newest':
      default:
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }, [products, state.sortBy])

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(totalCount / state.pageSize)
    return { totalPages, totalCount }
  }, [totalCount, state.pageSize])

  // Action handlers
  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setState((prev) => ({ ...prev, viewMode: mode }))
  }

  const handleSearchChange = (search: string) => {
    setState((prev) => ({ ...prev, searchValue: search, currentPage: 1 }))
  }

  const handleStatusChange = (status: string) => {
    setState((prev) => ({ ...prev, selectedStatus: status, currentPage: 1 }))
  }

  const handleCategoryChange = (category: string) => {
    setState((prev) => ({ ...prev, selectedCategory: category, currentPage: 1 }))
  }

  const handlePlatformChange = (platform: string) => {
    setState((prev) => ({ ...prev, selectedPlatform: platform, currentPage: 1 }))
  }

  const handleSortChange = (sortBy: ProductsPageState['sortBy']) => {
    setState((prev) => ({ ...prev, sortBy, currentPage: 1 }))
  }

  const handlePageChange = (page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }))
  }

  const handlePageSizeChange = (size: number) => {
    setState((prev) => ({ ...prev, pageSize: size, currentPage: 1 }))
  }

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product)
    // Navigate to edit page or open modal
  }

  const handleSaveProduct = (productData: { id?: string; name: string; sku: string; price: string; brand: string; status: string; syncedPlatforms: string[] }) => {
    console.log('Save product data to API:', productData)
    refetch()
  }

  const handleDelete = (product: Product) => {
    console.log('Delete product:', product)
    // Show confirmation and delete
  }

  const handleViewVariants = (product: Product) => {
    navigate(`/products/${product.id}`)
  }

  const statusCounts = useMemo(() => {
    // In a real app, this should come from a separate API endpoint for aggregation,
    // or from a meta object in the products list response.
    // For now, we return mock aggregated data to replace hardcoded values in UI.
    return {
      all: 120,
      active: 85,
      inactive: 23,
      deleted: 12
    }
  }, [])

  const availableCategories = useMemo(() => {
    return ["Áo thun", "Váy nữ", "Quần nam", "Áo sơ mi", "Áo khoác", "Quần tây", "Đồ thể thao"]
  }, [])

  const availablePlatforms = useMemo(() => [
    { id: 'shopee', label: 'Shopee', color: 'bg-orange-500' },
    { id: 'tiktok_shop', label: 'TikTok Shop', color: 'bg-slate-900' },
    { id: 'lazada', label: 'Lazada', color: 'bg-indigo-600' },
  ], [])

  // Mock data for insights and stats
  const quickStats: ProductQuickStatData[] = [
    { title: 'Cần nhập hàng', value: '12', description: 'Sản phẩm dưới định mức', iconType: 'package', colorTone: 'rose' },
    { title: 'Lỗi đồng bộ', value: '3', description: 'Cần kiểm tra trên Shopee', iconType: 'cloud', colorTone: 'amber' },
    { title: 'Chưa tối ưu SEO', value: '28', description: 'Điểm chất lượng < 70', iconType: 'alert', colorTone: 'indigo' },
    { title: 'Giá trị Tồn kho', value: '1.2B', description: 'Tổng vốn đọng dự kiến', iconType: 'dollar', colorTone: 'emerald' },
  ]

  const insightsData: ProductInsightsData = {
    categoryPerformance: [
      { name: 'Áo thun', sales: 4000, stock: 2400 },
      { name: 'Váy nữ', sales: 3000, stock: 1398 },
      { name: 'Quần nam', sales: 2000, stock: 9800 },
      { name: 'Áo sơ mi', sales: 2780, stock: 3908 },
      { name: 'Áo khoác', sales: 1890, stock: 4800 },
    ],
    platformAllocation: [
      { name: 'Shopee', value: 45, color: '#f97316' }, // orange-500
      { name: 'TikTok', value: 30, color: '#0f172a' }, // slate-900
      { name: 'Lazada', value: 25, color: '#4f46e5' }, // indigo-600
    ]
  }

  return {
    // State
    state,
    products: sortedProducts,
    isLoading,
    totalCount,
    paginationInfo,
    quickStats,
    insightsData,
    statusCounts,
    availableCategories,
    availablePlatforms,

    // Actions
    handleViewModeChange,
    handleSearchChange,
    handleStatusChange,
    handleCategoryChange,
    handlePlatformChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    handleEdit,
    handleSaveProduct,
    handleDelete,
    handleViewVariants,
    refetch,
  }
}
