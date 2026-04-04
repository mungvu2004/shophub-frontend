import type { Product } from '@/types/product.types'

export interface ProductDetailStats {
  totalVariants: number
  activeVariants: number
  inactiveVariants: number
  listedChannels: number
  minPrice: number
  maxPrice: number
  avgPrice: number
}

export interface ProductDetailViewModel {
  productId: string
  product?: Product
  stats: ProductDetailStats
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onBack: () => void
}
