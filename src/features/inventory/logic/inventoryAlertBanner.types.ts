export interface LowStockAlert {
  count: number
  onViewAlerts?: () => void
  onClose?: () => void
}

export interface InventoryAlertBannerViewModel {
  alert: LowStockAlert | null
  isVisible: boolean
  onClose: () => void
  onViewAlerts: () => void
}
