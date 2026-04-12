import type { PlatformCode } from '@/types/platform.types'

export type StaffPermissionTone = 'indigo' | 'blue' | 'emerald' | 'purple' | 'slate'

export type StaffPermissionStatus = 'active' | 'paused' | 'inactive'

export type StaffPermissionLevel = 'full' | 'view' | 'none'

export type StaffPermissionActionCode = 'edit' | 'pause' | 'activate' | 'delete'

export type StaffPermissionPlatform = {
  id: string
  code: PlatformCode
  label: string
}

export type StaffPermissionSummaryCard = {
  id: string
  label: string
  count: number
  icon: 'crown' | 'box' | 'chat' | 'chart'
  tone: StaffPermissionTone
}

export type StaffPermissionMember = {
  id: string
  name: string
  email: string
  avatarTone: StaffPermissionTone
  roleLabel: string
  roleTone: StaffPermissionTone
  status: StaffPermissionStatus
  lastLoginAt: string
  permissions: string[]
  supportedPlatforms: PlatformCode[]
  actionCodes: StaffPermissionActionCode[]
}

export type StaffPermissionMatrixColumn = {
  id: string
  label: string
}

export type StaffPermissionMatrixRow = {
  id: string
  roleLabel: string
  cells: StaffPermissionLevel[]
}

export type SettingsStaffPermissionsResponse = {
  title: string
  subtitle: string
  inviteButtonLabel: string
  supportedPlatforms: StaffPermissionPlatform[]
  summaryCards: StaffPermissionSummaryCard[]
  membersSectionTitle: string
  membersSectionDescription: string
  members: StaffPermissionMember[]
  matrixTitle: string
  matrixDescription: string
  matrixColumns: StaffPermissionMatrixColumn[]
  matrixRows: StaffPermissionMatrixRow[]
}

export type StaffPermissionSummaryCardViewModel = {
  id: string
  label: string
  countLabel: string
  icon: 'crown' | 'box' | 'chat' | 'chart'
  tone: StaffPermissionTone
}

export type StaffPermissionPlatformViewModel = {
  id: string
  code: PlatformCode
  label: string
}

export type StaffPermissionActionViewModel = {
  id: string
  label: string
  tone: 'default' | 'warning' | 'danger'
}

export type StaffPermissionMemberViewModel = {
  id: string
  name: string
  email: string
  avatarTone: StaffPermissionTone
  roleLabel: string
  roleTone: StaffPermissionTone
  statusLabel: string
  statusTone: StaffPermissionStatus
  lastLoginLabel: string
  permissionsLabel: string
  supportedPlatformLabel: string
  actions: StaffPermissionActionViewModel[]
}

export type StaffPermissionMatrixCellViewModel = {
  id: string
  level: StaffPermissionLevel
  label: string
}

export type StaffPermissionMatrixRowViewModel = {
  id: string
  roleLabel: string
  cells: StaffPermissionMatrixCellViewModel[]
}

export type SettingsStaffPermissionsViewModel = {
  title: string
  subtitle: string
  inviteButtonLabel: string
  supportedPlatforms: StaffPermissionPlatformViewModel[]
  summaryCards: StaffPermissionSummaryCardViewModel[]
  membersSectionTitle: string
  membersSectionDescription: string
  members: StaffPermissionMemberViewModel[]
  matrixTitle: string
  matrixDescription: string
  matrixColumns: StaffPermissionMatrixColumn[]
  matrixRows: StaffPermissionMatrixRowViewModel[]
}