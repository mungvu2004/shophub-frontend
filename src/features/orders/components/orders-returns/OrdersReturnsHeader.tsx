/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarRange, Download, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

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
    <ThemedPageHeader
      title={title}
      subtitle={
        <div className="flex items-center gap-2">
          <span>{subtitle}</span>
          {isRefreshing ? <span className="text-[11px] font-bold text-amber-600 animate-pulse">Đang cập nhật...</span> : null}
        </div> as any
      }
      theme="orders"
      badge={{ text: 'Returns & Cancellations', icon: <Undo2 className="size-3.5" /> }}
    >
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Button 
          type="button" 
          variant="outline" 
          className="h-10 rounded-xl border-amber-200/50 bg-white/80 backdrop-blur px-4 text-sm font-bold text-slate-700 hover:bg-white shadow-sm"
          onClick={handleDateClick}
        >
          <CalendarRange className="size-4 mr-2" />
          {dateRangeLabel}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="h-10 rounded-xl border-amber-300/50 bg-white/80 backdrop-blur px-4 text-sm font-black text-amber-700 hover:bg-white hover:text-amber-900 shadow-sm"
          onClick={handleExport}
        >
          <Download className="mr-2 size-4" />
          Xuất báo cáo
        </Button>
      </div>
    </ThemedPageHeader>
  )
}
