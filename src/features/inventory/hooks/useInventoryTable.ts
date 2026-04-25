import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useInventorySKUs } from './useInventoryData';
import { useSKUExtendedDetails } from './useSKUExtendedDetails';
import { mapStockLevelToTableRow } from '../logic/inventoryTableLogic';
import { inventoryService } from '../services/inventoryService';
import type { 
  InventorySortState, 
  InventoryTableRow, 
} from '../logic/inventoryTable.types';

type UseInventoryTableProps = {
  filters?: {
    search?: string;
    status?: string;
    category?: string;
    platform?: string;
  };
};

export function useInventoryTable({ filters }: UseInventoryTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State quản lý bảng
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortState, setSortState] = useState<InventorySortState>({
    columnId: 'actualStock',
    direction: 'desc',
  });

  // State quản lý Modals
  const [activeSKU, setActiveSKU] = useState<{ sku: string; name: string } | null>(null);
  const [modalType, setModalType] = useState<'QR' | 'BATCH' | 'REORDER' | 'COST' | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  const extendedDetails = useSKUExtendedDetails(activeSKU?.sku || '');

  // Reset trang khi bộ lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filters?.search, filters?.status, filters?.category, filters?.platform]);

  // Lấy dữ liệu từ API Hook
  const { data, isLoading } = useInventorySKUs({
    search: filters?.search,
    status: filters?.status,
    category: filters?.category,
    platform: filters?.platform,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  // Mapping dữ liệu thô sang dữ liệu hiển thị (UI Row)
  const rows: InventoryTableRow[] = useMemo(() => {
    return (data?.items ?? []).map(mapStockLevelToTableRow);
  }, [data?.items]);

  // Handlers (Logic xử lý sự kiện)
  const handlers = {
    onSelectRow: (rowId: string) => {
      setSelectedRows((prev) =>
        prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
      );
    },
    onSelectAll: (selected: boolean) => {
      setSelectedRows(selected ? rows.map((r) => r.id) : []);
    },
    onSortChange: (state: InventorySortState) => {
      setSortState(state);
    },
    onPageChange: (page: number) => {
      setCurrentPage(page);
    },
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    onEditRow: (rowId: string, productId?: string) => {
      if (!productId) return;
      navigate(`/products/${productId}/edit`, {
        state: { from: `${location.pathname}${location.search}` },
      });
    },
    onDeleteRow: async (rowId: string) => {
      try {
        await inventoryService.deleteSKUs([rowId]);
        setSelectedRows(prev => prev.filter(id => id !== rowId));
        toast.success('Đã xóa SKU thành công.');
        // Trigger refetch hoặc update local state nếu cần
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa SKU.');
      }
    },
    onDeleteRows: async (rowIds: string[]) => {
      try {
        await inventoryService.deleteSKUs(rowIds);
        setSelectedRows((prev) => prev.filter((id) => !rowIds.includes(id)));
        toast.success(`Đã xóa ${rowIds.length} SKU thành công.`);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa hàng loạt.');
      }
    },
    onBulkAdjust: () => {
      toast.info(`Bắt đầu điều chỉnh hàng loạt cho ${selectedRows.length} SKU.`);
    },
    onOpenProductDetail: (rowId: string) => {
      const selectedRow = rows.find((row) => row.id === rowId);
      if (selectedRow) {
        navigate(`/inventory/adjust/${selectedRow.id}`, {
          state: { from: `${location.pathname}${location.search}`, prefillStockLevelId: selectedRow.id },
        });
      }
    },
    onOpenQRCode: (sku: string, name: string) => {
      setActiveSKU({ sku, name });
      setModalType('QR');
    },
    onOpenBatchManagement: (sku: string, name: string) => {
      setActiveSKU({ sku, name });
      setModalType('BATCH');
      extendedDetails.fetchBatches();
    },
    onOpenReorderConfig: (sku, name) => {
      setActiveSKU({ sku, name });
      setModalType('REORDER');
      extendedDetails.fetchReorderConfig();
    },
    onOpenCostHistory: (sku, name) => {
      setActiveSKU({ sku, name });
      setModalType('COST');
      extendedDetails.fetchCostHistory();
    },
    closeModal: () => setModalType(null),
  };

  return {
    state: {
      rows,
      selectedRows,
      isLoading,
      sortState,
      currentPage,
      pageSize,
      totalCount: data?.totalCount || 0,
      activeSKU,
      modalType,
      activeActionMenuId,
      extendedDetails,
      pageSizeOptions: [10, 20, 50, 100],
    },
    handlers: {
      ...handlers,
      setActiveActionMenuId,
    },
  };
}

