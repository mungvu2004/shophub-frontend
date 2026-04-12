import type {
  SettingsStaffPermissionsInviteResponse,
  SettingsStaffPermissionsInviteViewModel,
} from '@/features/settings/logic/settingsStaffPermissionsInvite.types'

export function buildSettingsStaffPermissionsInviteViewModel(
  data: SettingsStaffPermissionsInviteResponse,
): SettingsStaffPermissionsInviteViewModel {
  return {
    title: data.title,
    emailLabel: data.emailLabel,
    emailPlaceholder: data.emailPlaceholder,
    defaultRoleLabel: data.defaultRoleLabel,
    defaultRoleOptions: data.defaultRoleOptions,
    permissionsLabel: data.permissionsLabel,
    permissions: data.permissions,
    submitLabel: data.submitLabel,
    helperText: data.helperText,
  }
}