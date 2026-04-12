import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

type AutomationBuilderFooterBarProps = {
  cancelLabel: string
  backLabel: string
  nextLabel: string
  completeLabel: string
  isLastStep: boolean
  disableNext?: boolean
  onBack: () => void
  onNext: () => void
  onCancel: () => void
}

export function AutomationBuilderFooterBar({
  cancelLabel,
  backLabel,
  nextLabel,
  completeLabel,
  isLastStep,
  disableNext = false,
  onBack,
  onNext,
  onCancel,
}: AutomationBuilderFooterBarProps) {
  return (
    <footer className="sticky bottom-0 z-10 mt-8 flex items-center justify-between border-t border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-500 hover:text-slate-700">
        {cancelLabel}
      </Button>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="h-10 px-5 text-slate-600">
          {backLabel}
        </Button>
        <Button type="button" onClick={onNext} disabled={disableNext} className="h-10 bg-gradient-to-r from-indigo-700 to-indigo-500 px-6 text-white hover:opacity-95">
          {isLastStep ? completeLabel : nextLabel}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </footer>
  )
}
