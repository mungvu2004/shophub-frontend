import type {
  InventoryAlert,
  MovementType,
  StockLevel,
  StockMovement,
  Warehouse,
} from "@/types/inventory.types";

const movementTypes: MovementType[] = [
  "ORDER_RESERVE",
  "ORDER_RELEASE",
  "ORDER_FULFILL",
  "RETURN_RECEIVED",
  "MANUAL_ADJUSTMENT",
  "IMPORT",
  "DAMAGE_LOSS",
  "TRANSFER_OUT",
  "TRANSFER_IN",
];

export const mockWarehouses: Warehouse[] = [
  {
    id: "wh-001",
    sellerId: "seller-001",
    name: "Main Warehouse",
    addressLine1: "123 Nguyen Van Linh",
    city: "Ho Chi Minh",
    country: "VN",
    isDefault: true,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "wh-002",
    sellerId: "seller-001",
    name: "Backup Warehouse",
    addressLine1: "88 Tran Hung Dao",
    city: "Ha Noi",
    country: "VN",
    isDefault: false,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

export const mockStockLevels: StockLevel[] = Array.from({ length: 12 }, (_, idx) => {
  const n = idx + 1;
  const physicalQty = 20 + n;
  const reservedQty = n % 5;
  return {
    id: `sl-${String(n).padStart(3, "0")}`,
    variantId: `var-${String(n).padStart(3, "0")}-1`,
    warehouseId: n % 2 === 0 ? "wh-001" : "wh-002",
    warehouseName: n % 2 === 0 ? "Main Warehouse" : "Backup Warehouse",
    physicalQty,
    reservedQty,
    availableQty: physicalQty - reservedQty,
    minThreshold: 15,
    maxThreshold: 250,
    updatedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T06:00:00Z`,
  };
});

export const mockInventoryAlerts: InventoryAlert[] = Array.from(
  { length: 12 },
  (_, idx) => {
    const n = idx + 1;
    const out = n % 6 === 0;
    const low = n % 3 === 0;
    return {
      id: `ia-${String(n).padStart(3, "0")}`,
      sellerId: "seller-001",
      variantId: `var-${String(n).padStart(3, "0")}-1`,
      warehouseId: n % 2 === 0 ? "wh-001" : "wh-002",
      productName: `Demo Product ${n}`,
      internalSku: `SKU-${String(n).padStart(4, "0")}`,
      alertType: out ? "OUT_OF_STOCK" : low ? "LOW_STOCK" : "OVERSTOCK",
      severity: out ? "Critical" : low ? "Warning" : "Info",
      currentPhysicalQty: out ? 0 : 10 + n,
      currentAvailableQty: out ? 0 : 5 + n,
      daysUntilStockout: out ? 0 : low ? 2 : 30,
      suggestedRestockQty: out ? 60 : low ? 30 : 0,
      message: out
        ? "Out of stock"
        : low
          ? "Low stock warning"
          : "Overstock detected",
      forecastResultId: `fr-${String(n).padStart(3, "0")}`,
      isResolved: n % 4 === 0,
      resolvedAt: n % 4 === 0 ? "2026-03-28T10:00:00Z" : undefined,
      notificationSentAt: "2026-03-29T07:00:00Z",
      createdAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T05:00:00Z`,
    };
  },
);

export const mockStockMovements: StockMovement[] = Array.from(
  { length: 24 },
  (_, idx) => {
    const n = idx + 1;
    const qtyBefore = 100 + n;
    const delta = n % 2 === 0 ? -(n % 5) - 1 : (n % 7) + 1;
    return {
      id: n,
      variantId: `var-${String((n % 12) + 1).padStart(3, "0")}-1`,
      warehouseId: n % 2 === 0 ? "wh-001" : "wh-002",
      movementType: movementTypes[idx % movementTypes.length],
      delta,
      qtyBefore,
      qtyAfter: qtyBefore + delta,
      refOrderItemId: n % 3 === 0 ? `item-${String((n % 12) + 1).padStart(3, "0")}-1` : undefined,
      reason: n % 2 === 0 ? "Order flow" : "Manual stock operation",
      note: `Movement note ${n}`,
      createdAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T08:00:00Z`,
      createdBy: n % 2 === 0 ? "system" : "staff-001",
    };
  },
);
