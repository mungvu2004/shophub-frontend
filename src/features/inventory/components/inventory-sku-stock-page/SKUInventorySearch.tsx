import { Search, Grid3X3, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export type ViewMode = 'table' | 'grid'

export type SKUInventorySearchProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  activeFilterCount?: number
}

export function SKUInventorySearch({
  searchValue,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeFilterCount = 0,
}: SKUInventorySearchProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Tìm SKU, tên sản phẩm, danh mục..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 border-slate-200 bg-white pl-9 placeholder:text-slate-400"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          {activeFilterCount > 0
            ? `Đang áp dụng ${activeFilterCount} bộ lọc cho dữ liệu tồn kho.`
            : 'Hiển thị toàn bộ dữ liệu tồn kho hiện tại.'}
        </p>

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className={`gap-1.5 ${viewMode === 'table' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-white'}`}
          >
            <List className="h-4 w-4" />
            <span className="text-xs font-medium">Bảng</span>
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={`gap-1.5 ${viewMode === 'grid' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'hover:bg-white'}`}
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="text-xs font-medium">Lưới</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
