import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { InventoryTable } from '@/features/inventory/components/inventory-table/InventoryTable'
import { useInventorySKUs } from '@/features/inventory/hooks/useInventoryData'
import type { InventorySortState, InventoryTableViewModel, InventoryTableRow } from '@/features/inventory/logic/inventoryTable.types'
import { mapStockLevelToTableRow } from '@/features/inventory/logic/inventoryTableLogic'
import { mockStockLevels } from '@/mocks/data/inventory'
import { toast } from 'sonner'

// New imports
import { SKUQRCodeModal } from '@/features/inventory/components/inventory-sku-stock-page/SKUQRCodeModal'
import { SKUBatchManagement } from '@/features/inventory/components/inventory-sku-stock-page/SKUBatchManagement'
import { SKUReorderPointConfig } from '@/features/inventory/components/inventory-sku-stock-page/SKUReorderPointConfig'
import { SKUCostHistoryChart } from '@/features/inventory/components/inventory-sku-stock-page/SKUCostHistoryChart'
import { useSKUExtendedDetails } from '@/features/inventory/hooks/useSKUExtendedDetails'

type InventoryTableViewProps = {
  filters?: {
    search?: string
    status?: string
    category?: string
    platform?: string
  }
}

export function InventoryTableView({ filters }: InventoryTableViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortState, setSortState] = useState<InventorySortState>({
    columnId: 'actualStock',
    direction: 'desc',
  })

  // Modal states
  const [activeSKU, setActiveSKU] = useState<{ sku: string; name: string } | null>(null)
  const [modalType, setModalType] = useState<'QR' | 'BATCH' | 'REORDER' | 'COST' | null>(null)

  const extendedDetails = useSKUExtendedDetails(activeSKU?.sku || '');

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters?.search, filters?.status, filters?.category, filters?.platform])

  // Fetch inventory data from API
  const { data, isLoading } = useInventorySKUs({
    search: filters?.search,
    status: filters?.status,
    category: filters?.category,
    platform: filters?.platform,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  })

  const displayData = isLoading ? [] : (data?.items ?? mockStockLevels)

  const rows: InventoryTableRow[] = useMemo(() => {
    return displayData.map(mapStockLevelToTableRow)
  }, [displayData])

  const model: InventoryTableViewModel = useMemo(() => {
    return {
      columns: [
        { id: 'image', label: 'Ảnh', align: 'center' },
        { id: 'productName', label: 'Tên sản phẩm' },
        { id: 'sku', label: 'SKU' },
        { id: 'category', label: 'Phân loại' },
        { id: 'platformType', label: 'Loại sàn' },
        { id: 'warehouseHN', label: 'Kho HN', align: 'right' },
        { id: 'warehouseHCM', label: 'Kho HCM', align: 'right' },
        { id: 'warehouseDN', label: 'Kho ĐN', align: 'right' },
        { id: 'marketplaceStock', label: 'Tồn trên sàn', align: 'right' },
        { id: 'actualStock', label: 'Tồn thực tế', align: 'right' },
        { id: 'onOrder', label: 'Đã đặt', align: 'right' },
        { id: 'available', label: 'Khả dụng', align: 'right' },
        { id: 'status', label: 'Trạng thái' },
        { id: 'forecast', label: 'Dự báo AI' },
      ],
      rows,
      selectedRows,
      isLoading,
      sortState,
      currentPage,
      pageSize,
      totalCount: data?.totalCount || mockStockLevels.length,
      onSelectRow: (rowId) => {
        setSelectedRows((prev) =>
          prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
        )
      },
      onSelectAll: (selected) => {
        setSelectedRows(selected ? rows.map((r) => r.id) : [])
      },
      onSortChange: setSortState,
      onEditRow: (_rowId, productId) => {
        if (!productId) return
        navigate(`/products/${productId}/edit`, {
          state: {
            from: `${location.pathname}${location.search}`,
          },
        })
      },
      onDeleteRows: (rowIds: string[]) => {
        setSelectedRows((prev) => prev.filter((id) => !rowIds.includes(id)))
        toast.success(`Da xoa khoi danh sach chon ${rowIds.length} SKU.`)
      },
      onBulkAdjust: () => {
        toast.info(`Bat dau dieu chinh hang loat cho ${selectedRows.length} SKU.`)
      },
      onPageChange: setCurrentPage,
      onPageSizeChange: (size) => {
        setPageSize(size)
        setCurrentPage(1)
      },
      pageSizeOptions: [10, 20, 50, 100],
      onOpenProductDetail: (rowId) => {
        const selectedRow = rows.find((row) => row.id === rowId)
        if (!selectedRow) {
          return
        }

        navigate(`/inventory/adjust/${selectedRow.id}`, {
          state: {
            from: `${location.pathname}${location.search}`,
            prefillStockLevelId: selectedRow.id,
          },
        })
      },
      onOpenQRCode: (sku, name) => {
        setActiveSKU({ sku, name });
        setModalType('QR');
      },
      onOpenBatchManagement: (sku, name) => {
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
    }
  }, [rows, selectedRows, isLoading, sortState, currentPage, pageSize, data?.totalCount, navigate, location.pathname, location.search, extendedDetails])

  return (
    <>
      <InventoryTable model={model} />
      
      {activeSKU && (
        <>
          <SKUQRCodeModal 
            isOpen={modalType === 'QR'} 
            onClose={() => setModalType(null)} 
            sku={activeSKU.sku} 
            productName={activeSKU.name} 
          />
          <SKUBatchManagement 
            isOpen={modalType === 'BATCH'} 
            onClose={() => setModalType(null)} 
            sku={activeSKU.sku} 
            productName={activeSKU.name} 
            batches={extendedDetails.batches}
            isLoading={extendedDetails.isLoading}
          />
          <SKUReorderPointConfig 
            isOpen={modalType === 'REORDER'} 
            onClose={() => setModalType(null)} 
            sku={activeSKU.sku} 
            productName={activeSKU.name} 
            initialConfig={extendedDetails.reorderConfig}
            onSave={extendedDetails.updateReorderConfig}
          />
          <SKUCostHistoryChart 
            isOpen={modalType === 'COST'} 
            onClose={() => setModalType(null)} 
            sku={activeSKU.sku} 
            productName={activeSKU.name} 
            history={extendedDetails.costHistory}
            isLoading={extendedDetails.isLoading}
          />
        </>
      )}
    </>
  );
}
