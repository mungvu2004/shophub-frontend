import { http, HttpResponse } from "msw";
import { mockProducts } from "@/mocks/data/products";

export const productsHandlers = [
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = (url.searchParams.get("status") ?? "").trim();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockProducts.filter((product) => {
      const matchSearch =
        !search
        || product.name.toLowerCase().includes(search)
        || product.variants.some((v) => v.internalSku.toLowerCase().includes(search));
      const matchStatus = !status || product.status === status;
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

  http.get("/api/products/:id", ({ params }) => {
    const found = mockProducts.find((product) => product.id === params.id);
    if (!found) {
      return HttpResponse.json({ status: 404, title: "Not Found", detail: "Product not found" }, { status: 404 });
    }
    return HttpResponse.json(found, { status: 200 });
  }),
];
