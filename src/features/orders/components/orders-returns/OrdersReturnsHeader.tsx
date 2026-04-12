import { CalendarRange } from 'lucide-react'

import { Button } from '@/components/ui/button'

type OrdersReturnsHeaderProps = {
  title: string
  subtitle: string
  dateRangeLabel: string
  isRefreshing: boolean
}

export function OrdersReturnsHeader({ title, subtitle, dateRangeLabel, isRefreshing }: OrdersReturnsHeaderProps) {
  return (
    <section className="rounded-xl bg-white px-6 py-4 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[22px] font-bold leading-[33px] tracking-[-0.55px] text-[#111c2d]">{title}</h1>
          <p className="text-[16px] leading-6 text-[#464555]">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" className="h-10 rounded-lg border-slate-200 bg-white px-4 text-[14px] font-semibold text-[#111c2d]">
            <CalendarRange className="size-4" />
            {dateRangeLabel}
          </Button>
          <Button type="button" variant="outline" className="h-10 rounded-lg border-indigo-300 bg-white px-4 text-[14px] font-bold text-indigo-700">
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {isRefreshing ? <p className="mt-2 text-[11px] font-semibold text-slate-400">Đang cập nhật dữ liệu...</p> : null}
    </section>
  )
}
