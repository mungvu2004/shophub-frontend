import { History, Sparkles, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'

type DynamicPricingHeaderProps = {
  subtitle: string
  onOpenHistory: () => void
  onApplyAll: () => void
}

export function DynamicPricingHeader({ subtitle, onOpenHistory, onApplyAll }: DynamicPricingHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Định giá Động</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Sparkles className="h-4 w-4 text-indigo-500" aria-hidden />
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="h-10 px-4 text-slate-600 hover:bg-slate-100"
          onClick={onOpenHistory}
        >
          <History className="h-4 w-4" aria-hidden />
          Lịch sử thay đổi giá
        </Button>
        <Button
          className="h-10 bg-gradient-to-r from-amber-500 to-orange-600 px-4 text-white shadow-md shadow-orange-200 hover:from-amber-600 hover:to-orange-700"
          onClick={onApplyAll}
        >
          <Zap className="h-4 w-4" aria-hidden />
          Áp dụng giá AI hàng loạt
        </Button>
      </div>
    </header>
  )
}
