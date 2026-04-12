import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type {
  InventoryStockMovementGroupFilter,
  InventoryStockMovementPlatformFilter,
  InventoryStockMovementsResponse,
} from '@/features/inventory/logic/inventoryStockMovements.types'
import { inventoryStockMovementsService, type GetInventoryStockMovementsParams } from '@/features/inventory/services/inventoryStockMovementsService'

export function useInventoryStockMovements(params: {
  search: string
  platform: InventoryStockMovementPlatformFilter
  movementGroup: InventoryStockMovementGroupFilter
  warehouseId: string
  page: number
  pageSize: number
}) {
  const serviceParams: GetInventoryStockMovementsParams = {
    search: params.search,
    platform: params.platform,
    movementGroup: params.movementGroup,
    warehouseId: params.warehouseId,
    page: params.page,
    pageSize: params.pageSize,
  }

  const query = useQuery({
    queryKey: ['inventory', 'stock-movements', params.search, params.platform, params.movementGroup, params.warehouseId, params.page, params.pageSize] as const,
    queryFn: (): Promise<InventoryStockMovementsResponse> => inventoryStockMovementsService.getMovements(serviceParams),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}