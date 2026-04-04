import { Search, ChevronDown } from 'lucide-react'
import type { InventoryFilterModel } from '@/features/inventory/logic/inventoryFilter.types'

type InventoryFilterBarProps = {
  model: InventoryFilterModel
}

export function InventoryFilterBar({ model }: InventoryFilterBarProps) {
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
      <div className="px-5 py-3 flex items-center gap-4">
        {/* Category Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-slate-900 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors">
            Tất cả danh mục
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>

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

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2">
          {model.statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => model.onStatusChange(status.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                model.selectedStatus === status.id
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
