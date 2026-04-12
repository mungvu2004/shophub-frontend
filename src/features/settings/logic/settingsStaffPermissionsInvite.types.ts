export type SettingsStaffPermissionsInviteRole = {
  id: string
  label: string
}

export type SettingsStaffPermissionsInvitePermission = {
  id: string
  label: string
  defaultChecked: boolean
}

export type SettingsStaffPermissionsInviteResponse = {
  title: string
  emailLabel: string
  emailPlaceholder: string
  defaultRoleLabel: string
  defaultRoleOptions: SettingsStaffPermissionsInviteRole[]
  permissionsLabel: string
  permissions: SettingsStaffPermissionsInvitePermission[]
  submitLabel: string
  helperText: string
}

export type SettingsStaffPermissionsInviteViewModel = {
  title: string
  emailLabel: string
  emailPlaceholder: string
  defaultRoleLabel: string
  defaultRoleOptions: SettingsStaffPermissionsInviteRole[]
  permissionsLabel: string
  permissions: SettingsStaffPermissionsInvitePermission[]
  submitLabel: string
  helperText: string
}