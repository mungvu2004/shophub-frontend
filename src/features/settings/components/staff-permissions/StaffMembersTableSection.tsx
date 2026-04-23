import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { cn } from '@/lib/utils'

import type { StaffPermissionMemberViewModel } from '@/features/settings/logic/settingsStaffPermissions.types'

type StaffMembersTableSectionProps = {
  title: string
  description: string
  members: StaffPermissionMemberViewModel[]
  onActionClick: (memberId: string, memberName: string, actionId: string, actionLabel: string) => void
  onActivityClick: (memberId: string, memberName: string) => void
}

const roleToneClassMap: Record<StaffPermissionMemberViewModel['roleTone'], string> = {
  indigo: 'bg-indigo-50 text-indigo-600',
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-500',
}

const statusToneClassMap: Record<StaffPermissionMemberViewModel['statusTone'], string> = {
  active: 'bg-emerald-500 shadow-[0px_0px_8px_rgba(16,185,129,0.35)]',
  paused: 'bg-amber-500 shadow-[0px_0px_8px_rgba(245,158,11,0.28)]',
  inactive: 'bg-slate-400',
}

const avatarToneClassMap: Record<StaffPermissionMemberViewModel['avatarTone'], string> = {
  indigo: 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white',
  blue: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white',
  emerald: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white',
  purple: 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white',
  slate: 'bg-gradient-to-br from-slate-700 to-slate-500 text-white',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '--'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

function MemberActions({
  memberId,
  memberName,
  actions,
  onActionClick,
}: {
  memberId: string
  memberName: string
  actions: StaffPermissionMemberViewModel['actions']
  onActionClick: (memberId: string, memberName: string, actionId: string, actionLabel: string) => void
}) {
  return (
    <div className="flex flex-wrap justify-end gap-x-3 gap-y-1.5">
      {actions.map((action) => {
        const toneClassName =
          action.tone === 'danger'
            ? 'text-rose-600 hover:text-rose-700'
            : action.tone === 'warning'
              ? 'text-amber-600 hover:text-amber-700'
              : 'text-indigo-600 hover:text-indigo-700'

        return (
          <Button
            key={action.id}
            type="button"
            variant="link"
            size="xs"
            onClick={(event) => {
              event.stopPropagation()
              onActionClick(memberId, memberName, action.id, action.label)
            }}
            className={cn('h-auto gap-1 px-0 py-0 text-sm font-semibold underline-offset-4', toneClassName)}
          >
            <span>{action.label}</span>
          </Button>
        )
      })}
    </div>
  )
}

export function StaffMembersTableSection({
  title,
  description,
  members,
  onActionClick,
  onActivityClick,
}: StaffMembersTableSectionProps) {
  const columns: DataTableColumn<StaffPermissionMemberViewModel>[] = [
    {
      id: 'member',
      header: 'Nhân viên',
      headerClassName: 'px-6 py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500',
      cellClassName: 'px-6 align-middle',
      cell: (member) => (
        <div className="flex items-center gap-3">
          <div className={cn('flex size-10 items-center justify-center rounded-full text-sm font-semibold', avatarToneClassMap[member.avatarTone])}>
            {getInitials(member.name)}
          </div>
          <div>
            <p className="text-left text-[15px] font-semibold text-slate-900">{member.name}</p>
            <p className="text-xs text-slate-400">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Vai trò',
      headerClassName: 'px-6 py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500',
      cellClassName: 'px-6 align-middle',
      cell: (member) => (
        <Badge variant="outline" className={cn('rounded-md border-0 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]', roleToneClassMap[member.roleTone])}>
          {member.roleLabel}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Trạng thái',
      headerClassName: 'px-6 py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500',
      cellClassName: 'px-6 align-middle',
      cell: (member) => (
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span className={cn('size-2 rounded-full', statusToneClassMap[member.statusTone])} />
          <span>{member.statusLabel}</span>
        </div>
      ),
    },
    {
      id: 'lastLoginLabel',
      header: <><span className="block">Đăng nhập</span><span className="block">cuối</span></>,
      accessor: (member) => member.lastLoginLabel,
      headerClassName: 'px-6 py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500',
      cellClassName: 'px-6 align-middle text-sm text-slate-500',
    },
    {
      id: 'permissionsLabel',
      header: 'Quyền hạn',
      accessor: (member) => member.permissionsLabel,
      headerClassName: 'px-6 py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500',
      cellClassName: 'px-6 align-middle text-sm text-slate-600',
    },
    {
      id: 'actions',
      header: 'Hành động',
      align: 'right',
      headerClassName: 'px-6 py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500',
      cellClassName: 'px-6 align-middle',
      cell: (member) => (
        <div className="space-y-1.5 text-right">
          <MemberActions
            memberId={member.id}
            memberName={member.name}
            actions={member.actions}
            onActionClick={onActionClick}
          />
          <p className="text-xs text-slate-400">Kênh: {member.supportedPlatformLabel}</p>
        </div>
      ),
    },
  ]

  return (
    <Card className="gap-0 border-0 bg-white shadow-[0px_12px_32px_rgba(15,23,42,0.06)]">
      <CardHeader className="border-b border-slate-100 pb-5">
        <CardTitle className="text-[18px] font-semibold text-slate-900">{title}</CardTitle>
        <p className="text-sm text-slate-500">{description}</p>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable
          rows={members}
          columns={columns}
          rowKey={(member) => member.id}
          tableClassName="[&_thead_tr]:border-b [&_thead_tr]:border-slate-100 [&_thead_tr]:bg-[rgba(240,243,255,0.55)] [&_thead_tr]:hover:bg-[rgba(240,243,255,0.55)]"
          rowClassName="cursor-pointer hover:bg-slate-50/80"
          onRowClick={(member) => onActivityClick(member.id, member.name)}
        />
      </CardContent>
    </Card>
  )
}