import { useCallback, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { Button } from '@/components/ui/button'
import { MESSAGES } from '@/constants/messages'
import { useDashboardKpiOverviewActions } from '@/features/dashboard/hooks/useDashboardKpiOverviewActions'
import type {
  DashboardKpiCrudPayload,
  DashboardKpiCrudRecord,
} from '@/features/dashboard/logic/dashboardKpiCrud.types'

import { KpiCrudFormDialog } from './KpiCrudFormDialog'
import { KpiCrudStatusBadge } from './KpiCrudStatusBadge'

export function DashboardKpiCrudSection() {
  const {
    items,
    isLoading,
    isError,
    refetch,
    isProcessing,
    actionType,
    activeRecordId,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
  } = useDashboardKpiOverviewActions()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DashboardKpiCrudRecord | null>(null)
  const [deletingItem, setDeletingItem] = useState<DashboardKpiCrudRecord | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(true)

  const formMode = editingItem ? 'edit' : 'create'

  const submitProcessing = isProcessing && (actionType === 'creating' || actionType === 'updating')

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null)
    setIsFormOpen(true)
  }, [])

  const handleOpenEdit = useCallback((item: DashboardKpiCrudRecord) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }, [])

  const handleSubmitForm = useCallback(
    async (payload: DashboardKpiCrudPayload) => {
      if (formMode === 'create') {
        await handleCreate(payload)
      } else if (editingItem) {
        await handleUpdate(editingItem.id, payload)
      }

      setIsFormOpen(false)
      setEditingItem(null)
    },
    [formMode, editingItem, handleCreate, handleUpdate],
  )

  const listContent = useMemo(() => {
    if (isLoading) {
      return <p className="text-sm text-slate-500">Đang tải cấu hình KPI...</p>
    }

    if (items.length === 0) {
      return <p className="text-sm text-slate-500">{MESSAGES.DASHBOARD.KPI_OVERVIEW.EMPTY}</p>
    }

    return (
      <div className="space-y-3">
        {items.map((item) => {
          const isUpdating = isProcessing && actionType === 'updating' && activeRecordId === item.id
          const isDeleting = isProcessing && actionType === 'deleting' && activeRecordId === item.id
          const isStatusChanging = isProcessing && actionType === 'status-changing' && activeRecordId === item.id

          return (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    Mã chỉ số: <span className="font-semibold text-slate-700">{item.metricId}</span>
                  </p>
                </div>
                <KpiCrudStatusBadge status={item.status} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenEdit(item)}
                  isLoading={isUpdating}
                  loadingText={MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.EDIT_LOADING}
                  disabled={isProcessing && !isUpdating}
                >
                  {MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.EDIT}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleStatusChange(item.id, item.status)}
                  isLoading={isStatusChanging}
                  loadingText={MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.STATUS_LOADING}
                  disabled={isProcessing && !isStatusChanging}
                >
                  {MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.STATUS}
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setDeletingItem(item)}
                  isLoading={isDeleting}
                  loadingText={MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.DELETE_LOADING}
                  disabled={isProcessing && !isDeleting}
                >
                  {MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.DELETE}
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    )
  }, [isLoading, items, isProcessing, actionType, activeRecordId, handleOpenEdit, handleStatusChange])

  if (isError) {
    return <DataLoadErrorState title="Không tải được cấu hình KPI." onRetry={() => refetch()} />
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <h3 className="text-base font-extrabold text-slate-900">{MESSAGES.DASHBOARD.KPI_OVERVIEW.SECTION_TITLE}</h3>
          <p className="text-sm text-slate-500">{MESSAGES.DASHBOARD.KPI_OVERVIEW.SECTION_SUBTITLE}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Mở rộng cấu hình KPI' : 'Thu gọn cấu hình KPI'}
            className="px-3"
          >
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
              aria-hidden="true"
            />
          </Button>
          
          <Button
            type="button"
            onClick={handleOpenCreate}
            isLoading={isProcessing && actionType === 'creating'}
            loadingText={MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.ADD_LOADING}
            disabled={isProcessing && actionType !== 'creating' || isCollapsed}
          >
            {MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.ADD}
          </Button>
        </div>
      </div>

      {!isCollapsed && listContent}

      {!isCollapsed && (
        <>
          <KpiCrudFormDialog
            key={`${formMode}-${editingItem?.id ?? 'new'}-${isFormOpen ? 'open' : 'closed'}`}
            open={isFormOpen}
            onOpenChange={(open) => {
              setIsFormOpen(open)
              if (!open) setEditingItem(null)
            }}
            mode={formMode}
            editingItem={editingItem}
            onSubmit={handleSubmitForm}
            isSubmitting={submitProcessing}
          />

          <ConfirmDialog
            open={Boolean(deletingItem)}
            onOpenChange={(open) => {
              if (!open) setDeletingItem(null)
            }}
            title={MESSAGES.DASHBOARD.KPI_OVERVIEW.CONFIRM.DELETE_TITLE}
            description={MESSAGES.DASHBOARD.KPI_OVERVIEW.CONFIRM.DELETE_DESC}
            confirmText={MESSAGES.DASHBOARD.KPI_OVERVIEW.BUTTON.DELETE}
            onConfirm={async () => {
              if (!deletingItem) return
              await handleDelete(deletingItem.id)
              setDeletingItem(null)
            }}
            isConfirming={isProcessing && actionType === 'deleting'}
          />
        </>
      )}
    </section>
  )
}
