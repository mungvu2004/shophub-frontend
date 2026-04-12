import { cn } from '@/lib/utils'

import type { AutomationBuilderStepViewModel } from '@/features/settings/logic/settingsAutomationBuilder.types'

type AutomationBuilderProgressProps = {
  steps: AutomationBuilderStepViewModel[]
}

export function AutomationBuilderProgress({ steps }: AutomationBuilderProgressProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-[680px] items-center justify-between px-2 pt-4">
      <div className="absolute left-[20%] right-[20%] top-9 h-px bg-slate-200" aria-hidden />
      {steps.map((step) => (
        <div key={step.id} className="relative z-[1] flex flex-col items-center gap-2">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold',
              step.isActive
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-[0_0_0_4px_rgba(99,102,241,0.12)]'
                : 'border-slate-200 bg-white text-slate-400',
            )}
          >
            {step.index}
          </div>
          <span className={cn('text-sm', step.isActive ? 'font-semibold text-indigo-600' : 'font-medium text-slate-400')}>{step.title}</span>
        </div>
      ))}
    </div>
  )
}
