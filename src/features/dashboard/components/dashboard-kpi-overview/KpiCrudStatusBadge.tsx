import { MESSAGES } from '@/constants/messages'
import { cn } from '@/lib/utils'

import type { DashboardKpiCrudStatus } from '@/features/dashboard/logic/dashboardKpiCrud.types'

type KpiCrudStatusBadgeProps = {
  status: DashboardKpiCrudStatus
}

const statusClassMap: Record<DashboardKpiCrudStatus, string> = {
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  processing: 'bg-amber-100 text-amber-700 border-amber-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  error: 'bg-rose-100 text-rose-700 border-rose-200',
}

const statusLabelMap: Record<DashboardKpiCrudStatus, string> = {
  success: MESSAGES.DASHBOARD.KPI_OVERVIEW.STATUS.SUCCESS,
  processing: MESSAGES.DASHBOARD.KPI_OVERVIEW.STATUS.PROCESSING,
  cancelled: MESSAGES.DASHBOARD.KPI_OVERVIEW.STATUS.CANCELLED,
  error: MESSAGES.DASHBOARD.KPI_OVERVIEW.STATUS.ERROR,
}

export function KpiCrudStatusBadge({ status }: KpiCrudStatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold', statusClassMap[status])}>
      {statusLabelMap[status]}
    </span>
  )
}
