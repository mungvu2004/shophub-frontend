import { useState, useCallback } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CRUDModal } from '@/components/shared/CRUDModal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useDashboardRevenueChartsActions } from '@/features/dashboard/hooks/useDashboardRevenueChartsActions'
import type { RevenueTimelineEvent } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

export function RevenueTimelineEventCrud() {
  const {
    events,
    isProcessing,
    actionType,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useDashboardRevenueChartsActions()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RevenueTimelineEvent | null>(null)
  const [deletingItem, setDeletingItem] = useState<RevenueTimelineEvent | null>(null)

  const formMode = editingItem ? 'edit' : 'create'

  const [formData, setFormData] = useState<Omit<RevenueTimelineEvent, 'id'>>({
    date: '',
    label: '',
    type: 'flash_sale',
    impactPercent: 0,
  })

  const resetForm = useCallback(() => {
    setFormData({
      date: '',
      label: '',
      type: 'flash_sale',
      impactPercent: 0,
    })
    setEditingItem(null)
  }, [])

  const handleOpenCreate = useCallback(() => {
    resetForm()
    setIsFormOpen(true)
  }, [resetForm])

  const handleOpenEdit = useCallback((item: RevenueTimelineEvent) => {
    setEditingItem(item)
    setFormData({
      date: item.date,
      label: item.label,
      type: item.type,
      impactPercent: item.impactPercent,
    })
    setIsFormOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        if (formMode === 'create') {
          await handleCreate(formData)
        } else if (editingItem) {
          await handleUpdate(editingItem.id, formData)
        }
        setIsFormOpen(false)
        resetForm()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Error is handled by useCRUDActions
      }
    },
    [formMode, editingItem, formData, handleCreate, handleUpdate, resetForm]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingItem) return
    try {
      await handleDelete(deletingItem.id)
      setDeletingItem(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error is handled by useCRUDActions
    }
  }, [deletingItem, handleDelete])

  return (
    <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-secondary-900">Quản lý sự kiện doanh thu</h3>
          <p className="text-sm text-secondary-500">Thêm, sửa, xóa các sự kiện ảnh hưởng tới doanh thu.</p>
        </div>
        <Button onClick={handleOpenCreate} disabled={isProcessing}>
          <Plus className="mr-2 h-4 w-4" /> Thêm sự kiện
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="flex flex-col justify-between rounded-xl border border-secondary-100 p-4 hover:border-primary-100">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant={event.type === 'flash_sale' ? 'default' : 'secondary'} className={event.type === 'flash_sale' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 text-white hover:bg-blue-600'}>
                  {event.type === 'flash_sale' ? 'Flash Sale' : 'Ngày Lễ'}
                </Badge>
                <span className="text-xs font-semibold text-secondary-500">{event.date}</span>
              </div>
              <h4 className="mt-2 font-bold text-secondary-900">{event.label}</h4>
              <p className="text-sm font-medium text-emerald-600">+{event.impactPercent}% ảnh hưởng</p>
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t border-secondary-50 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(event)}
                disabled={isProcessing && actionType !== null}
              >
                {isProcessing && actionType === 'updating' && editingItem?.id === event.id ? 'Đang lưu...' : <><Edit2 className="mr-1 h-3.5 w-3.5" /> Sửa</>}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeletingItem(event)}
                disabled={isProcessing && actionType !== null}
              >
                {isProcessing && actionType === 'deleting' && deletingItem?.id === event.id ? 'Đang xóa...' : <><Trash2 className="mr-1 h-3.5 w-3.5" /> Xóa</>}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CRUDModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          resetForm()
        }}
        title={formMode === 'create' ? 'Thêm sự kiện mới' : 'Chỉnh sửa sự kiện'}
        onSubmit={handleFormSubmit}
        isProcessing={isProcessing && (actionType === 'creating' || actionType === 'updating')}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Tên sự kiện</label>
            <input
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="VD: Flash Sale 3.3"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Ngày</label>
            <input
              type="date"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Loại</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'flash_sale' | 'holiday' })}
            >
              <option value="flash_sale">Flash Sale</option>
              <option value="holiday">Ngày Lễ</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Mức độ ảnh hưởng (%)</label>
            <input
              type="number"
              step="0.1"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.impactPercent}
              onChange={(e) => setFormData({ ...formData, impactPercent: Number(e.target.value) })}
            />
          </div>
        </div>
      </CRUDModal>

      <ConfirmDialog
        open={deletingItem !== null}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title="Xác nhận xóa sự kiện"
        description={<>Bạn có chắc chắn muốn xóa sự kiện <strong>{deletingItem?.label}</strong>? Hành động này không thể hoàn tác.</>}
        onConfirm={handleConfirmDelete}
        isConfirming={isProcessing && actionType === 'deleting'}
      />
    </div>
  )
}
