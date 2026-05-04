import { useMemo, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { InventoryAdjustmentMovementType, InventoryStockAdjustmentPayload } from '@/features/inventory/logic/inventoryPageHeader.types'
import type { StockLevel, Warehouse } from '@/types/inventory.types'

type AdjustmentFormState = {
  stockLevelId: string
  warehouseId: string
  delta: string
  movementType: InventoryAdjustmentMovementType
  reason: string
  note: string
}

type InventoryStockAdjustmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  inventoryItems: StockLevel[]
  warehouses: Warehouse[]
  onSubmit: (payload: InventoryStockAdjustmentPayload) => Promise<void> | void
  isSubmitting?: boolean
}

const movementOptions: Array<{ value: InventoryAdjustmentMovementType; label: string; helper: string }> = [
  { value: 'MANUAL_ADJUSTMENT', label: 'Điều chỉnh thủ công', helper: 'Cộng hoặc trừ theo số lượng bạn nhập.' },
  { value: 'IMPORT', label: 'Nhập kho', helper: 'Tự động cộng tồn kho.' },
  { value: 'DAMAGE_LOSS', label: 'Hàng hỏng / mất mát', helper: 'Tự động trừ tồn kho.' },
  { value: 'TRANSFER_IN', label: 'Chuyển kho vào', helper: 'Tự động cộng tồn kho.' },
  { value: 'TRANSFER_OUT', label: 'Chuyển kho ra', helper: 'Tự động trừ tồn kho.' },
]

const reasonOptions = [
  'Kiểm kê định kỳ',
  'Sai lệch sau đối soát',
  'Nhập bổ sung từ nhà cung cấp',
  'Hàng lỗi hoặc hỏng',
  'Mất mát trong kho',
  'Điều chuyển giữa kho',
  'Tách bộ hoặc gộp bộ sản phẩm',
]

function getInitialState(defaultWarehouseId = ''): AdjustmentFormState {
  return {
    stockLevelId: '',
    warehouseId: defaultWarehouseId,
    delta: '1',
    movementType: 'MANUAL_ADJUSTMENT',
    reason: 'Kiểm kê kho',
    note: '',
  }
}

function normalizeDelta(delta: number, movementType: InventoryAdjustmentMovementType) {
  const magnitude = Math.abs(delta)

  if (movementType === 'IMPORT' || movementType === 'TRANSFER_IN') {
    return magnitude
  }

  if (movementType === 'DAMAGE_LOSS' || movementType === 'TRANSFER_OUT') {
    return -magnitude
  }

  return delta
}

