import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useProductById, useProducts } from '@/features/products/hooks/useProducts'
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

export function buildProductDetailViewModel(): ProductDetailViewModel {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  const fallbackPathId = location.pathname.split('/').filter(Boolean).at(-1) ?? ''
  const productId = decodeURIComponent((id ?? fallbackPathId).trim())

  const { product, isLoading, isError, error } = useProductById(productId || undefined)
  const { products, isLoading: isListLoading } = useProducts({ limit: 1000 })

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

  const isNotFound = !productId || (!isLoading && !isListLoading && !resolvedProduct)

  return {
    productId,
    product: resolvedProduct,
    stats,
    isLoading: isLoading || isListLoading,
    isError: isNotFound || isError,
    errorMessage: !productId
      ? 'Không tìm thấy mã sản phẩm.'
      : isNotFound
        ? 'Sản phẩm không tồn tại hoặc đã bị xóa.'
        : error instanceof Error
          ? error.message
          : undefined,
    onBack: () => navigate('/products/list'),
  }
}
