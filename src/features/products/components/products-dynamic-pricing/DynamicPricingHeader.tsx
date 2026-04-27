import { History, Zap, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

type DynamicPricingHeaderProps = {
  title: string
  subtitle: string
  applyAllLabel: string
  historyLabel: string
  onOpenHistory: () => void
  onApplyAll: () => void
}

export function DynamicPricingHeader({ title, subtitle, applyAllLabel, historyLabel, onOpenHistory, onApplyAll }: DynamicPricingHeaderProps) {
  return (
    <ThemedPageHeader
      title={title}
      subtitle={
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" aria-hidden />
          {subtitle}
        </span>
      }
      theme="products"
      badge={{ text: 'Dynamic Pricing', icon: <Zap className="size-3.5" /> }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          className="h-10 px-4 text-slate-600 bg-white/50 backdrop-blur shadow-sm hover:bg-white/80"
          onClick={onOpenHistory}
        >
          <History className="h-4 w-4" aria-hidden />
          {historyLabel}
        </Button>
        <Button
          className="h-10 bg-gradient-to-r from-amber-500 to-orange-600 px-4 text-white shadow-md shadow-orange-200 hover:from-amber-600 hover:to-orange-700"
          onClick={onApplyAll}
        >
          <Zap className="h-4 w-4" aria-hidden />
          {applyAllLabel}
        </Button>
      </div>
    </ThemedPageHeader>
  )
}