import { http, HttpResponse } from "msw";
import {
  dashboardKPIOverview,
  dashboardRevenue30d,
  dashboardRevenueByPlatform,
} from "@/mocks/data/dashboard";
import { dashboardAlertsNotificationsMock } from "@/mocks/data/dashboardAlertsNotifications";
import {
  getDashboardTopProductsPayload,
  type DashboardTopProductsMetric,
  type DashboardTopProductsPlatform,
  type DashboardTopProductsRange,
} from "@/mocks/data/dashboardTopProducts";

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

  http.get("/api/dashboard/top-products", ({ request }) => {
    const url = new URL(request.url);

    const metric = (url.searchParams.get("metric") ?? "revenue") as DashboardTopProductsMetric;
    const rangeParam = Number(url.searchParams.get("range") ?? 30);
    const platform = (url.searchParams.get("platform") ?? "all") as DashboardTopProductsPlatform;

    const rangeDays: DashboardTopProductsRange =
      rangeParam === 7 || rangeParam === 90
        ? rangeParam
        : 30;

    const safeMetric: DashboardTopProductsMetric =
      metric === "quantity" || metric === "returnRate"
        ? metric
        : "revenue";

    const safePlatform: DashboardTopProductsPlatform =
      platform === "shopee" || platform === "lazada" || platform === "tiktok_shop"
        ? platform
        : "all";

    return HttpResponse.json(
      {
        success: true,
        data: getDashboardTopProductsPayload({
          metric: safeMetric,
          rangeDays,
          platform: safePlatform,
        }),
      },
      { status: 200 },
    );
  }),

  http.get("/api/dashboard/alerts-notifications", () => {
    return HttpResponse.json(
      {
        success: true,
        data: dashboardAlertsNotificationsMock,
      },
      { status: 200 },
    );
  }),

  http.post("/api/dashboard/alerts-notifications/read-all", () => {
    dashboardAlertsNotificationsMock.alerts = dashboardAlertsNotificationsMock.alerts.map((item) => ({
      ...item,
      isRead: true,
    }));

    return HttpResponse.json(
      {
        success: true,
        message: "All alerts marked as read",
      },
      { status: 200 },
    );
  }),
];
