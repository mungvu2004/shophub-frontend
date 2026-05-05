import { apiClient } from '@/services/apiClient'

export type InventoryAlertItem = {
  id: string
  productName?: string
  alertType?: string
  severity?: string
  currentAvailableQty?: number
  isResolved?: boolean
  [key: string]: unknown
}

export type PlatformConnectionItem = {
  id: string
  platform?: string
  status?: string
  isConnected?: boolean
  [key: string]: unknown
}

export type RevenueOrderItem = {
  id: string
  platform?: string
  status?: string
  totalAmount?: number
  createdAt?: string
  createdAt_platform?: string
  items?: Array<{
    productId?: string
    productName?: string
    imageUrl?: string
    qty?: number
    itemPrice?: number
    paidPrice?: number
  }>
  [key: string]: unknown
}

type ListLikeResponse<T> = {
  items?: T[]
  data?: T[] | { items?: T[] }
}

const toItems = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (!payload || typeof payload !== 'object') {
    return []
  }

  const listPayload = payload as ListLikeResponse<T>

  if (Array.isArray(listPayload.items)) {
    return listPayload.items
  }

  if (Array.isArray(listPayload.data)) {
    return listPayload.data
  }

  if (listPayload.data && typeof listPayload.data === 'object' && Array.isArray(listPayload.data.items)) {
    return listPayload.data.items
  }

  return []
}

export const dashboardService = {
  getInventoryAlerts: async (): Promise<InventoryAlertItem[]> => {
    const response = await apiClient.get('/inventory/alerts', {
      params: {
        isResolved: false,
        limit: 5,
      },
    })

    return toItems<InventoryAlertItem>(response.data)
  },

  getPlatformConnections: async (): Promise<PlatformConnectionItem[]> => {
    const response = await apiClient.get('/platforms/connections')
    return toItems<PlatformConnectionItem>(response.data)
  },

  getOrdersForRevenue: async (dateFrom: string, dateTo: string): Promise<RevenueOrderItem[]> => {
    const response = await apiClient.get('/orders', {
      params: {
        dateFrom,
        dateTo,
      },
    })

    return toItems<RevenueOrderItem>(response.data)
  },
}
