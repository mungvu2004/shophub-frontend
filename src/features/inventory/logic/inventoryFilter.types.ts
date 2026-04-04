export type FilterCategory = 'all' | 'clothing' | 'shoes' | 'accessories'
export type FilterPlatform = 'all' | 'shopee' | 'tiktok' | 'lazada'
export type FilterStatus = 'all' | 'normal' | 'warning' | 'critical' | 'discontinued'

export interface InventoryFilterModel {
  searchQuery: string
  selectedCategory: FilterCategory
  selectedPlatform: FilterPlatform
  selectedStatus: FilterStatus
  
  categories: { id: FilterCategory; label: string }[]
  platforms: { id: FilterPlatform; label: string }[]
  statuses: { id: FilterStatus; label: string }[]
  
  onSearchChange: (query: string) => void
  onCategoryChange: (category: FilterCategory) => void
  onPlatformChange: (platform: FilterPlatform) => void
  onStatusChange: (status: FilterStatus) => void
}
