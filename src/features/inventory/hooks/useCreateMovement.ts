import { useState, useCallback, useEffect } from 'react'
import { inventoryService } from '@/features/inventory/services/inventoryService'
import type { StockLevel, Warehouse, MovementType } from '@/types/inventory.types'
import { toast } from 'sonner'

export type CreateMovementFormState = {
  variantId: string
  warehouseId: string
  delta: number
  movementType: MovementType
  reason: string
  note: string
}

export function useCreateMovement(onSuccess?: () => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<'IMPORT' | 'EXPORT' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<StockLevel[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  const [form, setForm] = useState<CreateMovementFormState>({
    variantId: '',
    warehouseId: '',
    delta: 1,
    movementType: 'IMPORT',
    reason: '',
    note: '',
  })

  useEffect(() => {
    if (isOpen) {
      setIsLoadingData(true)
      Promise.all([
        inventoryService.getInventorySKUs({ limit: 100 }),
        inventoryService.getWarehouses(),
      ])
        .then(([skus, whs]) => {
          setInventoryItems(skus.items)
          setWarehouses(whs)
          
          if (whs.length > 0) {
            const defaultWh = whs.find(w => w.isDefault) || whs[0]
            setForm(prev => ({ ...prev, warehouseId: defaultWh.id }))
          }
        })
        .finally(() => setIsLoadingData(false))
    }
  }, [isOpen])

  const openImport = useCallback(() => {
    setType('IMPORT')
    setForm(prev => ({ 
      ...prev, 
      movementType: 'IMPORT',
      delta: 1,
      reason: 'Nhập hàng bổ sung'
    }))
    setIsOpen(true)
  }, [])

  const openExport = useCallback(() => {
    setType('EXPORT')
    setForm(prev => ({ 
      ...prev, 
      movementType: 'ORDER_FULFILL',
      delta: 1,
      reason: 'Xuất hàng đi đơn'
    }))
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setType(null)
  }, [])

  const updateField = <K extends keyof CreateMovementFormState>(key: K, value: CreateMovementFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const submit = async () => {
    if (!form.variantId || !form.warehouseId || !form.delta) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setIsSubmitting(true)
    try {
      // Logic: If export, delta should be negative
      const finalDelta = type === 'EXPORT' ? -Math.abs(form.delta) : Math.abs(form.delta)
      
      await inventoryService.adjustStock({
        variantId: form.variantId,
        warehouseId: form.warehouseId,
        delta: finalDelta,
        movementType: form.movementType,
        reason: form.reason,
        note: form.note,
      })

      toast.success(`${type === 'IMPORT' ? 'Nhập' : 'Xuất'} kho thành công`)
      onSuccess?.()
      close()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thực hiện thao tác')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isOpen,
    type,
    form,
    inventoryItems,
    warehouses,
    isSubmitting,
    isLoadingData,
    openImport,
    openExport,
    close,
    updateField,
    submit,
  }
}
