import { http, HttpResponse } from "msw";
import {
  mockInventoryAIForecast,
  mockInventoryAIForecastDetails,
  mockInventoryAlerts,
  mockStockLevels,
  mockStockMovements,
  mockWarehouses,
} from "@/mocks/data/inventory";

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
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockStockLevels.filter((stock) => {
      const matchSearch =
        !search
        || stock.variantId.toLowerCase().includes(search)
        || stock.warehouseName.toLowerCase().includes(search);

      const isOut = stock.availableQty === 0;
      const isLow = stock.availableQty > 0 && stock.availableQty <= stock.minThreshold;
      const derivedStatus = isOut ? "out" : isLow ? "low" : "normal";
      const matchStatus = !status || derivedStatus === status;

      return matchSearch && matchStatus;
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
    const status = (url.searchParams.get("status") ?? "").trim().toLowerCase();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockInventoryAlerts.filter((alert) => {
      const matchSearch =
        !search
        || alert.productName.toLowerCase().includes(search)
        || alert.internalSku.toLowerCase().includes(search);

      const normalizedStatus = status;
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
];
