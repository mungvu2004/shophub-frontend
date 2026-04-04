import { useMemo } from 'react'
import { InventoryFilterBar } from '@/features/inventory/components/inventory-filter/InventoryFilterBar'
import type { InventoryFilterModel, FilterCategory, FilterPlatform, FilterStatus } from '@/features/inventory/logic/inventoryFilter.types'

interface Filters {
  search: string
  category: string
  platform: string
  status: string
}

interface InventoryFilterBarViewProps {
  filters?: Filters
  onFilterChange?: (updates: Partial<Filters>) => void
}

export function InventoryFilterBarView({ 
  filters = {
    search: '',
    category: '',
    platform: '',
    status: '',
  },
  onFilterChange = () => {},
}: InventoryFilterBarViewProps) {
  const model: InventoryFilterModel = useMemo(() => {
    const categories: Array<{ id: FilterCategory; label: string }> = [
      { id: 'all', label: 'Tất cả danh mục' },
      { id: 'clothing', label: 'Quần áo' },
      { id: 'shoes', label: 'Giày dép' },
      { id: 'accessories', label: 'Phụ kiện' },
    ]

    const platforms: Array<{ id: FilterPlatform; label: string }> = [
      { id: 'all', label: 'Tất cả' },
      { id: 'shopee', label: 'Shopee' },
      { id: 'tiktok', label: 'TikTok' },
      { id: 'lazada', label: 'Lazada' },
    ]

    const statuses: Array<{ id: FilterStatus; label: string }> = [
      { id: 'all', label: 'Tất cả' },
      { id: 'normal', label: 'Bình thường' },
      { id: 'warning', label: 'Thấp' },
      { id: 'critical', label: 'Hết hàng' },
      { id: 'discontinued', label: 'Ngừng bán' },
    ]

    return {
      searchQuery: filters.search,
      selectedCategory: (filters.category || 'all') as FilterCategory,
      selectedPlatform: (filters.platform || 'all') as FilterPlatform,
      selectedStatus: (filters.status || 'all') as FilterStatus,
      
      categories,
      platforms,
      statuses,
      
      onSearchChange: (query) => onFilterChange({ search: query }),
      onCategoryChange: (category) => onFilterChange({ category }),
      onPlatformChange: (platform) => onFilterChange({ platform }),
      onStatusChange: (status) => onFilterChange({ status }),
    }
  }, [filters, onFilterChange])

  return <InventoryFilterBar model={model} />
}
