import { http, HttpResponse } from "msw";
import { mockProducts } from "@/mocks/data/products";
import { productsCompetitorTrackingMock } from "@/mocks/data/productsCompetitorTracking";
import { productsDynamicPricingMock } from "@/mocks/data/productsDynamicPricing";

const buildProductAutomationTriggers = (productId: string, productName: string) => {
  const suffix = productId.slice(-3);

  return [
    {
      id: `trigger-auto-confirm-${suffix}`,
      name: "Xác nhận đơn tự động khi còn tồn",
      status: "active",
      scopeLabel: "Áp dụng: Shopee / TikTok Shop / Lazada",
      description: `Theo dõi SKU của ${productName} và tự xác nhận khi tồn kho khả dụng > 0.`,
    },
    {
      id: `trigger-low-stock-${suffix}`,
      name: "Cảnh báo tồn kho thấp",
      status: Number(suffix) % 2 === 0 ? "active" : "paused",
      scopeLabel: "Áp dụng: Kho chính + Kho Lazada",
      description: "Gửi cảnh báo cho team vận hành khi tồn dưới ngưỡng đã cấu hình.",
    },
  ];
};

export const productsHandlers = [
  http.get("/api/products/competitor-tracking", () => {
    return HttpResponse.json(productsCompetitorTrackingMock, { status: 200 });
  }),

  http.get("/api/products/dynamic-pricing", () => {
    return HttpResponse.json(productsDynamicPricingMock, { status: 200 });
  }),

  http.post("/api/products/dynamic-pricing/apply-all", () => {
    return HttpResponse.json(
      {
        success: true,
        appliedCount: productsDynamicPricingMock.totalSuggestions,
        message: `Đã áp dụng ${productsDynamicPricingMock.totalSuggestions} gợi ý giá AI thành công`,
      },
      { status: 200 }
    );
  }),

  http.patch("/api/products/dynamic-pricing/rules/:id", async ({ params, request }) => {
    const body = (await request.json()) as { isActive?: boolean };
    const ruleId = String(params.id ?? "");

    const status = body.isActive ? "active" : "inactive";

    return HttpResponse.json(
      {
        success: true,
        ruleId,
        status,
        message: `Đã ${status === "active" ? "bật" : "tắt"} quy tắc thành công`,
      },
      { status: 200 }
    );
  }),

  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = (url.searchParams.get("status") ?? "").trim();
    const category = (url.searchParams.get("category") ?? "").trim();
    const platform = (url.searchParams.get("platform") ?? "").trim();
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    const filtered = mockProducts.filter((product) => {
      // Search filter (name or SKU)
      const matchSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.variants.some((v) => v.internalSku.toLowerCase().includes(search));

      // Status filter
      const matchStatus = !status || product.status === status;

      // Category filter (using brand as category)
      const matchCategory = !category || product.brand?.toLowerCase().includes(category.toLowerCase());

      // Platform filter (check if product has listing on specified platform)
      const matchPlatform =
        !platform ||
        product.variants.some((v) =>
          v.listings.some((l) => l.platform === platform)
        );

      return matchSearch && matchStatus && matchCategory && matchPlatform;
    });

    const totalCount = filtered.length;
    const hasMore = totalCount > offset + limit;
    const items = filtered.slice(
      offset,
      offset + (Number.isNaN(limit) ? 20 : limit)
    );

    return HttpResponse.json(
      {
        items,
        totalCount,
        hasMore,
        nextCursor: hasMore ? offset + limit : undefined,
      },
      { status: 200 }
    );
  }),

  http.get("/api/products/:id", ({ params }) => {
    const found = mockProducts.find((product) => product.id === params.id);
    if (!found) {
      return HttpResponse.json(
        { status: 404, title: "Not Found", detail: "Product not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(found, { status: 200 });
  }),

  http.get("/api/products/:id/automation-triggers", ({ params }) => {
    const found = mockProducts.find((product) => product.id === params.id);
    if (!found) {
      return HttpResponse.json(
        { status: 404, title: "Not Found", detail: "Product not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        productId: found.id,
        lastUpdatedAt: new Date().toISOString(),
        items: buildProductAutomationTriggers(found.id, found.name),
      },
      { status: 200 }
    );
  }),

  http.post("/api/products/sync", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const productIds = (body.productIds as string[]) ?? [];

    // Simulate sync operation
    return HttpResponse.json(
      {
        success: true,
        syncedCount: productIds.length,
        message: `Synced ${productIds.length} products successfully`,
      },
      { status: 200 }
    );
  }),

  http.put("/api/products/:id", async ({ params, request }) => {
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { status: 404, title: "Not Found", detail: "Product not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    Object.assign(product, body, {
      updatedAt: new Date().toISOString(),
    });

    return HttpResponse.json(product, { status: 200 });
  }),

  http.delete("/api/products/:id", ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { status: 404, title: "Not Found", detail: "Product not found" },
        { status: 404 }
      );
    }

    // In real scenario, delete would be persisted
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