export function InventoryStockAdjustmentDialog({
  open,
  onOpenChange,
  inventoryItems,
  warehouses,
  onSubmit,
  isSubmitting = false,
}: InventoryStockAdjustmentDialogProps) {
  const [form, setForm] = useState<AdjustmentFormState>(() => getInitialState())
  const [errors, setErrors] = useState<Partial<Record<keyof AdjustmentFormState, string>>>({})

  const defaultWarehouseId = useMemo(() => {
    return warehouses.find((warehouse) => warehouse.isDefault)?.id ?? warehouses.find((warehouse) => warehouse.isActive)?.id ?? warehouses[0]?.id ?? ''
  }, [warehouses])

  const selectedItem = useMemo(() => {
    if (!form.stockLevelId) {
      return null
    }

    return inventoryItems.find((item) => item.id === form.stockLevelId) ?? null
  }, [form.stockLevelId, inventoryItems])

  const warehouseOptions = useMemo(() => {
    if (warehouses.length > 0) {
      return warehouses
    }

    const uniqueWarehouses = new Map<string, Warehouse>()
    inventoryItems.forEach((item) => {
      if (!uniqueWarehouses.has(item.warehouseId)) {
        uniqueWarehouses.set(item.warehouseId, {
          id: item.warehouseId,
          sellerId: item.warehouseId,
          name: item.warehouseName,
          isDefault: false,
          isActive: true,
          createdAt: item.updatedAt,
        })
      }
    })

    return Array.from(uniqueWarehouses.values())
  }, [inventoryItems, warehouses])

  const [prevDefaultWarehouseId, setPrevDefaultWarehouseId] = useState(defaultWarehouseId)
  const [prevOpen, setPrevOpen] = useState(open)

  if (defaultWarehouseId !== prevDefaultWarehouseId || open !== prevOpen) {
    setPrevDefaultWarehouseId(defaultWarehouseId)
    setPrevOpen(open)
    if (open) {
      setForm(getInitialState(defaultWarehouseId))
      setErrors({})
    }
  }

  const [prevSelectedItem, setPrevSelectedItem] = useState(selectedItem)

  if (selectedItem !== prevSelectedItem) {
    setPrevSelectedItem(selectedItem)
    if (selectedItem && form.warehouseId !== selectedItem.warehouseId) {
      setForm((current) => ({
        ...current,
        warehouseId: selectedItem.warehouseId,
      }))
    }
  }

  const selectedWarehouse = warehouseOptions.find((warehouse) => warehouse.id === form.warehouseId)

  const onFieldChange = <K extends keyof AdjustmentFormState>(key: K, value: AdjustmentFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: Partial<Record<keyof AdjustmentFormState, string>> = {}
    const parsedDelta = Number(form.delta)
    const currentSelectedItem = selectedItem

    if (!currentSelectedItem) {
      nextErrors.stockLevelId = 'Chọn SKU có sẵn cần điều chỉnh.'
    }

    if (!form.warehouseId.trim()) {
      nextErrors.warehouseId = 'Chọn kho áp dụng.'
    }

    if (!Number.isFinite(parsedDelta) || parsedDelta === 0) {
      nextErrors.delta = 'Số lượng điều chỉnh phải khác 0.'
    }

    if (!form.reason.trim()) {
      nextErrors.reason = 'Nhập lý do điều chỉnh.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    await onSubmit({
      variantId: currentSelectedItem!.variantId,
      warehouseId: form.warehouseId,
      delta: normalizeDelta(parsedDelta, form.movementType),
      movementType: form.movementType,
      reason: form.reason.trim(),
      note: form.note.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="drawer-right"
        overlayClassName="bg-slate-900/35 backdrop-blur-[2px]"
        showCloseButton={false}
      >
        <div className="flex h-full flex-col">
          <header className="border-b border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-slate-600 hover:text-slate-900"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                <X className="mr-1 h-4 w-4" />
                Đóng panel
              </Button>
              <div className="text-center">
                <h2 className="text-base font-bold text-slate-900">Điều chỉnh tồn kho</h2>
                <p className="text-xs text-slate-500">Panel trượt ngang để ghi nhận biến động kho.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="border-b border-slate-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Chọn SKU, kho và loại biến động trước khi lưu.
          </div>

          <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
            <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4 pb-8">
              <div className="space-y-4">
                {selectedItem ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{selectedItem.productName ?? selectedItem.variantName ?? 'SKU đã chọn'}</Badge>
                      <span className="text-xs font-medium text-slate-500">SKU: {selectedItem.sku}</span>
                      <span className="text-xs font-medium text-slate-500">Variant: {selectedItem.variantId}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="rounded-lg bg-slate-50 px-2 py-1">Kho: <span className="font-semibold text-slate-700">{selectedWarehouse?.name ?? selectedItem.warehouseName}</span></div>
                      <div className="rounded-lg bg-slate-50 px-2 py-1">Danh mục: <span className="font-semibold text-slate-700">{selectedItem.category ?? 'Chưa phân loại'}</span></div>
                      <div className="rounded-lg bg-slate-50 px-2 py-1">Tồn thực tế: <span className="font-semibold text-slate-700">{selectedItem.physicalQty}</span></div>
                      <div className="rounded-lg bg-slate-50 px-2 py-1">Đang giữ chỗ: <span className="font-semibold text-slate-700">{selectedItem.reservedQty}</span></div>
                      <div className="rounded-lg bg-slate-50 px-2 py-1">Khả dụng: <span className="font-semibold text-slate-700">{selectedItem.availableQty}</span></div>
                      <div className="rounded-lg bg-slate-50 px-2 py-1">Mức tối thiểu: <span className="font-semibold text-slate-700">{selectedItem.minThreshold}</span></div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">Shopee: {selectedItem.channelStock?.shopee ?? 0}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">TikTok: {selectedItem.channelStock?.tiktok ?? 0}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">Lazada: {selectedItem.channelStock?.lazada ?? 0}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      Sau điều chỉnh, hệ thống sẽ ghi nhận biến động <span className="font-semibold text-slate-700">{normalizeDelta(Number(form.delta || 0), form.movementType)}</span> cho SKU này.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm">
                    Chọn SKU có sẵn để xem chi tiết tồn kho trước khi lưu.
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="stockLevelId">
                      SKU hiện có
                    </label>
                    <select
                      id="stockLevelId"
                      value={form.stockLevelId}
                      onChange={(event) => onFieldChange('stockLevelId', event.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">Chọn SKU từ danh sách có sẵn</option>
                      {inventoryItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.sku} - {item.productName ?? item.variantName ?? item.variantId} ({item.warehouseName})
                        </option>
                      ))}
                    </select>
                    {errors.stockLevelId ? <p className="text-sm text-red-600">{errors.stockLevelId}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="warehouseId">
                      Kho áp dụng
                    </label>
                    <select
                      id="warehouseId"
                      value={form.warehouseId}
                      onChange={(event) => onFieldChange('warehouseId', event.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">Chọn kho</option>
                      {warehouseOptions.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </option>
                      ))}
                    </select>
                    {errors.warehouseId ? <p className="text-sm text-red-600">{errors.warehouseId}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="delta">
                      Số lượng thay đổi
                    </label>
                    <Input
                      id="delta"
                      type="number"
                      value={form.delta}
                      onChange={(event) => onFieldChange('delta', event.target.value)}
                      placeholder="Ví dụ: 10 hoặc -5"
                    />
                    {errors.delta ? <p className="text-sm text-red-600">{errors.delta}</p> : null}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="movementType">
                      Loại biến động
                    </label>
                    <select
                      id="movementType"
                      value={form.movementType}
                      onChange={(event) => onFieldChange('movementType', event.target.value as InventoryAdjustmentMovementType)}
                      className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {movementOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500">
                      {movementOptions.find((option) => option.value === form.movementType)?.helper}
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="reason">
                      Lý do
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {reasonOptions.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => onFieldChange('reason', reason)}
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${form.reason === reason ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                    <Input
                      id="reason"
                      list="inventory-adjustment-reasons"
                      value={form.reason}
                      onChange={(event) => onFieldChange('reason', event.target.value)}
                      placeholder="Chọn nhanh ở trên hoặc nhập lý do cụ thể"
                    />
                    <datalist id="inventory-adjustment-reasons">
                      {reasonOptions.map((reason) => (
                        <option key={reason} value={reason} />
                      ))}
                    </datalist>
                    {errors.reason ? <p className="text-sm text-red-600">{errors.reason}</p> : null}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="note">
                      Ghi chú
                    </label>
                    <textarea
                      id="note"
                      value={form.note}
                      onChange={(event) => onFieldChange('note', event.target.value)}
                      placeholder="Ghi chú nội bộ, mã phiếu, người xác nhận..."
                      className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <footer className="border-t border-slate-100 bg-white px-4 py-4">
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu điều chỉnh'}
                </Button>
              </div>
            </footer>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}