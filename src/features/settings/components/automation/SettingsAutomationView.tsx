import { Card } from '@/components/ui/card'

import { AutomationBuilderPreview } from '@/features/settings/components/automation/AutomationBuilderPreview'
import { AutomationCategoryTabs } from '@/features/settings/components/automation/AutomationCategoryTabs'
import { AutomationHeader } from '@/features/settings/components/automation/AutomationHeader'
import { AutomationRulesTable } from '@/features/settings/components/automation/AutomationRulesTable'
import { AutomationStatsBar } from '@/features/settings/components/automation/AutomationStatsBar'
import type {
  AutomationCategoryId,
  SettingsAutomationViewModel,
} from '@/features/settings/logic/settingsAutomation.types'

type SettingsAutomationViewProps = {
  model: SettingsAutomationViewModel
  selectedCategory: AutomationCategoryId
  selectedRuleId: string | null
  onCategoryChange: (value: AutomationCategoryId) => void
  onRuleSelect: (ruleId: string) => void
  onRuleStatusToggle: (ruleId: string, nextStatus: 'on' | 'off') => void
  onRuleActionClick: (ruleId: string, ruleTitle: string, actionId: string, actionLabel: string) => void
  onCreateRule: () => void
  togglingRuleId: string | null
  isRefreshing: boolean
}

export function SettingsAutomationView({
  model,
  selectedCategory,
  selectedRuleId,
  onCategoryChange,
  onRuleSelect,
  onRuleStatusToggle,
  onRuleActionClick,
  onCreateRule,
  togglingRuleId,
  isRefreshing,
}: SettingsAutomationViewProps) {
  return (
    <div className="bg-[radial-gradient(circle_at_top,#eef2ff,transparent_42%)] pb-16 pt-1 md:pt-2 xl:pb-20">
      <div className="mx-auto max-w-[1152px] space-y-5 xl:space-y-6">
        <AutomationHeader
          title={model.title}
          subtitle={model.subtitle}
          createRuleLabel={model.createRuleLabel}
          isRefreshing={isRefreshing}
          onCreateRule={onCreateRule}
        />

        <AutomationStatsBar stats={model.stats} savingChartLabel={model.savingChartLabel} savingChartPoints={model.savingChartPoints} />

        <AutomationCategoryTabs tabs={model.tabs} value={selectedCategory} onChange={onCategoryChange} />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card className="border-indigo-100/80 bg-white/95 px-0 py-0 shadow-[0_12px_32px_0_rgba(15,23,42,0.06)] xl:col-span-8">
            <AutomationRulesTable
              rules={model.rules}
              selectedRuleId={selectedRuleId}
              onRuleSelect={onRuleSelect}
              onRuleStatusToggle={onRuleStatusToggle}
              onRuleActionClick={onRuleActionClick}
              togglingRuleId={togglingRuleId}
              loadMoreLabel={model.loadMoreLabel}
            />
          </Card>

          <Card className="border-indigo-100 bg-gradient-to-b from-white to-indigo-50/30 px-0 py-0 shadow-[0_12px_32px_0_rgba(15,23,42,0.06)] xl:col-span-4">
            <AutomationBuilderPreview preview={model.preview} />
          </Card>
        </section>
      </div>
    </div>
  )
}
