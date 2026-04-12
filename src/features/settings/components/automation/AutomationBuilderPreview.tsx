import { ArrowDown, ArrowUpRight, Bolt, BellRing, Funnel, PlaySquare } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

import type {
  AutomationPreviewFlowViewModel,
  AutomationPreviewStepType,
} from '@/features/settings/logic/settingsAutomation.types'

type AutomationBuilderPreviewProps = {
  preview: AutomationPreviewFlowViewModel
}

const iconMap: Record<AutomationPreviewStepType, typeof Bolt> = {
  trigger: PlaySquare,
  condition: Funnel,
  action: Bolt,
  notification: BellRing,
}

export function AutomationBuilderPreview({ preview }: AutomationBuilderPreviewProps) {
  return (
    <aside className="rounded-xl border border-indigo-100/80 bg-gradient-to-b from-white to-indigo-50/25 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-2 py-1 text-2xl text-indigo-500">⋄</p>
        <ArrowUpRight className="size-4 text-slate-500" />
      </div>

      <h3 className="text-lg font-bold text-slate-900">{preview.title}</h3>

      <div className="mt-4 space-y-3">
        {preview.steps.map((step, index) => {
          const Icon = iconMap[step.type] ?? Bolt

          return (
            <div key={step.id}>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                <div className="flex items-start gap-2.5">
                  <span className={cn('inline-flex size-7 items-center justify-center rounded-full', step.accentClassName)}>
                    <Icon className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold tracking-[1px] text-slate-500 uppercase">{step.typeLabel}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{step.title}</p>
                    {step.description.trim().length > 0 ? <p className="mt-1 text-xs text-slate-500">{step.description}</p> : null}
                  </div>
                </div>
              </div>

              {index < preview.steps.length - 1 ? (
                <div className="flex justify-center py-1.5">
                  <ArrowDown className="size-4 text-slate-300" />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <Button
        type="button"
        onClick={() => toast.info('Mở builder chỉnh sửa rule này sau khi nối route.')}
        className="mt-5 h-11 w-full rounded-xl bg-gradient-to-r from-indigo-700 to-indigo-500 text-sm font-bold tracking-wide uppercase text-white hover:opacity-95"
      >
        {preview.ctaLabel}
      </Button>
    </aside>
  )
}
