import { http, HttpResponse } from "msw";
import {
  mockInventoryAIForecast,
  mockInventoryAIForecastDetails,
  mockInventoryAlerts,
  mockStockLevels,
  mockStockMovements,
  mockWarehouses,
} from "@/mocks/data/inventory";
import type { StockMovement } from "@/types/inventory.types";

const matchesInventoryStatus = (derivedStatus: string, rawStatus: string) => {
  if (!rawStatus || rawStatus === 'all') return true;

  if (rawStatus === 'in-stock') return derivedStatus === 'normal';
  if (rawStatus === 'low-stock') return derivedStatus === 'low';
  if (rawStatus === 'out-of-stock') return derivedStatus === 'out';

  return derivedStatus === rawStatus;
};

export const inventoryHandlers = [
  http.get('/inventory/ai-forecast/detail/:sku', ({ params }) => {
    const sku = String(params.sku ?? '').toUpperCase();
    const detail = mockInventoryAIForecastDetails[sku as keyof typeof mockInventoryAIForecastDetails];
    const fallback = {
      ...mockInventoryAIForecastDetails['AT-WHT-XL'],
      sku,
      productName: `Chi tiết dự báo ${sku}`,
    };

    return HttpResponse.json(detail ?? fallback, { status: 200 });
  }),

  http.get('/api/inventory/ai-forecast/detail/:sku', ({ params }) => {
    const sku = String(params.sku ?? '').toUpperCase();
    const detail = mockInventoryAIForecastDetails[sku as keyof typeof mockInventoryAIForecastDetails];
    const fallback = {
      ...mockInventoryAIForecastDetails['AT-WHT-XL'],
      sku,
      productName: `Chi tiết dự báo ${sku}`,
    };

    return HttpResponse.json(detail ?? fallback, { status: 200 });
  }),

  http.get('/inventory/ai-forecast', () => {
    return HttpResponse.json(mockInventoryAIForecast, { status: 200 });
  }),

  http.get('/api/inventory/ai-forecast', () => {
    return HttpResponse.json(mockInventoryAIForecast, { status: 200 });
  }),

  http.get("/api/inventory", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = (url.searchParams.get("status") ?? "").trim().toLowerCase();
    const category = (url.searchParams.get("category") ?? "").trim().toLowerCase();
    const platform = (url.searchParams.get("platform") ?? "").trim().toLowerCase();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockStockLevels.filter((stock) => {
      const matchSearch =
        !search
        || stock.variantId.toLowerCase().includes(search)
        || stock.sku.toLowerCase().includes(search)
        || (stock.productName ?? '').toLowerCase().includes(search)
        || stock.warehouseName.toLowerCase().includes(search);

      const channelStock = stock.channelStock ?? { shopee: 0, tiktok: 0, lazada: 0 };
      const hasPlatformStock =
        !platform
        || platform === 'all'
        || (platform === 'shopee' && (channelStock.shopee ?? 0) > 0)
        || (platform === 'tiktok' && (channelStock.tiktok ?? 0) > 0)
        || (platform === 'lazada' && (channelStock.lazada ?? 0) > 0);

      const matchCategory = !category || category === 'all' || (stock.category ?? '').toLowerCase().includes(category);

      // Kiểm tra trạng thái từ mock data hoặc tính từ available quantity
      const isDiscontinued = (stock as any).isDiscontinued || false;
      const isOut = stock.availableQty === 0 && !isDiscontinued;
      const isLow = stock.availableQty > 0 && stock.availableQty <= stock.minThreshold && !isDiscontinued;
      const derivedStatus = isDiscontinued ? "discontinued" : isOut ? "out" : isLow ? "low" : "normal";
      const matchStatus = matchesInventoryStatus(derivedStatus, status);

      return matchSearch && matchStatus && matchCategory && hasPlatformStock;
    });

    return HttpResponse.json(
      {
        items: filtered.slice(0, Number.isNaN(limit) ? 10 : limit),
        hasMore: filtered.length > (Number.isNaN(limit) ? 10 : limit),
        nextCursor: undefined,
        totalCount: filtered.length,
      },
      { status: 200 },
    );
  }),

  http.get("/inventory", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = (url.searchParams.get("status") ?? "").trim().toLowerCase();
    const category = (url.searchParams.get("category") ?? "").trim().toLowerCase();
    const platform = (url.searchParams.get("platform") ?? "").trim().toLowerCase();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockStockLevels.filter((stock) => {
      const matchSearch =
        !search
        || stock.variantId.toLowerCase().includes(search)
        || stock.sku.toLowerCase().includes(search)
        || (stock.productName ?? '').toLowerCase().includes(search)
        || stock.warehouseName.toLowerCase().includes(search);

      const channelStock = stock.channelStock ?? { shopee: 0, tiktok: 0, lazada: 0 };
      const hasPlatformStock =
        !platform
        || platform === 'all'
        || (platform === 'shopee' && (channelStock.shopee ?? 0) > 0)
        || (platform === 'tiktok' && (channelStock.tiktok ?? 0) > 0)
        || (platform === 'lazada' && (channelStock.lazada ?? 0) > 0);

      const matchCategory = !category || category === 'all' || (stock.category ?? '').toLowerCase().includes(category);

      const isDiscontinued = (stock as any).isDiscontinued || false;
      const isOut = stock.availableQty === 0 && !isDiscontinued;
      const isLow = stock.availableQty > 0 && stock.availableQty <= stock.minThreshold && !isDiscontinued;
      const derivedStatus = isDiscontinued ? "discontinued" : isOut ? "out" : isLow ? "low" : "normal";
      const matchStatus = matchesInventoryStatus(derivedStatus, status);

      return matchSearch && matchStatus && matchCategory && hasPlatformStock;
    });

    return HttpResponse.json(
      {
        items: filtered.slice(0, Number.isNaN(limit) ? 10 : limit),
        hasMore: filtered.length > (Number.isNaN(limit) ? 10 : limit),
        nextCursor: undefined,
        totalCount: filtered.length,
      },
      { status: 200 },
    );
  }),

  http.get("/api/inventory/warehouses", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockWarehouses.filter((warehouse) => {
      if (!search) {
        return true;
      }
      return warehouse.name.toLowerCase().includes(search) || (warehouse.city ?? "").toLowerCase().includes(search);
    });

    return HttpResponse.json(
      {
        items: filtered.slice(0, Number.isNaN(limit) ? 10 : limit),
        hasMore: filtered.length > (Number.isNaN(limit) ? 10 : limit),
        nextCursor: undefined,
        totalCount: filtered.length,
      },
      { status: 200 },
    );
  }),

  http.get("/api/inventory/alerts", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const severity = (url.searchParams.get("severity") ?? "").trim().toLowerCase();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockInventoryAlerts.filter((alert) => {
      const matchSearch =
        !search
        || alert.productName.toLowerCase().includes(search)
        || alert.internalSku.toLowerCase().includes(search);

      const normalizedStatus = severity;
      const matchStatus =
        !normalizedStatus
        || alert.alertType.toLowerCase() === normalizedStatus
        || alert.severity.toLowerCase() === normalizedStatus;

      return matchSearch && matchStatus;
    });

    return HttpResponse.json(
      {
        items: filtered.slice(0, Number.isNaN(limit) ? 10 : limit),
        hasMore: filtered.length > (Number.isNaN(limit) ? 10 : limit),
        nextCursor: undefined,
        totalCount: filtered.length,
        unreadCount: filtered.filter((alert) => !alert.isResolved).length,
      },
      { status: 200 },
    );
  }),

  http.get("/inventory/alerts", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const severity = (url.searchParams.get("severity") ?? "").trim().toLowerCase();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockInventoryAlerts.filter((alert) => {
      const matchSearch =
        !search
        || alert.productName.toLowerCase().includes(search)
        || alert.internalSku.toLowerCase().includes(search);

      const normalizedStatus = severity;
      const matchStatus =
        !normalizedStatus
        || alert.alertType.toLowerCase() === normalizedStatus
        || alert.severity.toLowerCase() === normalizedStatus;

      return matchSearch && matchStatus;
    });

    return HttpResponse.json(
      {
        items: filtered.slice(0, Number.isNaN(limit) ? 10 : limit),
        hasMore: filtered.length > (Number.isNaN(limit) ? 10 : limit),
        nextCursor: undefined,
        totalCount: filtered.length,
        unreadCount: filtered.filter((alert) => !alert.isResolved).length,
      },
      { status: 200 },
    );
  }),

  http.get("/api/inventory/movements", ({ request }) => {
    const url = new URL(request.url);
    const variantId = (url.searchParams.get("variantId") ?? "").trim();
    const warehouseId = (url.searchParams.get("warehouseId") ?? "").trim();
    const status = (url.searchParams.get("status") ?? "").trim().toUpperCase();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockStockMovements.filter((movement) => {
      const matchVariant = !variantId || movement.variantId === variantId;
      const matchWarehouse = !warehouseId || movement.warehouseId === warehouseId;
      const matchStatus = !status || movement.movementType === status;
      return matchVariant && matchWarehouse && matchStatus;
    });

    return HttpResponse.json(
      {
        items: filtered.slice(0, Number.isNaN(limit) ? 10 : limit),
        hasMore: filtered.length > (Number.isNaN(limit) ? 10 : limit),
        nextCursor: undefined,
        totalCount: filtered.length,
      },
      { status: 200 },
    );
  }),

  http.post('/api/inventory/adjust', async ({ request }) => {
    const body = (await request.json()) as {
      variantId?: string
      warehouseId?: string
      delta?: number
      movementType?: string
      reason?: string
      note?: string
    }

    const variantId = String(body.variantId ?? '').trim()
    const warehouseId = String(body.warehouseId ?? '').trim()
    const delta = Number(body.delta ?? 0)

    if (!variantId || !warehouseId || !Number.isFinite(delta) || delta === 0) {
      return HttpResponse.json(
        {
          title: 'Invalid adjustment payload',
          detail: 'variantId, warehouseId và delta hợp lệ là bắt buộc.',
        },
        { status: 400 },
      )
    }

    const target = mockStockLevels.find((stock) => stock.variantId === variantId && stock.warehouseId === warehouseId)

    if (!target) {
      return HttpResponse.json(
        {
          title: 'Stock level not found',
          detail: `Không tìm thấy tồn kho cho ${variantId} tại ${warehouseId}.`,
        },
        { status: 404 },
      )
    }

    const nextPhysicalQty = Math.max(0, target.physicalQty + delta)
    const previousPhysicalQty = target.physicalQty
    target.physicalQty = nextPhysicalQty
    target.availableQty = Math.max(0, nextPhysicalQty - target.reservedQty)
    target.updatedAt = new Date().toISOString()

    const movement: StockMovement = {
      id: mockStockMovements.length + 1,
      variantId: target.variantId,
      warehouseId: target.warehouseId,
      movementType: (body.movementType?.toUpperCase() as StockMovement['movementType']) || 'MANUAL_ADJUSTMENT',
      delta,
      qtyBefore: previousPhysicalQty,
      qtyAfter: nextPhysicalQty,
      reason: body.reason,
      note: body.note,
      createdAt: target.updatedAt,
      createdBy: 'staff-001',
    }

    mockStockMovements.unshift(movement)

    return HttpResponse.json(target, { status: 200 })
  }),

  http.post('/inventory/adjust', async ({ request }) => {
    const body = (await request.json()) as {
      variantId?: string
      warehouseId?: string
      delta?: number
      movementType?: string
      reason?: string
      note?: string
    }

    const variantId = String(body.variantId ?? '').trim()
    const warehouseId = String(body.warehouseId ?? '').trim()
    const delta = Number(body.delta ?? 0)

    if (!variantId || !warehouseId || !Number.isFinite(delta) || delta === 0) {
      return HttpResponse.json(
        {
          title: 'Invalid adjustment payload',
          detail: 'variantId, warehouseId và delta hợp lệ là bắt buộc.',
        },
        { status: 400 },
      )
    }

    const target = mockStockLevels.find((stock) => stock.variantId === variantId && stock.warehouseId === warehouseId)

    if (!target) {
      return HttpResponse.json(
        {
          title: 'Stock level not found',
          detail: `Không tìm thấy tồn kho cho ${variantId} tại ${warehouseId}.`,
        },
        { status: 404 },
      )
    }

    const nextPhysicalQty = Math.max(0, target.physicalQty + delta)
    const previousPhysicalQty = target.physicalQty
    target.physicalQty = nextPhysicalQty
    target.availableQty = Math.max(0, nextPhysicalQty - target.reservedQty)
    target.updatedAt = new Date().toISOString()

    const movement: StockMovement = {
      id: mockStockMovements.length + 1,
      variantId: target.variantId,
      warehouseId: target.warehouseId,
      movementType: (body.movementType?.toUpperCase() as StockMovement['movementType']) || 'MANUAL_ADJUSTMENT',
      delta,
      qtyBefore: previousPhysicalQty,
      qtyAfter: nextPhysicalQty,
      reason: body.reason,
      note: body.note,
      createdAt: target.updatedAt,
      createdBy: 'staff-001',
    }

    mockStockMovements.unshift(movement)

    return HttpResponse.json(target, { status: 200 })
  }),
];
