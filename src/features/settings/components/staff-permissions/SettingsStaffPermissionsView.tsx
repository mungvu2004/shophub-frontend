import type { SettingsStaffPermissionsViewModel } from '@/features/settings/logic/settingsStaffPermissions.types'

import { PermissionsMatrixSection } from '@/features/settings/components/staff-permissions/PermissionsMatrixSection'
import { StaffMembersTableSection } from '@/features/settings/components/staff-permissions/StaffMembersTableSection'
import { StaffPermissionsBreadcrumb } from '@/features/settings/components/staff-permissions/StaffPermissionsBreadcrumb'
import { StaffPermissionsHeader } from '@/features/settings/components/staff-permissions/StaffPermissionsHeader'
import { StaffSummaryCards } from '@/features/settings/components/staff-permissions/StaffSummaryCards'
import { SupportedPlatformsStrip } from '@/features/settings/components/staff-permissions/SupportedPlatformsStrip'

type SettingsStaffPermissionsViewProps = {
  model: SettingsStaffPermissionsViewModel
  onInviteClick: () => void
  onMemberActionClick: (memberId: string, memberName: string, actionId: string, actionLabel: string) => void
  onMemberActivityClick: (memberId: string, memberName: string) => void
}

export function SettingsStaffPermissionsView({
  model,
  onInviteClick,
  onMemberActionClick,
  onMemberActivityClick,
}: SettingsStaffPermissionsViewProps) {
  return (
    <div className="pb-10">
      <div className="mx-auto max-w-[1280px] space-y-6">
        <StaffPermissionsBreadcrumb />

        <StaffPermissionsHeader
          title={model.title}
          subtitle={model.subtitle}
          actionLabel={model.inviteButtonLabel}
          onActionClick={onInviteClick}
        />

        <SupportedPlatformsStrip platforms={model.supportedPlatforms} />

        <StaffSummaryCards cards={model.summaryCards} />

        <StaffMembersTableSection
          title={model.membersSectionTitle}
          description={model.membersSectionDescription}
          members={model.members}
          onActionClick={onMemberActionClick}
          onActivityClick={onMemberActivityClick}
        />

        <PermissionsMatrixSection
          title={model.matrixTitle}
          description={model.matrixDescription}
          columns={model.matrixColumns}
          rows={model.matrixRows}
        />
      </div>
    </div>
  )
}