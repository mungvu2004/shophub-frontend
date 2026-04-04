import type { Product } from '@/types/product.types'

export const money = (value: number) => `${value.toLocaleString('vi-VN')} ₫`

export const formatDateTime = (value?: string) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString('vi-VN')
}

export const platformLabelMap: Record<string, string> = {
  shopee: 'Shopee',
  tiktok_shop: 'TikTok Shop',
  lazada: 'Lazada',
}

export const getProductChannels = (product: Product) => {
  const channelSet = new Set(
    product.variants.flatMap((variant) => variant.listings?.map((listing) => listing.platform) ?? []),
  )

  return Array.from(channelSet)
}
