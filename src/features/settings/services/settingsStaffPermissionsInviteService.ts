import { apiClient } from '@/services/apiClient'

import type {
  SettingsStaffPermissionsInvitePermission,
  SettingsStaffPermissionsInviteResponse,
  SettingsStaffPermissionsInviteRole,
} from '@/features/settings/logic/settingsStaffPermissionsInvite.types'

type SettingsStaffPermissionsInviteApiResponse = Partial<SettingsStaffPermissionsInviteResponse>

function toRoles(value: unknown): SettingsStaffPermissionsInviteRole[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `role-${index}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
      }
    })
}

function toPermissions(value: unknown): SettingsStaffPermissionsInvitePermission[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item) => Boolean(item && typeof item === 'object'))
    .map((item, index) => {
      const entry = item as Record<string, unknown>

      return {
        id: typeof entry.id === 'string' ? entry.id : `permission-${index}`,
        label: typeof entry.label === 'string' ? entry.label : '--',
        defaultChecked: entry.defaultChecked === true,
      }
    })
}

class SettingsStaffPermissionsInviteService {
  async getInviteConfig(): Promise<SettingsStaffPermissionsInviteResponse> {
    const response = await apiClient.get<SettingsStaffPermissionsInviteApiResponse>('/settings/staff-permissions/invite')

    return {
      title: response.data?.title ?? 'Mời nhân viên mới',
      emailLabel: response.data?.emailLabel ?? 'Địa chỉ Email',
      emailPlaceholder: response.data?.emailPlaceholder ?? 'VD: nhanvien@shophub.vn',
      defaultRoleLabel: response.data?.defaultRoleLabel ?? 'Vai trò mặc định',
      defaultRoleOptions: toRoles(response.data?.defaultRoleOptions),
      permissionsLabel: response.data?.permissionsLabel ?? 'Tuỳ chỉnh quyền nhanh',
      permissions: toPermissions(response.data?.permissions),
      submitLabel: response.data?.submitLabel ?? 'Gửi lời mời thành viên',
      helperText: response.data?.helperText ?? 'Mỗi email chứa link kích hoạt sẽ được gửi đến nhân viên ngay lập tức.',
    }
  }
}

export const settingsStaffPermissionsInviteService = new SettingsStaffPermissionsInviteService()