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

export const mockStockLevels: (StockLevel & { avgDailySales?: number; forecastDays?: number; isDiscontinued?: boolean; maxCapacity?: number })[] = Array.from({ length: 12 }, (_, idx) => {
  const n = idx + 1;
  const physicalQty = 20 + n;
  const reservedQty = n % 5;
  const categories = ['Áo', 'Váy', 'Quần', 'Giày', 'Phụ kiện'];
  const category = categories[n % categories.length];
  
  const skuCodes = ['AT-WHT-L', 'AT-WHT-XL', 'VS-HOA-M', 'QJ-SLM-28', 'GP-SNK-42', 
                    'AT-BLU-M', 'VS-CHK-L', 'QJ-STR-30', 'GP-SNK-40', 'GP-SNK-44',
                    'AT-BLK-M', 'GP-SNK-38'];
  const sku = skuCodes[n - 1];
  
  const productNames = [
    'Áo thun basic trắng',
    'Váy hoa nổi',
    'Quần jean slim',
    'Giày thể thao',
    'Mũ lưỡi trai',
    'Áo sơ mi xanh',
    'Váy ca rô',
    'Quần kaki trung tính',
    'Giày da công sở',
    'Giày thể thao màu trắng',
    'Áo phông đen',
    'Giày tây nam',
  ];
  const productName = productNames[n - 1];
  
  // Tốc độ bán trung bình (units/ngày)
  const avgDailySales = 0.5 + (n % 5) * 0.8;
  // Dự báo hết hàng (ngày)
  const forecastDays = Math.ceil(physicalQty / avgDailySales);
  // Một số sản phẩm bị đánh dấu ngừng bán
  const isDiscontinued = n === 11;
  // Sức chứa tối đa của kho (units)
  const maxCapacity = 80 + (n % 5) * 40;
  
  return {
    id: `sl-${String(n).padStart(3, "0")}`,
    sku,
    variantId: `var-${String(n).padStart(3, "0")}-1`,
    variantName: `${sku} - Size ${['XS', 'S', 'M', 'L', 'XL'][n % 5]}`,
    productName,
    category,
    productImage: `https://via.placeholder.com/100?text=${sku}`,
    warehouseId: n % 2 === 0 ? "wh-001" : "wh-002",
    warehouseName: n % 2 === 0 ? "Main Warehouse" : "Backup Warehouse",
    physicalQty,
    reservedQty,
    availableQty: physicalQty - reservedQty,
    onOrder: n % 4 === 0 ? 5 + (n % 3) : 0,
    channelStock: {
      shopee: Math.max(0, physicalQty - reservedQty - (n % 8)),
      tiktok: Math.max(0, Math.floor((physicalQty - reservedQty) / 2)),
      lazada: Math.max(0, Math.floor((physicalQty - reservedQty) / 3)),
    },
    minThreshold: 15,
    maxThreshold: 250,
    updatedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T06:00:00Z`,
    avgDailySales,
    forecastDays,
    isDiscontinued,
    maxCapacity,
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

export const mockInventoryAIForecast = {
  model: {
    name: 'LSTM v2.1',
    updatedAt: '2026-03-28T14:20:00Z',
    accuracyRate: 89.3,
    inputSkuCount: 847,
    historyDays: 90,
    lastRunAt: '2026-03-28T14:28:00Z',
    statusText: 'Model đang hoạt động bình thường',
  },
  urgentRestocks: [
    {
      id: 'urgent-001',
      productName: 'Áo thun basic trắng XL',
      sku: 'AT-WHT-XL',
      confidencePercent: 85,
      currentStock: 6,
      stockoutDays: 3,
      stockoutDate: '2026-03-23',
      suggestedInboundQty: 150,
      reasons: ['Bán nhanh hơn 40% so với tuần trước', 'Lễ Giỗ Tổ sắp tới', 'Tồn kho đối thủ thấp'],
      fillRatePercent: 85,
    },
    {
      id: 'urgent-002',
      productName: 'Quần Jeans Slimfit M',
      sku: 'JEAN-SLM-M',
      confidencePercent: 92,
      currentStock: 4,
      stockoutDays: 2,
      stockoutDate: '2026-03-22',
      suggestedInboundQty: 80,
      reasons: ['Đơn hàng Tiktok tăng 27%', 'Tỷ lệ hủy giảm nên nhu cầu thực tăng'],
      fillRatePercent: 91,
    },
    {
      id: 'urgent-003',
      productName: 'Giày Sneaker Sport 42',
      sku: 'SNK-SPT-42',
      confidencePercent: 78,
      currentStock: 2,
      stockoutDays: 1,
      stockoutDate: '2026-03-21',
      suggestedInboundQty: 45,
      reasons: ['Hiệu ứng combo trong live gần đây', 'Kho trung chuyển về chậm 2 ngày'],
      fillRatePercent: 74,
    },
  ],
  watchlist: [
    {
      id: 'watch-001',
      productName: 'Túi xách Canvas Đen',
      sku: 'BAG-CV-BLK',
      currentStock: 42,
      predictedStockoutDays: 9,
      predictedInboundQty: 200,
      confidencePercent: 94,
    },
    {
      id: 'watch-002',
      productName: 'Mũ lưỡi trai NY Trắng',
      sku: 'CAP-NY-WHT',
      currentStock: 15,
      predictedStockoutDays: 12,
      predictedInboundQty: 60,
      confidencePercent: 89,
    },
    {
      id: 'watch-003',
      productName: 'Thắt lưng da nâu B1',
      sku: 'BLT-LE-BR',
      currentStock: 31,
      predictedStockoutDays: 14,
      predictedInboundQty: 100,
      confidencePercent: 81,
    },
  ],
  allForecastRows: [
    {
      id: 'row-001',
      sku: 'AT-WHT-XL',
      productName: 'Áo thun basic trắng XL',
      currentStock: 6,
      avgDailySales: 2.1,
      forecastDays: 3,
      suggestedInboundQty: 150,
      confidencePercent: 85,
      action: 'URGENT_RESTOCK',
    },
    {
      id: 'row-002',
      sku: 'BAG-CV-BLK',
      productName: 'Túi xách Canvas Đen',
      currentStock: 42,
      avgDailySales: 4.5,
      forecastDays: 9,
      suggestedInboundQty: 200,
      confidencePercent: 94,
      action: 'PLAN_RESTOCK',
    },
    {
      id: 'row-003',
      sku: 'DRS-FLR-S',
      productName: 'Váy hoa nhí Pastel S',
      currentStock: 124,
      avgDailySales: 3.8,
      forecastDays: 32,
      suggestedInboundQty: 0,
      confidencePercent: 91,
      action: 'HEALTHY',
    },
    {
      id: 'row-004',
      sku: 'JACK-DNM-XL',
      productName: 'Áo khoác Denim XL',
      currentStock: 18,
      avgDailySales: 1.4,
      forecastDays: 13,
      suggestedInboundQty: 50,
      confidencePercent: 74,
      action: 'PLAN_RESTOCK',
    },
  ],
  generatedAt: '2026-03-28T14:28:00Z',
};

export const mockInventoryAIForecastDetails = {
  'AT-WHT-XL': {
    sku: 'AT-WHT-XL',
    productName: 'Áo thun basic trắng XL',
    categoryTag: 'T-SHIRT',
    groupTag: 'APPAREL',
    currentStock: 6,
    avgDailySales: 2.1,
    predictedStockoutDate: '2026-03-23',
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
    predictedStockoutDate: '2026-03-22',
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
    predictedStockoutDate: '2026-03-21',
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
