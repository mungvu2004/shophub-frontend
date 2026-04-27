import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowDownUp, ChevronDown, LayoutGrid, Table2, Check, Settings2, Search, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLATFORM_CONFIG } from '../../constants/platformConfig'

import type { ProductStatusCounts, SortOption } from '@/features/products/logic/productsListPage.types'

interface ProductsFiltersProps {
  isSidebar?: boolean
  isToolbarOnly?: boolean
  searchValue: string
  onSearchChange: (search: string) => void
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
  onToggleAdvancedFilters: () => void
  selectedCount: number
  statusCounts: ProductStatusCounts
  availableCategories: string[]
  selectedCategory?: string
  selectedStatus?: string
  selectedPlatform?: string
  selectedSort?: SortOption
}

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
  isSidebar,
  searchValue,
  onSearchChange,
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
  onToggleAdvancedFilters,
  selectedCount,
  statusCounts,
  availableCategories,
  selectedCategory = '',
  selectedStatus = '',
  selectedPlatform = '',
  selectedSort = 'newest',
}: ProductsFiltersProps) {
  if (isSidebar) {
    return (
      <div className="flex flex-col gap-6">
        {/* Status Vertical List */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 px-2">Trạng thái</p>
          {[
            { id: '', label: 'Tất cả', count: statusCounts?.all ?? 0 },
            { id: 'Active', label: 'Đang bán', count: statusCounts?.active ?? 0, color: 'bg-emerald-500' },
            { id: 'Deleted', label: 'Hết hàng', count: statusCounts?.deleted ?? 0, color: 'bg-rose-500' },
            { id: 'Inactive', label: 'Tạm dừng', count: statusCounts?.inactive ?? 0, color: 'bg-amber-500' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => onStatusChange(s.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                selectedStatus === s.id ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                {s.color && <div className={cn("size-1.5 rounded-full", s.color)} />}
                {s.label}
              </div>
              <span className={cn("text-[10px]", selectedStatus === s.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {s.count}
              </span>
            </button>
          ))}
        </div>

        {/* Platforms Vertical List */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 px-2">Sàn thương mại</p>
          <div className="space-y-0.5">
            <button
              onClick={() => onPlatformChange('')}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all",
                selectedPlatform === '' ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <div className="size-1.5 rounded-full bg-slate-300" />
              Tất cả sàn
            </button>
            {Object.entries(PLATFORM_CONFIG).map(([id, config]) => (
              <button
                key={id}
                onClick={() => onPlatformChange(id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all",
                  selectedPlatform === id ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <div className={cn("size-1.5 rounded-full", config.color)} />
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Vertical List */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 px-2">Danh mục</p>
          <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-0.5">
            <button
              onClick={() => onCategoryChange('')}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                selectedCategory === '' ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              <span>Tất cả danh mục</span>
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                  selectedCategory === cat ? "bg-accent text-foreground shadow-sm" : "text-muted-foreground hover:bg-accent/50"
                )}
              >
                <span className="truncate">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên, SKU..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 rounded-xl bg-muted/50 border-none pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchValue && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="h-10 rounded-xl border-border bg-card px-4 text-xs font-bold hover:bg-accent outline-none"
          onClick={onToggleAdvancedFilters}
        >
          <SlidersHorizontal className="mr-2 size-3.5 text-muted-foreground" />
          Lọc
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-bold hover:bg-accent outline-none">
            <ArrowDownUp className="size-3.5 text-muted-foreground" />
            <span>{getSortLabel(selectedSort)}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl shadow-2xl border-border w-[200px] p-1.5">
            {sortOptions.map((opt) => (
              <DropdownMenuItem key={opt.value} onClick={() => onSortChange(opt.value)} className="font-bold text-xs rounded-lg">
                {opt.label}
                {selectedSort === opt.value && <Check className="ml-auto size-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 rounded-md", viewMode === 'table' ? "bg-card shadow-sm" : "text-muted-foreground")}
            onClick={() => onViewModeChange('table')}
          >
            <Table2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 rounded-md", viewMode === 'grid' ? "bg-card shadow-sm" : "text-muted-foreground")}
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions Integrated into Toolbar */}
      <div className={cn(
        "flex items-center gap-2 transition-all duration-500",
        selectedCount > 0 ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0 pointer-events-none"
      )}>
        <span className="text-[10px] font-black text-primary uppercase mr-2 bg-primary/10 px-2 py-1 rounded-md">
          {selectedCount} đã chọn
        </span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-9 rounded-xl font-bold text-xs" onClick={onBulkUpdatePrice}>Chỉnh giá</Button>
          <Button variant="outline" size="sm" className="h-9 rounded-xl font-bold text-xs" onClick={onBulkSync}>Đồng bộ</Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-xs font-bold hover:bg-accent outline-none">
              <Settings2 className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl shadow-xl w-[160px] p-1.5">
              <DropdownMenuItem onClick={onBulkPause} className="text-xs font-bold rounded-lg">Tạm dừng</DropdownMenuItem>
              <DropdownMenuItem onClick={onBulkExport} className="text-xs font-bold rounded-lg">Xuất báo cáo</DropdownMenuItem>
              <DropdownMenuItem onClick={onBulkDelete} className="text-xs font-bold text-destructive rounded-lg">Xóa hàng loạt</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
