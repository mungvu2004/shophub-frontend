import { useState } from 'react'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type {
  OrdersPendingActionsDateFilters,
  OrdersPendingActionsPlatformFilter,
  OrdersPendingActionsPlatformOption,
  OrdersPendingActionsSlaFilter,
  OrdersPendingActionsSlaOption,
} from '@/features/orders/logic/ordersPendingActions.types'

type OrdersPendingActionsFiltersProps = {
  search: string
  platform: OrdersPendingActionsPlatformFilter
  sla: OrdersPendingActionsSlaFilter
  dateFilters: OrdersPendingActionsDateFilters
  isTodayActive: boolean
  isLast7DaysActive: boolean
  platformOptions: OrdersPendingActionsPlatformOption[]
  slaOptions: OrdersPendingActionsSlaOption[]
  onSearchChange: (value: string) => void
  onPlatformChange: (value: OrdersPendingActionsPlatformFilter) => void
  onSlaChange: (value: OrdersPendingActionsSlaFilter) => void
  onTodayToggle: () => void
  onLast7DaysToggle: () => void
  onDateFiltersApply: (filters: OrdersPendingActionsDateFilters) => void
  onDateFiltersReset: () => void
}

export function OrdersPendingActionsFilters({
  search,
  platform,
  sla,
  dateFilters,
  isTodayActive,
  isLast7DaysActive,
  platformOptions,
  slaOptions,
  onSearchChange,
  onPlatformChange,
  onSlaChange,
  onTodayToggle,
  onLast7DaysToggle,
  onDateFiltersApply,
  onDateFiltersReset,
}: OrdersPendingActionsFiltersProps) {
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false)
  const [draftDateFilters, setDraftDateFilters] = useState<OrdersPendingActionsDateFilters>(dateFilters)

  const [prevIsDateDialogOpen, setPrevIsDateDialogOpen] = useState(isDateDialogOpen)
  const [prevDateFilters, setPrevDateFilters] = useState(dateFilters)

  if (isDateDialogOpen !== prevIsDateDialogOpen || dateFilters !== prevDateFilters) {
    setPrevIsDateDialogOpen(isDateDialogOpen)
    setPrevDateFilters(dateFilters)
    if (isDateDialogOpen) {
      setDraftDateFilters(dateFilters)
    }
  }

  return (
    <>
      <section className="space-y-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
        <div className="relative w-full max-w-[380px]">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder="Tìm mã đơn, khách hàng, sản phẩm..."
            className="h-9 rounded-lg border-slate-200 bg-slate-50 pl-9 text-[14px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/35 p-2">
          {platformOptions.map((option) => {
            const active = platform === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onPlatformChange(option.value)}
                className={`h-8 rounded-full px-4 text-xs font-semibold ${
                  active ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2">
          {slaOptions.map((option) => {
            const active = sla === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSlaChange(option.value)}
                className={`h-8 rounded-md px-3 text-xs font-semibold ${
                  active ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600'
                }`}
              >
                {option.label}
              </button>
            )
          })}

          <button
            type="button"
            onClick={onTodayToggle}
            className={`h-8 rounded-md px-3 text-xs font-semibold ${
              isTodayActive ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            Hôm nay
          </button>

          <button
            type="button"
            onClick={onLast7DaysToggle}
            className={`h-8 rounded-md px-3 text-xs font-semibold ${
              isLast7DaysActive ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            7 ngày qua
          </button>

          <button
            type="button"
            onClick={() => setIsDateDialogOpen(true)}
            className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-indigo-600"
          >
            Tùy chọn ngày
          </button>
        </div>
      </section>

      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Bộ lọc thời gian</DialogTitle>
            <DialogDescription>Chọn khoảng thời gian để khoanh vùng đơn cần xử lý.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Từ ngày</span>
              <Input
                type="date"
                value={draftDateFilters.dateFrom}
                onChange={(event) => setDraftDateFilters((current) => ({ ...current, dateFrom: event.currentTarget.value }))}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Đến ngày</span>
              <Input
                type="date"
                value={draftDateFilters.dateTo}
                onChange={(event) => setDraftDateFilters((current) => ({ ...current, dateTo: event.currentTarget.value }))}
              />
            </label>
          </div>

          <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                onDateFiltersReset()
                setIsDateDialogOpen(false)
              }}
            >
              Xóa bộ lọc
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => {
                onDateFiltersApply(draftDateFilters)
                setIsDateDialogOpen(false)
              }}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
