import { Search, ChevronDown, Check } from 'lucide-react'
import type { InventoryFilterModel } from '@/features/inventory/logic/inventoryFilter.types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type InventoryFilterBarProps = {
  model: InventoryFilterModel
}

export function InventoryFilterBar({ model }: InventoryFilterBarProps) {
  const selectedCategory = model.categories.find((category) => category.id === model.selectedCategory)
  const selectedStatus = model.statuses.find((status) => status.id === model.selectedStatus)

  return (
    <div className="rounded-xl bg-white shadow-sm p-0">
      {/* Search Section */}
      <div className="px-5 py-3.5 border-b border-slate-200">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            value={model.searchQuery}
            onChange={(e) => model.onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-indigo-50 border border-transparent rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-5 py-3 flex items-center flex-wrap gap-4">
        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" className="min-w-[200px] justify-between bg-indigo-50 hover:bg-indigo-100 border-transparent" />}>
            <span className="truncate text-sm">{selectedCategory?.label || 'Tất cả danh mục'}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[220px]">
            {model.categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => model.onCategoryChange(category.id)}
                className="flex items-center justify-between"
              >
                <span>{category.label}</span>
                {model.selectedCategory === category.id ? <Check className="h-3.5 w-3.5 text-indigo-600" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1 bg-indigo-50 p-1 rounded-lg">
          {model.platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => model.onPlatformChange(platform.id)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                model.selectedPlatform === platform.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" className="min-w-[210px] justify-between bg-indigo-50 hover:bg-indigo-100 border-transparent" />}>
            <span className="truncate text-sm">Trạng thái: {selectedStatus?.label || 'Tất cả'}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[220px]">
            {model.statuses.map((status) => (
              <DropdownMenuItem
                key={status.id}
                onClick={() => model.onStatusChange(status.id)}
                className="flex items-center justify-between"
              >
                <span>{status.label}</span>
                {model.selectedStatus === status.id ? <Check className="h-3.5 w-3.5 text-indigo-600" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
