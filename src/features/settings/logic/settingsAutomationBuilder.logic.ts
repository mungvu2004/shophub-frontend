import type {
  AutomationBuilderStepId,
  SettingsAutomationBuilderResponse,
  SettingsAutomationBuilderViewModel,
} from '@/features/settings/logic/settingsAutomationBuilder.types'

export function buildSettingsAutomationBuilderViewModel(params: {
  data: SettingsAutomationBuilderResponse
  currentStepId: AutomationBuilderStepId
  selectedTriggerId: string | null
  selectedConditionId: string | null
  selectedActionId: string | null
  triggerParameterValuesByTriggerId: Record<string, Record<string, string | number | boolean>>
}): SettingsAutomationBuilderViewModel {
  const selectedTrigger = params.selectedTriggerId
    ? params.data.triggers.find((trigger) => trigger.id === params.selectedTriggerId)
    : undefined
  const selectedCondition = params.selectedConditionId
    ? params.data.conditions.find((condition) => condition.id === params.selectedConditionId)
    : undefined
  const selectedAction = params.selectedActionId
    ? params.data.actions.find((action) => action.id === params.selectedActionId)
    : undefined

  const fallbackTrigger = params.data.triggers[0]
  const fallbackCondition = params.data.conditions[0]
  const fallbackAction = params.data.actions[0]
  const currentTrigger = selectedTrigger ?? fallbackTrigger
  const currentCondition = selectedCondition ?? fallbackCondition
  const currentAction = selectedAction ?? fallbackAction
  const triggerParameterValues = currentTrigger
    ? params.triggerParameterValuesByTriggerId[currentTrigger.id] ?? {}
    : {}

  return {
    title: params.data.title,
    navLabel: params.data.navLabel,
    breadcrumbLabel: params.data.breadcrumbLabel,
    pageTitle: params.data.pageTitle,
    cancelLabel: params.data.cancelLabel,
    backLabel: params.data.backLabel,
    nextLabel: params.data.nextLabel,
    completeLabel: params.data.completeLabel,
    searchPlaceholder: params.data.searchPlaceholder,
    steps: params.data.steps.map((step, index) => ({
      id: step.id,
      title: step.title,
      index: index + 1,
      isActive: step.id === params.currentStepId,
    })),
    currentStepId: params.currentStepId,
    triggers: params.data.triggers.map((trigger) => ({
      id: trigger.id,
      title: trigger.title,
      description: trigger.description,
      icon: trigger.icon,
      isSelected: trigger.id === (currentTrigger?.id ?? ''),
    })),
    conditions: params.data.conditions.map((condition) => ({
      id: condition.id,
      title: condition.title,
      description: condition.description,
      icon: condition.icon,
      isSelected: condition.id === (currentCondition?.id ?? ''),
    })),
    actions: params.data.actions.map((action) => ({
      id: action.id,
      title: action.title,
      description: action.description,
      icon: action.icon,
      isSelected: action.id === (currentAction?.id ?? ''),
    })),
    selectedTriggerTitle: currentTrigger?.title ?? 'Chưa chọn trigger',
    selectedTriggerDescription:
      currentTrigger?.description ??
      'Hãy chọn một trigger để bắt đầu xây dựng quy tắc tự động hóa vận hành.',
    selectedConditionTitle: currentCondition?.title ?? 'Chưa chọn điều kiện',
    selectedConditionDescription:
      currentCondition?.description ??
      'Hãy chọn điều kiện để hệ thống xác định chính xác thời điểm chạy quy tắc.',
    selectedActionTitle: currentAction?.title ?? 'Chưa chọn hành động',
    selectedActionDescription:
      currentAction?.description ??
      'Hãy chọn hành động để hoàn tất quy tắc tự động hóa.',
    selectedTriggerPlatforms: params.data.platforms,
    selectedTriggerParameters: currentTrigger
      ? currentTrigger.parameters.map((parameter) => ({
          id: parameter.id,
          label: parameter.label,
          description: parameter.description,
          type: parameter.type,
          placeholder: parameter.placeholder,
          unitLabel: parameter.unitLabel,
          min: parameter.min,
          max: parameter.max,
          value: triggerParameterValues[parameter.id] ?? parameter.defaultValue,
          options: parameter.options,
        }))
      : [],
  }
}
