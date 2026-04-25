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
    <div className="rounded-2xl bg-white shadow-xl shadow-indigo-100/20 border border-indigo-100/50 overflow-hidden">
      {/* Search Section */}
      <div className="px-6 py-5 bg-gradient-to-br from-indigo-50/80 via-white to-white border-b border-indigo-100/30">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
          <input
            type="text"
            role="searchbox"
            aria-label="Tìm kiếm SKU hoặc tên sản phẩm"
            placeholder="Tìm kiếm SKU hoặc tên sản phẩm..."
            value={model.searchQuery}
            onChange={(e) => model.onSearchChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-indigo-100 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-6 py-4 flex items-center flex-wrap gap-6 bg-white">
        {/* Category Dropdown */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Danh mục hàng</span>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="min-w-[180px] h-10 justify-between bg-white hover:bg-indigo-50 border-slate-200 rounded-xl font-black text-slate-800 transition-all outline-none focus:ring-2 focus:ring-indigo-500/20" aria-label="Chọn danh mục sản phẩm" />}>
              <span className="truncate text-sm">{selectedCategory?.label || 'Tất cả danh mục'}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[220px] rounded-xl shadow-2xl p-1.5">
              {model.categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => model.onCategoryChange(category.id)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg font-bold text-slate-700 focus:bg-indigo-50 focus:text-indigo-700"
                >
                  <span>{category.label}</span>
                  {model.selectedCategory === category.id ? <Check className="h-4 w-4 text-indigo-600 stroke-[3]" /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Kênh bán hàng</span>
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50" role="tablist">
            {model.platforms.map((platform) => (
              <button
                key={platform.id}
                role="tab"
                aria-selected={model.selectedPlatform === platform.id}
                onClick={() => model.onPlatformChange(platform.id)}
                className={`px-4 py-2 text-xs font-black rounded-lg transition-all duration-300 ${
                  model.selectedPlatform === platform.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-y-[-1px]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1">Trạng thái kho</span>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="min-w-[200px] h-10 justify-between bg-white hover:bg-indigo-50 border-slate-200 rounded-xl font-black text-slate-800 transition-all outline-none focus:ring-2 focus:ring-indigo-500/20" aria-label="Lọc theo trạng thái tồn kho" />}>
              <span className="truncate text-sm">{selectedStatus?.label || 'Tất cả trạng thái'}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[220px] rounded-xl shadow-2xl p-1.5">
              {model.statuses.map((status) => (
                <DropdownMenuItem
                  key={status.id}
                  onClick={() => model.onStatusChange(status.id)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg font-bold text-slate-700 focus:bg-indigo-50 focus:text-indigo-700"
                >
                  <span>{status.label}</span>
                  {model.selectedStatus === status.id ? <Check className="h-4 w-4 text-indigo-600 stroke-[3]" /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

