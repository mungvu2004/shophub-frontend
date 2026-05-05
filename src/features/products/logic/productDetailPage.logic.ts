import { useMemo } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useProductAutomationTriggers, useProductById, useProducts, useUpdateProduct } from '@/features/products/hooks/useProducts'
import { useInventorySKUs } from '@/features/inventory/hooks/useInventoryData'
import type { ProductDetailViewModel } from './productDetailPage.types'

const EMPTY_STATS = {
  totalVariants: 0,
  activeVariants: 0,
  inactiveVariants: 0,
  listedChannels: 0,
  minPrice: 0,
  maxPrice: 0,
  avgPrice: 0,
}

const EMPTY_INVENTORY_SUMMARY = {
  totalPhysicalQty: 0,
  totalReservedQty: 0,
  totalAvailableQty: 0,
  warehouseCount: 0,
  variantCount: 0,
  channelStock: {
    shopee: 0,
    tiktok: 0,
    lazada: 0,
  },
  items: [],
}

export function useProductDetailViewModel(): ProductDetailViewModel {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const fallbackPathId = location.pathname.split('/').filter(Boolean).at(-1) ?? ''
  const productId = decodeURIComponent((id ?? fallbackPathId).trim())

  const { product, isLoading, isError, error } = useProductById(productId || undefined)
  const { products, isLoading: isListLoading } = useProducts({ limit: 1000 })
  const {
    triggers,
    lastUpdatedAt: triggersUpdatedAt,
    isLoading: isTriggersLoading,
  } = useProductAutomationTriggers(productId || undefined)
  const {
    data: inventoryData,
    isLoading: isInventoryLoading,
  } = useInventorySKUs({ limit: 1000 }, Boolean(productId))
  const { updateProduct, isUpdating } = useUpdateProduct()

  const fallbackProduct = useMemo(() => {
    if (!productId) return undefined
    return products.find((item) => item.id === productId)
  }, [productId, products])

  const resolvedProduct = product ?? fallbackProduct

  const stats = useMemo(() => {
    if (!resolvedProduct) {
      return EMPTY_STATS
    }

    const variants = resolvedProduct.variants ?? []
    const prices = variants.map((variant) => variant.salePrice ?? variant.basePrice ?? 0)
    const listedChannels = new Set(
      variants.flatMap((variant) => variant.listings?.map((listing) => listing.platform) ?? []),
    )

    return {
      totalVariants: variants.length,
      activeVariants: variants.filter((variant) => variant.status === 'Active').length,
      inactiveVariants: variants.filter((variant) => variant.status !== 'Active').length,
      listedChannels: listedChannels.size,
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
      maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
      avgPrice: prices.length > 0 ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length) : 0,
    }
  }, [resolvedProduct])

  const inventorySummary = useMemo(() => {
    if (!resolvedProduct) {
      return EMPTY_INVENTORY_SUMMARY
    }

    const variantIds = new Set((resolvedProduct.variants ?? []).map((variant) => variant.id))
    const inventoryItems = (inventoryData?.items ?? []).filter((item) => variantIds.has(item.variantId))

    const warehouseSet = new Set(inventoryItems.map((item) => item.warehouseId))

    const channelStock = inventoryItems.reduce(
      (acc, item) => {
        acc.shopee += item.channelStock?.shopee ?? 0
        acc.tiktok += item.channelStock?.tiktok ?? 0
        acc.lazada += item.channelStock?.lazada ?? 0
        return acc
      },
      { shopee: 0, tiktok: 0, lazada: 0 },
    )

    return {
      totalPhysicalQty: inventoryItems.reduce((sum, item) => sum + item.physicalQty, 0),
      totalReservedQty: inventoryItems.reduce((sum, item) => sum + item.reservedQty, 0),
      totalAvailableQty: inventoryItems.reduce((sum, item) => sum + item.availableQty, 0),
      warehouseCount: warehouseSet.size,
      variantCount: variantIds.size,
      channelStock,
      items: inventoryItems.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        sku: item.sku,
        warehouseName: item.warehouseName,
        physicalQty: item.physicalQty,
        reservedQty: item.reservedQty,
        availableQty: item.availableQty,
      })),
    }
  }, [inventoryData?.items, resolvedProduct])

  const fromPath = searchParams.get('from')
  const backPath = typeof fromPath === 'string' && fromPath.startsWith('/') ? fromPath : '/products/list'

  const isNotFound = !productId || (!isLoading && !isListLoading && !resolvedProduct)

  return {
    productId,
    product: resolvedProduct,
    stats,
    appliedTriggers: triggers,
    triggersUpdatedAt,
    isLoading: isLoading || isListLoading || isTriggersLoading,
    isInventoryLoading,
    inventorySummary,
    isError: isNotFound || isError,
    isUpdating,
    errorMessage: !productId
      ? 'Không tìm thấy mã sản phẩm.'
      : isNotFound
        ? 'Sản phẩm không tồn tại hoặc đã bị xóa.'
        : error instanceof Error
          ? error.message
          : undefined,
    onBack: () => navigate(backPath),
    onSaveEdit: async (input) => {
      if (!resolvedProduct) {
        return false
      }

      const nextVariants = (resolvedProduct.variants ?? []).length > 0
        ? (resolvedProduct.variants ?? []).map((variant, index) => {
            if (index !== 0) {
              return variant
            }

            return {
              ...variant,
              mainImageUrl: input.mainImageUrl || undefined,
              imagesJson: input.galleryImageUrls,
              updatedAt: new Date().toISOString(),
            }
          })
        : (resolvedProduct.variants ?? [])

      await updateProduct({
        id: resolvedProduct.id,
        data: {
          name: input.name,
          brand: input.brand || undefined,
          shortDescription: input.shortDescription || undefined,
          description: input.description || undefined,
          model: input.model || undefined,
          warrantyInfo: input.warrantyInfo || undefined,
          status: input.status,
          variants: nextVariants,
          updatedAt: new Date().toISOString(),
        },
      })

      return true
    },
  }
}
