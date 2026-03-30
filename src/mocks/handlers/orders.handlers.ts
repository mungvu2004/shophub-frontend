import { http, HttpResponse } from "msw";
import { mockOrders } from "@/mocks/data/orders";

export const ordersHandlers = [
  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = (url.searchParams.get("status") ?? "").trim();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockOrders.filter((order) => {
      const fullName = `${order.buyerFirstName ?? ""} ${order.buyerLastName ?? ""}`.toLowerCase();
      const matchSearch =
        !search
        || order.id.toLowerCase().includes(search)
        || order.externalOrderId.toLowerCase().includes(search)
        || fullName.includes(search);
      const matchStatus = !status || order.status === status;
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

  http.get("/api/orders/:id", ({ params }) => {
    const found = mockOrders.find((order) => order.id === params.id);
    if (!found) {
      return HttpResponse.json({ status: 404, title: "Not Found", detail: "Order not found" }, { status: 404 });
    }
    return HttpResponse.json(found, { status: 200 });
  }),
];
