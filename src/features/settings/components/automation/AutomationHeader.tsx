import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

type AutomationHeaderProps = {
  title: string
  subtitle: string
  createRuleLabel: string
  isRefreshing: boolean
  onCreateRule: () => void
}

export function AutomationHeader({ title, subtitle, createRuleLabel, isRefreshing, onCreateRule }: AutomationHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-white to-indigo-50/40 px-5 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm italic text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {isRefreshing ? <span className="text-xs text-slate-500">Đang làm mới...</span> : null}

        <Button
          type="button"
          onClick={onCreateRule}
          className="h-10 gap-2 rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-500 px-5 text-white shadow-indigo-500/30 hover:opacity-95"
        >
          <Plus className="size-4" />
          {createRuleLabel}
        </Button>
      </div>
    </header>
  )
}
