import { http, HttpResponse } from "msw";
import {
  dashboardKPIOverview,
  dashboardRevenue30d,
  dashboardRevenueByPlatform,
} from "@/mocks/data/dashboard";

export const dashboardHandlers = [
  http.get("/api/dashboard/kpi-overview", () => {
    return HttpResponse.json(
      {
        success: true,
        data: dashboardKPIOverview,
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/revenue", ({ request }) => {
    const url = new URL(request.url);
    const daysParam = Number(url.searchParams.get("days") ?? 30);
    const days = Number.isNaN(daysParam) ? 30 : Math.max(1, Math.min(daysParam, 30));
    const points = dashboardRevenue30d.slice(-days);

    return HttpResponse.json(
      {
        success: true,
        data: {
          points,
          byPlatform: dashboardRevenueByPlatform,
          totalRevenue: points.reduce((acc, point) => acc + point.total, 0),
        },
      },
      { status: 200 },
    );
  }),

  http.get("/api/revenue", ({ request }) => {
    const url = new URL(request.url);
    const daysParam = Number(url.searchParams.get("days") ?? 30);
    const days = Number.isNaN(daysParam) ? 30 : Math.max(1, Math.min(daysParam, 30));
    const points = dashboardRevenue30d.slice(-days);

    return HttpResponse.json(
      {
        items: points,
        totalCount: points.length,
      },
      { status: 200 },
    );
  }),
];
