import type {
  InventoryAlert,
  MovementType,
  StockLevel,
  StockMovement,
  Warehouse,
} from "@/types/inventory.types";
import { mockProducts } from "./products";

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
    name: "Main Warehouse HCM",
    addressLine1: "123 Nguyen Van Linh, District 1",
    city: "Ho Chi Minh",
    country: "VN",
    isDefault: true,
    isActive: true,
    createdAt: "2026-05-05T00:00:00Z",
  },
  {
    id: "wh-002",
    sellerId: "seller-001",
    name: "Secondary Warehouse Ha Noi",
    addressLine1: "88 Tran Hung Dao, Hoan Kiem",
    city: "Ha Noi",
    country: "VN",
    isDefault: false,
    isActive: true,
    createdAt: "2026-05-05T00:00:00Z",
  },
];

// Generate stock levels for ALL products and their variants
export const mockStockLevels: (StockLevel & { avgDailySales?: number; forecastDays?: number; isDiscontinued?: boolean; maxCapacity?: number })[] = [];

mockProducts.forEach((product, productIdx) => {
  product.variants.forEach((variant, variantIdx) => {
    const variantIndex = productIdx * 2 + variantIdx;
    const warehouseId = variantIndex % 2 === 0 ? "wh-001" : "wh-002";
    
    // Generate realistic stock data
    const avgDailySales = 0.5 + ((productIdx + 1) % 5) * 0.8;
    const baseStock = 30 + (variantIndex % 50);
    const physicalQty = baseStock + (variantIndex % 20);
    const reservedQty = Math.floor(physicalQty * (0.1 + (variantIndex % 5) * 0.08));
    
    const forecastDays = Math.ceil(physicalQty / avgDailySales);
    const isDiscontinued = (productIdx + 1) % 35 === 0;
    const maxCapacity = 150 + (variantIndex % 100);
    
    mockStockLevels.push({
      id: `sl-${String(variantIndex + 1).padStart(4, "0")}`,
      sku: variant.internalSku,
      variantId: variant.id,
      variantName: `${product.name} - ${variant.attributesJson ? Object.values(variant.attributesJson).join(" / ") : variant.name}`,
      productName: product.name,
      category: product.brand || "Fashion",
      productImage: variant.mainImageUrl,
      warehouseId,
      warehouseName: warehouseId === "wh-001" ? "Main Warehouse HCM" : "Secondary Warehouse Ha Noi",
      physicalQty,
      reservedQty,
      availableQty: physicalQty - reservedQty,
      onOrder: (variantIndex % 4 === 0) ? (5 + (variantIndex % 3)) : 0,
      channelStock: {
        shopee: Math.max(0, Math.floor((physicalQty - reservedQty) * 0.5)),
        tiktok: Math.max(0, Math.floor((physicalQty - reservedQty) * 0.3)),
        lazada: Math.max(0, Math.floor((physicalQty - reservedQty) * 0.2)),
      },
      minThreshold: 10,
      maxThreshold: maxCapacity,
      updatedAt: '2026-05-05T06:00:00Z',
      avgDailySales,
      forecastDays,
      isDiscontinued,
      maxCapacity,
    });
  });
});

