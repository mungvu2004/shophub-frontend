import { http, HttpResponse } from "msw";
import { mockPlatformConnections } from "@/mocks/data/platforms";

export const platformHandlers = [
  http.get("/api/platforms/connections", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
    const status = (url.searchParams.get("status") ?? "").trim();
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filtered = mockPlatformConnections.filter((connection) => {
      const matchSearch =
        !search
        || connection.platform.name.toLowerCase().includes(search)
        || (connection.externalShopName ?? "").toLowerCase().includes(search)
        || connection.externalShopId.toLowerCase().includes(search);
      const matchStatus = !status || connection.status === status;
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
];
