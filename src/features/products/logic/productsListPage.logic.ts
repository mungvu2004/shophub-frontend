import { useProductsPageLogic } from './productsPageLogic'
import { productsService } from '@/features/products/services/productsService'
import { useState, useEffect } from 'react'
import type { ProductsListViewModel, PlatformStats } from './productsListPage.types'

export function buildProductsListViewModel(): ProductsListViewModel {
  const {
    state,
    products,
    totalCount,
    isLoading,
    paginationInfo,
    handleViewModeChange,
    handleSearchChange,
    handleStatusChange,
    handleCategoryChange,
    handlePlatformChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    handleEdit,
    handleDelete,
    handleViewVariants,
  } = useProductsPageLogic()

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
    state,
    products,
    totalCount,
    totalPages: paginationInfo.totalPages,
    isLoading,
    platformStats,
    onViewModeChange: handleViewModeChange,
    onSearchChange: handleSearchChange,
    onStatusChange: handleStatusChange,
    onCategoryChange: handleCategoryChange,
    onPlatformChange: handlePlatformChange,
    onSortChange: handleSortChange,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onViewVariants: handleViewVariants,
  }
}
