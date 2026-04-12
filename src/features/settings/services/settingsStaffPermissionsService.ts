import { apiClient } from '@/services/apiClient'

import type {
  SettingsStaffPermissionsResponse,
  StaffPermissionActionCode,
  StaffPermissionLevel,
  StaffPermissionMember,
  StaffPermissionPlatform,
  StaffPermissionStatus,
  StaffPermissionSummaryCard,
} from '@/features/settings/logic/settingsStaffPermissions.types'

type SettingsStaffPermissionsApiResponse = Partial<SettingsStaffPermissionsResponse>

const supportedActionCodes: StaffPermissionActionCode[] = ['edit', 'pause', 'activate', 'delete']
const supportedStatuses: StaffPermissionStatus[] = ['active', 'paused', 'inactive']
const supportedLevels: StaffPermissionLevel[] = ['full', 'view', 'none']

function toTone(value: unknown): StaffPermissionSummaryCard['tone'] {
  if (value === 'blue' || value === 'emerald' || value === 'purple' || value === 'slate') {
    return value
  }

  return 'indigo'
}

function toStatus(value: unknown): StaffPermissionStatus {
  if (typeof value === 'string' && supportedStatuses.includes(value as StaffPermissionStatus)) {
    return value as StaffPermissionStatus
  }

  return 'active'
}

function toActionCodes(value: unknown): StaffPermissionActionCode[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is StaffPermissionActionCode => typeof item === 'string' && supportedActionCodes.includes(item as StaffPermissionActionCode))
}

function toSummaryCards(value: unknown): StaffPermissionSummaryCard[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `summary-${index}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
        count: typeof entry.count === 'number' && Number.isFinite(entry.count) ? entry.count : 0,
        icon: entry.icon === 'box' || entry.icon === 'chat' || entry.icon === 'chart' ? entry.icon : 'crown',
        tone: toTone(entry.tone),
      }
    })
}

function toSupportedPlatforms(value: unknown): StaffPermissionPlatform[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `platform-${index}`,
        code: entry.code === 'lazada' || entry.code === 'shopee' || entry.code === 'tiktok_shop' ? entry.code : 'shopee',
        label: typeof entry.label === 'string' ? entry.label : '--',
      }
    })
}

function toMembers(value: unknown): StaffPermissionMember[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `member-${index}`,
        name: typeof entry.name === 'string' ? entry.name : '--',
        email: typeof entry.email === 'string' ? entry.email : '--',
        avatarTone: toTone(entry.avatarTone),
        roleLabel: typeof entry.roleLabel === 'string' ? entry.roleLabel : '--',
        roleTone: toTone(entry.roleTone),
        status: toStatus(entry.status),
        lastLoginAt: typeof entry.lastLoginAt === 'string' ? entry.lastLoginAt : '',
        permissions: Array.isArray(entry.permissions)
          ? entry.permissions.filter((permission): permission is string => typeof permission === 'string')
          : [],
        supportedPlatforms: Array.isArray(entry.supportedPlatforms)
          ? entry.supportedPlatforms.filter((platform): platform is StaffPermissionMember['supportedPlatforms'][number] => typeof platform === 'string')
          : [],
        actionCodes: toActionCodes(entry.actionCodes),
      }
    })
}

function toMatrixColumns(value: unknown): SettingsStaffPermissionsResponse['matrixColumns'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `column-${index}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
      }
    })
}

function toMatrixRows(value: unknown): SettingsStaffPermissionsResponse['matrixRows'] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `row-${index}`,
        roleLabel: typeof entry.roleLabel === 'string' ? entry.roleLabel : '--',
        cells: Array.isArray(entry.cells)
          ? entry.cells.filter((level): level is StaffPermissionLevel => typeof level === 'string' && supportedLevels.includes(level as StaffPermissionLevel))
          : [],
      }
    })
}

class SettingsStaffPermissionsService {
  async getPermissionsOverview(): Promise<SettingsStaffPermissionsResponse> {
    const response = await apiClient.get<SettingsStaffPermissionsApiResponse>('/settings/staff-permissions')

    return {
      title: response.data?.title ?? 'Quản lý Nhân viên & Phân quyền',
      subtitle:
        response.data?.subtitle ?? '4 nhân viên đang hoạt động trên hệ thống ShopHub, bao gồm quyền cho Shopee, TikTok Shop và Lazada',
      inviteButtonLabel: response.data?.inviteButtonLabel ?? 'Mời nhân viên mới',
      supportedPlatforms: toSupportedPlatforms(response.data?.supportedPlatforms),
      summaryCards: toSummaryCards(response.data?.summaryCards),
      membersSectionTitle: response.data?.membersSectionTitle ?? 'Nhân viên',
      membersSectionDescription: response.data?.membersSectionDescription ?? 'Theo dõi trạng thái, vai trò và lần truy cập cuối của từng nhân sự',
      members: toMembers(response.data?.members),
      matrixTitle: response.data?.matrixTitle ?? 'Ma trận phân quyền',
      matrixDescription: response.data?.matrixDescription ?? 'Quyền được chia theo nhóm nghiệp vụ và áp dụng cho Shopee, TikTok Shop, Lazada',
      matrixColumns: toMatrixColumns(response.data?.matrixColumns),
      matrixRows: toMatrixRows(response.data?.matrixRows),
    }
  }
}

export const settingsStaffPermissionsService = new SettingsStaffPermissionsService()