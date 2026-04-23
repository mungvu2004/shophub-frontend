import { Check, Eye, X } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'

import type { StaffPermissionMatrixCellViewModel, StaffPermissionMatrixRowViewModel } from '@/features/settings/logic/settingsStaffPermissions.types'

type PermissionsMatrixSectionProps = {
  title: string
  description: string
  columns: { id: string; label: string }[]
  rows: StaffPermissionMatrixRowViewModel[]
}

function PermissionCell({ cell }: { cell: StaffPermissionMatrixCellViewModel }) {
  if (cell.level === 'full') {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-500">
        <Check className="size-4" />
        {cell.label}
      </span>
    )
  }

  if (cell.level === 'view') {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-500">
        <Eye className="size-4" />
        {cell.label}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-rose-500">
      <X className="size-4" />
      {cell.label}
    </span>
  )
}

export function PermissionsMatrixSection({ title, description, columns, rows }: PermissionsMatrixSectionProps) {
  const tableColumns: DataTableColumn<StaffPermissionMatrixRowViewModel>[] = [
    {
      id: 'roleLabel',
      header: 'Vai trò',
      widthClassName: 'w-[190px] px-6',
      headerClassName: 'py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500',
      cellClassName: 'px-6 font-semibold text-slate-800',
      accessor: (row) => row.roleLabel,
    },
    ...columns.map<DataTableColumn<StaffPermissionMatrixRowViewModel>>((column, index) => ({
      id: column.id,
      header: column.label,
      align: 'center',
      headerClassName: 'px-4 py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500',
      cellClassName: index === columns.length - 1 ? 'px-4 pr-6 text-sm' : 'px-4 text-sm',
      cell: (row) => <PermissionCell cell={row.cells[index]} />,
    })),
  ]

  return (
    <Card className="gap-0 border-0 bg-white shadow-[0px_12px_32px_rgba(15,23,42,0.06)]">
      <CardHeader className="border-b border-slate-100 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-[18px] font-semibold text-slate-900">{title}</CardTitle>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">Quyền mở rộng cho Lazada</span>
        </div>
        <p className="text-sm text-slate-500">{description}</p>
      </CardHeader>

      <CardContent className="p-0">
        <DataTable
          rows={rows}
          columns={tableColumns}
          rowKey={(row) => row.id}
          tableClassName="[&_thead_tr]:border-b [&_thead_tr]:border-slate-100 [&_thead_tr]:bg-[rgba(240,243,255,0.55)] [&_thead_tr]:hover:bg-[rgba(240,243,255,0.55)]"
          rowClassName="hover:bg-slate-50/70"
        />
      </CardContent>
    </Card>
  )
}