// Generate inventory alerts from stock levels
export const mockInventoryAlerts: InventoryAlert[] = mockStockLevels
  .filter((_, idx) => idx % 3 === 0) // Generate alerts for roughly 1/3 of stock levels
  .map((level, idx) => {
    const isOutOfStock = level.physicalQty === 0;
    const isLowStock = !isOutOfStock && level.physicalQty <= (level.minThreshold || 10) * 1.5;
    const isOverstock = level.physicalQty > (level.maxThreshold || 250) * 0.8;
    
    const alertType = isOutOfStock ? "OUT_OF_STOCK" : (isLowStock ? "LOW_STOCK" : (isOverstock ? "OVERSTOCK" : "NORMAL"));
    const severity = isOutOfStock ? "Critical" : (isLowStock ? "Warning" : (isOverstock ? "Info" : "Info"));
    
    return {
      id: `ia-${String(idx + 1).padStart(4, "0")}`,
      sellerId: "seller-001",
      variantId: level.variantId,
      warehouseId: level.warehouseId,
      productName: level.productName || "Unknown Product",
      internalSku: level.sku,
      alertType: alertType as InventoryAlert['alertType'],
      severity: severity as InventoryAlert['severity'],
      currentPhysicalQty: level.physicalQty,
      currentAvailableQty: level.availableQty,
      daysUntilStockout: isOutOfStock ? 0 : Math.ceil(level.availableQty / (level.avgDailySales || 1)),
      suggestedRestockQty: isOutOfStock ? Math.round((level.maxCapacity || 150) * 0.8) : (isLowStock ? Math.round((level.maxCapacity || 150) * 0.5) : 0),
      message: alertType === "OUT_OF_STOCK" ? "Out of stock" : (alertType === "LOW_STOCK" ? "Low stock warning" : "Overstock detected"),
      forecastResultId: `fr-${String(idx + 1).padStart(4, "0")}`,
      isResolved: idx % 4 === 0,
      resolvedAt: idx % 4 === 0 ? '2026-05-05T10:00:00Z' : undefined,
      notificationSentAt: '2026-05-05T07:00:00Z',
      createdAt: '2026-05-05T05:00:00Z',
    };
  });

// Generate stock movements
export const mockStockMovements: StockMovement[] = Array.from(
  { length: 60 },
  (_, idx) => {
    const n = idx + 1;
    const stockLevel = mockStockLevels[n % mockStockLevels.length];
    const qtyBefore = 50 + (n * 3) % 100;
    const movementType = movementTypes[idx % movementTypes.length];
    const delta = movementType.includes("RELEASE") || movementType === "ORDER_FULFILL" 
      ? -(n % 10 + 1)
      : movementType.includes("DAMAGE_LOSS")
      ? -(n % 5)
      : (n % 20 + 5);

    const today = new Date("2026-05-05T00:00:00Z");
    const createdAt = new Date(today);
    createdAt.setHours(today.getHours() - (idx % 24), today.getMinutes() - (idx % 60));

    return {
      id: n,
      variantId: stockLevel.variantId,
      warehouseId: stockLevel.warehouseId,
      movementType: movementType as StockMovement['movementType'],
      delta,
      qtyBefore,
      qtyAfter: Math.max(0, qtyBefore + delta),
      refOrderItemId: (n % 3 === 0) ? `item-${String((n % 50) + 1).padStart(3, "0")}-01` : undefined,
      reason: movementType === "IMPORT" ? "Nhập hàng bổ sung từ NCC" : (movementType === "ORDER_FULFILL" ? "Bán hàng kênh Ecommerce" : `Biến động ${movementType}`),
      note: `Ghi chú biến động ${movementType} cho ${stockLevel.productName}`,
      createdAt: createdAt.toISOString(),
      createdBy: n % 2 === 0 ? "system" : "staff-001",
    };
  },
);

