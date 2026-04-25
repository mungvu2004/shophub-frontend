import { apiClient } from '@/services/apiClient'
import type { InventoryStockMovementsResponse } from '@/features/inventory/logic/inventoryStockMovements.types'

import type {
  InventoryStockMovementGroupFilter,
  InventoryStockMovementPlatformFilter,
  InventoryStockMovementsQueryState,
} from '@/features/inventory/logic/inventoryStockMovements.types'

type ApiEnvelope = {
  data?: InventoryStockMovementsResponse | { data?: InventoryStockMovementsResponse }
}

const parseResponse = (payload: unknown, fallback: InventoryStockMovementsResponse): InventoryStockMovementsResponse => {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const candidate = payload as ApiEnvelope & InventoryStockMovementsResponse

  if (candidate.data && typeof candidate.data === 'object' && 'movements' in candidate.data) {
    return candidate.data as InventoryStockMovementsResponse
  }

  if ('movements' in candidate) {
    return candidate as InventoryStockMovementsResponse
  }

  return fallback
}

export type GetInventoryStockMovementsParams = Pick<InventoryStockMovementsQueryState, 'search' | 'page' | 'pageSize'> & {
  platform?: InventoryStockMovementPlatformFilter
  movementGroup?: InventoryStockMovementGroupFilter
  warehouseId?: string
  performerId?: string
}

const emptyResponse: InventoryStockMovementsResponse = {
  title: 'Nhập/Xuất kho',
  subtitle: 'Theo dõi mọi biến động kho theo thời gian thực',
  updatedAt: '--:--',
  summary: {
    totalMovements: 0,
    inboundQty: 0,
    outboundQty: 0,
    netQty: 0,
    lazadaMovements: 0,
    criticalSignals: 0,
  },
  platformBreakdown: [],
  groupBreakdown: [],
  warehouseBreakdown: [],
  movements: [],
  totalCount: 0,
  suggestedActionLabel: 'Đồng bộ kho tự động',
  lazadaNote: 'Lazada được theo dõi như một kênh riêng trong biến động kho.',
}

class InventoryStockMovementsService {
  async getMovements(params: GetInventoryStockMovementsParams): Promise<InventoryStockMovementsResponse> {
    const response = await apiClient.get('/inventory/stock-movements', {
      params: {
        search: params.search,
        platform: params.platform && params.platform !== 'all' ? params.platform : undefined,
        movementGroup: params.movementGroup && params.movementGroup !== 'all' ? params.movementGroup : undefined,
        warehouseId: params.warehouseId && params.warehouseId !== 'all' ? params.warehouseId : undefined,
        performerId: params.performerId && params.performerId !== 'all' ? params.performerId : undefined,
        page: params.page,
        pageSize: params.pageSize,
      },
    })

    return parseResponse(response.data, emptyResponse)
  }
}

export const inventoryStockMovementsService = new InventoryStockMovementsService()