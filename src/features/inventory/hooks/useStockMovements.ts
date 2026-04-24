import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  InventoryStockMovementsQueryState, 
  InventoryStockMovementRecord,
  InventoryStockMovementChartEntry
} from '@/features/inventory/logic/inventoryStockMovements.types';
import { stockMovementsService } from '@/features/inventory/services/stockMovements.service';
import { toast } from 'sonner';

export function useStockMovements() {
  const [query, setQuery] = useState<InventoryStockMovementsQueryState>({
    search: '',
    platform: 'all',
    movementGroup: 'all',
    warehouseId: 'all',
    performerId: 'all',
    page: 1,
    pageSize: 20,
  });

  const [movements, setMovements] = useState<InventoryStockMovementRecord[]>([]);
  const [chartData, setChartData] = useState<InventoryStockMovementChartEntry[]>([]);
  const [performers, setPerformers] = useState<Array<{ id: string; label: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovements = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await stockMovementsService.getMovements(query);
      setMovements(response.movements);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu nhật ký kho.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const fetchChartAndPerformers = useCallback(async () => {
    try {
      const [chart, list] = await Promise.all([
        stockMovementsService.getChartData(),
        stockMovementsService.getPerformers()
      ]);
      setChartData(chart);
      setPerformers(list);
    } catch (error) {
      console.error('Initial fetch failed', error);
    }
  }, []);

  useEffect(() => {
    fetchChartAndPerformers();
  }, [fetchChartAndPerformers]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const handleExport = useCallback(() => {
    toast.info('Đang chuẩn bị tệp nhật ký...');
    stockMovementsService.exportToCSV(movements);
  }, [movements]);

  const handleQueryChange = (updates: Partial<InventoryStockMovementsQueryState>) => {
    setQuery(prev => ({ ...prev, ...updates, page: 1 }));
  };

  return {
    movements,
    chartData,
    performers,
    query,
    isLoading,
    handleQueryChange,
    handleExport,
  };
}
