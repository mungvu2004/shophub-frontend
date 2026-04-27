import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { ProductsFilters } from './products-filters/ProductsFilters'
import { ProductsTable } from './products-table/ProductsTable'
import { ProductsCardList } from './products-list/ProductsCardList'
import { ProductFormDrawer } from './products-list/ProductFormDrawer'
import { ProductInsights } from './products-insights/ProductInsights'
import { ProductQuickStats } from './products-insights/ProductQuickStats'
import { Download, Plus, PackageSearch } from 'lucide-react'
import type { ProductsListViewModel } from '@/features/products/logic/productsListPage.types'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product.types'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

interface ProductsListViewProps {
  model: ProductsListViewModel
}

function MiniStat({ label, value, tone }: { label: string, value: string | number, tone?: 'indigo' | 'amber' | 'rose' }) {
  return (
    <div className="flex flex-col border-r border-slate-100 px-6 last:border-0">
      <div className="flex items-center gap-1.5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</p>
        {tone && <div className={cn("size-1.5 rounded-full", tone === 'indigo' ? 'bg-indigo-500' : tone === 'amber' ? 'bg-orange-500' : 'bg-slate-900')} />}
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-sm font-bold font-mono text-slate-900">{value}</span>
      </div>
    </div>
  )
}

export function ProductsListView({ model }: ProductsListViewProps) {
  const formatNumber = (value: number) => value.toLocaleString('vi-VN')
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setIsCreateModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsCreateModalOpen(true)
  }

  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedProductIds(ids)
    model.onSelectionChange(ids)
  }, [model])

  const handleDrawerClose = (open: boolean) => {
    setIsCreateModalOpen(open)
    if (!open) {
      setTimeout(() => setEditingProduct(null), 300)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ThemedPageHeader
        title="Danh mục Sản phẩm"
        subtitle="Trung tâm điều phối & Hiệu suất bán hàng"
        theme="products"
        badge={{ text: 'Product Catalog', icon: <PackageSearch className="size-3.5" /> }}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="hidden lg:flex items-center bg-white/80 backdrop-blur rounded-xl border border-sky-200/50 py-2 shadow-sm mr-2" aria-label="Thống kê theo sàn">
            <MiniStat label="Shopee" value={formatNumber(model.platformStats.shopee)} tone="amber" />
            <MiniStat label="TikTok" value={formatNumber(model.platformStats.tiktok_shop)} tone="rose" />
            <MiniStat label="Lazada" value={formatNumber(model.platformStats.lazada)} tone="indigo" />
          </div>
          
          <Button 
            variant="outline"
            className="h-10 rounded-xl bg-white/80 backdrop-blur border-sky-200/50 px-4 text-xs font-bold text-sky-900 shadow-sm hover:bg-white hover:text-sky-700 active:scale-95 transition-all"
            onClick={model.onImportExcel}
            aria-label="Nhập dữ liệu từ file Excel"
          >
            <Download className="mr-2 size-4 rotate-180" />
            Nhập file
          </Button>
          <Button 
            className="h-10 rounded-xl bg-sky-600 px-5 text-xs font-bold text-white shadow-xl hover:bg-sky-700 active:scale-95 transition-all"
            onClick={handleOpenCreate}
            aria-label="Thêm sản phẩm mới"
          >
            <Plus className="mr-2 size-4" />
            Sản phẩm mới
          </Button>
        </div>
      </ThemedPageHeader>

      <div className="mt-6 flex flex-1 gap-6 relative">
        <aside className="hidden xl:block w-64 shrink-0 space-y-6">
          <div className="sticky top-6">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Điều khiển luồng</h3>
              <ProductsFilters
                isSidebar
                searchValue={model.state.searchValue}
                onSearchChange={model.onSearchChange}
                viewMode={model.state.viewMode}
                onViewModeChange={model.onViewModeChange}
                onStatusChange={model.onStatusChange}
                onCategoryChange={model.onCategoryChange}
                onPlatformChange={model.onPlatformChange}
                onSortChange={model.onSortChange}
                onBulkUpdatePrice={model.onBulkUpdatePrice}
                onBulkSync={model.onBulkSync}
                onBulkPause={model.onBulkPause}
                onBulkDelete={model.onBulkDelete}
                onBulkExport={model.onBulkExport}
                onToggleAdvancedFilters={model.onToggleAdvancedFilters}
                selectedCount={selectedProductIds.length}
                statusCounts={model.statusCounts}
                availableCategories={model.availableCategories}
                selectedCategory={model.state.selectedCategory}
                selectedStatus={model.state.selectedStatus}
                selectedPlatform={model.state.selectedPlatform}
                selectedSort={model.state.sortBy}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-primary/5 p-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Thông tin nhanh</h3>
              <ProductQuickStats stats={model.quickStats} isCompact />
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
            <div className="flex-1">
               <ProductsFilters
                 searchValue={model.state.searchValue}
                 onSearchChange={model.onSearchChange}
                 viewMode={model.state.viewMode}
                 onViewModeChange={model.onViewModeChange}
                 onStatusChange={model.onStatusChange}
                 onCategoryChange={model.onCategoryChange}
                 onPlatformChange={model.onPlatformChange}
                 onSortChange={model.onSortChange}
                 onBulkUpdatePrice={model.onBulkUpdatePrice}
                 onBulkSync={model.onBulkSync}
                 onBulkPause={model.onBulkPause}
                 onBulkDelete={model.onBulkDelete}
                 onBulkExport={model.onBulkExport}
                 onToggleAdvancedFilters={model.onToggleAdvancedFilters}
                 selectedCount={selectedProductIds.length}
                 statusCounts={model.statusCounts}
                 availableCategories={model.availableCategories}
                 selectedCategory={model.state.selectedCategory}
                 selectedStatus={model.state.selectedStatus}
                 selectedPlatform={model.state.selectedPlatform}
                 selectedSort={model.state.sortBy}
               />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-2 shadow-sm overflow-hidden h-[120px]">
             <ProductInsights data={model.insightsData} isCondensed />
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden relative mb-6 lg:mb-0">
            <div className="p-1 pb-16 md:pb-0"> 
              <div className={cn(model.state.viewMode === 'grid' ? 'hidden' : 'block')}>
                <ProductsTable
                  products={model.products}
                  onEdit={handleEditProduct}
                  onDelete={model.onDelete}
                  onViewVariants={model.onViewVariants}
                  onSelectionChange={handleSelectionChange}
                />
              </div>
              <div className={cn(model.state.viewMode === 'table' ? 'hidden' : 'block')}>
                <ProductsCardList
                  products={model.products}
                  isLoading={model.isLoading}
                  onEdit={handleEditProduct}
                  onView={model.onViewVariants}
                />
              </div>
            </div>

            <div className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-md px-6 py-3">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    Trang {model.state.currentPage} / {model.totalPages}
                  </span>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-[11px] font-bold text-foreground">
                    {formatNumber(model.totalCount)} Kết quả
                  </span>
                </div>
                
                <Pagination
                  currentPage={model.state.currentPage}
                  totalCount={model.totalCount}
                  pageSize={model.state.pageSize}
                  onPageChange={model.onPageChange}
                  onPageSizeChange={model.onPageSizeChange}
                  pageSizeOptions={[10, 20, 50]}
                  compact
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <ProductFormDrawer 
        open={isCreateModalOpen} 
        onOpenChange={handleDrawerClose} 
        onSave={model.onSaveProduct}
        product={editingProduct}
      />
    </div>
  )
}
