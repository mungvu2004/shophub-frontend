import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { ProductsFilters } from './products-filters/ProductsFilters'
import { ProductsTable } from './products-table/ProductsTable'
import { ProductsCardList } from './products-list/ProductsCardList'
import { ProductCreateModal } from './products-list/ProductCreateModal'
import { Download, RefreshCw, Plus } from 'lucide-react'
import type { ProductsListViewModel } from '@/features/products/logic/productsListPage.types'
import { useState } from 'react'

interface ProductsListViewProps {
  model: ProductsListViewModel
}

export function ProductsListView({ model }: ProductsListViewProps) {
  const formatNumber = (value: number) => value.toLocaleString('vi-VN')
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleBulkUpdatePrice = () => {
    console.log('Bulk update price:', selectedProductIds)
  }

  const handleBulkSync = () => {
    console.log('Bulk sync:', selectedProductIds)
  }

  const handleBulkPause = () => {
    console.log('Bulk pause:', selectedProductIds)
  }

  const handleBulkDelete = () => {
    console.log('Bulk delete:', selectedProductIds)
  }

  const handleBulkExport = () => {
    console.log('Bulk export:', selectedProductIds)
  }

  return (
    <div className="space-y-6">
      {/* Header Section + Action Buttons (Single Block) */}
      <div className="flex items-start justify-between rounded-xl bg-white border border-slate-100 px-4 py-3 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold">Quản lý Sản phẩm</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              Tổng số sản phẩm: <strong className="text-gray-900">{formatNumber(model.totalCount)} sản phẩm</strong>
            </span>
            <span className="text-red-600">Shopee: <strong>{formatNumber(model.platformStats.shopee)}</strong></span>
            <span className="text-gray-900">TikTok: <strong>{formatNumber(model.platformStats.tiktok_shop)}</strong></span>
            <span className="text-yellow-600">Lazada: <strong>{formatNumber(model.platformStats.lazada)}</strong></span>
            <span className="flex items-center gap-1 text-green-600">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              (đồng bộ 2 phút trước)
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Nhập Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Đồng bộ từ sàn
          </Button>
          <Button 
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <ProductsFilters
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
        selectedCategory={model.state.selectedCategory}
        selectedStatus={model.state.selectedStatus}
        selectedPlatform={model.state.selectedPlatform}
        selectedSort={model.state.sortBy}
      />

      {model.state.viewMode === 'table' ? (
        <ProductsTable
          products={model.products}
          isLoading={model.isLoading}
          onEdit={model.onEdit}
          onDelete={model.onDelete}
          onViewVariants={model.onViewVariants}
          onSelectionChange={setSelectedProductIds}
        />
      ) : (
        <ProductsCardList
          products={model.products}
          isLoading={model.isLoading}
          onEdit={model.onEdit}
          onView={model.onViewVariants}
        />
      )}

      <div className="pt-2">
        <div className="min-w-[420px]">
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

      <ProductCreateModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />
    </div>
  )
}
