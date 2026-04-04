import { useState } from 'react'
import { InventoryAlertBanner } from '@/features/inventory/components/inventory-alert-banner/InventoryAlertBanner'
import type { InventoryAlertBannerViewModel, LowStockAlert } from '@/features/inventory/logic/inventoryAlertBanner.types'

type InventoryAlertBannerViewProps = {
  alert?: LowStockAlert | null
  onViewAlerts?: () => void
}

export function InventoryAlertBannerView({ 
  alert, 
  onViewAlerts 
}: InventoryAlertBannerViewProps) {
  const [isVisible, setIsVisible] = useState(!!alert)

  // If alert is passed in from parent, use that; otherwise empty
  const shouldShowAlert = !!alert && isVisible

  const model: InventoryAlertBannerViewModel = {
    alert: shouldShowAlert ? alert : null,
    isVisible: shouldShowAlert,
    onClose: () => setIsVisible(false),
    onViewAlerts: onViewAlerts || (() => {}),
  }

  return <InventoryAlertBanner model={model} />
}
