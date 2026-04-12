export type StaffActivityKind = 'inventory' | 'order' | 'export'

export type StaffActivityEntry = {
  id: string
  title: string
  detail?: string
  timeLabel: string
  kind: StaffActivityKind
  dimmed?: boolean
}

export type StaffActivitySection = {
  id: string
  label?: string
  entries: StaffActivityEntry[]
}

export type SettingsStaffPermissionsActivityResponse = {
  memberId: string
  memberName: string
  headerTitle: string
  summaryLabel: string
  sections: StaffActivitySection[]
}

export type SettingsStaffPermissionsActivityViewModel = SettingsStaffPermissionsActivityResponse