import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { Product } from '@/types/product.types'
import type { SortOption } from '@/features/products/components/products-filters/ProductsFilters'

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
    pageSize: 20,
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

  const handleDelete = (product: Product) => {
    console.log('Delete product:', product)
    // Show confirmation and delete
  }

  const handleViewVariants = (product: Product) => {
    navigate(`/products/${product.id}`)
  }

  return {
    // State
    state,
    products: sortedProducts,
    isLoading,
    totalCount,
    paginationInfo,

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
    handleDelete,
    handleViewVariants,
    refetch,
  }
}
