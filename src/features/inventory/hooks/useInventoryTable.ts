/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useInventorySKUs } from './useInventoryData';
import { useSKUExtendedDetails } from './useSKUExtendedDetails';
import { mapStockLevelToTableRow } from '../logic/inventoryTableLogic';
import type { 
  InventorySortState, 
  InventoryTableRow, 
} from '../logic/inventoryTable.types';
import type { StockLevel } from '@/types/inventory.types'

type UseInventoryTableProps = {
  filters?: {
    search?: string;
    status?: string;
    category?: string;
    platform?: string;
  };
  onEditSKU?: (sku: StockLevel) => void;
  skuActions?: any;
};

export function useInventoryTable({ filters, onEditSKU, skuActions }: UseInventoryTableProps) {
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

  // State quản lý xóa
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string } | null>(null);

  const extendedDetails = useSKUExtendedDetails(activeSKU?.sku || '');

  const [prevFilters, setPrevFilters] = useState(filters)
  if (
    prevFilters?.search !== filters?.search ||
    prevFilters?.status !== filters?.status ||
    prevFilters?.category !== filters?.category ||
    prevFilters?.platform !== filters?.platform
  ) {
    setPrevFilters(filters)
    setCurrentPage(1)
  }

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
      if (onEditSKU) {
        const item = data?.items?.find((i) => i.id === rowId);
        if (item) {
          onEditSKU(item);
          return;
        }
      }
      if (!productId) return;
      navigate(`/products/${productId}/edit`, {
        state: { from: `${location.pathname}${location.search}` },
      });
    },
    // Mở modal xác nhận xóa
    onConfirmDeleteRow: (rowId: string, productName: string) => {
      setItemToDelete({ id: rowId, name: productName });
    },
    onCancelDelete: () => {
      setItemToDelete(null);
    },
    // Hành động xóa thực sự
    onExecuteDelete: async () => {
      if (!itemToDelete || !skuActions) return;
      await skuActions.handleDelete([itemToDelete.id]);
      setSelectedRows((prev) => prev.filter((id) => id !== itemToDelete.id));
      setItemToDelete(null);
    },
    onDeleteRows: async (rowIds: string[]) => {
      if (!skuActions) return;
      await skuActions.handleDelete(rowIds);
      setSelectedRows((prev) => prev.filter((id) => !rowIds.includes(id)));
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
    onOpenReorderConfig: (sku: string, name: string) => {
      setActiveSKU({ sku, name });
      setModalType('REORDER');
      extendedDetails.fetchReorderConfig();
    },
    onOpenCostHistory: (sku: string, name: string) => {
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
      itemToDelete,
      crudState: {
        isProcessing: skuActions?.isProcessing || false,
        actionType: skuActions?.actionType || null,
      },
    },
    handlers: {
      ...handlers,
      setActiveActionMenuId,
    },
  };
}

