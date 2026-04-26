import { useProductsPageLogic } from './productsPageLogic'
import { productsService } from '@/features/products/services/productsService'
import { useState, useEffect } from 'react'
import type { ProductsListViewModel, PlatformStats } from './productsListPage.types'

export function useProductsListViewModel(): ProductsListViewModel {
  const logic = useProductsPageLogic()

  // Calculate platform stats from all products
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    shopee: 0,
    tiktok_shop: 0,
    lazada: 0,
  })

  useEffect(() => {
    // Fetch all products to calculate stats
    productsService.getProducts({ limit: 1000 }).then((response) => {
      const stats: PlatformStats = {
        shopee: 0,
        tiktok_shop: 0,
        lazada: 0,
      }

      // Count unique products per platform
      const platformMap = new Map<string, Set<string>>()

      response.items.forEach((product) => {
        product.variants?.forEach((variant) => {
          variant.listings?.forEach((listing) => {
            const platform = listing.platform as keyof PlatformStats
            if (platform in stats) {
              if (!platformMap.has(platform)) {
                platformMap.set(platform, new Set())
              }
              platformMap.get(platform)?.add(product.id)
            }
          })
        })
      })

      // Convert sets to counts
      platformMap.forEach((set, platform) => {
        stats[platform as keyof PlatformStats] = set.size
      })

      setPlatformStats(stats)
    })
  }, [])

  return {
    state: logic.state,
    products: logic.products,
    totalCount: logic.totalCount,
    totalPages: logic.paginationInfo.totalPages,
    isLoading: logic.isLoading,
    platformStats,
    quickStats: logic.quickStats,
    insightsData: logic.insightsData,
    statusCounts: logic.statusCounts,
    availableCategories: logic.availableCategories,
    availablePlatforms: logic.availablePlatforms,
    onViewModeChange: logic.handleViewModeChange,
    onSearchChange: logic.handleSearchChange,
    onStatusChange: logic.handleStatusChange,
    onCategoryChange: logic.handleCategoryChange,
    onPlatformChange: logic.handlePlatformChange,
    onSortChange: logic.handleSortChange,
    onPageChange: logic.handlePageChange,
    onPageSizeChange: logic.handlePageSizeChange,
    onEdit: logic.handleEdit,
    onSaveProduct: logic.handleSaveProduct,
    onDelete: logic.handleDelete,
    onViewVariants: logic.handleViewVariants,
  }
}
