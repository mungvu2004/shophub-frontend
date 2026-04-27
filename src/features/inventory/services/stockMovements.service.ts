import type { 
  InventoryStockMovementsQueryState, 
  InventoryStockMovementsResponse,
  InventoryStockMovementChartEntry
} from '@/features/inventory/logic/inventoryStockMovements.types';
import { mockExtendedStockMovements, mockChartData, mockStockMovementPerformers } from '@/mocks/data/stockMovements.mock';

export const stockMovementsService = {
  async getMovements(_query: InventoryStockMovementsQueryState): Promise<InventoryStockMovementsResponse> {
    await new Promise(resolve => setTimeout(resolve, 600)); // Network simulation
    
    // In real app, this would be an API call with query params
    return {
      title: 'Nhật ký biến động kho',
      subtitle: 'Theo dõi chi tiết Audit trail và đính kèm chứng từ nhập/xuất.',
      updatedAt: new Date().toISOString(),
      summary: {
        totalMovements: 1254,
        inboundQty: 4500,
        outboundQty: 3200,
        netQty: 1300,
        lazadaMovements: 45,
        criticalSignals: 12
      },
      platformBreakdown: [],
      groupBreakdown: [],
      warehouseBreakdown: [],
      movements: mockExtendedStockMovements,
      totalCount: 1254,
      suggestedActionLabel: 'Kiểm tra các biến động lớn (>500 đơn vị)',
      lazadaNote: 'Đồng bộ tự động mỗi 15 phút'
    };
  },

  async getChartData(filters?: Partial<InventoryStockMovementsQueryState>): Promise<InventoryStockMovementChartEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Default data for 'all'
    if (!filters || (filters.platform === 'all' && filters.movementGroup === 'all' && filters.warehouseId === 'all')) {
      return mockChartData;
    }

    // Assign unique multipliers per platform to make them distinct
    const platformMultipliers: Record<string, { in: number, out: number }> = {
      'shopee': { in: 0.6, out: 1.2 },
      'lazada': { in: 1.4, out: 0.5 },
      'tiktok_shop': { in: 0.9, out: 0.8 },
    };

    const multiplier = (filters.platform && platformMultipliers[filters.platform]) || { in: 0.5, out: 0.5 };
    const warehouseFactor = filters.warehouseId !== 'all' ? 0.6 : 1;

    // Generate distinct data based on selection
    return mockChartData.map((item, idx) => ({
      ...item,
      // Add a bit of randomness per index to make the line shape change slightly too
      inbound: Math.floor(item.inbound * multiplier.in * warehouseFactor * (idx % 2 === 0 ? 1.1 : 0.9)),
      outbound: Math.floor(item.outbound * multiplier.out * warehouseFactor * (idx % 3 === 0 ? 0.8 : 1.2))
    }));
  },

  async getPerformers() {
    return mockStockMovementPerformers;
  },

  exportToCSV(data: any[]) {
    if (!data.length) return;
    
    const headers = ['ID', 'Thời gian', 'SKU', 'Sản phẩm', 'Loại', 'Số lượng', 'Kho', 'Người thực hiện', 'Lý do'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.id,
        item.createdAtLabel,
        item.sku,
        item.productName,
        item.movementTypeLabel,
        item.delta,
        item.warehouseName,
        item.performerName,
        item.reason || ''
      ].map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nhat_ky_kho_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
