import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { toast } from '@/components/ui/toast'
import { SettingsAutomationBuilderView } from '@/features/settings/components/automation-builder/SettingsAutomationBuilderView'
import { useSettingsAutomationBuilder } from '@/features/settings/hooks/useSettingsAutomationBuilder'
import { buildSettingsAutomationBuilderViewModel } from '@/features/settings/logic/settingsAutomationBuilder.logic'
import type {
  AutomationBuilderStepId,
  AutomationBuilderTriggerParameterValue,
  SettingsAutomationBuilderResponse,
} from '@/features/settings/logic/settingsAutomationBuilder.types'

const stepOrder: AutomationBuilderStepId[] = ['trigger', 'condition', 'action']

function buildTriggerParameterDefaults(data: SettingsAutomationBuilderResponse): Record<string, Record<string, AutomationBuilderTriggerParameterValue>> {
  return data.triggers.reduce<Record<string, Record<string, AutomationBuilderTriggerParameterValue>>>((accumulator, trigger) => {
    accumulator[trigger.id] = trigger.parameters.reduce<Record<string, AutomationBuilderTriggerParameterValue>>((parameterValues, parameter) => {
      parameterValues[parameter.id] = parameter.defaultValue
      return parameterValues
    }, {})

    return accumulator
  }, {})
}

export function SettingsAutomationBuilder() {
  const navigate = useNavigate()
  const { data, isLoading, isFetching, isError, refetch } = useSettingsAutomationBuilder()
  const [currentStepId, setCurrentStepId] = useState<AutomationBuilderStepId>('trigger')
  const [selectedTriggerId, setSelectedTriggerId] = useState<string | null>(null)
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null)
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null)
  const [triggerParameterValuesByTriggerId, setTriggerParameterValuesByTriggerId] = useState<
    Record<string, Record<string, AutomationBuilderTriggerParameterValue>>
  >({})

  useEffect(() => {
    if (!data?.defaultTriggerId) return

    setTriggerParameterValuesByTriggerId((current) => {
      if (Object.keys(current).length > 0) {
        return current
      }

      return buildTriggerParameterDefaults(data)
    })

    setSelectedTriggerId((current) => current ?? data.defaultTriggerId)
    setSelectedConditionId((current) => current ?? data.defaultConditionId)
    setSelectedActionId((current) => current ?? data.defaultActionId)
  }, [data])

  const model = useMemo(() => {
    if (!data) return null

    return buildSettingsAutomationBuilderViewModel({
      data,
      currentStepId,
      selectedTriggerId,
      selectedConditionId,
      selectedActionId,
      triggerParameterValuesByTriggerId,
    })
  }, [currentStepId, data, selectedActionId, selectedConditionId, selectedTriggerId, triggerParameterValuesByTriggerId])

  const currentStepIndex = stepOrder.indexOf(currentStepId)
  const isLastStep = currentStepIndex === stepOrder.length - 1
  const isFirstStep = currentStepIndex === 0

  const goNextStep = () => {
    if (isLastStep) {
      toast.success('Đã lưu cấu hình rule tự động.')
      navigate('/settings/automation')
      return
    }

    setCurrentStepId(stepOrder[currentStepIndex + 1])
  }

  const goBackStep = () => {
    if (isFirstStep) {
      navigate('/settings/automation')
      return
    }

    setCurrentStepId(stepOrder[currentStepIndex - 1])
  }

  if (isLoading && !model) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải trình dựng quy tắc...</div>
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không tải được dữ liệu Automation Rule Builder." onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-3 pb-8">
      {isFetching ? <div className="text-xs text-slate-500">Đang làm mới...</div> : null}
      <SettingsAutomationBuilderView
        model={model}
        onBackToList={() => navigate('/settings/automation')}
        onCancel={() => navigate('/settings/automation')}
        onTriggerSelect={setSelectedTriggerId}
        onTriggerParameterChange={(parameterId, value) => {
          if (!selectedTriggerId) return

          setTriggerParameterValuesByTriggerId((current) => ({
            ...current,
            [selectedTriggerId]: {
              ...(current[selectedTriggerId] ?? {}),
              [parameterId]: value,
            },
          }))
        }}
        onConditionSelect={setSelectedConditionId}
        onActionSelect={setSelectedActionId}
        onBackStep={goBackStep}
        onNextStep={goNextStep}
      />
    </div>
  )
}
