import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowDownUp, ChevronDown, LayoutGrid, Table2, Check, Download, Settings2, Percent, Sparkles, Tags, Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { ProductStatusCounts } from '@/features/products/logic/productsListPage.types'

export type SortOption = 'price-asc' | 'price-desc' | 'inventory-desc' | 'revenue-desc' | 'name-asc' | 'newest'

interface ProductsFiltersProps {
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

function FilterSelect({ label, value, options, onChange, placeholder = "Tất cả" }: { label: string, value: string, options: {label: string, value: string}[], onChange: (val: string) => void, placeholder?: string }) {
  const displayValue = options.find(o => o.value === value)?.label || placeholder

  return (
    <div className="space-y-1.5 flex-1 min-w-[140px] max-w-[180px]">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none hover:bg-slate-50 transition-all data-[state=open]:border-indigo-200 data-[state=open]:ring-2 data-[state=open]:ring-indigo-100">
          <div className="flex flex-col items-start gap-0.5">
             <span className="text-[9px] font-black uppercase text-slate-400">{label}</span>
             <span className="truncate">{displayValue}</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
          <DropdownMenuItem
            className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold"
            onClick={() => onChange('')}
          >
            <span>{placeholder}</span>
            {value === '' && <Check className="h-4 w-4 text-indigo-600" />}
          </DropdownMenuItem>
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold"
              onClick={() => onChange(opt.value)}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check className="h-4 w-4 text-indigo-600" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function ProductsFilters({
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
  selectedCount,
  statusCounts,
  availableCategories,
  selectedCategory = '',
  selectedStatus = '',
  selectedPlatform = '',
  selectedSort = 'newest',
}: ProductsFiltersProps) {
  return (
    <div className="bg-card">
      {/* Quick Status Tabs */}
      <div className="flex items-center gap-8 px-6 pt-4 border-b border-border overflow-x-auto hide-scrollbar">
        <button onClick={() => onStatusChange('')} className={cn("px-1 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all", selectedStatus === '' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
          Tất cả sản phẩm <span className="ml-2 rounded-full bg-muted px-2.5 py-0.5 text-[10px] text-foreground/70">{statusCounts?.all ?? 0}</span>
        </button>
        <button onClick={() => onStatusChange('Active')} className={cn("px-1 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all", selectedStatus === 'Active' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
          Đang bán <span className="ml-2 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">{statusCounts?.active ?? 0}</span>
        </button>
        <button onClick={() => onStatusChange('Deleted')} className={cn("px-1 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all", selectedStatus === 'Deleted' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
          Hết hàng <span className="ml-2 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] text-rose-600 dark:text-rose-400">{statusCounts?.deleted ?? 0}</span>
        </button>
        <button onClick={() => onStatusChange('Inactive')} className={cn("px-1 py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all", selectedStatus === 'Inactive' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
          Tạm dừng <span className="ml-2 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] text-amber-600 dark:text-amber-400">{statusCounts?.inactive ?? 0}</span>
        </button>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-[320px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                aria-label="Tìm kiếm sản phẩm"
                placeholder="Tìm kiếm Tên sản phẩm, SKU..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-11 rounded-xl border border-input bg-background pl-10 pr-4 text-sm font-semibold text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <FilterSelect 
              label="Danh mục" 
              value={selectedCategory} 
              options={availableCategories.map(c => ({label: c, value: c}))} 
              onChange={onCategoryChange} 
            />
            <FilterSelect 
              label="Sàn thương mại" 
              value={selectedPlatform} 
              options={[
                {label: 'Shopee', value: 'shopee'},
                {label: 'TikTok Shop', value: 'tiktok_shop'},
                {label: 'Lazada', value: 'lazada'}
              ]} 
              onChange={onPlatformChange} 
            />
            
            {/* Advanced Filters Button */}
            <Button variant="outline" className="h-11 rounded-xl border-input bg-background px-4 text-xs font-bold text-foreground shadow-sm hover:bg-accent active:scale-95 transition-all">
              <SlidersHorizontal className="mr-2 size-4 text-muted-foreground" />
              Lọc nâng cao
            </Button>
          </div>

          <div className="flex items-center gap-4 border-l border-border pl-4">
            <div className="relative group">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-11 w-[180px] items-center justify-between rounded-xl border border-input bg-background px-3.5 text-xs font-bold text-foreground outline-none hover:bg-accent transition-all data-[state=open]:border-primary/50 data-[state=open]:ring-2 data-[state=open]:ring-primary/10">
                  <div className="flex flex-col items-start gap-0.5">
                     <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Sắp xếp theo</span>
                     <span className="truncate">{getSortLabel(selectedSort)}</span>
                  </div>
                  <ArrowDownUp className="h-4 w-4 text-muted-foreground shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] rounded-2xl border border-border bg-card p-1.5 shadow-xl">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold"
                      onClick={() => onSortChange(option.value)}
                    >
                      <span>{option.label}</span>
                      {selectedSort === option.value && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex h-11 rounded-xl bg-muted p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-9 w-9 rounded-lg transition-all active:scale-90", viewMode === 'table' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")} 
                onClick={() => onViewModeChange('table')}
              >
                <Table2 className="h-4.5 w-4.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-9 w-9 rounded-lg transition-all active:scale-90", viewMode === 'grid' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")} 
                onClick={() => onViewModeChange('grid')}
              >
                <LayoutGrid className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "flex items-center justify-between border-t border-border bg-primary/5 px-5 py-3 transition-all duration-300",
        selectedCount > 0 ? "opacity-100 translate-y-0 h-[60px]" : "opacity-0 -translate-y-2 pointer-events-none h-0 p-0 overflow-hidden border-none"
      )}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 border border-primary/20 shadow-sm">
            <Settings2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-primary">Đã chọn {selectedCount}</span>
          </div>
          <div className="flex gap-1.5">
            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[11px] font-bold text-foreground hover:bg-card hover:text-primary hover:shadow-sm transition-all" onClick={onBulkUpdatePrice}><Percent className="mr-1.5 size-3.5" /> Chỉnh giá</Button>
            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[11px] font-bold text-foreground hover:bg-card hover:text-primary hover:shadow-sm transition-all gap-1.5" onClick={onBulkSync}><Sparkles className="size-3.5 text-amber-500" /> SEO Hàng loạt</Button>
            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[11px] font-bold text-foreground hover:bg-card hover:text-primary hover:shadow-sm transition-all gap-1.5" onClick={onBulkPause}><Tags className="size-3.5" /> Gắn nhãn</Button>
            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[11px] font-bold text-foreground hover:bg-card hover:text-primary hover:shadow-sm transition-all" onClick={onBulkSync}>Đồng bộ sàn</Button>
            <div className="w-px h-4 bg-primary/20 mx-1 self-center" />
            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[11px] font-bold text-foreground hover:bg-card hover:text-primary hover:shadow-sm transition-all gap-2" onClick={onBulkExport}><Download className="w-3.5 h-3.5"/> Xuất báo cáo</Button>
            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[11px] font-bold text-destructive hover:bg-destructive/10 transition-all border border-transparent" onClick={onBulkDelete}>Xoá</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

