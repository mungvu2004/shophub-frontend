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
  // Handler lấy tóm tắt kho
  http.get("/api/inventory/summary", () => {
    return HttpResponse.json({
      totalSKUs: mockStockLevels.length,
      totalValue: "₫ 125,480,000",
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      lowStockCount: mockStockLevels.filter(s => s.availableQty <= (s.minThreshold || 15)).length
    }, { status: 200 });
  }),

  // Handler lấy danh mục động
  http.get("/api/inventory/categories", () => {
    const categories = Array.from(new Set(mockStockLevels.map(s => s.category).filter(Boolean)));
    return HttpResponse.json(categories, { status: 200 });
  }),

  // Handler xóa SKU
  http.delete("/api/inventory", async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    // Trong thực tế sẽ xóa trong mockStockLevels, ở đây ta chỉ giả lập thành công
    return new HttpResponse(null, { status: 204 });
  }),

  // Handler lấy danh sách SKU (Cập nhật để hỗ trợ multi-select)
  http.get("/api/inventory", ({ request }) => {
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

      const matchCategory = categoryFilter.length === 0 || categoryFilter.includes(stock.category);
      
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
  http.get("/api/inventory/alerts", () => {
    return HttpResponse.json({
      items: mockInventoryAlerts,
      totalCount: mockInventoryAlerts.length,
      unreadCount: mockInventoryAlerts.filter(a => !a.isResolved).length
    }, { status: 200 });
  }),

  http.get("/api/inventory/warehouses", () => {
    return HttpResponse.json(mockWarehouses, { status: 200 });
  }),

  http.get("/api/inventory/ai-forecast", () => {
    return HttpResponse.json(mockInventoryAIForecast, { status: 200 });
  }),

  http.get("/api/inventory/ai-forecast/detail/:sku", ({ params }) => {
    const sku = String(params.sku ?? '').toUpperCase();
    return HttpResponse.json(mockInventoryAIForecastDetails[sku as keyof typeof mockInventoryAIForecastDetails] || mockInventoryAIForecastDetails['AT-WHT-XL'], { status: 200 });
  }),
];
