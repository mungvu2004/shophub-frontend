/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RevenueOrderItem } from '@/features/dashboard/services/dashboardService'
import { mockOrders } from './orders'

/**
 * Derive revenue orders from actual mockOrders for consistency
 * Maps all 50 orders to RevenueOrderItem format
 */
const generateRevenueOrders = (): RevenueOrderItem[] => {
  return mockOrders.map((order) => {
    const platformMap = {
      shopee: 'shopee',
      lazada: 'lazada',
      tiktok_shop: 'tiktok_shop',
    }
    
    // Map order status to revenue order status
    const statusMap: Record<string, 'pending' | 'completed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'> = {
      Pending: 'pending',
      PendingPayment: 'pending',
      Confirmed: 'completed',
      Packed: 'completed',
      ReadyToShip: 'shipped',
      Shipped: 'shipped',
      Delivered: 'delivered',
      Cancelled: 'cancelled',
      Returned: 'refunded',
    }
    
    return {
      id: order.id,
      platform: platformMap[order.platform as keyof typeof platformMap] as any,
      status: statusMap[order.status] || 'completed',
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      createdAt_platform: order.createdAt_platform,
      items: (order.items || []).map(item => ({
        productName: item.productName,
        qty: item.qty,
        itemPrice: Math.floor(item.itemPrice * item.qty),
        paidPrice: item.paidPrice * item.qty,
      })),
    }
  })
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
  const today = new Date("2026-05-05T00:00:00Z")
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
