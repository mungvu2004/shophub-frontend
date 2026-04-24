import type { StockBatch, CostHistoryEntry, ReorderConfig } from '@/types/inventory.types';
import { mockSKUBatches, mockCostHistory, mockReorderConfigs } from '@/mocks/data/inventoryExtended';

export const inventoryExtendedService = {
  async getBatches(sku: string): Promise<StockBatch[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập network delay
    return mockSKUBatches[sku] || mockSKUBatches['DEFAULT'] || [];
  },

  async getCostHistory(sku: string): Promise<CostHistoryEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCostHistory[sku] || mockCostHistory['DEFAULT'] || [];
  },

  async getReorderConfig(sku: string): Promise<ReorderConfig | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockReorderConfigs[sku] || mockReorderConfigs['DEFAULT'] || null;
  },

  async updateReorderConfig(config: ReorderConfig): Promise<ReorderConfig> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Service: Updating reorder config', config);
    return config;
  }
};
