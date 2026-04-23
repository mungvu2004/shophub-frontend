import { Badge } from '@/components/ui/badge'
import { InventoryTableView } from '@/features/inventory/components/inventory-table/InventoryTableView'
import { InventoryGridView } from '@/features/inventory/components/inventory-grid/InventoryGridView'
import { SKUInventoryHeader } from '@/features/inventory/components/inventory-sku-stock-page/SKUInventoryHeader'
import { SKUInventoryActions } from '@/features/inventory/components/inventory-sku-stock-page/SKUInventoryActions'
import { SKUInventorySearch } from '@/features/inventory/components/inventory-sku-stock-page/SKUInventorySearch'
import { SKUInventoryFilters } from '@/features/inventory/components/inventory-sku-stock-page/SKUInventoryFilters'
import { SKULowStockAlert } from '@/features/inventory/components/inventory-sku-stock-page/SKULowStockAlert'
import { SKUInventorySection } from '@/features/inventory/components/inventory-sku-stock-page/SKUInventorySection'
import type { useInventorySKUStockPage } from '@/features/inventory/hooks/useInventorySKUStockPage'

export type InventorySKUStockPageViewProps = {
  model: ReturnType<typeof useInventorySKUStockPage>
}

export function InventorySKUStockPageView({ model }: InventorySKUStockPageViewProps) {
  const {
    viewMode,
    filters,
    lowStockAlert,
    handleFilterChange,
    handleViewModeChange,
    handleAdjustStock,
    handleExportData,
    handleImportData,
  } = model

  const categoryOptions = [
    { value: 'electronics', label: 'Điện tử' },
    { value: 'clothing', label: 'Thời trang' },
    { value: 'home', label: 'Nhà cửa' },
  ]

  const platformOptions = [
    { value: 'shopee', label: 'Shopee' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'lazada', label: 'Lazada' },
  ]

  const statusOptions = [
    { value: 'in-stock', label: 'Còn hàng' },
    { value: 'low-stock', label: 'Tồn kho thấp' },
    { value: 'out-of-stock', label: 'Hết hàng' },
  ]

  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const totalSKUs = 1254

  const filterPayload = {
    search: filters.search,
    status: filters.status,
    category: filters.category,
    platform: filters.platform,
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="relative isolate px-5 py-5 md:px-7 md:py-7">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(14,116,144,0.14),_transparent_45%),radial-gradient(circle_at_top_left,_rgba(79,70,229,0.12),_transparent_42%)]" />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border border-indigo-200 bg-indigo-50 text-indigo-700">Kho vận</Badge>
                <Badge className="border border-sky-200 bg-sky-50 text-sky-700">Trang SKU Stock</Badge>
              </div>

              <div>
                <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-4xl">Quản lý Tồn kho SKU</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Theo dõi sức khỏe tồn kho toàn kênh, phát hiện SKU rủi ro sớm và thực hiện điều chỉnh nhanh theo từng nhóm sản phẩm.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white/90 p-3 text-xs text-slate-700">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">SKU đang theo dõi</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{totalSKUs}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Bộ lọc áp dụng</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{activeFilterCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <SKUInventoryHeader
              totalSKUs={totalSKUs}
              lowStockCount={lowStockAlert?.count ?? 0}
              totalValue="₫ 125,480,000"
              lastUpdated="10:30 AM"
            />
          </div>
        </div>
      </section>

      <SKUInventorySection
        title="Thao tác nhanh"
        description="Thực hiện điều chỉnh, xuất nhập dữ liệu và đồng bộ trạng thái tồn kho."
        tone="soft"
      >
        <SKUInventoryActions
          onAdjustStock={handleAdjustStock}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
      </SKUInventorySection>

      {lowStockAlert && lowStockAlert.count > 0 && (
        <SKULowStockAlert
          count={lowStockAlert.count}
          percentage={Math.round((lowStockAlert.count / totalSKUs) * 100)}
          onViewAlerts={lowStockAlert.onViewAlerts}
          onDismiss={lowStockAlert.onClose}
        />
      )}

      <SKUInventorySection
        title="Tìm kiếm và lọc dữ liệu"
        description="Thu hẹp tập SKU theo danh mục, kênh bán và trạng thái tồn kho."
      >
        <div className="space-y-4">
          <SKUInventorySearch
            searchValue={filters.search || ''}
            onSearchChange={(value) => handleFilterChange({ search: value })}
            viewMode={viewMode as 'table' | 'grid'}
            onViewModeChange={handleViewModeChange as (mode: 'table' | 'grid') => void}
            activeFilterCount={activeFilterCount}
          />

          <SKUInventoryFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            categoryOptions={categoryOptions}
            platformOptions={platformOptions}
            statusOptions={statusOptions}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </SKUInventorySection>

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
    </div>
  )
}
