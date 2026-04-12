import type { PlatformCode } from '@/types/platform.types'

export type AutomationBuilderStepId = 'trigger' | 'condition' | 'action'

export type AutomationBuilderTriggerIcon =
  | 'shopping-cart'
  | 'package'
  | 'message-square-warning'
  | 'trending-up-down'
  | 'clock-3'
  | 'webhook'

export type AutomationBuilderConditionIcon = 'package' | 'clock-3' | 'triangle-alert' | 'filter'

export type AutomationBuilderActionIcon = 'bell' | 'tag' | 'message-circle' | 'shield-check'

export type AutomationBuilderStep = {
  id: AutomationBuilderStepId
  title: string
}

export type AutomationBuilderTriggerOption = {
  id: string
  title: string
  description: string
  icon: AutomationBuilderTriggerIcon
  parameters: AutomationBuilderTriggerParameterDefinition[]
}

export type AutomationBuilderTriggerParameterType = 'number' | 'text' | 'select' | 'switch'

export type AutomationBuilderTriggerParameterValue = string | number | boolean

export type AutomationBuilderTriggerParameterOption = {
  label: string
  value: string
}

export type AutomationBuilderTriggerParameterDefinition = {
  id: string
  label: string
  description?: string
  type: AutomationBuilderTriggerParameterType
  placeholder?: string
  unitLabel?: string
  min?: number
  max?: number
  defaultValue: AutomationBuilderTriggerParameterValue
  options: AutomationBuilderTriggerParameterOption[]
}

export type AutomationBuilderConditionOption = {
  id: string
  title: string
  description: string
  icon: AutomationBuilderConditionIcon
}

export type AutomationBuilderActionOption = {
  id: string
  title: string
  description: string
  icon: AutomationBuilderActionIcon
}

export type AutomationBuilderPlatform = {
  code: PlatformCode
  label: string
}

export type SettingsAutomationBuilderResponse = {
  title: string
  navLabel: string
  breadcrumbLabel: string
  pageTitle: string
  cancelLabel: string
  backLabel: string
  nextLabel: string
  completeLabel: string
  searchPlaceholder: string
  steps: AutomationBuilderStep[]
  triggers: AutomationBuilderTriggerOption[]
  conditions: AutomationBuilderConditionOption[]
  actions: AutomationBuilderActionOption[]
  defaultTriggerId: string
  defaultConditionId: string
  defaultActionId: string
  platforms: AutomationBuilderPlatform[]
}

export type AutomationBuilderStepViewModel = {
  id: AutomationBuilderStepId
  title: string
  index: number
  isActive: boolean
}

export type AutomationBuilderTriggerViewModel = {
  id: string
  title: string
  description: string
  icon: AutomationBuilderTriggerIcon
  isSelected: boolean
}

export type AutomationBuilderTriggerParameterViewModel = {
  id: string
  label: string
  description?: string
  type: AutomationBuilderTriggerParameterType
  placeholder?: string
  unitLabel?: string
  min?: number
  max?: number
  value: AutomationBuilderTriggerParameterValue
  options: AutomationBuilderTriggerParameterOption[]
}

export type AutomationBuilderConditionViewModel = {
  id: string
  title: string
  description: string
  icon: AutomationBuilderConditionIcon
  isSelected: boolean
}

export type AutomationBuilderActionViewModel = {
  id: string
  title: string
  description: string
  icon: AutomationBuilderActionIcon
  isSelected: boolean
}

export type SettingsAutomationBuilderViewModel = {
  title: string
  navLabel: string
  breadcrumbLabel: string
  pageTitle: string
  cancelLabel: string
  backLabel: string
  nextLabel: string
  completeLabel: string
  searchPlaceholder: string
  steps: AutomationBuilderStepViewModel[]
  currentStepId: AutomationBuilderStepId
  triggers: AutomationBuilderTriggerViewModel[]
  conditions: AutomationBuilderConditionViewModel[]
  actions: AutomationBuilderActionViewModel[]
  selectedTriggerTitle: string
  selectedTriggerDescription: string
  selectedConditionTitle: string
  selectedConditionDescription: string
  selectedActionTitle: string
  selectedActionDescription: string
  selectedTriggerPlatforms: AutomationBuilderPlatform[]
  selectedTriggerParameters: AutomationBuilderTriggerParameterViewModel[]
}
