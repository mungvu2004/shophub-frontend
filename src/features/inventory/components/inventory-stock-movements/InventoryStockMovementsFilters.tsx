import { Search, User, MapPin, Check, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  formatDateKey,
  generateCalendarDays,
  isFutureDate,
  NAVBAR_WEEK_DAYS,
} from '@/components/layout/navbar/navbarDate.utils'

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

function MovementDatePicker({ 
  selectedDate, 
  onDateSelect, 
  label, 
  icon 
}: { 
  selectedDate: string; 
  onDateSelect: (val: string) => void;
  label: string;
  icon?: React.ReactNode;
}) {
  const [show, setShow] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayDate = selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit'
  }) : label

  return (
    <div className="relative flex-1" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setShow(!show)
          if (!show && selectedDate) {
            setCalendarMonth(new Date(selectedDate + 'T00:00:00'))
          }
        }}
        className="flex h-9 w-full items-center gap-2 rounded-xl px-2 transition-colors hover:bg-white"
      >
        {icon || <div className="size-3.5" />}
        <span className="text-[10px] font-black uppercase text-slate-600 truncate">{displayDate}</span>
      </button>

      {show && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
              className="flex size-7 items-center justify-center rounded-lg hover:bg-slate-100"
            >
              <ChevronLeft className="size-4 text-slate-500" />
            </button>
            <p className="text-xs font-bold text-slate-700">
              {calendarMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
            </p>
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
              className="flex size-7 items-center justify-center rounded-lg hover:bg-slate-100"
            >
              <ChevronRight className="size-4 text-slate-500" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {NAVBAR_WEEK_DAYS.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays(calendarMonth).map((day, index) => {
              if (!day) return <div key={index} />
              
              const dateObj = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
              const dateKey = formatDateKey(dateObj)
              const isSelected = selectedDate === dateKey
              const future = isFutureDate(dateObj)

              return (
                <button
                  key={index}
                  type="button"
                  disabled={future}
                  onClick={() => {
                    onDateSelect(dateKey)
                    setShow(false)
                  }}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-all",
                    isSelected ? "bg-primary-600 text-white shadow-md shadow-primary-100" : "hover:bg-slate-100 text-slate-600",
                    future && "opacity-20 cursor-not-allowed"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
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
  const selectedWarehouse = warehouseOptions.find(o => o.id === warehouseId)?.label || 'Tất cả kho'
  const selectedPerformer = performerOptions.find(o => o.id === performerId)?.label || 'Người thực hiện'
  
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  return (
    <section className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="relative flex-[1.5]">
          <label htmlFor="movement-search" className="sr-only">Tìm kiếm biến động kho</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            id="movement-search"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder="Tìm SKU, sản phẩm..."
            className="h-11 w-full rounded-2xl border border-slate-100 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-primary-300 focus:bg-white"
          />
        </div>

        <div className="flex flex-1 items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:border-primary-100 transition-all">
          <MovementDatePicker 
            label="Từ ngày" 
            selectedDate={fromDate} 
            onDateSelect={setFromDate}
            icon={<CalendarDays className="size-3.5 text-slate-400" />}
          />
          <div className="size-1 shrink-0 rounded-full bg-slate-200" />
          <MovementDatePicker 
            label="Đến ngày" 
            selectedDate={toDate} 
            onDateSelect={setToDate} 
          />
        </div>

        <div className="flex flex-1 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-2xl border-slate-100 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-white"
                >
                  <MapPin className="mr-2 size-3.5 text-slate-400" />
                  <span className="truncate">{selectedWarehouse}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 shadow-xl border-slate-100 bg-white">
              <div className="px-2 py-1.5 mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Chọn kho vật lý</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onWarehouseChange('all')} className="rounded-xl flex items-center justify-between cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-50 p-2 transition-colors">
                Tất cả kho {warehouseId === 'all' && <Check className="size-3.5 text-primary-600" />}
              </DropdownMenuItem>
              {warehouseOptions.map((option) => (
                <DropdownMenuItem key={option.id} onClick={() => onWarehouseChange(option.id)} className="rounded-xl flex items-center justify-between cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-50 p-2 transition-colors">
                  {option.label} {warehouseId === option.id && <Check className="size-3.5 text-primary-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-11 flex-1 rounded-2xl border-slate-100 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-white"
                >
                  <User className="mr-2 size-3.5 text-slate-400" />
                  <span className="truncate">{selectedPerformer}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 shadow-xl border-slate-100 bg-white">
              <div className="px-2 py-1.5 mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Người thực hiện</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onPerformerChange('all')} className="rounded-xl flex items-center justify-between cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-50 p-2 transition-colors">
                Tất cả {performerId === 'all' && <Check className="size-3.5 text-primary-600" />}
              </DropdownMenuItem>
              {performerOptions.map((option) => (
                <DropdownMenuItem key={option.id} onClick={() => onPerformerChange(option.id)} className="rounded-xl flex items-center justify-between cursor-pointer text-sm font-medium text-slate-600 hover:bg-slate-50 p-2 transition-colors">
                  {option.label} {performerId === option.id && <Check className="size-3.5 text-primary-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <label className="px-1 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Nguồn dữ liệu</label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo nền tảng">
            {platformOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onPlatformChange(option.id)}
                aria-pressed={platform === option.id}
                className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  platform === option.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="px-1 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Tính chất nghiệp vụ</label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo nhóm biến động">
            {groupOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onMovementGroupChange(option.id)}
                aria-pressed={movementGroup === option.id}
                className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  movementGroup === option.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-100 ring-2 ring-primary-100' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
