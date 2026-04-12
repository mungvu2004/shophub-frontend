import type {
  SettingsStaffPermissionsResponse,
  SettingsStaffPermissionsViewModel,
  StaffPermissionActionViewModel,
  StaffPermissionLevel,
  StaffPermissionMatrixCellViewModel,
  StaffPermissionMemberViewModel,
  StaffPermissionSummaryCardViewModel,
} from '@/features/settings/logic/settingsStaffPermissions.types'

const numberFormatter = new Intl.NumberFormat('vi-VN')

function formatRelativeTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000))

  if (diffMinutes < 1) {
    return 'Vừa xong'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours} giờ trước`
  }

  return `${Math.floor(diffHours / 24)} ngày trước`
}

function toActionViewModel(code: string): StaffPermissionActionViewModel {
  if (code === 'pause') {
    return { id: code, label: 'Tạm dừng', tone: 'warning' }
  }

  if (code === 'activate') {
    return { id: code, label: 'Kích hoạt lại', tone: 'default' }
  }

  if (code === 'delete') {
    return { id: code, label: 'Xoá', tone: 'danger' }
  }

  return { id: code, label: 'Sửa quyền', tone: 'default' }
}

function buildSummaryCardViewModel(card: SettingsStaffPermissionsResponse['summaryCards'][number]): StaffPermissionSummaryCardViewModel {
  return {
    id: card.id,
    label: card.label,
    countLabel: numberFormatter.format(card.count),
    icon: card.icon,
    tone: card.tone,
  }
}

function buildMemberViewModel(
  member: SettingsStaffPermissionsResponse['members'][number],
  platformLabelMap: Map<string, string>,
): StaffPermissionMemberViewModel {
  const permissionsLabel = member.permissions.length > 0 ? member.permissions.join(', ') : '—'
  const supportedPlatformLabel = member.supportedPlatforms.length > 0
    ? member.supportedPlatforms.map((platformCode) => platformLabelMap.get(platformCode) ?? platformCode).join(', ')
    : '—'

  return {
    id: member.id,
    name: member.name,
    email: member.email,
    avatarTone: member.avatarTone,
    roleLabel: member.roleLabel,
    roleTone: member.roleTone,
    statusLabel:
      member.status === 'active' ? 'Hoạt động' : member.status === 'paused' ? 'Tạm dừng' : 'Không hoạt động',
    statusTone: member.status,
    lastLoginLabel: formatRelativeTime(member.lastLoginAt),
    permissionsLabel,
    supportedPlatformLabel,
    actions: member.actionCodes.map(toActionViewModel),
  }
}

function buildMatrixCellViewModel(level: StaffPermissionLevel, columnId: string): StaffPermissionMatrixCellViewModel {
  if (level === 'full') {
    return { id: `${columnId}-full`, level, label: 'Full' }
  }

  if (level === 'view') {
    return { id: `${columnId}-view`, level, label: 'View' }
  }

  return { id: `${columnId}-none`, level, label: 'No' }
}

export function buildSettingsStaffPermissionsViewModel(
  data: SettingsStaffPermissionsResponse,
): SettingsStaffPermissionsViewModel {
  const platformLabelMap = new Map<string, string>(data.supportedPlatforms.map((platform) => [platform.code, platform.label]))

  return {
    title: data.title,
    subtitle: data.subtitle,
    inviteButtonLabel: data.inviteButtonLabel,
    supportedPlatforms: data.supportedPlatforms,
    summaryCards: data.summaryCards.map(buildSummaryCardViewModel),
    membersSectionTitle: data.membersSectionTitle,
    membersSectionDescription: data.membersSectionDescription,
    members: data.members.map((member) => buildMemberViewModel(member, platformLabelMap)),
    matrixTitle: data.matrixTitle,
    matrixDescription: data.matrixDescription,
    matrixColumns: data.matrixColumns,
    matrixRows: data.matrixRows.map((row) => ({
      id: row.id,
      roleLabel: row.roleLabel,
      cells: row.cells.map((level, index) => buildMatrixCellViewModel(level, data.matrixColumns[index]?.id ?? `column-${index}`)),
    })),
  }
}