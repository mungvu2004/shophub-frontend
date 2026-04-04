import { Button } from '@/components/ui/button'
import type { InventoryAlertBannerViewModel } from '@/features/inventory/logic/inventoryAlertBanner.types'
import { AlertTriangle, X } from 'lucide-react'

type InventoryAlertBannerProps = {
  model: InventoryAlertBannerViewModel
}

export function InventoryAlertBanner({ model }: InventoryAlertBannerProps) {
  if (!model.isVisible || !model.alert) {
    return null
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-amber-50 px-6 py-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-900" />
        <div className="flex flex-col">
          <p className="text-base font-bold text-amber-900">
            <span className="font-bold">{model.alert.count} SKU</span>
            <span className="ml-1 font-medium"> tồn kho thấp. Cần bổ sung ngay để không gián đoạn kinh doanh.</span>
          </p>
        </div>
        <Button
          variant="link"
          size="sm"
          className="ml-4 text-indigo-600 hover:text-indigo-700"
          onClick={model.onViewAlerts}
        >
          [Lọc xem ngay →]
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={model.onClose}
        className="text-amber-900 hover:bg-amber-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
