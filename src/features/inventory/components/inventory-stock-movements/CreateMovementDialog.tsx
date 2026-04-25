import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { MovementForm } from './MovementForm'
import type { useCreateMovement } from '@/features/inventory/hooks/useCreateMovement'

type CreateMovementDialogProps = {
  controller: ReturnType<typeof useCreateMovement>
}

export function CreateMovementDialog({ controller }: CreateMovementDialogProps) {
  const {
    isOpen,
    type,
    form,
    inventoryItems,
    warehouses,
    isSubmitting,
    isLoadingData,
    close,
    updateField,
    submit,
  } = controller

  if (!type) return null

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && close()}>
      <DialogContent variant="drawer-right" className="flex flex-col gap-0 p-0" showCloseButton={false}>
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={close}
              className="size-8 rounded-full hover:bg-slate-100"
            >
              <X className="size-4 text-slate-500" />
            </Button>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {type === 'IMPORT' ? 'Phiếu Nhập kho' : 'Phiếu Xuất kho'}
              </h2>
              <p className="text-xs text-slate-500">Ghi nhận biến động tồn kho thực tế</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          {isLoadingData ? (
            <div className="flex h-32 items-center justify-center text-sm text-slate-400">
              Đang tải dữ liệu...
            </div>
          ) : (
            <MovementForm
              form={form}
              inventoryItems={inventoryItems}
              warehouses={warehouses}
              type={type}
              onFieldChange={updateField}
            />
          )}
        </div>

        <footer className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={close} disabled={isSubmitting}>
              Hủy bỏ
            </Button>
            <Button
              onClick={submit}
              disabled={isSubmitting || isLoadingData}
              className={type === 'IMPORT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}
            >
              {isSubmitting ? 'Đang xử lý...' : type === 'IMPORT' ? 'Xác nhận Nhập' : 'Xác nhận Xuất'}
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
