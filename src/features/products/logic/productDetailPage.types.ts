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

export interface ProductAppliedTrigger {
  id: string
  name: string
  status: 'active' | 'paused'
  scopeLabel: string
  description: string
}

export interface ProductDetailEditInput {
  name: string
  brand: string
  shortDescription: string
  description: string
  model: string
  warrantyInfo: string
  status: Product['status']
  mainImageUrl: string
  galleryImageUrls: string[]
}

export interface ProductInventoryItem {
  id: string
  variantId: string
  sku: string
  warehouseName: string
  physicalQty: number
  reservedQty: number
  availableQty: number
}

export interface ProductInventorySummary {
  totalPhysicalQty: number
  totalReservedQty: number
  totalAvailableQty: number
  warehouseCount: number
  variantCount: number
  channelStock: {
    shopee: number
    tiktok: number
    lazada: number
  }
  items: ProductInventoryItem[]
}

export interface ProductDetailViewModel {
  productId: string
  product?: Product
  stats: ProductDetailStats
  appliedTriggers: ProductAppliedTrigger[]
  triggersUpdatedAt?: string
  isLoading: boolean
  isError: boolean
  isUpdating: boolean
  isInventoryLoading: boolean
  errorMessage?: string
  inventorySummary: ProductInventorySummary
  onBack: () => void
  onSaveEdit: (input: ProductDetailEditInput) => Promise<boolean>
}
