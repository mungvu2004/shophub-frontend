import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type FilterOptions = {
  category?: string
  platform?: string
  status?: string
}

export type SKUInventoryFiltersProps = {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  categoryOptions?: Array<{ value: string; label: string }>
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

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      category: filters.category === category ? undefined : category,
    })
  }

  const handlePlatformChange = (platform: string) => {
    onFilterChange({
      platform: filters.platform === platform ? undefined : platform,
    })
  }

  const handleStatusChange = (status: string) => {
    onFilterChange({
      status: filters.status === status ? undefined : status,
    })
  }

  const clearAllFilters = () => {
    onFilterChange({ category: undefined, platform: undefined, status: undefined })
  }

  const chipBaseClass =
    'rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:border-slate-300'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-700" />
          <p className="text-sm font-semibold text-slate-900">Bộ lọc nâng cao</p>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 border border-slate-200 bg-white text-slate-700">
              {activeFilterCount} bộ lọc
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs text-slate-600 hover:text-slate-900"
          >
            <X className="h-3 w-3" />
            <span className="ml-1">Xóa tất cả</span>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categoryOptions.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Danh mục</p>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCategoryChange(option.value)}
                  className={`${chipBaseClass} ${
                    filters.category === option.value
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {platformOptions.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nền tảng</p>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePlatformChange(option.value)}
                  className={`${chipBaseClass} ${
                    filters.platform === option.value
                      ? 'border-sky-300 bg-sky-50 text-sky-700'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {statusOptions.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`${chipBaseClass} ${
                    filters.status === option.value
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
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
