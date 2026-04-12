import { useMemo } from 'react'
import { useState } from 'react'

import { StaffMemberActivityDrawer } from '@/features/settings/components/staff-permissions/StaffMemberActivityDrawer'
import { StaffMemberActionDialog } from '@/features/settings/components/staff-permissions/StaffMemberActionDialog'
import { SettingsStaffPermissionsInviteDrawer } from '@/features/settings/components/staff-permissions/SettingsStaffPermissionsInviteDrawer'
import { SettingsStaffPermissionsView } from '@/features/settings/components/staff-permissions/SettingsStaffPermissionsView'
import { useSettingsStaffPermissionsActivity } from '@/features/settings/hooks/useSettingsStaffPermissionsActivity'
import { useSettingsStaffPermissions } from '@/features/settings/hooks/useSettingsStaffPermissions'
import { useSettingsStaffPermissionsInvite } from '@/features/settings/hooks/useSettingsStaffPermissionsInvite'
import { buildSettingsStaffPermissionsActivityViewModel } from '@/features/settings/logic/settingsStaffPermissionsActivity.logic'
import { buildSettingsStaffPermissionsViewModel } from '@/features/settings/logic/settingsStaffPermissions.logic'
import { buildSettingsStaffPermissionsInviteViewModel } from '@/features/settings/logic/settingsStaffPermissionsInvite.logic'

export function SettingsStaffPermissions() {
  const { data, isLoading, isError, refetch } = useSettingsStaffPermissions()
  const { data: inviteData } = useSettingsStaffPermissionsInvite()
  const [activityOpen, setActivityOpen] = useState(false)
  const [selectedActivityMemberId, setSelectedActivityMemberId] = useState('')
  const [selectedActivityMemberName, setSelectedActivityMemberName] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedActionMemberName, setSelectedActionMemberName] = useState('')
  const [selectedActionLabel, setSelectedActionLabel] = useState('')

  const { data: activityData, isLoading: isActivityLoading } = useSettingsStaffPermissionsActivity({
    memberId: selectedActivityMemberId,
    enabled: activityOpen && selectedActivityMemberId.trim().length > 0,
  })

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    return buildSettingsStaffPermissionsViewModel(data)
  }, [data])

  const inviteModel = useMemo(() => {
    if (!inviteData) {
      return null
    }

    return buildSettingsStaffPermissionsInviteViewModel(inviteData)
  }, [inviteData])

  const activityModel = useMemo(() => {
    if (!activityData) {
      return null
    }

    return buildSettingsStaffPermissionsActivityViewModel(activityData)
  }, [activityData])

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải dữ liệu phân quyền nhân viên...</div>
  }

  if (isError || !model) {
    return (
      <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-8">
        <p className="text-sm font-semibold text-rose-700">Không tải được dữ liệu phân quyền nhân viên.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Thử lại
        </button>
      </div>
    )
  }

  const handleMemberActionClick = (_memberId: string, memberName: string, _actionId: string, actionLabel: string) => {
    setSelectedActionMemberName(memberName)
    setSelectedActionLabel(actionLabel)
    setActionDialogOpen(true)
  }

  const handleMemberActivityClick = (memberId: string, memberName: string) => {
    setSelectedActivityMemberId(memberId)
    setSelectedActivityMemberName(memberName)
    setActivityOpen(true)
  }

  return (
    <>
      <SettingsStaffPermissionsView
        model={model}
        onInviteClick={() => setInviteOpen(true)}
        onMemberActionClick={handleMemberActionClick}
        onMemberActivityClick={handleMemberActivityClick}
      />
      <SettingsStaffPermissionsInviteDrawer open={inviteOpen} onOpenChange={setInviteOpen} model={inviteModel} />
      <StaffMemberActivityDrawer
        open={activityOpen}
        onOpenChange={setActivityOpen}
        model={activityModel ?? {
          memberId: selectedActivityMemberId,
          memberName: selectedActivityMemberName,
          headerTitle: `Hoạt động — ${selectedActivityMemberName || 'Nhân viên'}`,
          summaryLabel: 'Hiển thị 1-20 trong 0 hoạt động',
          sections: [],
        }}
        isLoading={isActivityLoading}
      />
      <StaffMemberActionDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        memberName={selectedActionMemberName}
        actionLabel={selectedActionLabel}
      />
    </>
  )
}