/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'
import { mockProducts } from './products'

/**
 * Generate mock revenue orders for the past 30 days with platform distribution
 */
const generateRevenueOrders = (): RevenueOrderItem[] => {
  const orders: RevenueOrderItem[] = []
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const platforms: Array<'shopee' | 'lazada' | 'tiktok'> = ['shopee', 'lazada', 'tiktok']

  let orderId = 1

  // Generate orders for past 30 days
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() - dayOffset)
    
    // Use local date parts to ensure consistency with toLocalDateKey in logic
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    // Number of orders per day varies (10-30 orders for more realistic charts)
    // Make today and yesterday have slightly different patterns to test change percentage
    let ordersPerDay = 15 + Math.floor(Math.random() * 20)
    
    // Artificial spike/dip for testing delta
    if (dayOffset === 0) ordersPerDay = 25 // Today
    if (dayOffset === 1) ordersPerDay = 20 // Yesterday

    for (let i = 0; i < ordersPerDay; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)]
      const hour = Math.floor(Math.random() * 24)
      const minute = Math.floor(Math.random() * 60)
      const second = Math.floor(Math.random() * 60)

      // Revenue varies by platform and day
      const trendMultiplier = 1 + (29 - dayOffset) * 0.01 
      let baseAmount = 400000 * trendMultiplier
      
      if (platform === 'shopee') baseAmount *= (1.2 + Math.random() * 0.5)
      if (platform === 'lazada') baseAmount *= (1.0 + Math.random() * 0.4)
      if (platform === 'tiktok') baseAmount *= (0.8 + Math.random() * 0.6)

      const totalAmount = Math.round(baseAmount)
      // Create local ISO-like string (no 'Z' so new Date() parses it as local)
      const createdAt = `${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
      
      // Randomly pick a status
      const statusSeed = Math.random()
      let status = 'delivered'
      if (statusSeed < 0.1) status = 'cancelled'
      else if (statusSeed < 0.15) status = 'refunded'
      else if (statusSeed < 0.3) status = 'shipped'
      else if (statusSeed < 0.4) status = 'pending'
      else if (statusSeed < 0.7) status = 'completed'

      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]

      orders.push({
        id: `order-rev-${String(orderId).padStart(6, '0')}`,
        platform: platform === 'tiktok' ? 'tiktok_shop' : platform,
        status: status as any,
        totalAmount,
        createdAt: createdAt,
        createdAt_platform: createdAt,
        items: [
          {
            productId: randomProduct.id,
            productName: randomProduct.name,
            qty: Math.floor(Math.random() * 2) + 1,
            itemPrice: Math.round(totalAmount * (0.8 + Math.random() * 0.1)),
            paidPrice: totalAmount,
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
 * Summary of revenue by platform for past 30 days
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
 * Daily revenue breakdown for past 30 days
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

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
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
