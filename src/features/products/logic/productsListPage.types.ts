import type { Product } from '@/types/product.types'
import type { SortOption } from '@/features/products/components/products-filters/ProductsFilters'

export interface ProductsListPageState {
  viewMode: 'table' | 'grid'
  searchValue: string
  sortBy: SortOption
  selectedStatus: string
  selectedCategory: string
  selectedPlatform: string
  currentPage: number
  pageSize: number
}

export interface PlatformStats {
  shopee: number
  tiktok_shop: number
  lazada: number
}

export interface ProductsListViewModel {
  // State
  state: ProductsListPageState

  // Data
  products: Product[]
  totalCount: number
  totalPages: number
  isLoading: boolean
  platformStats: PlatformStats

  // Handlers
  onViewModeChange: (mode: 'table' | 'grid') => void
  onSearchChange: (search: string) => void
  onStatusChange: (status: string) => void
  onCategoryChange: (category: string) => void
  onPlatformChange: (platform: string) => void
  onSortChange: (sortBy: ProductsListPageState['sortBy']) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onViewVariants: (product: Product) => void
}
