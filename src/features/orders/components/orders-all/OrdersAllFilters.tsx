import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { OrderPlatformFilter, OrdersAllAdvancedFilters, OrdersAllPlatformOption } from '@/features/orders/logic/ordersAll.types'
import {
  formatDateKey,
  generateCalendarDays,
  isFutureDate,
  NAVBAR_WEEK_DAYS,
} from '@/components/layout/navbar/navbarDate.utils'

type OrdersAllFiltersProps = {
  search: string
  platform: OrderPlatformFilter
  platformOptions: OrdersAllPlatformOption[]
  isTodayActive: boolean
  isLast7DaysActive: boolean
  advancedFilters: OrdersAllAdvancedFilters
  advancedFilterCount: number
  onSearchChange: (value: string) => void
  onPlatformChange: (value: OrderPlatformFilter) => void
  onTodayToggle: () => void
  onLast7DaysToggle: () => void
  onAdvancedFiltersApply: (filters: OrdersAllAdvancedFilters) => void
  onAdvancedFiltersReset: () => void
}

type DateFieldPickerProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function formatDisplayDate(value: string) {
  if (!value) return '--/--/----'

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return '--/--/----'

  return date.toLocaleDateString('vi-VN')
}

function DateFieldPicker({ label, value, onChange, placeholder = 'Chọn ngày' }: DateFieldPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    if (!value) return new Date()
    const parsed = new Date(`${value}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed
  })

  useEffect(() => {
    if (!isOpen || !value) return

    const parsed = new Date(`${value}T00:00:00`)
    if (!Number.isNaN(parsed.getTime())) {
      setCalendarMonth(parsed)
    }
  }, [isOpen, value])

  const selectedDateKey = useMemo(() => value || '', [value])

  const handleDayClick = (day: number | null) => {
    if (!day) return

    const nextDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    if (isFutureDate(nextDate)) return

    onChange(formatDateKey(nextDate))
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-left text-sm transition-colors hover:bg-slate-50',
          isOpen && 'border-indigo-300 ring-2 ring-indigo-100',
        )}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="truncate text-sm font-semibold text-slate-800">{value ? formatDisplayDate(value) : placeholder}</p>
        </div>
        <CalendarDays className="size-4 shrink-0 text-slate-400" />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] ring-1 ring-black/5 backdrop-blur-md">
          <div className="mb-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/70 px-2 py-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-slate-900"
              >
                <ChevronLeft className="size-4" />
              </button>
              <p className="text-sm font-semibold capitalize tracking-wide text-slate-900">
                {calendarMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
              </p>
              <button
                type="button"
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-slate-900"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {NAVBAR_WEEK_DAYS.map((day) => (
              <div key={day} className="h-8 w-8 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays(calendarMonth).map((day, index) => {
              const dateValue = day ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day) : null
              const dateKey = dateValue ? formatDateKey(dateValue) : null
              const futureDate = dateValue ? isFutureDate(dateValue) : false
              const isSelected = dateKey === selectedDateKey

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={!day}
                  className={cn(
                    'h-8 w-8 rounded-lg text-xs font-medium transition-colors',
                    !day && 'cursor-default',
                    day && !futureDate && 'cursor-pointer text-slate-700 hover:bg-slate-100',
                    day && futureDate && 'cursor-not-allowed bg-slate-50 text-slate-300',
                    isSelected && day && !futureDate ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300 hover:bg-indigo-700' : '',
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <Button type="button" variant="ghost" size="sm" className="h-8 px-3 text-slate-600" onClick={() => setIsOpen(false)}>
              Đóng
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
            >
              Xóa
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function OrdersAllFilters({
  search,
  platform,
  platformOptions,
  isTodayActive,
  isLast7DaysActive,
  advancedFilters,
  advancedFilterCount,
  onSearchChange,
  onPlatformChange,
  onTodayToggle,
  onLast7DaysToggle,
  onAdvancedFiltersApply,
  onAdvancedFiltersReset,
}: OrdersAllFiltersProps) {
  const allOption = platformOptions.find((item) => item.value === 'all')
  const quickPlatforms = platformOptions.filter((item) => item.value !== 'all')
  const isAllActive = platform === 'all'
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<OrdersAllAdvancedFilters>(advancedFilters)

  useEffect(() => {
    if (isAdvancedOpen) {
      setDraftFilters(advancedFilters)
    }
  }, [advancedFilters, isAdvancedOpen])

  const handleOpenAdvancedFilters = () => {
    setDraftFilters(advancedFilters)
    setIsAdvancedOpen(true)
  }

  const handleApplyAdvancedFilters = () => {
    onAdvancedFiltersApply(draftFilters)
    setIsAdvancedOpen(false)
  }

  const handleResetAdvancedFilters = () => {
    const clearedFilters: OrdersAllAdvancedFilters = {
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
    }

    setDraftFilters(clearedFilters)
    onAdvancedFiltersReset()
    setIsAdvancedOpen(false)
  }

  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-[360px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder="Tìm mã đơn, tên khách hàng..."
            className="h-9 rounded-lg border-slate-200 bg-slate-50 pl-9 text-[14px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPlatformChange('all')}
            className={`h-8 rounded-full px-4 text-[12px] font-bold ${
              isAllActive ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            {allOption?.label ?? 'Tất cả'}
          </button>

          {quickPlatforms.map((item) => {
            const isActive = platform === item.value
            const dotClass = item.value === 'shopee' ? 'bg-orange-500' : item.value === 'lazada' ? 'bg-blue-600' : 'bg-black'

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onPlatformChange(item.value)}
                className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-4 text-[12px] font-semibold ${
                  isActive ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                {item.label}
              </button>
            )
          })}

          <button
            type="button"
            onClick={onTodayToggle}
            className={`h-8 rounded-lg border px-4 text-[12px] font-semibold ${
              isTodayActive
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            Hôm nay
          </button>

          <button
            type="button"
            onClick={onLast7DaysToggle}
            className={`h-8 rounded-lg border px-4 text-[12px] font-semibold ${
              isLast7DaysActive
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            7 ngày qua
          </button>

          <button
            type="button"
            onClick={handleOpenAdvancedFilters}
            className={`h-8 rounded-lg px-2 text-[12px] font-bold ${
              advancedFilterCount > 0 ? 'text-indigo-700' : 'text-indigo-600'
            }`}
          >
            Tùy chọn ngày {advancedFilterCount > 0 ? `(${advancedFilterCount})` : ''}
          </button>
        </div>
      </section>

      <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Bộ lọc nâng cao</DialogTitle>
            <DialogDescription>Lọc theo khoảng ngày và biên độ giá trị đơn hàng.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <DateFieldPicker
              label="Từ ngày"
              value={draftFilters.dateFrom}
              onChange={(value) => setDraftFilters((current) => ({ ...current, dateFrom: value }))}
              placeholder="Chọn ngày bắt đầu"
            />
            <DateFieldPicker
              label="Đến ngày"
              value={draftFilters.dateTo}
              onChange={(value) => setDraftFilters((current) => ({ ...current, dateTo: value }))}
              placeholder="Chọn ngày kết thúc"
            />
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Giá trị từ</span>
              <Input
                type="number"
                min="0"
                value={draftFilters.minAmount}
                onChange={(event) => setDraftFilters((current) => ({ ...current, minAmount: event.currentTarget.value }))}
                placeholder="0"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Giá trị đến</span>
              <Input
                type="number"
                min="0"
                value={draftFilters.maxAmount}
                onChange={(event) => setDraftFilters((current) => ({ ...current, maxAmount: event.currentTarget.value }))}
                placeholder="0"
              />
            </label>
          </div>

          <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleResetAdvancedFilters}>
              Xóa bộ lọc
            </Button>
            <Button type="button" className="w-full sm:w-auto" onClick={handleApplyAdvancedFilters}>
              Áp dụng bộ lọc
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
