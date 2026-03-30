import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import {
  formatDateKey,
  generateCalendarDays,
  isFutureDate,
  NAVBAR_WEEK_DAYS,
} from '@/components/layout/navbar/navbarDate.utils'

type NavbarDatePickerProps = {
  selectedDate: string
  onDateSelect: (value: string) => void
}

export function NavbarDatePicker({ selectedDate, onDateSelect }: NavbarDatePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  const handleDateClick = (day: number, futureDate: boolean) => {
    if (futureDate) {
      toast.warning('Khong the chon ngay trong tuong lai')
      return
    }

    const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    onDateSelect(formatDateKey(newDate))
    setTimeout(() => setShowDatePicker(false), 200)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setShowDatePicker((prev) => !prev)
          if (!showDatePicker) {
            setCalendarMonth(new Date(selectedDate + 'T00:00:00'))
          }
        }}
        className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 outline-none hover:bg-slate-50 focus:outline-none"
        aria-label="Choose date"
      >
        <CalendarDays className="size-[18px]" />
      </button>

      {showDatePicker && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] ring-1 ring-black/5 backdrop-blur-md">
          <div className="mb-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/70 px-2 py-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1),
                  )
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-slate-900"
              >
                <ChevronLeft className="size-4" />
              </button>
              <p className="text-sm font-semibold capitalize tracking-wide text-slate-900">
                {calendarMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
              </p>
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1),
                  )
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white hover:text-slate-900"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {NAVBAR_WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="h-8 w-8 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays(calendarMonth).map((day, index) => {
              const dateValue = day
                ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
                : null
              const dateString = dateValue ? formatDateKey(dateValue) : null
              const futureDate = dateValue ? isFutureDate(dateValue) : false
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => day && handleDateClick(day, futureDate)}
                  disabled={!day}
                  className={cn(
                    'h-8 w-8 rounded-lg text-xs font-medium transition-colors',
                    !day && 'cursor-default',
                    day && !futureDate && 'cursor-pointer text-slate-700 hover:bg-slate-100',
                    day && futureDate && 'cursor-not-allowed bg-slate-50 text-slate-300',
                    selectedDate === dateString && day && !futureDate
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300 hover:bg-indigo-700'
                      : day && !futureDate && 'text-slate-900',
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
