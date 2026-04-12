import { apiClient } from '@/services/apiClient'

import type {
  AutomationBuilderActionIcon,
  AutomationBuilderActionOption,
  AutomationBuilderConditionIcon,
  AutomationBuilderConditionOption,
  AutomationBuilderPlatform,
  AutomationBuilderStep,
  AutomationBuilderStepId,
  AutomationBuilderTriggerParameterDefinition,
  AutomationBuilderTriggerParameterOption,
  AutomationBuilderTriggerParameterType,
  AutomationBuilderTriggerParameterValue,
  AutomationBuilderTriggerIcon,
  AutomationBuilderTriggerOption,
  SettingsAutomationBuilderResponse,
} from '@/features/settings/logic/settingsAutomationBuilder.types'
import type { PlatformCode } from '@/types/platform.types'

type SettingsAutomationBuilderApiResponse = Partial<SettingsAutomationBuilderResponse>

const supportedStepIds: AutomationBuilderStepId[] = ['trigger', 'condition', 'action']
const supportedTriggerIcons: AutomationBuilderTriggerIcon[] = [
  'shopping-cart',
  'package',
  'message-square-warning',
  'trending-up-down',
  'clock-3',
  'webhook',
]
const supportedConditionIcons: AutomationBuilderConditionIcon[] = ['package', 'clock-3', 'triangle-alert', 'filter']
const supportedActionIcons: AutomationBuilderActionIcon[] = ['bell', 'tag', 'message-circle', 'shield-check']
const supportedPlatforms: PlatformCode[] = ['shopee', 'tiktok_shop', 'lazada']
const supportedTriggerParameterTypes: AutomationBuilderTriggerParameterType[] = ['number', 'text', 'select', 'switch']

function toStepId(value: unknown): AutomationBuilderStepId {
  if (typeof value === 'string' && supportedStepIds.includes(value as AutomationBuilderStepId)) {
    return value as AutomationBuilderStepId
  }

  return 'trigger'
}

function toTriggerIcon(value: unknown): AutomationBuilderTriggerIcon {
  if (typeof value === 'string' && supportedTriggerIcons.includes(value as AutomationBuilderTriggerIcon)) {
    return value as AutomationBuilderTriggerIcon
  }

  return 'webhook'
}

function toConditionIcon(value: unknown): AutomationBuilderConditionIcon {
  if (typeof value === 'string' && supportedConditionIcons.includes(value as AutomationBuilderConditionIcon)) {
    return value as AutomationBuilderConditionIcon
  }

  return 'filter'
}

function toActionIcon(value: unknown): AutomationBuilderActionIcon {
  if (typeof value === 'string' && supportedActionIcons.includes(value as AutomationBuilderActionIcon)) {
    return value as AutomationBuilderActionIcon
  }

  return 'bell'
}

function toTriggerParameterType(value: unknown): AutomationBuilderTriggerParameterType {
  if (typeof value === 'string' && supportedTriggerParameterTypes.includes(value as AutomationBuilderTriggerParameterType)) {
    return value as AutomationBuilderTriggerParameterType
  }

  return 'text'
}

function toTriggerParameterValue(value: unknown, type: AutomationBuilderTriggerParameterType): AutomationBuilderTriggerParameterValue {
  if (type === 'switch') {
    return typeof value === 'boolean' ? value : false
  }

  if (type === 'number') {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) ? parsedValue : 0
  }

  return typeof value === 'string' ? value : ''
}

function toTriggerParameterOptions(value: unknown): AutomationBuilderTriggerParameterOption[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        label: typeof entry.label === 'string' ? entry.label : `Tùy chọn ${index + 1}`,
        value: typeof entry.value === 'string' ? entry.value : `option-${index + 1}`,
      }
    })
}

