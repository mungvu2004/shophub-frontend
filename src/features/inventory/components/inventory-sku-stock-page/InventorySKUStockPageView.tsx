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
    categoryOptions,
    handleFilterChange,
    handleViewModeChange,
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
      
      {/* Page Header - Đồng bộ với Revenue Summary */}
      <header className="rounded-xl border border-secondary-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-secondary-900 leading-tight">Quản lý Tồn kho SKU</h1>
            <p className="text-sm text-secondary-500 font-medium">Theo dõi sức khỏe tồn kho đa kênh và dự báo rủi ro hàng hóa</p>
            
            <div className="flex items-center gap-3 pt-3">
              <Button 
                onClick={handleAddSKU}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg px-6 shadow-sm shadow-primary-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm SKU mới
              </Button>
            </div>
          </div>

          <div className="flex items-stretch gap-4">
            <div className="bg-secondary-50 px-5 py-4 rounded-xl border border-secondary-100 min-w-[140px] text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-400 mb-1">SKU theo dõi</p>
              <p className="text-2xl font-bold text-secondary-900 font-mono tracking-tight">{totalSKUs.toLocaleString()}</p>
            </div>
            <div className="bg-secondary-50 px-5 py-4 rounded-xl border border-secondary-100 min-w-[140px] text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-400 mb-1">Bộ lọc active</p>
              <div className="flex items-baseline justify-center gap-1">
                <p className="text-2xl font-bold text-secondary-900 font-mono tracking-tight">{activeFilterCount}</p>
                <span className="text-[10px] font-bold text-secondary-500 uppercase">Mục</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-secondary-100">
          <SKUInventoryHeader
            totalSKUs={totalSKUs}
            lowStockCount={lowStockCount}
            totalValue={totalValue}
            lastUpdated={lastUpdated}
          />
        </div>
      </header>

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
ếm hiện tại."
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
