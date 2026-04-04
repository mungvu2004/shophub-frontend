import type { DynamicPricingPlatform } from '@/features/products/logic/productsDynamicPricing.types'

export const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')}đ`

export const formatPercent = (value: number) => {
  const rounded = value.toFixed(1)
  return `${value > 0 ? '+' : ''}${rounded}%`
}

export const platformLabelMap: Record<DynamicPricingPlatform, string> = {
  shopee: 'Shopee',
  tiktok_shop: 'TikTok',
  lazada: 'Lazada',
}
