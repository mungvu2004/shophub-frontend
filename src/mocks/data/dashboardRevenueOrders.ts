import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'
import { mockProducts } from './products'

/**
 * Generate mock revenue orders for the past 7 days with platform distribution
 */
const generateRevenueOrders = (): RevenueOrderItem[] => {
  const orders: RevenueOrderItem[] = []
  const today = new Date()
  const platforms: Array<'shopee' | 'lazada' | 'tiktok'> = ['shopee', 'lazada', 'tiktok']
  const statues = ['completed', 'shipped', 'delivered', 'pending', 'cancelled']
  const productNames = [
    'Áo thun cotton nam',
    'Quần jean nữ',
    'Giày thể thao',
    'Túi xách da',
    'Ví da nam',
    'Đồng hồ thông minh',
    'Pin sạc nhanh',
    'Tai nghe Bluetooth',
    'Bàn phím cơ',
    'Chuột không dây',
  ]

  let orderId = 1

  // Generate orders for past 7 days
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() - dayOffset)
    const dateStr = currentDate.toISOString().split('T')[0]
    const date = `${dateStr}T00:00:00Z`

    // Number of orders per day varies (5-15 orders)
    const ordersPerDay = 5 + Math.floor(Math.random() * 11)

    for (let i = 0; i < ordersPerDay; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      const hour = Math.floor(Math.random() * 24)
      const minute = Math.floor(Math.random() * 60)

      // Revenue varies by platform and time
      let baseAmount = 500000
      if (platform === 'shopee') baseAmount = 800000 + Math.random() * 400000
      if (platform === 'lazada') baseAmount = 600000 + Math.random() * 350000
      if (platform === 'tiktok') baseAmount = 400000 + Math.random() * 300000

      const totalAmount = Math.round(baseAmount)
      const createdAtTime = `T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`
      
      // Pick a random product from mock products
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]

      orders.push({
        id: `order-${String(orderId).padStart(5, '0')}`,
        platform: platform === 'tiktok' ? 'tiktok_shop' : platform,
        status: statues[Math.floor(Math.random() * statues.length)] as any,
        totalAmount,
        createdAt: `${dateStr}${createdAtTime}`,
        createdAt_platform: `${dateStr}${createdAtTime}`,
        items: [
          {
            productId: randomProduct.id,
            productName: randomProduct.name,
            qty: Math.floor(Math.random() * 3) + 1,
            itemPrice: Math.round(totalAmount * (0.6 + Math.random() * 0.3)),
            paidPrice: Math.round(totalAmount * (0.8 + Math.random() * 0.15)),
          },
        ],
      })

      orderId++
    }
  }

  return orders.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
}

export const mockRevenueOrders = generateRevenueOrders()

/**
 * Summary of revenue by platform for past 7 days
 */
export const revenueSummary = (() => {
  const summary = {
    shopee: { revenue: 0, orders: 0 },
    lazada: { revenue: 0, orders: 0 },
    tiktok: { revenue: 0, orders: 0 },
  }

  for (const order of mockRevenueOrders) {
    const platform = order.platform?.toLowerCase().replace('_shop', '') as keyof typeof summary
    if (platform && summary[platform]) {
      summary[platform].revenue += order.totalAmount || 0
      summary[platform].orders += 1
    }
  }

  return summary
})()

/**
 * Daily revenue breakdown for past 7 days
 */
export const dailyRevenueBreakdown = (() => {
  const today = new Date()
  const breakdown: Record<
    string,
    {
      date: string
      shopee: number
      lazada: number
      tiktok: number
      total: number
    }
  > = {}

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() - dayOffset)
    const dateStr = currentDate.toISOString().split('T')[0]

    breakdown[dateStr] = {
      date: dateStr,
      shopee: 0,
      lazada: 0,
      tiktok: 0,
      total: 0,
    }
  }

  for (const order of mockRevenueOrders) {
    if (!order.createdAt) continue

    const dateStr = order.createdAt.split('T')[0]
    const platform = order.platform?.toLowerCase().replace('_shop', '') as 'shopee' | 'lazada' | 'tiktok'
    const amount = order.totalAmount || 0

    if (breakdown[dateStr] && platform && ['shopee', 'lazada', 'tiktok'].includes(platform)) {
      breakdown[dateStr][platform] += amount
      breakdown[dateStr].total += amount
    }
  }

  return Object.values(breakdown)
})()
