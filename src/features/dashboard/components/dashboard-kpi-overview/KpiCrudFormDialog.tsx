import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MESSAGES } from '@/constants/messages'

import type {
  DashboardKpiCrudPayload,
  DashboardKpiCrudRecord,
  DashboardKpiCrudStatus,
} from '@/features/dashboard/logic/dashboardKpiCrud.types'

type KpiCrudFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  editingItem?: DashboardKpiCrudRecord | null
  isSubmitting: boolean
  onSubmit: (payload: DashboardKpiCrudPayload) => Promise<void>
}

const metricOptions: Array<{ value: DashboardKpiCrudPayload['metricId']; label: string }> = [
  { value: 'today-revenue', label: 'Doanh thu hôm nay' },
  { value: 'total-orders', label: 'Tổng đơn hàng hôm nay' },
  { value: 'urgent-orders', label: 'Cần xử lý ngay' },
  { value: 'refund-rate', label: 'Tỷ lệ hoàn/hủy hôm nay' },
]

const statusOptions: Array<{ value: DashboardKpiCrudStatus; label: string }> = [
  { value: 'success', label: MESSAGES.DASHBOARD.KPI_OVERVIEW.STATUS.SUCCESS },
  { value: 'processing', label: MESSAGES.DASHBOARD.KPI_OVERVIEW.STATUS.PROCESSING },
  { value: 'cancelled', label: MESSAGES.DASHBOARD.KPI_OVERVIEW.STATUS.CANCELLED },
  { value: 'error', label: MESSAGES.DASHBOARD.KPI_OVERVIEW.STATUS.ERROR },
]

export function KpiCrudFormDialog({
  open,
  onOpenChange,
  mode,
  editingItem,
  isSubmitting,
  onSubmit,
}: KpiCrudFormDialogProps) {
  const initialValues = useMemo(
    () =>
      mode === 'edit' && editingItem
        ? {
            metricId: editingItem.metricId,
            title: editingItem.title,
            status: editingItem.status,
          }
        : {
            metricId: 'today-revenue' as const,
            title: '',
            status: 'success' as const,
          },
    [mode, editingItem],
  )

  const [metricId, setMetricId] = useState<DashboardKpiCrudPayload['metricId']>(initialValues.metricId)
  const [title, setTitle] = useState(initialValues.title)
  const [status, setStatus] = useState<DashboardKpiCrudStatus>(initialValues.status)

  const titleText = useMemo(
    () =>
      mode === 'create'
        ? MESSAGES.DASHBOARD.KPI_OVERVIEW.FORM.CREATE_TITLE
        : MESSAGES.DASHBOARD.KPI_OVERVIEW.FORM.UPDATE_TITLE,
    [mode],
  )

  const submitText = useMemo(
    () =>
      mode === 'create'
        ? MESSAGES.DASHBOARD.KPI_OVERVIEW.FORM.CREATE_SUBMIT
        : MESSAGES.DASHBOARD.KPI_OVERVIEW.FORM.UPDATE_SUBMIT,
    [mode],
  )

  const handleSubmit = async () => {
    await onSubmit({
      metricId,
      title: title.trim(),
      status,
    })
  }

  const isSubmitDisabled = isSubmitting || title.trim().length === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]" showCloseButton={!isSubmitting}>
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>{MESSAGES.DASHBOARD.KPI_OVERVIEW.SECTION_SUBTITLE}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kpi-metric-id">{MESSAGES.DASHBOARD.KPI_OVERVIEW.FORM.METRIC_LABEL}</Label>
            <select
              id="kpi-metric-id"
              value={metricId}
              onChange={(event) => setMetricId(event.target.value as DashboardKpiCrudPayload['metricId'])}
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {metricOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kpi-config-name">{MESSAGES.DASHBOARD.KPI_OVERVIEW.FORM.NAME_LABEL}</Label>
            <Input
              id="kpi-config-name"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ví dụ: Theo dõi đơn hoàn theo ngày"
              disabled={isSubmitting}
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kpi-config-status">{MESSAGES.DASHBOARD.KPI_OVERVIEW.FORM.STATUS_LABEL}</Label>
            <select
              id="kpi-config-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as DashboardKpiCrudStatus)}
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} loadingText={MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.SAVE_LOADING} disabled={isSubmitDisabled}>
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
