import type {
  SettingsStaffPermissionsActivityResponse,
  SettingsStaffPermissionsActivityViewModel,
} from '@/features/settings/logic/settingsStaffPermissionsActivity.types'

export function buildSettingsStaffPermissionsActivityViewModel(
  data: SettingsStaffPermissionsActivityResponse,
): SettingsStaffPermissionsActivityViewModel {
  return data
}