import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { InventoryStockAdjustmentPayload } from '@/features/inventory/logic/inventoryPageHeader.types'
import { inventoryService } from '@/features/inventory/services/inventoryService'

export function useInventoryStockAdjustment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: InventoryStockAdjustmentPayload) => inventoryService.adjustStock(payload),
    onSuccess: async (_, payload) => {
      await queryClient.invalidateQueries({ queryKey: ['inventory'] })
      toast.success(`Đã điều chỉnh tồn kho cho ${payload.variantId}.`)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Không thể điều chỉnh tồn kho. Vui lòng thử lại.'
      toast.error(message)
    },
  })
}