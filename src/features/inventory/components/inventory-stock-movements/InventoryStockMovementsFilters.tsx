import { Search, User } from 'lucide-react'

import type {
  InventoryStockMovementGroupFilter,
  InventoryStockMovementPlatformFilter,
} from '@/features/inventory/logic/inventoryStockMovements.types'

type InventoryStockMovementsFiltersProps = {
  search: string
  platform: InventoryStockMovementPlatformFilter
  movementGroup: InventoryStockMovementGroupFilter
  warehouseId: string
  performerId: string
  platformOptions: Array<{ id: InventoryStockMovementPlatformFilter; label: string }>
  groupOptions: Array<{ id: InventoryStockMovementGroupFilter; label: string }>
  warehouseOptions: Array<{ id: string; label: string }>
  performerOptions: Array<{ id: string; label: string }>
  onSearchChange: (value: string) => void
  onPlatformChange: (value: InventoryStockMovementPlatformFilter) => void
  onMovementGroupChange: (value: InventoryStockMovementGroupFilter) => void
  onWarehouseChange: (value: string) => void
  onPerformerChange: (value: string) => void
}

export function InventoryStockMovementsFilters({
  search,
  platform,
  movementGroup,
  warehouseId,
  performerId,
  platformOptions,
  groupOptions,
  warehouseOptions,
  performerOptions,
  onSearchChange,
  onPlatformChange,
  onMovementGroupChange,
  onWarehouseChange,
  onPerformerChange,
}: InventoryStockMovementsFiltersProps) {
  return (
    <section className="space-y-4 rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder="Tìm SKU, tên sản phẩm, ghi chú..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
          />
        </div>

        <div className="relative min-w-[240px]">
          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <select
            value={performerId}
            onChange={(event) => onPerformerChange(event.currentTarget.value)}
            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
          >
            {performerOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l border-slate-200 pl-2">
            <svg className="size-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.8fr]">
        <div className="space-y-2">
          <p className="px-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Nguồn dữ liệu</p>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onPlatformChange(option.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  platform === option.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="px-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Tính chất nghiệp vụ</p>
          <div className="flex flex-wrap gap-2">
            {groupOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onMovementGroupChange(option.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  movementGroup === option.id ? 'bg-indigo-50 text-[#3525cd] ring-1 ring-indigo-200 shadow-sm shadow-indigo-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="px-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Vị trí kho</p>
          <div className="relative">
            <select
              value={warehouseId}
              onChange={(event) => onWarehouseChange(event.currentTarget.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
            >
              <option value="all">Tất cả kho vật lý</option>
              {warehouseOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
               <svg className="size-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
