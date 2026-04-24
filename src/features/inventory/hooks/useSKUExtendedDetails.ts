import { useState, useCallback } from 'react';
import type { StockBatch, CostHistoryEntry, ReorderConfig } from '@/types/inventory.types';
import { inventoryExtendedService } from '@/features/inventory/services/inventoryExtended.service';

export function useSKUExtendedDetails(sku: string) {
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [costHistory, setCostHistory] = useState<CostHistoryEntry[]>([]);
  const [reorderConfig, setReorderConfig] = useState<ReorderConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBatches = useCallback(async () => {
    if (!sku) return;
    setIsLoading(true);
    try {
      const data = await inventoryExtendedService.getBatches(sku);
      setBatches(data);
    } finally {
      setIsLoading(false);
    }
  }, [sku]);

  const fetchCostHistory = useCallback(async () => {
    if (!sku) return;
    setIsLoading(true);
    try {
      const data = await inventoryExtendedService.getCostHistory(sku);
      setCostHistory(data);
    } finally {
      setIsLoading(false);
    }
  }, [sku]);

  const fetchReorderConfig = useCallback(async () => {
    if (!sku) return;
    setIsLoading(true);
    try {
      const data = await inventoryExtendedService.getReorderConfig(sku);
      setReorderConfig(data);
    } finally {
      setIsLoading(false);
    }
  }, [sku]);

  const updateReorderConfig = useCallback(async (config: ReorderConfig) => {
    setIsLoading(true);
    try {
      const updated = await inventoryExtendedService.updateReorderConfig(config);
      setReorderConfig(updated);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    batches,
    costHistory,
    reorderConfig,
    isLoading,
    fetchBatches,
    fetchCostHistory,
    fetchReorderConfig,
    updateReorderConfig,
  };
}
