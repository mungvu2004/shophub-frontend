import type { Product } from '@/types/product.types'

export type SortOption = 'price-asc' | 'price-desc' | 'inventory-desc' | 'revenue-desc' | 'name-asc' | 'newest'

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

export interface ProductStatusCounts {
  all: number
  active: number
  inactive: number
  deleted: number
}

export interface ProductQuickStatData {
  title: string
  value: string | number
  description: string
  iconType: 'package' | 'cloud' | 'alert' | 'dollar'
  colorTone: 'rose' | 'amber' | 'indigo' | 'emerald'
}

export interface ProductInsightsData {
  categoryPerformance: { name: string, sales: number, stock: number }[]
  platformAllocation: { name: string, value: number, color: string }[]
}

export interface PlatformConfig {
  id: string
  label: string
  color: string
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
  statusCounts: ProductStatusCounts
  availableCategories: string[]
  availablePlatforms: PlatformConfig[]
  quickStats: ProductQuickStatData[]
  insightsData: ProductInsightsData

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
  onSaveProduct: (productData: { id?: string; name: string; sku: string; price: string; brand: string; status: string; syncedPlatforms: string[] }) => void
  onDelete: (product: Product) => void
  onViewVariants: (product: Product) => void
  onSelectionChange: (ids: string[]) => void
  onToggleAdvancedFilters: () => void
  onBulkUpdatePrice: () => void
  onBulkSync: () => void
  onBulkPause: () => void
  onBulkDelete: () => void
  onBulkExport: () => void
  onImportExcel: () => void
}
