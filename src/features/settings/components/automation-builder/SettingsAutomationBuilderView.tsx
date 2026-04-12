import { ChevronLeft } from 'lucide-react'

import { AutomationBuilderActionGrid } from '@/features/settings/components/automation-builder/AutomationBuilderActionGrid'
import { AutomationBuilderConditionGrid } from '@/features/settings/components/automation-builder/AutomationBuilderConditionGrid'
import { AutomationBuilderFooterBar } from '@/features/settings/components/automation-builder/AutomationBuilderFooterBar'
import { AutomationBuilderProgress } from '@/features/settings/components/automation-builder/AutomationBuilderProgress'
import { AutomationBuilderStepHint } from '@/features/settings/components/automation-builder/AutomationBuilderStepHint'
import { AutomationBuilderTriggerGrid } from '@/features/settings/components/automation-builder/AutomationBuilderTriggerGrid'
import { AutomationBuilderTriggerInsight } from '@/features/settings/components/automation-builder/AutomationBuilderTriggerInsight'
import { AutomationBuilderTriggerParametersForm } from '@/features/settings/components/automation-builder/AutomationBuilderTriggerParametersForm'
import type { AutomationBuilderTriggerParameterValue, SettingsAutomationBuilderViewModel } from '@/features/settings/logic/settingsAutomationBuilder.types'

type SettingsAutomationBuilderViewProps = {
  model: SettingsAutomationBuilderViewModel
  onBackToList: () => void
  onCancel: () => void
  onTriggerSelect: (triggerId: string) => void
  onTriggerParameterChange: (parameterId: string, value: AutomationBuilderTriggerParameterValue) => void
  onConditionSelect: (conditionId: string) => void
  onActionSelect: (actionId: string) => void
  onBackStep: () => void
  onNextStep: () => void
}

export function SettingsAutomationBuilderView({
  model,
  onBackToList,
  onCancel,
  onTriggerSelect,
  onTriggerParameterChange,
  onConditionSelect,
  onActionSelect,
  onBackStep,
  onNextStep,
}: SettingsAutomationBuilderViewProps) {
  const isTriggerStep = model.currentStepId === 'trigger'
  const isConditionStep = model.currentStepId === 'condition'
  const isActionStep = model.currentStepId === 'action'

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <div className="space-y-4 bg-slate-50 px-6 pb-10 pt-6">
        <button type="button" onClick={onBackToList} className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          <ChevronLeft className="size-4" />
          {model.breadcrumbLabel}
        </button>

        <h2 className="text-[30px] font-semibold tracking-tight text-slate-900">{model.pageTitle}</h2>

        <AutomationBuilderProgress steps={model.steps} />

        {isTriggerStep ? <AutomationBuilderTriggerGrid triggers={model.triggers} onSelect={onTriggerSelect} /> : null}
        {isConditionStep ? <AutomationBuilderConditionGrid conditions={model.conditions} onSelect={onConditionSelect} /> : null}
        {isActionStep ? <AutomationBuilderActionGrid actions={model.actions} onSelect={onActionSelect} /> : null}

        {isTriggerStep ? (
          <AutomationBuilderTriggerInsight
            triggerTitle={model.selectedTriggerTitle}
            triggerDescription={model.selectedTriggerDescription}
            platforms={model.selectedTriggerPlatforms}
          />
        ) : null}

        {isTriggerStep ? (
          <AutomationBuilderTriggerParametersForm
            parameters={model.selectedTriggerParameters}
            onParameterChange={onTriggerParameterChange}
          />
        ) : null}

        {isConditionStep ? (
          <AutomationBuilderStepHint title={model.selectedConditionTitle} description={model.selectedConditionDescription} />
        ) : null}

        {isActionStep ? (
          <AutomationBuilderStepHint title={model.selectedActionTitle} description={model.selectedActionDescription} />
        ) : null}
      </div>

      <AutomationBuilderFooterBar
        cancelLabel={model.cancelLabel}
        backLabel={model.backLabel}
        nextLabel={model.nextLabel}
        completeLabel={model.completeLabel}
        isLastStep={isActionStep}
        onBack={onBackStep}
        onNext={onNextStep}
        onCancel={onCancel}
      />
    </div>
  )
}