export const mockInventoryAIForecast = {
  model: {
    name: 'LSTM v2.1',
    updatedAt: '2026-05-05T14:20:00Z',
    accuracyRate: 89.3,
    inputSkuCount: mockStockLevels.length,
    historyDays: 90,
    lastRunAt: '2026-05-05T14:28:00Z',
    statusText: 'Model đang hoạt động bình thường',
  },
  accuracyMetrics: {
    mape: 12.4,
    rmse: 4.2,
    previousMape: 14.8,
  },
  seasonalityPatterns: [
    {
      id: 'sea-001',
      name: 'Mùa sắm Tết',
      impactMultiplier: 2.4,
      description: 'Nhu cầu tăng mạnh vào 2 tuần trước Tết Nguyên Đán.',
      confidencePercent: 96,
      periodLabel: 'Tháng 1 - Tháng 2',
    },
    {
      id: 'sea-002',
      name: 'Black Friday',
      impactMultiplier: 3.8,
      description: 'Nhu cầu đột biến trong tuần lễ giảm giá tháng 11.',
      confidencePercent: 92,
      periodLabel: 'Cuối tháng 11',
    },
  ],
  inboundPlan: mockStockLevels
    .filter((_, idx) => idx % 8 === 0)
    .map((level, idx) => ({
      id: `plan-${String(idx + 1).padStart(3, "0")}`,
      sku: level.sku,
      productName: level.productName || "Unknown Product",
      suggestedQuantity: Math.round((level.maxCapacity || 150) * 0.6),
      suggestedOrderDate: new Date("2026-05-05T00:00:00Z").toISOString(),
      leadTimeDays: 3 + (idx % 5),
      priority: (idx % 3 === 0) ? 'high' : 'normal',
    })),
  urgentRestocks: mockStockLevels
    .filter((level) => level.physicalQty <= level.minThreshold * 2)
    .slice(0, 5)
    .map((level, idx) => ({
      id: `urgent-${String(idx + 1).padStart(3, "0")}`,
      productName: level.productName,
      sku: level.sku,
      confidencePercent: 85 + (idx * 2),
      currentStock: level.physicalQty,
      stockoutDays: level.forecastDays,
      stockoutDate: new Date(Date.now() + (level.forecastDays || 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      suggestedInboundQty: Math.round((level.maxCapacity || 150) * 0.7),
      reasons: ['Bán nhanh hơn dự báo', 'Mùa vụ tăng nhu cầu', 'Tồn kho đối thủ thấp'],
      fillRatePercent: 85 + (idx * 3),
    })),
  watchlist: mockStockLevels
    .filter((_, idx) => idx % 10 === 0)
    .map((level, idx) => ({
      id: `watch-${String(idx + 1).padStart(3, "0")}`,
      productName: level.productName,
      sku: level.sku,
      currentStock: level.physicalQty,
      predictedStockoutDays: level.forecastDays,
      predictedInboundQty: Math.round((level.maxCapacity || 150) * 0.6),
      confidencePercent: 85 + (idx % 15),
    })),
  allForecastRows: mockStockLevels
    .map((level, idx) => ({
      id: `row-${String(idx + 1).padStart(4, "0")}`,
      sku: level.sku,
      productName: level.productName,
      currentStock: level.physicalQty,
      avgDailySales: level.avgDailySales,
      forecastDays: level.forecastDays,
      suggestedInboundQty: Math.round((level.maxCapacity || 150) * 0.6),
      confidencePercent: 82 + (idx % 18),
      platformDemand: {
        shopee: Math.max(0, Math.round((level.avgDailySales || 1) * 0.5)),
        tiktok: Math.max(0, Math.round((level.avgDailySales || 1) * 0.3)),
        lazada: Math.max(0, Math.round((level.avgDailySales || 1) * 0.2)),
      },
    })),
};

export const mockInventoryAIForecastDetails = {
  'AT-WHT-XL': {
    sku: 'AT-WHT-XL',
    productName: 'Áo thun basic trắng XL',
    categoryTag: 'T-SHIRT',
    groupTag: 'APPAREL',
    currentStock: 6,
    avgDailySales: 2.1,
    predictedStockoutDate: '2026-05-05',
    suggestedInboundQty: 150,
    modelName: 'LSTM v2.1',
    modelAccuracyRate: 89.3,
    chartPoints: [
      { monthLabel: 'JAN', historical: 58, forecast: 0, confidenceLow: 45, confidenceHigh: 70 },
      { monthLabel: 'FEB', historical: 86, forecast: 0, confidenceLow: 62, confidenceHigh: 102 },
      { monthLabel: 'MAR', historical: 72, forecast: 110, confidenceLow: 68, confidenceHigh: 128 },
      { monthLabel: 'APR', historical: 0, forecast: 148, confidenceLow: 102, confidenceHigh: 168 },
    ],
    factors: [
      { id: 'f-1', label: 'Tốc độ bán hàng gần đây', impactPercent: 85 },
      { id: 'f-2', label: 'Dự báo nhu cầu lễ hội', impactPercent: 65 },
      { id: 'f-3', label: 'Tồn kho an toàn tối thiểu', impactPercent: 40 },
    ],
    aiSuggestionText:
      'Nhu cầu đang tăng trưởng nhanh hơn dự kiến 12%. Chúng tôi khuyến nghị đặt hàng sớm hơn 5 ngày để tránh rủi ro đứt hàng vào cuối tháng 3.',
    riskLevelText: 'Trung bình - Cao',
  },
  'JEAN-SLM-M': {
    sku: 'JEAN-SLM-M',
    productName: 'Quần Jeans Slimfit M',
    categoryTag: 'JEANS',
    groupTag: 'APPAREL',
    currentStock: 4,
    avgDailySales: 2.5,
    predictedStockoutDate: '2026-05-05',
    suggestedInboundQty: 80,
    modelName: 'LSTM v2.1',
    modelAccuracyRate: 89.3,
    chartPoints: [
      { monthLabel: 'JAN', historical: 42, forecast: 0, confidenceLow: 30, confidenceHigh: 56 },
      { monthLabel: 'FEB', historical: 60, forecast: 0, confidenceLow: 48, confidenceHigh: 76 },
      { monthLabel: 'MAR', historical: 54, forecast: 82, confidenceLow: 51, confidenceHigh: 94 },
      { monthLabel: 'APR', historical: 0, forecast: 108, confidenceLow: 84, confidenceHigh: 124 },
    ],
    factors: [
      { id: 'f-1', label: 'Doanh số TikTok tăng nhanh', impactPercent: 81 },
      { id: 'f-2', label: 'Tỷ lệ hoàn hàng giảm', impactPercent: 59 },
      { id: 'f-3', label: 'Tồn kho kho phụ thấp', impactPercent: 44 },
    ],
    aiSuggestionText:
      'Tín hiệu mua lặp lại tăng mạnh trong 2 tuần gần đây. Nên đẩy lịch nhập trước 3-4 ngày để duy trì tỷ lệ sẵn hàng ổn định.',
    riskLevelText: 'Cao',
  },
  'SNK-SPT-42': {
    sku: 'SNK-SPT-42',
    productName: 'Giày Sneaker Sport 42',
    categoryTag: 'SNEAKER',
    groupTag: 'FOOTWEAR',
    currentStock: 2,
    avgDailySales: 1.9,
    predictedStockoutDate: '2026-05-05',
    suggestedInboundQty: 45,
    modelName: 'LSTM v2.1',
    modelAccuracyRate: 89.3,
    chartPoints: [
      { monthLabel: 'JAN', historical: 24, forecast: 0, confidenceLow: 18, confidenceHigh: 32 },
      { monthLabel: 'FEB', historical: 34, forecast: 0, confidenceLow: 26, confidenceHigh: 42 },
      { monthLabel: 'MAR', historical: 29, forecast: 50, confidenceLow: 24, confidenceHigh: 63 },
      { monthLabel: 'APR', historical: 0, forecast: 72, confidenceLow: 51, confidenceHigh: 84 },
    ],
    factors: [
      { id: 'f-1', label: 'Nhu cầu combo sản phẩm', impactPercent: 77 },
      { id: 'f-2', label: 'Thời gian vận chuyển kéo dài', impactPercent: 62 },
      { id: 'f-3', label: 'Độ phủ size 42 bị thiếu', impactPercent: 48 },
    ],
    aiSuggestionText:
      'SKU size 42 đang chạm ngưỡng thiếu hụt nhanh. Ưu tiên nhập theo lô nhỏ nhưng tần suất dày để giảm rủi ro tồn kho cuối mùa.',
    riskLevelText: 'Trung bình - Cao',
  },
};
