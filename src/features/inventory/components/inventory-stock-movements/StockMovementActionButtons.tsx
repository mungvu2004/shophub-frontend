import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type StockMovementActionButtonsProps = {
  onImport: () => void
  onExport: () => void
}

export function StockMovementActionButtons({ onImport, onExport }: StockMovementActionButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onImport}
        className="h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(5,150,105,0.2)] hover:bg-emerald-700"
      >
        <ArrowDownLeft className="mr-2 size-4" />
        Nhập kho
      </Button>
      <Button
        onClick={onExport}
        className="h-11 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(225,29,72,0.2)] hover:bg-rose-700"
      >
        <ArrowUpRight className="mr-2 size-4" />
        Xuất kho
      </Button>
    </div>
  )
}
