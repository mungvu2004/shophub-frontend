import { apiClient } from '@/services/apiClient';
import type { StockLevel, InventoryAlert, Warehouse } from '@/types/inventory.types';
import type { InventoryStockAdjustmentPayload } from '@/features/inventory/logic/inventoryPageHeader.types';

export interface GetInventorySKUsParams {
  search?: string;
  status?: string;
  category?: string;
  platform?: string;
  warehouseId?: string;
  limit?: number;
  offset?: number;
}

export interface InventoryListResponse<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: number;
}

export interface AlertListResponse {
  items: InventoryAlert[];
  totalCount: number;
  unreadCount: number;
}

class InventoryService {
  /**
   * Fetch inventory SKUs with optional filters
   */
  async getInventorySKUs(params?: GetInventorySKUsParams): Promise<InventoryListResponse<StockLevel>> {
    const response = await apiClient.get('/inventory', {
      params: {
        search: params?.search,
        status: params?.status,
        category: params?.category,
        platform: params?.platform,
        warehouseId: params?.warehouseId,
        limit: params?.limit,
        offset: params?.offset,
      },
    });
    return response.data;
  }

  /**
   * Fetch low stock alerts
   */
  async getInventoryAlerts(params?: {
    severity?: string;
    limit?: number;
    offset?: number;
  }): Promise<AlertListResponse> {
    const response = await apiClient.get('/inventory/alerts', {
      params: {
        severity: params?.severity,
        limit: params?.limit,
        offset: params?.offset,
      },
    });
    return response.data;
  }

  /**
   * Fetch warehouse list
   */
  async getWarehouses(): Promise<Warehouse[]> {
    const response = await apiClient.get('/inventory/warehouses');
    return response.data;
  }

  /**
   * Mark alert as resolved
   */
  async resolveAlert(alertId: string): Promise<InventoryAlert> {
    const response = await apiClient.put(`/inventory/alerts/${alertId}`, {
      isResolved: true,
      resolvedAt: new Date().toISOString(),
    });
    return response.data;
  }

  /**
   * Adjust stock level for a SKU
   */
  async adjustStock(adjustment: InventoryStockAdjustmentPayload): Promise<StockLevel> {
    const response = await apiClient.post('/inventory/adjust', adjustment);
    return response.data;
  }
}

export const inventoryService = new InventoryService();
