import type {
  BuildTopProductsFromOrdersParams,
  TopProductPlatform,
  TopProductTableInputItem,
  TopProductsTableModelParams,
  TopProductsTableViewModel,
} from '@/features/dashboard/logic/topProductsTable.types'

const normalizePlatform = (platform?: string): TopProductPlatform => {
  const normalized = platform?.toLowerCase() ?? ''

  if (normalized === 'tiktok_shop' || normalized === 'tiktok') return 'tiktok'
  if (normalized === 'lazada') return 'lazada'

  return 'shopee'
}

const formatSold = (value: number) => new Intl.NumberFormat('vi-VN').format(Math.max(0, Math.floor(value)))

const formatRevenue = (value: number) => {
  const safeValue = Math.max(0, value)

  if (safeValue >= 1_000_000_000) {
    return `${(safeValue / 1_000_000_000).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1')}B`
  }

  if (safeValue >= 1_000_000) {
    return `${(safeValue / 1_000_000).toFixed(0)}M`
  }

  return new Intl.NumberFormat('vi-VN').format(safeValue)
}

export function buildTopProductsFromOrders({ orders = [] }: BuildTopProductsFromOrdersParams): TopProductTableInputItem[] {
  const aggregate = new Map<
    string,
    {
      id: string
      name: string
      soldInMonth: number
      revenue: number
      platformCount: Record<TopProductPlatform, number>
    }
  >()

  for (const order of orders) {
    const platform = normalizePlatform(order.platform)
    const orderItems = Array.isArray(order.items) ? order.items : []

    for (const item of orderItems) {
      const name = typeof item.productName === 'string' && item.productName.trim() ? item.productName : 'Sản phẩm chưa đặt tên'
      const qty = typeof item.qty === 'number' && Number.isFinite(item.qty) && item.qty > 0 ? item.qty : 1
      const unitPrice =
        typeof item.paidPrice === 'number' && Number.isFinite(item.paidPrice)
          ? item.paidPrice
          : typeof item.itemPrice === 'number' && Number.isFinite(item.itemPrice)
            ? item.itemPrice
            : typeof order.totalAmount === 'number' && Number.isFinite(order.totalAmount)
              ? order.totalAmount
              : 0

      const key = name.toLowerCase()
      const existingId = Array.from(aggregate.values()).find((v) => v.name === name)?.id
      
      const current = aggregate.get(key) ?? {
        id: item.productId || existingId || `top-${aggregate.size + 1}`,
        name,
        soldInMonth: 0,
        revenue: 0,
        platformCount: { shopee: 0, tiktok: 0, lazada: 0 },
      }

      current.soldInMonth += qty
      current.revenue += Math.max(0, unitPrice) * qty
      current.platformCount[platform] += 1

      aggregate.set(key, current)
    }
  }

  return Array.from(aggregate.values()).map((item) => {
    const platform = (Object.keys(item.platformCount) as TopProductPlatform[]).reduce((winner, current) =>
      item.platformCount[current] > item.platformCount[winner] ? current : winner,
    'shopee')

    return {
      id: item.id,
      name: item.name,
      platform,
      soldInMonth: item.soldInMonth,
      revenue: item.revenue,
    }
  })
}

export function buildTopProductsTableViewModel({ products = [] }: TopProductsTableModelParams): TopProductsTableViewModel {
  const rows = [...products]
    .sort((a, b) => b.soldInMonth - a.soldInMonth)
    .slice(0, 10)
    .map((item, index) => ({
      id: item.id,
      rank: `#${String(index + 1).padStart(2, '0')}`,
      name: item.name,
      platform: item.platform,
      soldInMonthLabel: formatSold(item.soldInMonth),
      revenueLabel: formatRevenue(item.revenue),
      imageUrl: item.imageUrl,
    }))

  return {
    title: 'Top 10 sản phẩm bán chạy',
    ctaLabel: 'Xem tất cả',
    rows,
    hasData: rows.length > 0,
  }
}