function toTriggerParameters(value: unknown): AutomationBuilderTriggerParameterDefinition[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>
      const type = toTriggerParameterType(entry.type)

      return {
        id: typeof entry.id === 'string' ? entry.id : `parameter-${index + 1}`,
        label: typeof entry.label === 'string' ? entry.label : `Tham số ${index + 1}`,
        description: typeof entry.description === 'string' ? entry.description : undefined,
        type,
        placeholder: typeof entry.placeholder === 'string' ? entry.placeholder : undefined,
        unitLabel: typeof entry.unitLabel === 'string' ? entry.unitLabel : undefined,
        min: typeof entry.min === 'number' && Number.isFinite(entry.min) ? entry.min : undefined,
        max: typeof entry.max === 'number' && Number.isFinite(entry.max) ? entry.max : undefined,
        defaultValue: toTriggerParameterValue(entry.defaultValue, type),
        options: toTriggerParameterOptions(entry.options),
      }
    })
}

function toSteps(value: unknown): AutomationBuilderStep[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: toStepId(entry.id),
        title: typeof entry.title === 'string' ? entry.title : `Bước ${index + 1}`,
      }
    })
}

function toTriggers(value: unknown): AutomationBuilderTriggerOption[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `trigger-${index + 1}`,
        title: typeof entry.title === 'string' ? entry.title : '--',
        description: typeof entry.description === 'string' ? entry.description : '',
        icon: toTriggerIcon(entry.icon),
        parameters: toTriggerParameters(entry.parameters),
      }
    })
}

function toConditions(value: unknown): AutomationBuilderConditionOption[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `condition-${index + 1}`,
        title: typeof entry.title === 'string' ? entry.title : '--',
        description: typeof entry.description === 'string' ? entry.description : '',
        icon: toConditionIcon(entry.icon),
      }
    })
}

function toActions(value: unknown): AutomationBuilderActionOption[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `action-${index + 1}`,
        title: typeof entry.title === 'string' ? entry.title : '--',
        description: typeof entry.description === 'string' ? entry.description : '',
        icon: toActionIcon(entry.icon),
      }
    })
}

function toPlatforms(value: unknown): AutomationBuilderPlatform[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>
      const code =
        typeof entry.code === 'string' && supportedPlatforms.includes(entry.code as PlatformCode)
          ? (entry.code as PlatformCode)
          : 'shopee'

      return {
        code,
        label: typeof entry.label === 'string' ? entry.label : `Kênh ${index + 1}`,
      }
    })
}

class SettingsAutomationBuilderService {
  async getBuilderSetup(): Promise<SettingsAutomationBuilderResponse> {
    const response = await apiClient.get<SettingsAutomationBuilderApiResponse>('/settings/automation/builder')

    const triggers = toTriggers(response.data?.triggers)
    const conditions = toConditions(response.data?.conditions)
    const actions = toActions(response.data?.actions)

    return {
      title: response.data?.title ?? 'Tự động hóa Vận hành',
      navLabel: response.data?.navLabel ?? 'Automation Rule Builder',
      breadcrumbLabel: response.data?.breadcrumbLabel ?? 'Quay lại danh sách',
      pageTitle: response.data?.pageTitle ?? 'Tạo quy tắc tự động mới',
      cancelLabel: response.data?.cancelLabel ?? 'Hủy',
      backLabel: response.data?.backLabel ?? 'Quay lại',
      nextLabel: response.data?.nextLabel ?? 'Tiếp theo',
      completeLabel: response.data?.completeLabel ?? 'Hoàn tất',
      searchPlaceholder: response.data?.searchPlaceholder ?? 'Tìm quy tắc...',
      steps: toSteps(response.data?.steps),
      triggers,
      conditions,
      actions,
      defaultTriggerId: response.data?.defaultTriggerId && triggers.some((item) => item.id === response.data.defaultTriggerId)
        ? response.data.defaultTriggerId
        : triggers[0]?.id ?? '',
      defaultConditionId: response.data?.defaultConditionId && conditions.some((item) => item.id === response.data.defaultConditionId)
        ? response.data.defaultConditionId
        : conditions[0]?.id ?? '',
      defaultActionId: response.data?.defaultActionId && actions.some((item) => item.id === response.data.defaultActionId)
        ? response.data.defaultActionId
        : actions[0]?.id ?? '',
      platforms: toPlatforms(response.data?.platforms),
    }
  }
}

export const settingsAutomationBuilderService = new SettingsAutomationBuilderService()
