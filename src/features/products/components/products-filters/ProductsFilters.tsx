import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowDownUp, ChevronDown, LayoutGrid, Table2, Check, Download } from 'lucide-react'

export type SortOption = 'price-asc' | 'price-desc' | 'inventory-desc' | 'revenue-desc' | 'name-asc' | 'newest'

interface ProductsFiltersProps {
  viewMode: 'table' | 'grid'
  onViewModeChange: (mode: 'table' | 'grid') => void
  onStatusChange: (status: string) => void
  onCategoryChange: (category: string) => void
  onPlatformChange: (platform: string) => void
  onSortChange: (sortBy: SortOption) => void
  onBulkUpdatePrice: () => void
  onBulkSync: () => void
  onBulkPause: () => void
  onBulkDelete: () => void
  onBulkExport: () => void
  selectedCount: number
  selectedCategory?: string
  selectedStatus?: string
  selectedPlatform?: string
  selectedSort?: SortOption
}

const categories = ["Áo thun", "Váy nữ", "Quần nam", "Áo sơ mi", "Áo khoác", "Quần tây", "Đồ thể thao"];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Ngày tạo (Mới nhất)' },
  { value: 'price-asc', label: 'Giá (Thấp đến cao)' },
  { value: 'price-desc', label: 'Giá (Cao đến thấp)' },
  { value: 'inventory-desc', label: 'Tồn kho (Nhiều nhất)' },
  { value: 'revenue-desc', label: 'Doanh thu (Cao nhất)' },
  { value: 'name-asc', label: 'Tên (A-Z)' },
]

const getSortLabel = (value: ProductsFiltersProps['selectedSort']) => {
  return sortOptions.find((option) => option.value === value)?.label ?? 'Ngày tạo (Mới nhất)'
}

export function ProductsFilters({
  viewMode,
  onViewModeChange,
  onStatusChange,
  onCategoryChange,
  onPlatformChange,
  onSortChange,
  onBulkUpdatePrice,
  onBulkSync,
  onBulkPause,
  onBulkDelete,
  onBulkExport,
  selectedCount,
  selectedCategory = '',
  selectedStatus = '',
  selectedPlatform = '',
  selectedSort = 'newest',
}: ProductsFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto_auto]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[240px_1fr_1fr]">
            <div className="space-y-1.5">
              <p className="px-1 text-[10px] font-bold uppercase tracking-[0.5px] text-slate-400">Danh mục</p>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5">
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                >
                  <option value="">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="px-1 text-[10px] font-bold uppercase tracking-[0.5px] text-slate-400">Sàn thương mại</p>
              <div className="flex rounded-lg bg-slate-100 p-1">
                <Button variant={selectedPlatform === '' ? 'default' : 'ghost'} size="sm" className="h-9 flex-1 rounded-md" onClick={() => onPlatformChange('')}>Tất cả</Button>
                <Button variant={selectedPlatform === 'shopee' ? 'default' : 'ghost'} size="sm" className="h-9 flex-1 rounded-md" onClick={() => onPlatformChange('shopee')}>Shopee</Button>
                <Button variant={selectedPlatform === 'tiktok_shop' ? 'default' : 'ghost'} size="sm" className="h-9 flex-1 rounded-md" onClick={() => onPlatformChange('tiktok_shop')}>TikTok</Button>
                <Button variant={selectedPlatform === 'lazada' ? 'default' : 'ghost'} size="sm" className="h-9 flex-1 rounded-md" onClick={() => onPlatformChange('lazada')}>Lazada</Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="px-1 text-[10px] font-bold uppercase tracking-[0.5px] text-slate-400">Trạng thái</p>
              <div className="flex rounded-lg bg-slate-100 p-1">
                <Button variant={selectedStatus === '' ? 'default' : 'ghost'} size="sm" className="h-9 flex-1 rounded-md" onClick={() => onStatusChange('')}>Tất cả</Button>
                <Button variant={selectedStatus === 'Active' ? 'default' : 'ghost'} size="sm" className="h-9 flex-1 rounded-md text-emerald-600 data-[state=active]:text-emerald-600" onClick={() => onStatusChange('Active')}>Đang bán</Button>
                <Button variant={selectedStatus === 'Inactive' ? 'default' : 'ghost'} size="sm" className="h-9 flex-1 rounded-md" onClick={() => onStatusChange('Inactive')}>Tạm dừng</Button>
                <Button variant={selectedStatus === 'Deleted' ? 'default' : 'ghost'} size="sm" className="h-9 flex-1 rounded-md" onClick={() => onStatusChange('Deleted')}>Hết hàng</Button>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="w-[220px] space-y-1.5">
              <p className="px-1 text-[10px] font-bold uppercase tracking-[0.5px] text-slate-400">Sắp xếp</p>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none hover:bg-slate-100">
                  <span>{getSortLabel(selectedSort)}</span>
                  <ArrowDownUp className="h-4 w-4 text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px] rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm"
                      onClick={() => onSortChange(option.value)}
                    >
                      <span>{option.label}</span>
                      {selectedSort === option.value && <Check className="h-4 w-4 text-indigo-600" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex rounded-lg bg-slate-100 p-1">
              <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="icon" className="rounded-md" onClick={() => onViewModeChange('table')}>
                <Table2 className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="rounded-md" onClick={() => onViewModeChange('grid')}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[1.2px] text-slate-400">Thao tác hàng loạt:</span>
          <Button size="sm" variant="secondary" className="rounded-lg" disabled={selectedCount === 0} onClick={onBulkUpdatePrice}>Cập nhật giá</Button>
          <Button size="sm" variant="secondary" className="rounded-lg" disabled={selectedCount === 0} onClick={onBulkSync}>Đồng bộ sàn</Button>
          <Button size="sm" variant="secondary" className="rounded-lg" disabled={selectedCount === 0} onClick={onBulkPause}>Tạm dừng</Button>
          <Button size="sm" variant="secondary" className="rounded-lg gap-2" disabled={selectedCount === 0} onClick={onBulkExport}><Download className="w-3.5 h-3.5"/> Xuất Excel</Button>
          <Button size="sm" variant="destructive" className="rounded-lg" disabled={selectedCount === 0} onClick={onBulkDelete}>Xoá</Button>
        </div>
        <span className="text-sm text-slate-400">Đã chọn {selectedCount} sản phẩm</span>
      </div>
    </div>
  )
}
