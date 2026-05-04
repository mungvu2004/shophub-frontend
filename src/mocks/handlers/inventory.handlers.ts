/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse, delay } from "msw";
import {
  mockInventoryAIForecast,
  mockInventoryAIForecastDetails,
  mockInventoryAlerts,
  mockStockLevels,
  mockWarehouses,
} from "@/mocks/data/inventory";

export const inventoryHandlers = [
  // Handler lấy tóm tắt kho
  http.get("/api/inventory/summary", async () => {
    await delay(300);
    return HttpResponse.json({
      totalSKUs: mockStockLevels.length,
      totalValue: "₫ 125,480,000",
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      lowStockCount: mockStockLevels.filter(s => s.availableQty <= (s.minThreshold || 15)).length
    }, { status: 200 });
  }),

  // Handler lấy danh mục động
  http.get("/api/inventory/categories", async () => {
    await delay(300);
    const categories = Array.from(new Set(mockStockLevels.map(s => s.category).filter(Boolean)));
    return HttpResponse.json(categories, { status: 200 });
  }),

  // Handler xóa SKU
  http.delete("/api/inventory", async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { ids: string[] };
    if (body?.ids) {
      const idsToRemove = body.ids;
      // Mutate trực tiếp mảng mockStockLevels để giữ state sống
      idsToRemove.forEach(id => {
        const index = mockStockLevels.findIndex(item => item.id === id);
        if (index !== -1) {
          mockStockLevels.splice(index, 1);
        }
      });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Handler thêm SKU (Create)
  http.post("/api/inventory", async ({ request }) => {
    await delay(500);
    const newSkuData = (await request.json()) as any;
    const newId = `sl-${Date.now()}`;
    const newStockLevel = {
      id: newId,
      sku: newSkuData.sku || `SKU-${Date.now()}`,
      variantId: `var-${Date.now()}`,
      variantName: newSkuData.variantName || 'Tên hiển thị mặc định',
      productName: newSkuData.productName || 'Sản phẩm mới',
      category: newSkuData.category || 'Khác',
      warehouseId: "wh-001",
      warehouseName: "Main Warehouse",
      physicalQty: newSkuData.physicalQty || 0,
      reservedQty: 0,
      availableQty: newSkuData.physicalQty || 0,
      onOrder: 0,
      channelStock: { shopee: 0, tiktok: 0, lazada: 0 },
      minThreshold: 15,
      maxThreshold: 250,
      updatedAt: new Date().toISOString(),
      avgDailySales: 0,
      forecastDays: 0,
      isDiscontinued: false,
      maxCapacity: 100,
    };
    mockStockLevels.push(newStockLevel);
    return HttpResponse.json(newStockLevel, { status: 201 });
  }),

  // Handler cập nhật SKU (Update)
  http.put("/api/inventory/:id", async ({ params, request }) => {
    await delay(500);
    const body = (await request.json()) as any;
    const index = mockStockLevels.findIndex(item => item.id === params.id);
    if (index !== -1) {
      mockStockLevels[index] = { ...mockStockLevels[index], ...body, updatedAt: new Date().toISOString() };
      return HttpResponse.json(mockStockLevels[index], { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Handler lấy danh sách SKU
  http.get("/api/inventory", async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    
    // Hỗ trợ multi-select từ query param (ví dụ: status=in-stock,low-stock)
    const statusFilter = url.searchParams.get("status")?.split(',').filter(Boolean) || [];
    const categoryFilter = url.searchParams.get("category")?.split(',').filter(Boolean) || [];
    const platformFilter = url.searchParams.get("platform")?.split(',').filter(Boolean) || [];
    
    const limit = Number(url.searchParams.get("limit") ?? 10);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    const filtered = mockStockLevels.filter((stock) => {
      const matchSearch = !search || 
        stock.sku.toLowerCase().includes(search) || 
        (stock.productName ?? '').toLowerCase().includes(search);

      const matchCategory = categoryFilter.length === 0 || (stock.category && categoryFilter.includes(stock.category));
      
      const channelStock = stock.channelStock ?? { shopee: 0, tiktok: 0, lazada: 0 };
      const matchPlatform = platformFilter.length === 0 || platformFilter.some(p => {
        if (p === 'shopee') return (channelStock.shopee ?? 0) > 0;
        if (p === 'tiktok') return (channelStock.tiktok ?? 0) > 0;
        if (p === 'lazada') return (channelStock.lazada ?? 0) > 0;
        return false;
      });

      const isDiscontinued = (stock as any).isDiscontinued || false;
      const isOut = stock.availableQty === 0 && !isDiscontinued;
      const isLow = stock.availableQty > 0 && stock.availableQty <= (stock.minThreshold || 15) && !isDiscontinued;
      const derivedStatus = isDiscontinued ? "out-of-stock" : isOut ? "out-of-stock" : isLow ? "low-stock" : "in-stock";
      
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(derivedStatus);

      return matchSearch && matchCategory && matchPlatform && matchStatus;
    });

    return HttpResponse.json(
      {
        items: filtered.slice(offset, offset + limit),
        totalCount: filtered.length,
        hasMore: offset + limit < filtered.length,
      },
      { status: 200 },
    );
  }),

  // Các handler khác (giữ nguyên logic nhưng đảm bảo path chuẩn)
  http.get("/api/inventory/alerts", async () => {
    await delay(300);
    return HttpResponse.json({
      items: mockInventoryAlerts,
      totalCount: mockInventoryAlerts.length,
      unreadCount: mockInventoryAlerts.filter(a => !a.isResolved).length
    }, { status: 200 });
  }),

  http.get("/api/inventory/warehouses", async () => {
    await delay(300);
    return HttpResponse.json(mockWarehouses, { status: 200 });
  }),

  http.get("/api/inventory/ai-forecast", async () => {
    await delay(300);
    return HttpResponse.json(mockInventoryAIForecast, { status: 200 });
  }),

  http.get("/api/inventory/ai-forecast/detail/:sku", async ({ params }) => {
    await delay(300);
    const sku = String(params.sku ?? '').toUpperCase();
    return HttpResponse.json(mockInventoryAIForecastDetails[sku as keyof typeof mockInventoryAIForecastDetails] || mockInventoryAIForecastDetails['AT-WHT-XL'], { status: 200 });
  }),
];
