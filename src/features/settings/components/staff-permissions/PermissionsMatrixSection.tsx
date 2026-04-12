import { Check, Eye, X } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

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
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-[rgba(240,243,255,0.55)] hover:bg-[rgba(240,243,255,0.55)]">
              <TableHead className="w-[190px] px-6 py-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Vai trò</TableHead>
              {columns.map((column) => (
                <TableHead key={column.id} className="px-4 py-5 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                <TableCell className="px-6 py-5 font-semibold text-slate-800">{row.roleLabel}</TableCell>
                {row.cells.map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'px-4 py-5 text-center text-sm',
                      index === columns.length - 1 ? 'pr-6' : '',
                    )}
                  >
                    <PermissionCell cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}