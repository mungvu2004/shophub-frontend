import { InventoryTable } from '@/features/inventory/components/inventory-table/InventoryTable'
import { SKUQRCodeModal } from '@/features/inventory/components/inventory-sku-stock-page/SKUQRCodeModal'
import { SKUBatchManagement } from '@/features/inventory/components/inventory-sku-stock-page/SKUBatchManagement'
import { SKUReorderPointConfig } from '@/features/inventory/components/inventory-sku-stock-page/SKUReorderPointConfig'
import { SKUCostHistoryChart } from '@/features/inventory/components/inventory-sku-stock-page/SKUCostHistoryChart'
import { useInventoryTable } from '@/features/inventory/hooks/useInventoryTable'
import type { InventoryTableViewModel } from '@/features/inventory/logic/inventoryTable.types'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { MESSAGES } from '@/constants/messages'
import type { StockLevel } from '@/types/inventory.types'

type InventoryTableViewProps = {
  filters?: {
    search?: string
    status?: string
    category?: string
    platform?: string
  }
  onEditSKU?: (sku: StockLevel) => void
  skuActions?: unknown
}

export function InventoryTableView({ filters, onEditSKU, skuActions }: InventoryTableViewProps) {
  const { state, handlers } = useInventoryTable({ filters, onEditSKU, skuActions });

  const tableModel: InventoryTableViewModel = {
    ...state,
    ...handlers,
    columns: [
      { id: 'image', label: 'Ảnh', align: 'center' },
      { id: 'productName', label: 'Tên sản phẩm' },
      { id: 'sku', label: 'SKU' },
      { id: 'category', label: 'Phân loại' },
      { id: 'platformType', label: 'Loại sàn' },
      { id: 'actualStock', label: 'Tồn thực tế', align: 'right' },
      { id: 'available', label: 'Khả dụng', align: 'right' },
      { id: 'status', label: 'Trạng thái' },
      { id: 'forecast', label: 'Dự báo AI' },
    ],
  };

  return (
    <>
      <InventoryTable model={tableModel} />
      
      {state.activeSKU && (
        <>
          <SKUQRCodeModal 
            isOpen={state.modalType === 'QR'} 
            onClose={handlers.closeModal} 
            sku={state.activeSKU.sku} 
            productName={state.activeSKU.name} 
          />
          <SKUBatchManagement 
            isOpen={state.modalType === 'BATCH'} 
            onClose={handlers.closeModal} 
            sku={state.activeSKU.sku} 
            productName={state.activeSKU.name} 
            batches={state.extendedDetails.batches}
            isLoading={state.extendedDetails.isLoading}
          />
          <SKUReorderPointConfig 
            isOpen={state.modalType === 'REORDER'} 
            onClose={handlers.closeModal} 
            sku={state.activeSKU.sku} 
            productName={state.activeSKU.name} 
            initialConfig={state.extendedDetails.reorderConfig}
            onSave={state.extendedDetails.updateReorderConfig}
            isProcessing={state.extendedDetails.isLoading}
          />
          <SKUCostHistoryChart 
            isOpen={state.modalType === 'COST'} 
            onClose={handlers.closeModal} 
            sku={state.activeSKU.sku} 
            productName={state.activeSKU.name} 
            history={state.extendedDetails.costHistory}
            isLoading={state.extendedDetails.isLoading}
          />
        </>
      )}

      <ConfirmDialog
        open={!!state.itemToDelete}
        onOpenChange={(open) => {
          if (!open) handlers.onCancelDelete()
        }}
        onConfirm={handlers.onExecuteDelete}
        title={MESSAGES.CONFIRM.DELETE_TITLE}
        description={
          <>
            Bạn có chắc chắn muốn xóa <strong>{state.itemToDelete?.name}</strong>? Hành động này không thể hoàn tác.
          </>
        }
        isConfirming={state.crudState.isProcessing && state.crudState.actionType === 'deleting'}
      />
    </>
  );
}

