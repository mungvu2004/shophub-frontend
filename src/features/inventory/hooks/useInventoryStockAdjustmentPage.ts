import { useMemo, useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useInventorySKUs, useWarehouses } from '@/features/inventory/hooks/useInventoryData'
import { useInventoryStockAdjustment } from '@/features/inventory/hooks/useInventoryStockAdjustment'
import type { InventoryAdjustmentMovementType, InventoryStockAdjustmentPayload } from '@/features/inventory/logic/inventoryPageHeader.types'
import type { StockLevel, Warehouse } from '@/types/inventory.types'

export type AdjustmentFormState = {
  stockLevelId: string
  warehouseId: string
  delta: string
  movementType: InventoryAdjustmentMovementType
  reason: string
  note: string
}

type InventoryAdjustmentLocationState = {
  from?: string
  prefillStockLevelId?: string
}

export type AdjustmentFormErrors = Partial<Record<keyof AdjustmentFormState, string>>

export const movementOptions: Array<{ value: InventoryAdjustmentMovementType; label: string; helper: string }> = [
  { value: 'MANUAL_ADJUSTMENT', label: 'Điều chỉnh thủ công', helper: 'Cộng hoặc trừ theo số lượng bạn nhập.' },
  { value: 'IMPORT', label: 'Nhập kho', helper: 'Tự động cộng tồn kho.' },
  { value: 'DAMAGE_LOSS', label: 'Hàng hỏng / mất mát', helper: 'Tự động trừ tồn kho.' },
  { value: 'TRANSFER_IN', label: 'Chuyển kho vào', helper: 'Tự động cộng tồn kho.' },
  { value: 'TRANSFER_OUT', label: 'Chuyển kho ra', helper: 'Tự động trừ tồn kho.' },
]

export const reasonOptions = [
  'Kiểm kê định kỳ',
  'Sai lệch sau đối soát',
  'Nhập bổ sung từ nhà cung cấp',
  'Hàng lỗi hoặc hỏng',
  'Mất mát trong kho',
  'Điều chuyển giữa kho',
  'Tách bộ hoặc gộp bộ sản phẩm',
]

function getInitialState(defaultWarehouseId = '', prefillStockLevelId = ''): AdjustmentFormState {
  return {
    stockLevelId: prefillStockLevelId,
    warehouseId: defaultWarehouseId,
    delta: '1',
    movementType: 'MANUAL_ADJUSTMENT',
    reason: 'Kiểm kê định kỳ',
    note: '',
  }
}

export function normalizeDelta(delta: number, movementType: InventoryAdjustmentMovementType) {
  const magnitude = Math.abs(delta)

  if (movementType === 'IMPORT' || movementType === 'TRANSFER_IN') {
    return magnitude
  }

  if (movementType === 'DAMAGE_LOSS' || movementType === 'TRANSFER_OUT') {
    return -magnitude
  }

  return delta
}

export function useInventoryStockAdjustmentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams<{ stockLevelId?: string }>()
  const locationState = (location.state as InventoryAdjustmentLocationState | null) ?? null

  const returnPath = locationState?.from || '/inventory/sku-stock'
  const prefillStockLevelId = params.stockLevelId || locationState?.prefillStockLevelId || ''

  const { data: stockSource, isLoading: isLoadingStock } = useInventorySKUs({
    limit: 1000,
    offset: 0,
  })
  const { data: warehousesData } = useWarehouses()
  const adjustmentMutation = useInventoryStockAdjustment()

  const inventoryItems = useMemo(() => stockSource?.items ?? [], [stockSource?.items])

  const warehouseOptions = useMemo<Warehouse[]>(() => {
    if ((warehousesData ?? []).length > 0) {
      return warehousesData ?? []
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
  }, [inventoryItems, warehousesData])

  const defaultWarehouseId = useMemo(() => {
    return warehouseOptions.find((warehouse) => warehouse.isDefault)?.id
      ?? warehouseOptions.find((warehouse) => warehouse.isActive)?.id
      ?? warehouseOptions[0]?.id
      ?? ''
  }, [warehouseOptions])

  const [form, setForm] = useState<AdjustmentFormState>(() => getInitialState(defaultWarehouseId, prefillStockLevelId))
  const [errors, setErrors] = useState<AdjustmentFormErrors>({})

  const selectedItem = useMemo<StockLevel | null>(() => {
    if (!form.stockLevelId) {
      return null
    }

    return inventoryItems.find((item) => item.id === form.stockLevelId) ?? null
  }, [form.stockLevelId, inventoryItems])

  const resolvedWarehouseId = form.warehouseId || selectedItem?.warehouseId || defaultWarehouseId
  const selectedWarehouse = warehouseOptions.find((warehouse) => warehouse.id === resolvedWarehouseId)
  const parsedDelta = Number(form.delta)
  const normalizedDelta = normalizeDelta(Number.isFinite(parsedDelta) ? parsedDelta : 0, form.movementType)

  const simulation = useMemo(() => {
    if (!selectedItem) {
      return null
    }

    const nextPhysical = Math.max(0, selectedItem.physicalQty + normalizedDelta)
    const nextAvailable = Math.max(0, nextPhysical - selectedItem.reservedQty)

    return {
      nextPhysical,
      nextAvailable,
    }
  }, [normalizedDelta, selectedItem])

  const selectedItemDescription = useMemo(() => {
    if (!selectedItem) {
      return ''
    }

    const baseName = selectedItem.productName || selectedItem.variantName || selectedItem.sku
    const categoryText = selectedItem.category ? `Nhóm ${selectedItem.category}. ` : ''
    const warehouseText = `Đang theo dõi tại kho ${selectedItem.warehouseName}.`

    return `${baseName}. ${categoryText}${warehouseText}`
  }, [selectedItem])

  const relatedVariants = useMemo(() => {
    if (!selectedItem) {
      return []
    }

    const productNameKey = (selectedItem.productName || '').trim().toLowerCase()

    if (!productNameKey) {
      return []
    }

    const uniqueByVariant = new Map<string, StockLevel>()

    inventoryItems.forEach((item) => {
      const itemName = (item.productName || '').trim().toLowerCase()
      if (itemName !== productNameKey) {
        return
      }

      if (!uniqueByVariant.has(item.variantId)) {
        uniqueByVariant.set(item.variantId, item)
      }
    })

    return Array.from(uniqueByVariant.values())
      .filter((item) => item.variantId !== selectedItem.variantId)
      .slice(0, 6)
  }, [inventoryItems, selectedItem])

  const onFieldChange = <K extends keyof AdjustmentFormState>(key: K, value: AdjustmentFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onBack = () => {
    navigate(returnPath)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: AdjustmentFormErrors = {}
    const deltaValue = Number(form.delta)
    const currentSelectedItem = selectedItem

    if (!currentSelectedItem) {
      nextErrors.stockLevelId = 'Chọn SKU cần điều chỉnh.'
    }

    if (!resolvedWarehouseId.trim()) {
      nextErrors.warehouseId = 'Chọn kho áp dụng.'
    }

    if (!Number.isFinite(deltaValue) || deltaValue === 0) {
      nextErrors.delta = 'Số lượng điều chỉnh phải khác 0.'
    }

    if (!form.reason.trim()) {
      nextErrors.reason = 'Nhập lý do điều chỉnh.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const payload: InventoryStockAdjustmentPayload = {
      variantId: currentSelectedItem!.variantId,
      warehouseId: resolvedWarehouseId,
      delta: normalizeDelta(deltaValue, form.movementType),
      movementType: form.movementType,
      reason: form.reason.trim(),
      note: form.note.trim() || undefined,
    }

    await adjustmentMutation.mutateAsync(payload)
    navigate(returnPath)
  }

  return {
    form,
    errors,
    returnPath,
    warehouseOptions,
    selectedItem,
    selectedWarehouse,
    resolvedWarehouseId,
    selectedItemDescription,
    relatedVariants,
    normalizedDelta,
    simulation,
    isLoadingStock,
    isSubmitting: adjustmentMutation.isPending,
    movementOptions,
    reasonOptions,
    onFieldChange,
    onBack,
    handleSubmit,
  }
}
