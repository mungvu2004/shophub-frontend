import { InventoryStockAdjustmentPageView } from '@/features/inventory/components/inventory-stock-adjustment-page/InventoryStockAdjustmentPageView'
import { useInventoryStockAdjustmentPage } from '@/features/inventory/hooks/useInventoryStockAdjustmentPage'

export function InventoryStockAdjustmentPage() {
  const model = useInventoryStockAdjustmentPage()
  return <InventoryStockAdjustmentPageView model={model} />
}
