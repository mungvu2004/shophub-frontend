import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type FilterOptions = {
  category?: string[]
  platform?: string[]
  status?: string[]
}

export type SKUInventoryFiltersProps = {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  categoryOptions?: string[]
  platformOptions?: Array<{ value: string; label: string }>
  statusOptions?: Array<{ value: string; label: string }>
  activeFilterCount?: number
}

export function SKUInventoryFilters({
  filters,
  onFilterChange,
  categoryOptions = [],
  platformOptions = [],
  statusOptions = [],
  activeFilterCount = 0,
}: SKUInventoryFiltersProps) {
  const hasActiveFilters = activeFilterCount > 0

  const toggleFilter = (key: keyof FilterOptions, value: string) => {
    const currentValues = filters[key] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    onFilterChange({
      ...filters,
      [key]: newValues.length > 0 ? newValues : undefined
    })
  }

  const clearAllFilters = () => {
    onFilterChange({ category: undefined, platform: undefined, status: undefined })
  }

  const chipBaseClass =
    'rounded-lg border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-sm'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-700" />
          <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Bộ lọc nâng cao</p>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 border-indigo-100 bg-indigo-50 text-indigo-700">
              {activeFilterCount} tiêu chí
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span className="ml-1">Xóa tất cả</span>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categoryOptions.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Danh mục hàng hóa</p>
            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto scrollbar-thin">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleFilter('category', cat)}
                  className={cn(chipBaseClass, 
                    filters.category?.includes(cat)
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-indigo-200'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {platformOptions.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Nền tảng bán hàng</p>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFilter('platform', option.value)}
                  className={cn(chipBaseClass,
                    filters.platform?.includes(option.value)
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-indigo-200'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {statusOptions.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3">Trạng thái tồn kho</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleFilter('status', option.value)}
                  className={cn(chipBaseClass,
                    filters.status?.includes(option.value)
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-indigo-200'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

