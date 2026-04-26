import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { ProductsFilters } from './products-filters/ProductsFilters'
import { ProductsTable } from './products-table/ProductsTable'
import { ProductsCardList } from './products-list/ProductsCardList'
import { ProductFormDrawer } from './products-list/ProductFormDrawer'
import { ProductInsights } from './products-insights/ProductInsights'
import { ProductQuickStats } from './products-insights/ProductQuickStats'
import { Download, Plus, Package } from 'lucide-react'
import type { ProductsListViewModel } from '@/features/products/logic/productsListPage.types'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product.types'

interface ProductsListViewProps {
  model: ProductsListViewModel
}

function MiniStat({ label, value }: { label: string, value: string | number, tone?: 'indigo' | 'amber' | 'rose' }) {
  return (
    <div className="flex flex-col border-r border-slate-100 px-6 last:border-0">
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
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

  const handleBulkUpdatePrice = () => console.log('Bulk update price:', selectedProductIds)
  const handleBulkSync = () => console.log('Bulk sync:', selectedProductIds)
  const handleBulkPause = () => console.log('Bulk pause:', selectedProductIds)
  const handleBulkDelete = () => console.log('Bulk delete:', selectedProductIds)
  const handleBulkExport = () => console.log('Bulk export:', selectedProductIds)

  const handleOpenCreate = () => {
    setEditingProduct(null)
    setIsCreateModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsCreateModalOpen(true)
  }

  const handleDrawerClose = (open: boolean) => {
    setIsCreateModalOpen(open)
    if (!open) {
      setTimeout(() => setEditingProduct(null), 300) // Clear after animation
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Danh mục Sản phẩm</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Trung tâm điều phối & Hiệu suất bán hàng</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-card rounded-xl border border-border py-2 shadow-sm mr-2">
            <MiniStat label="Shopee" value={formatNumber(model.platformStats.shopee)} tone="amber" />
            <MiniStat label="TikTok" value={formatNumber(model.platformStats.tiktok_shop)} tone="rose" />
            <MiniStat label="Lazada" value={formatNumber(model.platformStats.lazada)} tone="indigo" />
          </div>
          
          <Button 
            variant="outline"
            className="h-10 rounded-xl bg-card border-border px-4 text-xs font-bold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all"
            onClick={() => console.log('Import Excel')}
          >
            <Download className="mr-2 size-4 rotate-180" />
            Nhập file
          </Button>
          <Button 
            className="h-10 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-xl hover:bg-primary/90 active:scale-95 transition-all"
            onClick={handleOpenCreate}
          >
            <Plus className="mr-2 size-4" />
            Sản phẩm mới
          </Button>
        </div>
      </header>

      {/* Insights Section */}
      <ProductQuickStats stats={model.quickStats} />
      <ProductInsights data={model.insightsData} />

      {/* Main Content Area: Data Hub */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden dark:bg-card/50">
        <ProductsFilters
          searchValue={model.state.searchValue}
          onSearchChange={model.onSearchChange}
          viewMode={model.state.viewMode}
          onViewModeChange={model.onViewModeChange}
          onStatusChange={model.onStatusChange}
          onCategoryChange={model.onCategoryChange}
          onPlatformChange={model.onPlatformChange}
          onSortChange={model.onSortChange}
          onBulkUpdatePrice={handleBulkUpdatePrice}
          onBulkSync={handleBulkSync}
          onBulkPause={handleBulkPause}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          selectedCount={selectedProductIds.length}
          statusCounts={model.statusCounts}
          availableCategories={model.availableCategories}
          selectedCategory={model.state.selectedCategory}
          selectedStatus={model.state.selectedStatus}
          selectedPlatform={model.state.selectedPlatform}
          selectedSort={model.state.sortBy}
        />

        <div className="p-2">
          <div className={cn(model.state.viewMode === 'grid' ? 'hidden' : 'hidden md:block')}>
            <ProductsTable
              products={model.products}
              onEdit={handleEditProduct}
              onDelete={model.onDelete}
              onViewVariants={model.onViewVariants}
              onSelectionChange={setSelectedProductIds}
            />
          </div>
          <div className={cn(model.state.viewMode === 'table' ? 'block md:hidden' : 'block')}>
            <ProductsCardList
              products={model.products}
              isLoading={model.isLoading}
              onEdit={handleEditProduct}
              onView={model.onViewVariants}
            />
          </div>
        </div>

        {/* Improved Pagination Footer */}
        <div className="flex flex-col gap-4 border-t border-border bg-muted/30 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-1.5 shadow-sm">
                <Package className="size-3.5 text-primary" />
                <span className="text-[10px] font-bold text-foreground">
                  Tổng {formatNumber(model.totalCount)} mặt hàng
                </span>
             </div>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
               Trang {model.state.currentPage} / {Math.ceil(model.totalCount / model.state.pageSize)}
             </p>
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

      <ProductFormDrawer 
        open={isCreateModalOpen} 
        onOpenChange={handleDrawerClose} 
        onSave={model.onSaveProduct}
        availablePlatforms={model.availablePlatforms}
        product={editingProduct}
      />
    </div>
  )
}
