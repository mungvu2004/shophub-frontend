import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { GetInventorySKUsParams, InventoryListResponse } from '@/features/inventory/services/inventoryService';
import { inventoryService } from '@/features/inventory/services/inventoryService';
import type { StockLevel, InventoryAlert, Warehouse } from '@/types/inventory.types';

/**
 * Hook to fetch inventory SKUs with filters
 */
export function useInventorySKUs(
  params?: GetInventorySKUsParams,
  enabled = true
): UseQueryResult<InventoryListResponse<StockLevel>> {
  return useQuery({
    queryKey: [
      'inventory',
      'skus',
      params?.search,
      params?.status,
      params?.category,
      params?.platform,
      params?.warehouseId,
      params?.limit,
      params?.offset,
    ],
    queryFn: () => inventoryService.getInventorySKUs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
    enabled,
    retry: 1,
  });
}

/**
 * Hook to fetch inventory alerts
 */
export function useInventoryAlerts(
  params?: {
    severity?: string;
    limit?: number;
    offset?: number;
  },
  enabled = true
): UseQueryResult<{
  items: InventoryAlert[];
  totalCount: number;
  unreadCount: number;
}> {
  return useQuery({
    queryKey: [
      'inventory',
      'alerts',
      params?.severity,
      params?.limit,
      params?.offset,
    ],
    queryFn: () => inventoryService.getInventoryAlerts(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled,
    retry: 1,
  });
}

/**
 * Hook to fetch warehouse list
 */
export function useWarehouses(
  enabled = true
): UseQueryResult<Warehouse[]> {
  return useQuery({
    queryKey: ['inventory', 'warehouses'],
    queryFn: () => inventoryService.getWarehouses(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled,
    retry: 1,
  });
}
