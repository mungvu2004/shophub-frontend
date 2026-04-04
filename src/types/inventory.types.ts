export interface Warehouse {
  id: string; // Source: Warehouses.Id | nullable: no
  sellerId: string; // Source: Warehouses.SellerId | nullable: no
  name: string; // Source: Warehouses.Name | nullable: no
  addressLine1?: string; // Source: Warehouses.AddressLine1 | nullable: yes
  city?: string; // Source: Warehouses.City | nullable: yes
  country?: string; // Source: Warehouses.Country | nullable: yes
  isDefault: boolean; // Source: Warehouses.IsDefault | nullable: no
  isActive: boolean; // Source: Warehouses.IsActive | nullable: no
  createdAt: string; // Source: Warehouses.CreatedAt | nullable: no
}

export interface StockLevel {
  id: string; // Source: StockLevels.Id | nullable: no
  sku: string; // Product SKU code
  variantId: string; // Source: StockLevels.VariantId | nullable: no
  variantName?: string; // Product variant name
  productName?: string; // Product name
  category?: string; // Product category
  productImage?: string; // Product image URL
  warehouseId: string; // Source: StockLevels.WarehouseId | nullable: no
  warehouseName: string; // Source: Joined Warehouses.Name | nullable: no
  physicalQty: number; // Physical stock quantity (alias: physicalStock)
  reservedQty: number; // Source: StockLevels.ReservedQty | nullable: no
  availableQty: number; // Available quantity after reservation (alias: availableStock)
  onOrder?: number; // Quantity on pending order
  channelStock?: {
    shopee?: number;
    tiktok?: number;
    lazada?: number;
  }; // Stock by sales channel
  minThreshold: number; // Source: StockLevels.MinThreshold | nullable: no
  maxThreshold?: number; // Source: StockLevels.MaxThreshold | nullable: yes
  updatedAt: string; // Source: StockLevels.UpdatedAt | nullable: no
}

export type MovementType =
  | "ORDER_RESERVE"
  | "ORDER_RELEASE"
  | "ORDER_FULFILL"
  | "RETURN_RECEIVED"
  | "MANUAL_ADJUSTMENT"
  | "IMPORT"
  | "DAMAGE_LOSS"
  | "TRANSFER_OUT"
  | "TRANSFER_IN"; // Source: StockMovements.MovementType | nullable: no

export interface StockMovement {
  id: number; // Source: StockMovements.Id | nullable: no
  variantId: string; // Source: StockMovements.VariantId | nullable: no
  warehouseId: string; // Source: StockMovements.WarehouseId | nullable: no
  movementType: MovementType; // Source: StockMovements.MovementType | nullable: no
  delta: number; // Source: StockMovements.Delta | nullable: no
  qtyBefore: number; // Source: StockMovements.QtyBefore | nullable: no
  qtyAfter: number; // Source: StockMovements.QtyAfter | nullable: no
  refOrderItemId?: string; // Source: StockMovements.RefOrderItemId | nullable: yes
  reason?: string; // Source: StockMovements.Reason | nullable: yes
  note?: string; // Source: StockMovements.Note | nullable: yes
  createdAt: string; // Source: StockMovements.CreatedAt | nullable: no
  createdBy: string; // Source: StockMovements.CreatedBy | nullable: no
}

export interface InventoryAlert {
  id: string; // Source: InventoryAlerts.Id | nullable: no
  sellerId: string; // Source: InventoryAlerts.SellerId | nullable: no
  variantId: string; // Source: InventoryAlerts.VariantId | nullable: no
  warehouseId?: string; // Source: InventoryAlerts.WarehouseId | nullable: yes
  productName: string; // Source: Joined Products/ProductVariants display name | nullable: no
  internalSku: string; // Source: Joined ProductVariants.InternalSku | nullable: no
  alertType: "LOW_STOCK" | "OUT_OF_STOCK" | "OVERSTOCK" | "SLOW_MOVING"; // Source: InventoryAlerts.AlertType | nullable: no
  severity: "Info" | "Warning" | "Critical"; // Source: InventoryAlerts.Severity | nullable: no
  currentPhysicalQty?: number; // Source: InventoryAlerts.CurrentPhysicalQty | nullable: yes
  currentAvailableQty?: number; // Source: InventoryAlerts.CurrentAvailableQty | nullable: yes
  daysUntilStockout?: number; // Source: InventoryAlerts.DaysUntilStockout | nullable: yes
  suggestedRestockQty?: number; // Source: InventoryAlerts.SuggestedRestockQty | nullable: yes
  message: string; // Source: InventoryAlerts.Message | nullable: no
  forecastResultId?: string; // Source: InventoryAlerts.ForecastResultId | nullable: yes
  isResolved: boolean; // Source: InventoryAlerts.IsResolved | nullable: no
  resolvedAt?: string; // Source: InventoryAlerts.ResolvedAt | nullable: yes
  notificationSentAt?: string; // Source: InventoryAlerts.NotificationSentAt | nullable: yes
  createdAt: string; // Source: InventoryAlerts.CreatedAt | nullable: no
}
