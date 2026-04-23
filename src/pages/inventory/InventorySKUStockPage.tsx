import { useInventorySKUStockPage } from '@/features/inventory/hooks/useInventorySKUStockPage'
import { InventorySKUStockPageView } from '@/features/inventory/components/inventory-sku-stock-page/InventorySKUStockPageView'

export function InventorySKUStockPage() {
  const model = useInventorySKUStockPage()
  return <InventorySKUStockPageView model={model} />
}




