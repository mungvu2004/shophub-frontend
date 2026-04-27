import { Plus, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

type AutomationHeaderProps = {
  title: string
  subtitle: string
  createRuleLabel: string
  isRefreshing: boolean
  onCreateRule: () => void
}

export function AutomationHeader({ title, subtitle, createRuleLabel, isRefreshing, onCreateRule }: AutomationHeaderProps) {
  return (
    <ThemedPageHeader
      title={title}
      subtitle={subtitle}
      theme="settings"
      badge={{ text: 'Automation', icon: <Zap className="size-3.5" /> }}
    >
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
    </ThemedPageHeader>
  )
}
