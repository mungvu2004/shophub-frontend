import { InventoryTableView } from '@/features/inventory/components/inventory-table/InventoryTableView'
import { InventoryGridView } from '@/features/inventory/components/inventory-grid/InventoryGridView'
import { SKUInventoryHeader } from '@/features/inventory/components/inventory-sku-stock-page/SKUInventoryHeader'
import { SKUInventoryActions } from '@/features/inventory/components/inventory-sku-stock-page/SKUInventoryActions'
import { SKULowStockAlert } from '@/features/inventory/components/inventory-sku-stock-page/SKULowStockAlert'
import { SKUInventorySection } from '@/features/inventory/components/inventory-sku-stock-page/SKUInventorySection'
import { BulkImportModal } from '@/features/inventory/components/inventory-sku-stock-page/BulkImportModal'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'
import type { useInventorySKUStockPage } from '@/features/inventory/hooks/useInventorySKUStockPage'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

export type InventorySKUStockPageViewProps = {
  model: ReturnType<typeof useInventorySKUStockPage>
}

export function InventorySKUStockPageView({ model }: InventorySKUStockPageViewProps) {
  const {
    viewMode,
    filters,
    lowStockAlert,
    bulkImport,
    totalSKUs,
    lowStockCount,
    totalValue,
    lastUpdated,
    handleAdjustStock,
    handleExportData,
    handleImportData,
    handleAddSKU,
  } = model

  const activeFilterCount = Object.values(filters).filter(Boolean).flat().length

  const filterPayload = {
    search: filters.search,
    status: filters.status?.join(','),
    category: filters.category?.join(','),
    platform: filters.platform?.join(','),
  }

  return (
    <div className="space-y-6 pb-10">
      <BulkImportModal model={bulkImport} />
      
      {/* Page Header - Tích hợp ThemedPageHeader */}
      <ThemedPageHeader
        title="Quản lý Tồn kho SKU"
        subtitle="Theo dõi sức khỏe tồn kho đa kênh và dự báo rủi ro hàng hóa"
        theme="inventory"
        badge={{ text: 'Inventory', icon: <Package className="size-3.5" /> }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-stretch gap-4">
            <div className="bg-white/80 px-5 py-3 rounded-xl border border-emerald-200/50 min-w-[120px] text-center shadow-sm backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">SKU theo dõi</p>
              <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{totalSKUs.toLocaleString()}</p>
            </div>
            <div className="bg-white/80 px-5 py-3 rounded-xl border border-emerald-200/50 min-w-[120px] text-center shadow-sm backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Bộ lọc active</p>
              <div className="flex items-baseline justify-center gap-1">
                <p className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{activeFilterCount}</p>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Mục</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleAddSKU}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 h-[76px] shadow-sm shadow-emerald-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm SKU
          </Button>
        </div>
      </ThemedPageHeader>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <SKUInventoryHeader
          totalSKUs={totalSKUs}
          lowStockCount={lowStockCount}
          totalValue={totalValue}
          lastUpdated={lastUpdated}
        />
      </div>

      {/* Stats & Actions Section */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <SKUInventorySection
            title="Thao tác nhanh"
            description="Xuất nhập dữ liệu và đồng bộ trạng thái tồn kho."
            tone="soft"
          >
            <SKUInventoryActions
              onAdjustStock={handleAdjustStock}
              onExportData={handleExportData}
              onImportData={handleImportData}
            />
          </SKUInventorySection>
        </div>

        <div className="xl:col-span-2">
          {lowStockAlert && lowStockAlert.count > 0 ? (
            <SKULowStockAlert
              count={lowStockAlert.count}
              percentage={Math.round((lowStockAlert.count / totalSKUs) * 100)}
              onViewAlerts={lowStockAlert.onViewAlerts}
              onDismiss={lowStockAlert.onClose}
            />
          ) : (
            <div className="h-full rounded-xl border border-success-100 bg-success-50/50 p-6 flex flex-col justify-center items-center text-center">
              <div className="size-10 rounded-full bg-success-100 flex items-center justify-center text-success-600 mb-3">
                <Package className="size-5" />
              </div>
              <h4 className="text-sm font-bold text-success-900 uppercase tracking-widest">Kho an toàn</h4>
              <p className="text-xs text-success-700 mt-1">Không có SKU nào ở mức cảnh báo</p>
            </div>
          )}
        </div>
      </div>


      <section id="inventory-data-section">
        <SKUInventorySection
          title={viewMode === 'table' ? 'Danh sách SKU dạng bảng' : 'Danh sách SKU dạng lưới'}
          description="Dữ liệu được cập nhật theo bộ lọc và từ khóa tìm kiếm hiện tại."
        >
          {viewMode === 'table' ? (
            <InventoryTableView filters={filterPayload} />
          ) : (
            <InventoryGridView filters={filterPayload} />
          )}
        </SKUInventorySection>
      </section>
    </div>
  )
}