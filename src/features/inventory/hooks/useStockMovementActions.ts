import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'
import { inventoryService } from '@/features/inventory/services/inventoryService'
import type { StockLevel, Warehouse, MovementType } from '@/types/inventory.types'
import { MESSAGES } from '@/constants/messages'

export type StockMovementFormState = {
  variantId: string
  warehouseId: string
  delta: number
  movementType: MovementType
  reason: string
  note: string
}

export type MovementDirection = 'IMPORT' | 'EXPORT'

interface UseStockMovementActionsOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useStockMovementActions(options: UseStockMovementActionsOptions = {}) {
  const { onSuccess, onError } = options
  const crud = useCRUDActions<StockLevel>()

  // Modal state
  const [isOpen, setIsOpen] = useState(false)
  const [direction, setDirection] = useState<MovementDirection | null>(null)

  // Data loading state
  const [inventoryItems, setInventoryItems] = useState<StockLevel[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const isLoadingRef = useRef(false)

  // Form state
  const [form, setForm] = useState<StockMovementFormState>({
    variantId: '',
    warehouseId: '',
    delta: 1,
    movementType: 'IMPORT',
    reason: '',
    note: '',
  })

  // Load data when modal opens
  useEffect(() => {
    if (!isOpen || isLoadingRef.current) return

    isLoadingRef.current = true
    // Use timeout to defer loading state update to avoid synchronous setState
    const timeoutId = setTimeout(() => {
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
        .catch((error) => {
          onError?.(error)
        })
        .finally(() => {
          setIsLoadingData(false)
          isLoadingRef.current = false
        })
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [isOpen, onError])

  // Open modal helpers
  const openImport = useCallback(() => {
    setDirection('IMPORT')
    setForm(prev => ({
      ...prev,
      movementType: 'IMPORT',
      delta: 1,
      reason: 'Nhập hàng bổ sung',
    }))
    setIsOpen(true)
  }, [])

  const openExport = useCallback(() => {
    setDirection('EXPORT')
    setForm(prev => ({
      ...prev,
      movementType: 'ORDER_FULFILL',
      delta: 1,
      reason: 'Xuất hàng đi đơn',
    }))
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setDirection(null)
  }, [])

  // Form field update
  const updateField = useCallback(<K extends keyof StockMovementFormState>(
    key: K,
    value: StockMovementFormState[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

  // Submit handler
  const submit = useCallback(async () => {
    if (!form.variantId || !form.warehouseId || !form.delta) {
      return { success: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc' }
    }

    // Logic: If export, delta should be negative
    const finalDelta = direction === 'EXPORT' ? -Math.abs(form.delta) : Math.abs(form.delta)

    const actionMessages = direction === 'IMPORT'
      ? {
          processing: MESSAGES.INVENTORY.STOCK_MOVEMENT.FORM.IMPORT_SUBMITTING,
          success: MESSAGES.INVENTORY.STOCK_MOVEMENT.SUCCESS.IMPORT,
          error: MESSAGES.INVENTORY.STOCK_MOVEMENT.ERROR.IMPORT,
        }
      : {
          processing: MESSAGES.INVENTORY.STOCK_MOVEMENT.FORM.EXPORT_SUBMITTING,
          success: MESSAGES.INVENTORY.STOCK_MOVEMENT.SUCCESS.EXPORT,
          error: MESSAGES.INVENTORY.STOCK_MOVEMENT.ERROR.EXPORT,
        }

    try {
      await crud.handleCreate(
        () => inventoryService.adjustStock({
          variantId: form.variantId,
          warehouseId: form.warehouseId,
          delta: finalDelta,
          movementType: form.movementType,
          reason: form.reason,
          note: form.note,
        }),
        {
          onSuccess: () => {
            onSuccess?.()
            close()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        actionMessages
      )
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }, [form, direction, crud, onSuccess, onError, close])

  // Reset form
  const resetForm = useCallback(() => {
    setForm({
      variantId: '',
      warehouseId: '',
      delta: 1,
      movementType: 'IMPORT',
      reason: '',
      note: '',
    })
  }, [])

  // Get submit button label
  const getSubmitButtonLabel = useCallback(() => {
    if (crud.isProcessing) {
      return direction === 'IMPORT'
        ? MESSAGES.INVENTORY.STOCK_MOVEMENT.FORM.IMPORT_SUBMITTING
        : MESSAGES.INVENTORY.STOCK_MOVEMENT.FORM.EXPORT_SUBMITTING
    }
    return direction === 'IMPORT'
      ? MESSAGES.INVENTORY.STOCK_MOVEMENT.FORM.IMPORT_SUBMIT
      : MESSAGES.INVENTORY.STOCK_MOVEMENT.FORM.EXPORT_SUBMIT
  }, [crud.isProcessing, direction])

  return useMemo(
    () => ({
      // Modal state
      isOpen,
      direction,

      // Data
      inventoryItems,
      warehouses,
      isLoadingData,

      // Form
      form,

      // Processing state
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,

      // Actions
      openImport,
      openExport,
      close,
      updateField,
      submit,
      resetForm,

      // Helpers
      getSubmitButtonLabel,

      // Messages
      messages: {
        importTitle: MESSAGES.INVENTORY.STOCK_MOVEMENT.FORM.IMPORT_TITLE,
        exportTitle: MESSAGES.INVENTORY.STOCK_MOVEMENT.FORM.EXPORT_TITLE,
      },
    }),
    [
      isOpen,
      direction,
      inventoryItems,
      warehouses,
      isLoadingData,
      form,
      crud.isProcessing,
      crud.actionType,
      openImport,
      openExport,
      close,
      updateField,
      submit,
      resetForm,
      getSubmitButtonLabel,
    ]
  )
}
