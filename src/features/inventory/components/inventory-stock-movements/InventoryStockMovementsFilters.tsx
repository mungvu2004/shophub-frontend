import { Search } from 'lucide-react'

import type {
  InventoryStockMovementGroupFilter,
  InventoryStockMovementPlatformFilter,
} from '@/features/inventory/logic/inventoryStockMovements.types'

type InventoryStockMovementsFiltersProps = {
  search: string
  platform: InventoryStockMovementPlatformFilter
  movementGroup: InventoryStockMovementGroupFilter
  warehouseId: string
  platformOptions: Array<{ id: InventoryStockMovementPlatformFilter; label: string }>
  groupOptions: Array<{ id: InventoryStockMovementGroupFilter; label: string }>
  warehouseOptions: Array<{ id: string; label: string }>
  onSearchChange: (value: string) => void
  onPlatformChange: (value: InventoryStockMovementPlatformFilter) => void
  onMovementGroupChange: (value: InventoryStockMovementGroupFilter) => void
  onWarehouseChange: (value: string) => void
}

export function InventoryStockMovementsFilters({
  search,
  platform,
  movementGroup,
  warehouseId,
  platformOptions,
  groupOptions,
  warehouseOptions,
  onSearchChange,
  onPlatformChange,
  onMovementGroupChange,
  onWarehouseChange,
}: InventoryStockMovementsFiltersProps) {
  return (
    <section className="space-y-4 rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          placeholder="Tìm SKU, tên sản phẩm, kho, ghi chú..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1.3fr_0.9fr]">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Sàn</p>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onPlatformChange(option.id)}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  platform === option.id ? 'bg-[#3525cd] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Nhóm biến động</p>
          <div className="flex flex-wrap gap-2">
            {groupOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onMovementGroupChange(option.id)}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  movementGroup === option.id ? 'bg-indigo-50 text-[#3525cd] ring-1 ring-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Kho</p>
          <select
            value={warehouseId}
            onChange={(event) => onWarehouseChange(event.currentTarget.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
          >
            <option value="">Tất cả kho</option>
            {warehouseOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}