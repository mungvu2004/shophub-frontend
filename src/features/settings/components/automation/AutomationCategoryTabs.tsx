import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type {
  AutomationCategoryId,
  AutomationCategoryTabViewModel,
} from '@/features/settings/logic/settingsAutomation.types'

type AutomationCategoryTabsProps = {
  tabs: AutomationCategoryTabViewModel[]
  value: AutomationCategoryId
  onChange: (value: AutomationCategoryId) => void
}

export function AutomationCategoryTabs({ tabs, value, onChange }: AutomationCategoryTabsProps) {
  return (
    <section className="rounded-xl border border-indigo-100 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <Tabs value={value} onValueChange={(nextValue) => onChange(nextValue as AutomationCategoryId)}>
        <TabsList variant="line" className="h-auto w-full justify-start gap-5 rounded-none border-b border-[#e7eeff] p-0 text-left">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="h-auto flex-none rounded-none border-b-2 border-transparent px-0 pb-3.5 pt-0 data-active:border-[#3525cd] data-active:text-[#3525cd]"
            >
              <span>{tab.label}</span>
              <Badge
                variant="outline"
                className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0 text-[11px] font-semibold text-slate-500 data-[active=true]:border-indigo-200 data-[active=true]:bg-[#3525cd1a] data-[active=true]:text-[#3525cd]"
                data-active={value === tab.id}
              >
                {tab.countLabel}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </section>
  )
}
