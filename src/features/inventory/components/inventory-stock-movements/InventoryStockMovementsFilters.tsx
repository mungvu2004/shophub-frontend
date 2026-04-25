import { Search, User, MapPin, Check, ChevronLeft, ChevronRight, CalendarDays, SlidersHorizontal } from 'lucide-react'
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
        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-500 truncate">{displayDate}</span>
      </button>

      {show && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-secondary-100 bg-white p-4 shadow-xl ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
              className="flex size-7 items-center justify-center rounded-lg hover:bg-secondary-50"
            >
              <ChevronLeft className="size-4 text-secondary-400" />
            </button>
            <p className="text-xs font-bold text-secondary-900">
              {calendarMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
            </p>
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
              className="flex size-7 items-center justify-center rounded-lg hover:bg-secondary-50"
            >
              <ChevronRight className="size-4 text-secondary-400" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {NAVBAR_WEEK_DAYS.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-secondary-300 uppercase">{day}</div>
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
                    isSelected ? "bg-primary-600 text-white shadow-md shadow-primary-100" : "hover:bg-secondary-50 text-secondary-600",
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
    <section className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="relative flex-[1.5]">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-secondary-400" />
          <input
            id="movement-search"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder="Tìm SKU, sản phẩm..."
            className="h-11 w-full rounded-2xl border border-secondary-100 bg-white pl-11 pr-4 text-sm font-medium text-secondary-900 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-50 shadow-sm"
          />
        </div>

        <div className="flex flex-1 items-center gap-1 bg-white p-1 rounded-2xl border border-secondary-100 shadow-sm">
          <MovementDatePicker 
            label="Từ ngày" 
            selectedDate={fromDate} 
            onDateSelect={setFromDate}
            icon={<CalendarDays className="size-3.5 text-secondary-400" />}
          />
          <div className="size-1 shrink-0 rounded-full bg-secondary-100" />
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
                  className="h-11 flex-1 rounded-2xl border-secondary-100 bg-white text-[11px] font-black uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 transition-all shadow-sm"
                >
                  <MapPin className="mr-2 size-3.5 text-secondary-400" />
                  <span className="truncate">{selectedWarehouse}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-[200px] rounded-[20px] p-2 shadow-xl border-secondary-100 bg-white/95 backdrop-blur-xl">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">Chọn kho</div>
              <DropdownMenuSeparator className="bg-secondary-100" />
              <DropdownMenuItem onClick={() => onWarehouseChange('all')} className="rounded-xl flex items-center justify-between cursor-pointer text-sm font-semibold text-secondary-700 hover:bg-primary-50 hover:text-primary-700 p-2.5 transition-colors">
                Tất cả kho {warehouseId === 'all' && <Check className="size-3.5 text-primary-600" />}
              </DropdownMenuItem>
              {warehouseOptions.map((option) => (
                <DropdownMenuItem key={option.id} onClick={() => onWarehouseChange(option.id)} className="rounded-xl flex items-center justify-between cursor-pointer text-sm font-semibold text-secondary-700 hover:bg-primary-50 hover:text-primary-700 p-2.5 transition-colors">
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
                  className="h-11 flex-1 rounded-2xl border-secondary-100 bg-white text-[11px] font-black uppercase tracking-widest text-secondary-600 hover:bg-secondary-50 transition-all shadow-sm"
                >
                  <User className="mr-2 size-3.5 text-secondary-400" />
                  <span className="truncate">{selectedPerformer}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-[200px] rounded-[20px] p-2 shadow-xl border-secondary-100 bg-white/95 backdrop-blur-xl">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">Người thực hiện</div>
              <DropdownMenuSeparator className="bg-secondary-100" />
              <DropdownMenuItem onClick={() => onPerformerChange('all')} className="rounded-xl flex items-center justify-between cursor-pointer text-sm font-semibold text-secondary-700 hover:bg-primary-50 hover:text-primary-700 p-2.5 transition-colors">
                Tất cả {performerId === 'all' && <Check className="size-3.5 text-primary-600" />}
              </DropdownMenuItem>
              {performerOptions.map((option) => (
                <DropdownMenuItem key={option.id} onClick={() => onPerformerChange(option.id)} className="rounded-xl flex items-center justify-between cursor-pointer text-sm font-semibold text-secondary-700 hover:bg-primary-50 hover:text-primary-700 p-2.5 transition-colors">
                  {option.label} {performerId === option.id && <Check className="size-3.5 text-primary-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between px-2">
        <div className="flex items-center gap-8">
           <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">
                 <SlidersHorizontal className="size-3" />
                 <span>Nền tảng</span>
              </div>
              <div className="flex flex-wrap gap-2">
                 {platformOptions.map((option) => (
                    <button
                       key={option.id}
                       type="button"
                       onClick={() => onPlatformChange(option.id)}
                       className={cn(
                          'rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all border',
                          platform === option.id 
                             ? 'bg-secondary-900 text-white border-secondary-900 shadow-md' 
                             : 'bg-white text-secondary-500 border-secondary-100 hover:border-secondary-300'
                       )}
                    >
                       {option.label}
                    </button>
                 ))}
              </div>
           </div>

           <div className="h-10 w-px bg-secondary-100 hidden xl:block" />

           <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">
                 <div className="size-1.5 rounded-full bg-primary-500" />
                 <span>Nghiệp vụ</span>
              </div>
              <div className="flex flex-wrap gap-2">
                 {groupOptions.map((option) => (
                    <button
                       key={option.id}
                       type="button"
                       onClick={() => onMovementGroupChange(option.id)}
                       className={cn(
                          'rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all border',
                          movementGroup === option.id 
                             ? 'bg-primary-600 text-white border-primary-600 shadow-md ring-4 ring-primary-50' 
                             : 'bg-white text-secondary-500 border-secondary-100 hover:border-secondary-300'
                       )}
                    >
                       {option.label}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}
