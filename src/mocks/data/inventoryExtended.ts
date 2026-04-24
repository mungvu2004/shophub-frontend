import type { StockBatch, CostHistoryEntry, ReorderConfig } from '@/types/inventory.types';

export const mockSKUBatches: Record<string, StockBatch[]> = {
  'DEFAULT': [
    {
      id: 'B1',
      sku: 'SKU-SAMPLE',
      batchNumber: 'LOT-2024-001',
      quantity: 50,
      expiryDate: '2025-12-31',
      receivedDate: '2024-01-15',
      costPrice: 150000,
      warehouseId: 'WH1',
    },
    {
      id: 'B2',
      sku: 'SKU-SAMPLE',
      batchNumber: 'LOT-2024-002',
      quantity: 30,
      expiryDate: '2025-06-30',
      receivedDate: '2024-02-20',
      costPrice: 155000,
      warehouseId: 'WH1',
    }
  ]
};

export const mockCostHistory: Record<string, CostHistoryEntry[]> = {
  'DEFAULT': [
    { id: 'C1', sku: 'SKU-SAMPLE', date: '2024-01-01', costPrice: 145000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'IMP-001' },
    { id: 'C2', sku: 'SKU-SAMPLE', date: '2024-02-01', costPrice: 148000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'IMP-002' },
    { id: 'C3', sku: 'SKU-SAMPLE', date: '2024-03-01', costPrice: 152000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'IMP-003' },
  ]
};

export const mockReorderConfigs: Record<string, ReorderConfig> = {
  'DEFAULT': {
    sku: 'SKU-SAMPLE',
    minThreshold: 15,
    reorderQty: 100,
    isAutoReorder: true
  }
};
