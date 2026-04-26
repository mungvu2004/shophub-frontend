import { CalendarRange, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type OrdersReturnsHeaderProps = {
  title: string
  subtitle: string
  dateRangeLabel: string
  isRefreshing: boolean
}

export function OrdersReturnsHeader({ title, subtitle, dateRangeLabel, isRefreshing }: OrdersReturnsHeaderProps) {
  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Đang chuẩn bị dữ liệu báo cáo...',
        success: 'Đã xuất báo cáo hoàn/hủy thành công (Excel)',
        error: 'Có lỗi xảy ra khi xuất báo cáo',
      }
    )
  }

  const handleDateClick = () => {
    toast.info(`Tính năng chọn ngày đang được nâng cấp cho khoảng ${dateRangeLabel}`)
  }

  return (
    <section className="rounded-xl border border-slate-100 bg-white bg-abstract-geometric px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[22px] font-bold leading-[33px] tracking-[-0.55px] text-slate-900 dark:text-slate-100">{title}</h1>
          <p className="text-[16px] leading-6 text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            className="h-11 rounded-lg border-slate-200 bg-white px-4 text-[14px] font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:h-10"
            onClick={handleDateClick}
          >
            <CalendarRange className="size-4" />
            {dateRangeLabel}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="h-11 rounded-lg border-indigo-300 bg-white px-4 text-[14px] font-bold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/20 dark:text-indigo-400 md:h-10"
            onClick={handleExport}
          >
            <Download className="mr-2 size-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {isRefreshing ? <p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Đang cập nhật dữ liệu...</p> : null}
    </section>
  )
}
